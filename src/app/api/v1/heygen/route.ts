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

async function generateScript(topic: string, audienceType: string) {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) throw new Error("OpenAI API key not configured");

  const systemPrompt = `Eres un experto en crear guiones para videos cortos de redes sociales.
Tu trabajo es escribir SOLO el texto que el presentador dirá en voz alta.
NO incluyas instrucciones de escena, descripciones visuales, ni nada entre corchetes o paréntesis.
El texto debe ser natural, fluido y listo para ser leído por un avatar de IA.
Audiencia: ${audienceType === 'creador' ? 'Creadores de contenido' : 'Empresarios y emprendedores'}.
Idioma: Español neutro (LATAM/España).`;

  const userPrompt = `Escribe un guión de 30-45 segundos sobre: "${topic}"

IMPORTANTE:
- Solo texto hablado, sin instrucciones entre corchetes
- Empieza con un hook que capture atención
- Desarrolla la idea principal
- Termina con un call-to-action claro
- Máximo 150 palabras`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) throw new Error("Error generating script with OpenAI");
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

async function createHeyGenVideo(
  script: string,
  backgroundUrl?: string,
  backgroundType?: string,
  avatarId?: string,
  voiceId?: string
) {
  const heygenApiKey = process.env.HEYGEN_API_KEY;
  if (!heygenApiKey) throw new Error("HeyGen API key not configured");

  // Background por defecto: el video que configuramos
  const defaultBgUrl = "https://database.blotato.io/storage/v1/object/public/public_media/4ddd33eb-e811-4ab5-93e1-2cd0b7e8fb3f/videogen2-render-e6b398a2-5859-4a77-88ef-2345bcefdc98.mp4";

  let background: { type: string; value?: string; url?: string } = {
    type: "color",
    value: "#1a1a2e"
  };

  const bgUrl = backgroundUrl || defaultBgUrl;
  const bgType = backgroundType || (bgUrl ? "video" : "color");

  if (bgUrl) {
    if (bgType === "video" || /\.(mp4|webm|mov)$/i.test(bgUrl)) {
      background = { type: "video", url: bgUrl };
    } else if (bgType === "image" || /\.(jpg|jpeg|png|webp|gif)$/i.test(bgUrl)) {
      background = { type: "image", url: bgUrl };
    } else {
      background = { type: "video", url: bgUrl };
    }
  }

  const requestBody = {
    video_inputs: [
      {
        character: {
          type: "avatar",
          avatar_id: avatarId || process.env.HEYGEN_AVATAR_ID || "Kristin_public_2_20240108",
          avatar_style: "normal",
        },
        voice: {
          type: "text",
          input_text: script,
          voice_id: voiceId || process.env.HEYGEN_VOICE_ID || "es-ES-AlvaroNeural",
        },
        background: background,
      },
    ],
    dimension: { width: 1080, height: 1920 },
    aspect_ratio: "9:16",
    test: false,
  };

  console.log("HeyGen request:", JSON.stringify(requestBody, null, 2));

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
    throw new Error(`HeyGen error: ${error.message || error.error || response.statusText}`);
  }

  const data = await response.json();
  return { videoId: data.data?.video_id, status: "processing" };
}

async function checkVideoStatus(videoId: string) {
  const heygenApiKey = process.env.HEYGEN_API_KEY;
  if (!heygenApiKey) throw new Error("HeyGen API key not configured");

  const response = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
    method: "GET",
    headers: { "X-Api-Key": heygenApiKey },
  });

  if (!response.ok) throw new Error("Error checking video status");

  const data = await response.json();
  return {
    videoId: videoId,
    status: data.data?.status,
    videoUrl: data.data?.video_url,
    thumbnailUrl: data.data?.thumbnail_url,
    duration: data.data?.duration,
  };
}

export async function POST(request: NextRequest) {
  try {
    if (!validateApiKey(request)) {
      return NextResponse.json({ error: "Unauthorized - Invalid API key" }, { status: 401 });
    }

    const body = await request.json();
    const { action, topic, audience_type, background_url, background_type, avatar_id, voice_id, video_id, script: providedScript } = body;

    if (action === "check_status") {
      if (!video_id) return NextResponse.json({ error: "video_id is required" }, { status: 400 });
      const videoStatus = await checkVideoStatus(video_id);
      return NextResponse.json({ success: true, video: videoStatus });
    }

    if (action === "full_pipeline" || !action) {
      if (!topic) return NextResponse.json({ error: "topic is required" }, { status: 400 });
      const script = await generateScript(topic, audience_type || "empresa");
      const video = await createHeyGenVideo(script, background_url, background_type, avatar_id, voice_id);
      return NextResponse.json({
        success: true,
        topic,
        script,
        video,
        background: { url: background_url || "default_video", type: background_type || "video" },
        message: "Video en proceso. Usa action='check_status' con el video_id para verificar.",
      });
    }

    if (action === "create_video") {
      if (!providedScript) return NextResponse.json({ error: "script is required" }, { status: 400 });
      const video = await createHeyGenVideo(providedScript, background_url, background_type, avatar_id, voice_id);
      return NextResponse.json({ success: true, video, background: { url: background_url || "default_video", type: background_type || "video" } });
    }

    return NextResponse.json({ error: "Invalid action. Use: full_pipeline, create_video, or check_status" }, { status: 400 });
  } catch (error) {
    console.error("HeyGen API error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/v1/heygen",
    actions: ["full_pipeline", "create_video", "check_status"],
    default_background: "video (mp4)"
  });
}
