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

async function generateContent(topic: string, audienceType: string, region: string) {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) throw new Error("OpenAI API key not configured");

  const systemPrompt = `Eres un experto en marketing de contenidos y copywriting para redes sociales.
Tu audiencia objetivo es: ${audienceType === 'creador' ? 'Creadores de contenido, YouTubers, TikTokers' : 'Empresas, CEOs, Fundadores de agencias'}.
Región: ${region || 'LATAM y España'}.
Genera contenido en español, con tono profesional pero cercano.`;

  const userPrompt = `Genera contenido para el siguiente tema: "${topic}"

Devuelve un JSON con esta estructura exacta:
{
  "title": "Título atractivo (máx 60 caracteres)",
  "script": "Guión para video de 30-60 segundos. Incluye HOOK inicial, desarrollo y CTA final.",
  "caption": "Caption para redes sociales (máx 200 caracteres)",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
  "cta": "Llamada a la acción específica",
  "hook": "Frase de apertura impactante"
}`;

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
      temperature: 0.8,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) throw new Error("Error generating content with OpenAI");

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

export async function POST(request: NextRequest) {
  try {
    if (!validateApiKey(request)) {
      return NextResponse.json({ error: "Unauthorized - Invalid API key" }, { status: 401 });
    }

    const body = await request.json();
    const { topic, audience_type, region } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const content = await generateContent(topic, audience_type || "empresa", region || "MIXTO");

    return NextResponse.json({
      success: true,
      data: {
        topic,
        audience_type: audience_type || "empresa",
        region: region || "MIXTO",
        ...content,
        generated_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Generate API error:", error);
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
    endpoint: "/api/v1/generate",
    method: "POST",
    params: {
      topic: "string (required)",
      audience_type: "creador | empresa (optional)",
      region: "LATAM | España | MIXTO (optional)",
    },
  });
}
