"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-white hover:text-purple-400 transition-colors">
            Vortia <span className="text-purple-500">/&gt;</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
          <Link href="/servicios" className="hover:text-white transition-colors">Servicios</Link>
          <Link href="/casos" className="hover:text-white transition-colors">Casos</Link>
          <Link href="/cursos" className="px-4 py-2 rounded-full border border-purple-500/50 bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white transition-all shadow-[0_0_15px_rgba(123,97,255,0.3)]">
            Academia
          </Link>
        </nav>
        
        <div className="md:hidden">
          {/* Mobile menu icon (minimal) */}
          <button className="text-white p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
}
