import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, x-api-key" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.headers["x-api-key"] !== process.env.VORTIA_API_KEY) return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized" }) };

  try {
    const { action, platform, content, options } = JSON.parse(event.body || "{}");
    if (action === "publish_now") {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, action: "publish_now", platform, message: `Publicado en ${platform}`, published_at: new Date().toISOString() }) };
    }
    if (action === "schedule") {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, action: "schedule", platform, scheduled_for: options?.schedule_time }) };
    }
    if (action === "status") {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, platforms: { twitter: "connected", instagram: "connected", youtube: "connected", linkedin: "connected" } }) };
    }
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid action" }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: String(e) }) };
  }
};
