"use client";

import { useState } from "react";

const QUE_HACEMOS = [
  {
    t: "Plataformas a medida",
    d: "Una aplicación con el nombre y el logo de tu negocio, en el móvil y en el ordenador. Cada persona del equipo ve lo suyo.",
  },
  {
    t: "Agentes que hacen tareas",
    d: "No solo responden preguntas: preparan presupuestos, ordenan documentos, atienden a clientes y avisan de lo que vence. Nada se envía sin tu permiso.",
  },
  {
    t: "Todo conectado",
    d: "Correo, calendario, web, redes y las herramientas que ya usas. Automatizaciones con n8n y vídeo con avatar para tu comunicación.",
  },
];

const PROYECTOS = [
  {
    sector: "Construcción",
    nombre: "Clara Obra",
    estado: "En uso en una constructora",
    d: "Plataforma de gestión con secretaria IA para constructoras y subcontratas: documentación de obra, presupuestos con tu base de precios, facturas, personal y bancos. Cada cargo (gerencia, administración, jefe de obra, encargado) ve lo suyo.",
    destacado: true,
  },
  {
    sector: "Concesionarios",
    nombre: "CarBot",
    estado: "Proyecto creado",
    d: "Equipo de tres agentes de venta: uno conversa con el cliente, otro consulta el stock real y otro aplica las reglas del negocio (descuentos, financiación y prioridades).",
  },
  {
    sector: "Restauración",
    nombre: "FoodOS",
    estado: "Proyecto creado",
    d: "Web de pedidos con la marca del restaurante, pago, zonas de reparto, panel de cocina con ticket impreso y panel de administración.",
  },
  {
    sector: "Inmobiliarias",
    nombre: "Fichas de inmuebles con IA",
    estado: "Prototipo",
    d: "A partir de los datos y las fotos de un inmueble, prepara la descripción, el texto para Instagram, la ficha en PDF y un vídeo corto.",
  },
  {
    sector: "Marketing",
    nombre: "Social Media AI",
    estado: "Herramienta propia",
    d: "Analiza los vídeos que mejor funcionan en tu sector y propone ideas adaptadas a tu marca, listas para grabar.",
  },
  {
    sector: "Comunicación",
    nombre: "Vídeo con avatar",
    estado: "Herramienta propia",
    d: "Vídeos con un avatar de la persona (con su permiso y marcados como IA), para anuncios, formación o atención al cliente.",
  },
];

const PASOS = [
  { t: "Nos cuentas tu caso", d: "Una llamada de 30 minutos para ver qué te quita tiempo." },
  { t: "Propuesta clara", d: "Qué haremos, en cuánto tiempo y cuánto cuesta. Por escrito." },
  { t: "Prueba con tu equipo", d: "Empezamos por una parte pequeña y útil, con tus datos." },
  { t: "Lo ampliamos", d: "Cuando veas que funciona, sumamos más tareas y más personas." },
];

const PRINCIPIOS = [
  "Probado primero en nuestra propia empresa.",
  "Tus datos son tuyos y no se mezclan con los de nadie.",
  "Los agentes preparan; las personas deciden y envían.",
  "Empezamos pequeño, sin permanencia en la prueba.",
];

function Contacto() {
  const [estado, setEstado] = useState<"" | "enviando" | "ok" | "error">("");

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setEstado("enviando");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          email: f.get("email"),
          phone: f.get("phone"),
          company: f.get("company"),
          sector: f.get("sector"),
          message: f.get("message"),
          source: "web_veaia_demo",
          date: new Date().toISOString(),
        }),
      });
      if (!r.ok) throw new Error();
      setEstado("ok");
    } catch {
      setEstado("error");
    }
  }

  if (estado === "ok")
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-xl font-semibold">Gracias. Te escribimos en 24 horas laborables.</p>
        <p className="mt-2 text-gray-400">Si es urgente, escríbenos a info@vortiaecosistemasagentesia.com.</p>
      </div>
    );

  const campo = "w-full rounded-lg border border-white/10 bg-[#0F131B] px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#7B61FF] focus:outline-none";
  return (
    <form onSubmit={enviar} className="grid gap-4 sm:grid-cols-2">
      <label className="sr-only" htmlFor="name">Nombre</label>
      <input id="name" name="name" required placeholder="Nombre" className={campo} />
      <label className="sr-only" htmlFor="company">Empresa</label>
      <input id="company" name="company" placeholder="Empresa" className={campo} />
      <label className="sr-only" htmlFor="email">Correo</label>
      <input id="email" name="email" type="email" required placeholder="Correo" className={campo} />
      <label className="sr-only" htmlFor="phone">Teléfono</label>
      <input id="phone" name="phone" type="tel" placeholder="Teléfono (opcional)" className={campo} />
      <label className="sr-only" htmlFor="sector">Sector</label>
      <select id="sector" name="sector" defaultValue="" className={`${campo} sm:col-span-2`}>
        <option value="" disabled>Sector</option>
        <option>Construcción</option>
        <option>Concesionario</option>
        <option>Restauración</option>
        <option>Inmobiliaria</option>
        <option>Servicios profesionales</option>
        <option>Otro</option>
      </select>
      <label className="sr-only" htmlFor="message">Qué te quita tiempo</label>
      <textarea id="message" name="message" rows={4} placeholder="¿Qué te quita más tiempo en tu negocio?" className={`${campo} sm:col-span-2`} />
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
        <button type="submit" disabled={estado === "enviando"} className="rounded-full bg-[#7B61FF] px-8 py-3 font-semibold text-white transition hover:bg-[#6A4FF0] disabled:opacity-60">
          {estado === "enviando" ? "Enviando…" : "Pedir una demo"}
        </button>
        <p className="text-sm text-gray-400">
          {estado === "error" ? "No se ha podido enviar. Escríbenos a info@vortiaecosistemasagentesia.com." : "Usamos tus datos solo para responderte."}
        </p>
      </div>
    </form>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0E14] text-white">
      {/* Cabecera */}
      <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 md:pt-40">
        <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[720px] max-w-full -translate-x-1/2 rounded-full bg-[#7B61FF]/20 blur-[120px]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#F5A524]">Plataformas · Agentes · Automatización</p>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
            Creamos ecosistemas de agentes de IA para cualquier negocio
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
            Una plataforma con tu marca, agentes que hacen el trabajo de oficina y todo conectado con lo que ya usas. Para empresas, servicios y productos de cualquier sector.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#contacto" className="rounded-full bg-[#7B61FF] px-8 py-4 text-center font-semibold transition hover:bg-[#6A4FF0]">Pedir una demo</a>
            <a href="#proyectos" className="rounded-full border border-white/15 px-8 py-4 text-center font-semibold text-gray-200 transition hover:border-white/40">Ver proyectos</a>
          </div>
        </div>
      </section>

      {/* Qué hacemos */}
      <section id="que-hacemos" className="scroll-mt-20 border-t border-white/5 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Qué hacemos</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {QUE_HACEMOS.map((x, i) => (
              <div key={x.t} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <span className="font-mono text-sm text-[#F5A524]">0{i + 1}</span>
                <h3 className="mt-3 text-xl font-semibold">{x.t}</h3>
                <p className="mt-3 leading-relaxed text-gray-400">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proyectos */}
      <section id="proyectos" className="scroll-mt-20 border-t border-white/5 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Proyectos que hemos creado</h2>
          <p className="mt-4 max-w-2xl text-gray-400">Cada uno nació de un negocio real y se adapta al siguiente. Si tu sector no está aquí, cuéntanos qué te quita tiempo.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {PROYECTOS.map((p) => (
              <article key={p.nombre} className={`rounded-2xl border p-6 ${p.destacado ? "border-[#7B61FF]/60 bg-[#7B61FF]/10 md:col-span-2" : "border-white/10 bg-white/[0.03]"}`}>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-white/10 px-3 py-1 font-medium text-gray-200">{p.sector}</span>
                  <span className="rounded-full border border-[#F5A524]/40 px-3 py-1 text-[#F5A524]">{p.estado}</span>
                </div>
                <h3 className="mt-4 text-2xl font-bold">{p.nombre}</h3>
                <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">{p.d}</p>
                {p.destacado && (
                  <a href="#contacto" className="mt-5 inline-block font-semibold text-[#B7A8FF] hover:text-white">Pide una demo de Clara Obra →</a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section id="como-trabajamos" className="scroll-mt-20 border-t border-white/5 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Cómo trabajamos</h2>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PASOS.map((p, i) => (
              <li key={p.t} className="rounded-2xl border border-white/10 p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7B61FF]/20 font-bold text-[#B7A8FF]">{i + 1}</span>
                <h3 className="mt-4 font-semibold">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{p.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Quién está detrás */}
      <section id="quien" className="scroll-mt-20 border-t border-white/5 px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Quién está detrás</h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-300">
              VeaIA la dirige Raúl de Paco. Además de crear tecnología, es constructor: dirige una empresa de estructuras y cimentación y conoce el día a día de la obra y de la oficina.
            </p>
            <p className="mt-4 leading-relaxed text-gray-400">
              Empezó formándose en inteligencia artificial para quitarse papeleo en su propia empresa. Cuando vio el tiempo que le ahorraba, empezó a crear herramientas para otros negocios. Por eso aquí no se vende magia: se hacen aplicaciones que se usan cada día.
            </p>
          </div>
          <ul className="space-y-3 self-center">
            {PRINCIPIOS.map((x) => (
              <li key={x} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-gray-200">
                <span className="mt-0.5 text-[#F5A524]" aria-hidden>✓</span>
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="scroll-mt-20 border-t border-white/5 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pide una demo</h2>
          <p className="mt-4 text-gray-400">Cuéntanos tu caso y te enseñamos en 30 minutos qué podríamos hacer por tu negocio. Sin compromiso.</p>
          <div className="mt-8">
            <Contacto />
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 px-4 py-10 text-sm text-gray-500 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:justify-between">
          <p>© 2026 VeaIA · Raúl de Paco</p>
          <p className="flex gap-5">
            <a href="mailto:info@vortiaecosistemasagentesia.com" className="hover:text-gray-300">info@vortiaecosistemasagentesia.com</a>
            <span>Aviso legal · Privacidad</span>
          </p>
        </div>
      </footer>
    </main>
  );
}
