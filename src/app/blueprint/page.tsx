import Link from "next/link";

export const metadata = {
  title: "Blueprint de Agentes Autónomos 2026 | Vortia Academia",
  description: "Guía paso a paso para configurar tu primer equipo de Agentes Autónomos con IA.",
};

const steps = [
  {
    id: 1,
    title: "Entiende el cambio: de IA Generativa a IA Agéntica",
    content:
      "En 2024 usábamos la IA como un asistente que responde preguntas. En 2026, la IA actúa: planifica, ejecuta tareas, toma decisiones y se corrige sola. Un Agente Autónomo es un sistema de IA que recibe un objetivo, decide qué pasos seguir y los ejecuta sin intervención humana constante.",
    bullets: [
      "IA Generativa: responde. IA Agéntica: actúa.",
      "Los agentes pueden usar herramientas: buscar en internet, enviar emails, actualizar bases de datos.",
      "El AI Act europeo ya regula estos sistemas — conocerlo es ventaja competitiva.",
    ],
  },
  {
    id: 2,
    title: "Define el caso de uso de tu primer agente",
    content:
      "El error más común es empezar por la tecnología en vez del problema. Antes de elegir herramientas, identifica qué tarea repetitiva consume más tiempo en tu negocio.",
    bullets: [
      "Ejemplos: responder leads, generar informes, publicar contenido, gestionar soporte.",
      "El mejor primer agente es el que resuelve algo que ya haces manualmente cada semana.",
      "Define el input (qué recibe), el proceso (qué decide) y el output (qué entrega).",
    ],
  },
  {
    id: 3,
    title: "Elige tu stack: herramientas para 2026",
    content:
      "No necesitas programar desde cero. El ecosistema actual permite construir agentes potentes con herramientas accesibles.",
    bullets: [
      "Low-code: n8n, Make, Zapier — para automatizaciones y flujos con agentes.",
      "Frameworks avanzados: CrewAI, LangGraph — para sistemas multiagente complejos.",
      "Modelos: GPT-5, Gemini 2.0, Claude 3.5 — multimodales (texto, imagen, vídeo).",
      "Cursor AI — para desarrollo asistido por IA y creación de micro-SaaS.",
    ],
  },
  {
    id: 4,
    title: "Arquitectura de un equipo de agentes",
    content:
      "Los sistemas más potentes no son un solo agente, sino equipos. Cada agente tiene un rol específico y se coordina con los demás, igual que un equipo humano.",
    bullets: [
      "Agente Orquestador: recibe el objetivo y delega subtareas.",
      "Agentes Especializados: ejecutan tareas concretas (investigación, redacción, análisis).",
      "Agente Revisor: valida la calidad del resultado antes de entregarlo.",
      "La comunicación entre agentes define la calidad del sistema.",
    ],
  },
  {
    id: 5,
    title: "Monetiza: convierte tu expertise en servicios",
    content:
      "Saber construir agentes es una habilidad escasa y muy demandada. Puedes monetizarla de múltiples formas sin necesitar una gran empresa detrás.",
    bullets: [
      "Servicios de automatización para PYMEs: $500–$3.000 por proyecto.",
      "Micro-SaaS: construye una herramienta específica con agentes y véndela por suscripción.",
      "Consultoría de IA: acompaña a empresas en su transformación agéntica.",
      "Funnels automatizados: usa agentes para escalar tu propio negocio digital.",
    ],
  },
];

export default function BlueprintPage() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-white pt-24 pb-20 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-purple-600/20 blur-[150px] rounded-full z-0" />
      <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full z-0" />

      <main className="container mx-auto px-6 relative z-10 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold tracking-widest uppercase mb-4">
            Vortia Academia · Exclusivo
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Blueprint de{" "}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Agentes Autónomos 2026
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Los 5 pasos para construir, desplegar y monetizar tu primer equipo
            de agentes de IA en 2026.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-10">
          {steps.map((step) => (
            <div
              key={step.id}
              className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-black text-lg flex-shrink-0">
                  {step.id}
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">{step.title}</h2>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {step.content}
                  </p>
                  <ul className="space-y-2">
                    {step.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                        <span className="text-purple-400 mt-0.5">›</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 p-10 rounded-3xl bg-gradient-to-br from-purple-900/40 to-blue-900/20 border border-purple-500/20 text-center">
          <h2 className="text-2xl font-bold mb-3">
            ¿Listo para ir más allá del Blueprint?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            En Academia Vortia implementamos todo esto paso a paso, con casos
            reales y acompañamiento directo. Reserva tu plaza ahora.
          </p>
          <Link
            href="/cursos#blueprint"
            className="inline-block px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(123,97,255,0.4)]"
          >
            Quiero unirme al programa
          </Link>
        </div>
      </main>

      <footer className="mt-20 border-t border-white/5 py-10 text-center text-gray-600 text-sm">
        © 2026 Vortia Ecosistemas /&gt; — Todos los derechos reservados.
      </footer>
    </div>
  );
}
