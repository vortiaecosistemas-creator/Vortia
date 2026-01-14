import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, x-api-key" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.headers["x-api-key"] !== process.env.VORTIA_API_KEY) return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized" }) };

  try {
    const { topic, audience_type, region } = JSON.parse(event.body || "{}");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: `Experto en marketing. Audiencia: ${audience_type === 'creador' ? 'Creadores' : 'Empresas'}. Region: ${region || 'LATAM'}. Español.` },
          { role: "user", content: `Genera contenido JSON para: "${topic}". Formato: {"title":"","script":"","caption":"","hashtags":[],"cta":"","hook":""}` }
        ],
        temperature: 0.8,
        response_format: { type: "json_object" },
      }),
    });
    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, data: { topic, ...content } }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: String(e) }) };
  }
};
