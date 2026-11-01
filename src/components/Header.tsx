"use client";

import Link from "next/link";
import { useState } from "react";

const ENLACES = [
  { href: "/#que-hacemos", t: "Qué hacemos" },
  { href: "/#proyectos", t: "Proyectos" },
  { href: "/#como-trabajamos", t: "Cómo trabajamos" },
  { href: "/#quien", t: "Quién está detrás" },
];

export default function Header() {
  const [abierto, setAbierto] = useState(false);
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#0B0E14]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-2xl font-black tracking-tight text-white">
          Vea<span className="text-[#7B61FF]">IA</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-gray-300 md:flex">
          {ENLACES.map((e) => (
            <a key={e.href} href={e.href} className="transition-colors hover:text-white">{e.t}</a>
          ))}
          <a href="/#contacto" className="rounded-full bg-[#7B61FF] px-5 py-2 font-semibold text-white transition hover:bg-[#6A4FF0]">
            Pedir una demo
          </a>
        </nav>

        <button className="p-2 text-white md:hidden" aria-label="Abrir el menú" aria-expanded={abierto} onClick={() => setAbierto(!abierto)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>
      {abierto && (
        <nav className="border-t border-white/10 bg-[#0B0E14] px-4 py-4 md:hidden">
          {[...ENLACES, { href: "/#contacto", t: "Pedir una demo" }].map((e) => (
            <a key={e.href} href={e.href} onClick={() => setAbierto(false)} className="block py-3 text-gray-200">{e.t}</a>
          ))}
        </nav>
      )}
    </header>
  );
}
