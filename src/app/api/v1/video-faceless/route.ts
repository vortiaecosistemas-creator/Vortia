import { NextRequest, NextResponse } from "next/server";

const validateApiKey = (request: NextRequest): boolean => {
  const apiKey = request.headers.get("x-api-key");
  const validApiKey = process.env.VORTIA_API_KEY;
  if (!validApiKey) {
    console.warn("VORTIA_API_KEY not configured");
    return false;
  }
  return apiKey === validApiKey;
};

// Background por defecto para videos faceless (SIEMPRE usar un background)
const DEFAULT_BACKGROUND_VIDEO = "https://database.blotato.io/storage/v1/object/public/public_media/4ddd33eb-e811-4ab5-93e1-2cd0b7e8fb3f/videogen2-render-e6b398a2-5859-4a77-88ef-2345bcefdc98.mp4";

// Detectar tipo de background por extensión
function detectBackgroundType(url: string): "video" | "image" {
  const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv"];
  const lowerUrl = url.toLowerCase();
  for (const ext of videoExtensions) {
    if (lowerUrl.includes(ext)) return "video";
  }
  return "image";
}

// Base de datos en memoria para videos
const videoJobs: Map<string, {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  script: string;
  voiceId: string;
  style: string;
  backgroundUrl: string;
  mediaUrl?: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
}> = new Map();

function generateVideoId() {
  return `vid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generar audio con OpenAI TTS
async function generateAudio(text: string, voice: string = "alloy") {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) throw new Error("OpenAI API key not configured");

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: "tts-1-hd",
      input: text,
      voice: voice, // alloy, echo, fable, onyx, nova, shimmer
      response_format: "mp3",
    }),
  });

  if (!response.ok) {
    throw new Error(`Error generating audio: ${response.statusText}`);
  }

  // Convertir a base64 para almacenar temporalmente
  const arrayBuffer = await response.arrayBuffer();
  const base64Audio = Buffer.from(arrayBuffer).toString("base64");
  return `data:audio/mp3;base64,${base64Audio}`;
}

// Generar imágenes para el video con DALL-E
async function generateImages(script: string, style: string, count: number = 3) {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) throw new Error("OpenAI API key not configured");

  const images: string[] = [];

  // Dividir el script en partes para generar imágenes relevantes
  const parts = script.split(/[.!?]+/).filter(s => s.trim().length > 10).slice(0, count);

  for (const part of parts) {
    const prompt = `${style} style, cinematic, high quality, 9:16 vertical format: ${part.trim()}`;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1792", // Vertical para shorts/reels
        quality: "hd",
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.data?.[0]?.url) {
        images.push(data.data[0].url);
      }
    }
  }

  return images;
}

// Crear video faceless con HeyGen (sin avatar visible, SIEMPRE con background)
async function createFacelessVideoWithHeyGen(
  script: string,
  backgroundUrl?: string,
  backgroundType?: string,
  voiceId?: string
) {
  const heygenApiKey = process.env.HEYGEN_API_KEY;
  if (!heygenApiKey) throw new Error("HeyGen API key not configured");

  // SIEMPRE usar un background - nunca color sólido
  const bgUrl = backgroundUrl || DEFAULT_BACKGROUND_VIDEO;
  const bgType = backgroundType || detectBackgroundType(bgUrl);

  // Configurar background según tipo
  const background = bgType === "video"
    ? { type: "video", url: bgUrl }
    : { type: "image", url: bgUrl };

  console.log("HeyGen Faceless - Background:", { type: bgType, url: bgUrl });

  // Usar avatar mínimo/invisible con background ocupando toda la pantalla
  const requestBody = {
    video_inputs: [
      {
        character: {
          type: "avatar",
          avatar_id: "Kristin_public_2_20240108",
          avatar_style: "normal",
          scale: 0.001,
          offset: { x: -1000, y: -1000 },
        },
        voice: {
          type: "text",
          input_text: script,
          voice_id: voiceId || "es-ES-AlvaroNeural",
        },
        background: background,
      },
    ],
    dimension: { width: 1080, height: 1920 },
    aspect_ratio: "9:16",
    test: false,
  };

  const response = await fetch("https://api.heygen.com/v2/video/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": heygenApiKey,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`HeyGen error: ${error.message || response.statusText}`);
  }

  const data = await response.json();
  return { videoId: data.data?.video_id, provider: "heygen", backgroundUsed: bgUrl };
}

// Verificar estado del video en HeyGen
async function checkHeyGenVideoStatus(videoId: string) {
  const heygenApiKey = process.env.HEYGEN_API_KEY;
  if (!heygenApiKey) throw new Error("HeyGen API key not configured");

  const response = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
    headers: { "X-Api-Key": heygenApiKey },
  });

  if (!response.ok) throw new Error("Error checking video status");

  const data = await response.json();
  return {
    status: data.data?.status === "completed" ? "completed" :
            data.data?.status === "failed" ? "failed" : "processing",
    videoUrl: data.data?.video_url,
    thumbnailUrl: data.data?.thumbnail_url,
  };
}

export async function POST(request: NextRequest) {
  try {
    if (!validateApiKey(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, script, voice_id, style, background_url, background_type, video_id } = body;

    // Crear video faceless
    if (action === "create" || !action) {
      if (!script) {
        return NextResponse.json({ error: "script is required" }, { status: 400 });
      }

      const videoJobId = generateVideoId();
      const bgUrl = background_url || DEFAULT_BACKGROUND_VIDEO;

      // Intentar crear con HeyGen primero
      try {
        const result = await createFacelessVideoWithHeyGen(
          script,
          background_url,
          background_type,
          voice_id
        );

        videoJobs.set(videoJobId, {
          id: videoJobId,
          status: "processing",
          script,
          voiceId: voice_id || "es-ES-AlvaroNeural",
          style: style || "cinematic",
          backgroundUrl: bgUrl,
          createdAt: new Date().toISOString(),
        });

        return NextResponse.json({
          success: true,
          video_id: videoJobId,
          heygen_video_id: result.videoId,
          provider: "heygen",
          status: "processing",
          background: {
            url: result.backgroundUsed,
            type: background_type || detectBackgroundType(bgUrl),
          },
          message: "Video faceless con background en proceso. Usa action='status' para verificar.",
        });
      } catch (heygenError) {
        // Si HeyGen falla, crear con audio + imágenes (fallback)
        console.log("HeyGen failed, using fallback method:", heygenError);

        return NextResponse.json({
          success: false,
          error: heygenError instanceof Error ? heygenError.message : "HeyGen error",
          note: "Configura HEYGEN_API_KEY para crear videos con background",
        }, { status: 500 });
      }
    }

    // Verificar estado del video
    if (action === "status") {
      if (!video_id) {
        return NextResponse.json({ error: "video_id is required" }, { status: 400 });
      }

      // Verificar si es un ID interno
      if (video_id.startsWith("vid_")) {
        const job = videoJobs.get(video_id);
        if (!job) {
          return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, video: job });
      }

      // Verificar en HeyGen directamente
      try {
        const heygenApiKey = process.env.HEYGEN_API_KEY;
        if (!heygenApiKey) throw new Error("HeyGen API key not configured");

        const response = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${video_id}`, {
          headers: { "X-Api-Key": heygenApiKey },
        });

        if (!response.ok) throw new Error("Error checking video status");

        const data = await response.json();
        return NextResponse.json({
          success: true,
          video: {
            status: data.data?.status === "completed" ? "completed" :
                    data.data?.status === "failed" ? "failed" : "processing",
            videoUrl: data.data?.video_url,
            thumbnailUrl: data.data?.thumbnail_url,
          }
        });
      } catch (error) {
        return NextResponse.json({
          error: error instanceof Error ? error.message : "Error checking status"
        }, { status: 500 });
      }
    }

    // Listar videos
    if (action === "list") {
      const videos = Array.from(videoJobs.values()).slice(-20);
      return NextResponse.json({
        success: true,
        videos,
        total: videoJobs.size,
      });
    }

    return NextResponse.json({
      error: "Invalid action. Use: create, status, list"
    }, { status: 400 });

  } catch (error) {
    console.error("Video Faceless API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    status: "ok",
    endpoint: "/api/v1/video-faceless",
    version: "1.1",
    description: "Genera videos faceless (sin avatar) con IA - SIEMPRE con background",
    default_background: DEFAULT_BACKGROUND_VIDEO,
    actions: {
      create: {
        description: "Crear video faceless CON BACKGROUND",
        params: {
          script: "string (required) - Guión del video",
          voice_id: "string (optional) - ID de voz (default: es-ES-AlvaroNeural)",
          style: "string (optional) - Estilo visual",
          background_url: "string (optional) - URL de video/imagen de fondo (tiene default)",
          background_type: "string (optional) - 'video' o 'image' (auto-detectado)",
        }
      },
      status: {
        description: "Verificar estado del video",
        params: { video_id: "string (required)" }
      },
      list: "Listar videos recientes"
    },
    note: "Los videos SIEMPRE tienen background. Si no proporcionas uno, se usa el default.",
  });
}
