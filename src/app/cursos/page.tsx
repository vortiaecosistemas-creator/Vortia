"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CursosPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "academia_vortia",
          date: new Date().toISOString()
        }),
      });

      if (response.ok) {
        router.push("/gracias");
      } else {
        throw new Error("Error en el envío");
      }
    } catch (err) {
      setError("Hubo un problema. Por favor, inténtalo de nuevo.");
      // Opcional: Para pruebas, si no hay Webhook, podemos simular el éxito
      // router.push("/gracias");
    } finally {
      setLoading(false);
    }
  };

  const modules = [
    {
      id: 1,
      title: "Módulo 1: Fundamentos y Ecosistema 2026",
      desc: "El salto evolutivo de la IA Generativa a la Agéntica y el impacto del AI Act.",
    },
    {
      id: 2,
      title: "Módulo 2: Multimodalidad Nativa",
      desc: "Procesamiento simultáneo de texto, imagen y video con Gemini y GPT-5.",
    },
    {
      id: 3,
      title: "Módulo 3: La Revolución Agéntica",
      desc: "Arquitectura de sistemas autónomos con CrewAI y LangGraph.",
    },
    {
      id: 4,
      title: "Módulo 4: Desarrollo con IA (Low-Code)",
      desc: "Domina Cursor y creación de micro-SaaS en tiempo récord.",
    },
    {
      id: 5,
      title: "Módulo 5: Estrategia y Monetización",
      desc: "Venta de servicios y automatización de funnels de venta.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white pt-24 pb-20 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Glowing Accents */}
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-purple-600/20 blur-[150px] rounded-full z-0"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full z-0"></div>

      <main className="container mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
          <div className="lg:w-1/2 text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold tracking-widest uppercase mb-4">
              Vortia Academia
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
              Domina la Nueva Era de la <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">IA Agéntica</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-xl">
              No solo uses la IA, construye el futuro con ella. Aprende a diseñar sistemas autónomos y multimodales con el programa más avanzado del 2026.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#blueprint" className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(123,97,255,0.4)]">
                Inscribirme ahora
              </Link>
              <Link href="#temario" className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all">
                Ver temario
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="aspect-square relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image 
                src="/assets/hero.png" 
                alt="Agentes IA Vortia" 
                fill 
                className="object-cover scale-105 hover:scale-100 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* The Problem (PAS) */}
        <section className="py-20 border-y border-white/5 mb-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-8 italic">
              "¿Sientes que la IA avanza más rápido de lo que puedes aprender?"
            </h2>
            <div className="space-y-6 text-gray-400 text-lg">
              <p>
                El 90% de los profesionales siguen usando la IA de forma básica. En 2026, eso ya no es suficiente. 
                Las empresas buscan expertos que sepan construir **Agentes Autónomos** que trabajen solos mientras tú escalas.
              </p>
              <p className="text-white font-medium">
                Hemos diseñado el puente directo hacia la autonomía técnica.
              </p>
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section id="temario" className="mb-24">
          <h2 className="text-3xl font-bold mb-12 text-center">Currícula del Programa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((m) => (
              <div key={m.id} className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/50 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold mb-6 group-hover:scale-110 transition-transform">
                  {m.id}
                </div>
                <h3 className="text-xl font-bold mb-3">{m.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Lead Magnet Section */}
        <section id="blueprint" className="p-12 rounded-3xl bg-gradient-to-br from-purple-900/40 to-blue-900/20 border border-purple-500/20 relative overflow-hidden text-center max-w-4xl mx-auto">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/3">
              <Image 
                src="/assets/lead-magnet.png" 
                alt="Lead Magnet Blueprint" 
                width={250} 
                height={350} 
                className="transform -rotate-3 hover:rotate-0 transition-transform duration-500 rounded-lg shadow-2xl"
              />
            </div>
            <div className="md:w-2/3 text-left">
              <h2 className="text-3xl font-bold mb-4 text-yellow-500">GRATIS: Blueprint 2026</h2>
              <p className="text-gray-300 mb-6">
                Descarga la guía paso a paso para configurar tu primer equipo de Agentes Autónomos.
              </p>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    required
                    placeholder="Tu nombre" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-5 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-purple-500 outline-none flex-grow transition-all"
                  />
                  <input 
                    type="email" 
                    required
                    placeholder="Tu mejor email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="px-5 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-purple-500 outline-none flex-grow transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-500 font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando..." : "Descargar Guía y Reservar Plaza"}
                </button>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-20 border-t border-white/5 py-10 text-center text-gray-600 text-sm">
        &copy; 2026 Vortia Ecosistemas /&gt; - Todos los derechos reservados.
      </footer>
    </div>
  );
}
