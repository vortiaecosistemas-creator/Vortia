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

// Obtener estado y URL del video de HeyGen
async function getHeyGenVideo(videoId: string) {
  const heygenApiKey = process.env.HEYGEN_API_KEY;
  if (!heygenApiKey) throw new Error("HeyGen API key not configured");

  const response = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
    method: "GET",
    headers: {
      "X-Api-Key": heygenApiKey,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`HeyGen error: ${error.message || response.statusText}`);
  }

  const data = await response.json();

  return {
    video_id: videoId,
    status: data.data?.status || "unknown",
    video_url: data.data?.video_url || null,
    thumbnail_url: data.data?.thumbnail_url || null,
    duration: data.data?.duration || null,
    created_at: data.data?.created_at || null,
  };
}

export async function POST(request: NextRequest) {
  try {
    if (!validateApiKey(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { video_id } = body;

    if (!video_id) {
      return NextResponse.json({ error: "video_id is required" }, { status: 400 });
    }

    const videoData = await getHeyGenVideo(video_id);

    // Determinar si el video está listo para publicar
    const isReady = videoData.status === "completed" && videoData.video_url;

    return NextResponse.json({
      success: true,
      video: videoData,
      ready_to_publish: isReady,
      message: isReady
        ? "Video listo. Usa video_url para publicar."
        : `Video en estado: ${videoData.status}. Espera y vuelve a consultar.`,
    });

  } catch (error) {
    console.error("Get Video API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Permitir GET con query param para facilitar pruebas
  const url = new URL(request.url);
  const videoId = url.searchParams.get("video_id");

  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!videoId) {
    return NextResponse.json({
      status: "ok",
      endpoint: "/api/v1/get-video",
      version: "1.0",
      description: "Obtener estado y URL del video de HeyGen",
      usage: {
        POST: {
          body: { video_id: "string (required) - ID del video de HeyGen" }
        },
        GET: {
          query: "?video_id=TU_VIDEO_ID"
        }
      },
      response: {
        video: {
          video_id: "string",
          status: "pending | processing | completed | failed",
          video_url: "string (URL del video cuando está listo)",
          thumbnail_url: "string",
          duration: "number (segundos)"
        },
        ready_to_publish: "boolean"
      }
    });
  }

  try {
    const videoData = await getHeyGenVideo(videoId);
    const isReady = videoData.status === "completed" && videoData.video_url;

    return NextResponse.json({
      success: true,
      video: videoData,
      ready_to_publish: isReady,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Error getting video"
    }, { status: 500 });
  }
}
