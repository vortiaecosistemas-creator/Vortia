export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            VeaIA
          </h1>
          <p className="text-xl text-gray-300">
            Plataforma de Automatización de Contenido
          </p>
          <p className="text-sm text-gray-500 mt-2">
            100% Independiente - Sin dependencias externas
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6">API Endpoints</h2>

          <div className="space-y-4 text-left">
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-600">
              <code className="text-cyan-400">/api/v1/generate</code>
              <p className="text-sm text-gray-400 mt-1">Genera contenido con IA (guiones, captions, hashtags)</p>
            </div>

            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-600">
              <code className="text-purple-400">/api/v1/heygen</code>
              <p className="text-sm text-gray-400 mt-1">Crea videos con avatar IA + background personalizado</p>
            </div>

            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-600">
              <code className="text-green-400">/api/v1/video-faceless</code>
              <p className="text-sm text-gray-400 mt-1">Videos faceless (sin avatar) con voz IA + imágenes generadas</p>
            </div>

            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-600">
              <code className="text-yellow-400">/api/v1/get-video</code>
              <p className="text-sm text-gray-400 mt-1">Obtener estado y URL del video de HeyGen</p>
            </div>

            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-600">
              <code className="text-pink-400">/api/v1/automation</code>
              <p className="text-sm text-gray-400 mt-1">Publicación automática en redes sociales</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-500">
              Autenticación requerida: Header <code className="text-gray-400">x-api-key</code>
            </p>
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Powered by OpenAI + HeyGen + n8n
        </p>
      </div>
    </main>
  );
}
