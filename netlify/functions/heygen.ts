import type { Handler } from "@netlify/functions";

const validateApiKey = (headers: Record<string, string | undefined>): boolean => {
  return headers["x-api-key"] === process.env.VORTIA_API_KEY;
};

async function generateScript(topic: string, audienceType: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: `Experto en guiones para videos. Solo texto hablado. Audiencia: ${audienceType === 'creador' ? 'Creadores' : 'Empresarios'}. Español.` },
        { role: "user", content: `Guión 30-45 segundos sobre: "${topic}". Max 150 palabras.` }
      ],
      temperature: 0.7,
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

async function createVideo(script: string, bgUrl?: string, avatarId?: string, voiceId?: string) {
  const defaultBg = "https://database.blotato.io/storage/v1/object/public/public_media/4ddd33eb-e811-4ab5-93e1-2cd0b7e8fb3f/videogen2-render-e6b398a2-5859-4a77-88ef-2345bcefdc98.mp4";
  const response = await fetch("https://api.heygen.com/v2/video/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Api-Key": process.env.HEYGEN_API_KEY! },
    body: JSON.stringify({
      video_inputs: [{
        character: { type: "avatar", avatar_id: avatarId || process.env.HEYGEN_AVATAR_ID || "Kristin_public_2_20240108", avatar_style: "normal" },
        voice: { type: "text", input_text: script, voice_id: voiceId || process.env.HEYGEN_VOICE_ID || "es-ES-AlvaroNeural" },
        background: { type: "video", url: bgUrl || defaultBg }
      }],
      dimension: { width: 1080, height: 1920 }, aspect_ratio: "9:16", test: false
    }),
  });
  const data = await response.json();
  return { videoId: data.data?.video_id, status: "processing" };
}

async function checkStatus(videoId: string) {
  const response = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
    headers: { "X-Api-Key": process.env.HEYGEN_API_KEY! }
  });
  const data = await response.json();
  return { videoId, status: data.data?.status, videoUrl: data.data?.video_url };
}

export const handler: Handler = async (event) => {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, x-api-key" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (!validateApiKey(event.headers)) return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized" }) };

  try {
    const body = JSON.parse(event.body || "{}");
    if (body.action === "check_status") return { statusCode: 200, headers, body: JSON.stringify({ success: true, video: await checkStatus(body.video_id) }) };
    if (body.action === "create_video") return { statusCode: 200, headers, body: JSON.stringify({ success: true, video: await createVideo(body.script, body.background_url, body.avatar_id, body.voice_id) }) };
    const script = await generateScript(body.topic, body.audience_type || "empresa");
    const video = await createVideo(script, body.background_url, body.avatar_id, body.voice_id);
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, topic: body.topic, script, video }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: String(e) }) };
  }
};
