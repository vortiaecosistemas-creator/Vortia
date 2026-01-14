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

export async function POST(request: NextRequest) {
  try {
    if (!validateApiKey(request)) {
      return NextResponse.json({ error: "Unauthorized - Invalid API key" }, { status: 401 });
    }

    const body = await request.json();
    const { action, platform, content, options } = body;

    if (action === "publish_now") {
      return NextResponse.json({
        success: true,
        action: "publish_now",
        platform,
        message: `Contenido programado para publicar en ${platform}`,
        content_preview: content?.text?.substring(0, 100) + "...",
        media_url: options?.mediaUrl,
        published_at: new Date().toISOString(),
      });
    }

    if (action === "schedule") {
      return NextResponse.json({
        success: true,
        action: "schedule",
        platform,
        scheduled_for: options?.schedule_time,
        message: `Contenido programado para ${options?.schedule_time}`,
      });
    }

    if (action === "status") {
      return NextResponse.json({
        success: true,
        action: "status",
        platforms: {
          twitter: "connected",
          instagram: "connected",
          youtube: "connected",
          linkedin: "connected",
          facebook: "pending_verification",
          tiktok: "not_configured",
        },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Automation API error:", error);
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
    endpoint: "/api/v1/automation",
    actions: ["publish_now", "schedule", "status"],
  });
}
