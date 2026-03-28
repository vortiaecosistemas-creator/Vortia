import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0E14] text-white pt-20 px-8">
      <div className="max-w-4xl mx-auto py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
          <div className="text-left">
            <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              VeaIA
            </h1>
            <p className="text-2xl text-gray-300 font-medium">
              Plataforma de Automatización de Contenido
            </p>
            <div className="flex gap-4 mt-8">
              <Link href="/cursos" className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(123,97,255,0.4)]">
                Ir a la Academia
              </Link>
              <button className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all">
                Documentación API
              </button>
            </div>
          </div>
          
          <div className="bg-gray-800/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl max-w-md">
            <h2 className="text-xl font-bold mb-6 text-purple-400">Estado de la Red</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">API Gateway</span>
                <span className="text-green-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Workers n8n</span>
                <span className="text-green-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Activos</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Memoria</span>
                <span className="text-gray-300">Independiente</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6">Últimos Endpoints</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-600">
              <code className="text-cyan-400">/api/v1/generate</code>
              <p className="text-sm text-gray-400 mt-1">Genera contenido con IA</p>
            </div>

            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-600">
              <code className="text-purple-400">/api/v1/heygen</code>
              <p className="text-sm text-gray-400 mt-1">Crea videos con avatar IA</p>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-gray-500">
            Powered by OpenAI + HeyGen + n8n | &copy; 2026 Vortia Ecosistemas /&gt;
          </p>
        </div>
      </div>
    </main>
  );
}
