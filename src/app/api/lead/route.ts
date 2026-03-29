import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const WEBHOOK_URL = "https://demo-n8n.0ogwot.easypanel.host/webhook/lead-capture-vortia";

  try {
    const body = await request.json();

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("n8n responded with error:", response.status, errorText);
      return NextResponse.json({ error: `n8n error: ${response.status}` }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API Route Exception:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
