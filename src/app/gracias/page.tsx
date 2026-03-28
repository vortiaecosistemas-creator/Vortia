import Link from "next/link";

export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center relative overflow-hidden px-6">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Glowing Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[150px] rounded-full z-0"></div>

      <div className="max-w-2xl text-center relative z-10">
        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border border-green-500/50 text-green-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
          ¡Ya casi está listo! 🚀
        </h1>
        
        <p className="text-xl text-gray-400 mb-10 leading-relaxed">
          Hemos enviado el **Blueprint de Agentes Autónomos** a tu bandeja de entrada. 
          Revisa también tu carpeta de spam, por si acaso.
        </p>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 mb-10 text-left">
          <h2 className="text-lg font-bold mb-4 text-purple-400 uppercase tracking-wider">Próximos Pasos:</h2>
          <ul className="space-y-4 text-gray-300">
            <li className="flex gap-3">
              <span className="text-purple-500 font-bold">1.</span>
              <span>Busca un email de **Vortia Academia** con el asunto: "Aquí tienes tu acceso al Blueprint".</span>
            </li>
            <li className="flex gap-3">
              <span className="text-purple-500 font-bold">2.</span>
              <span>Únete a nuestro canal de IA para recibir actualizaciones en tiempo real.</span>
            </li>
          </ul>
        </div>

        <Link href="/cursos" className="inline-block px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all">
          Volver a la Academia
        </Link>
      </div>
    </div>
  );
}
