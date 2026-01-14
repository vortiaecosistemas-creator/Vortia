# VORTIA API

Ecosistemas de Agentes IA - API para generación de contenido y videos con IA.

## API Endpoints

### `/api/v1/generate`
Genera contenido con IA (guiones, captions, hashtags)

### `/api/v1/heygen`
Crea videos con avatar IA + background personalizado

### `/api/v1/automation`
Publicación automática en redes sociales

## Autenticación

Todas las peticiones requieren el header `x-api-key`.

## Getting Started

```bash
npm install
npm run dev
```

## Deployment

Configurado para Netlify con Next.js.

## Environment Variables

- `VORTIA_API_KEY` - API key para autenticación
- `OPENAI_API_KEY` - API key de OpenAI
- `HEYGEN_API_KEY` - API key de HeyGen
- `HEYGEN_AVATAR_ID` - ID del avatar de HeyGen
- `HEYGEN_VOICE_ID` - ID de la voz de HeyGen

---

Powered by OpenAI + HeyGen + n8n
