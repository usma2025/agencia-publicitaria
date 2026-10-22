import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { ACENTO_FONDO } from "@/components/catalogo/acentos";
import { CotizadorRapido } from "@/components/home/CotizadorRapido";
import { precioDesde, productosDeSeccion, SECCIONES } from "@/lib/catalog";
import { cop } from "@/lib/money";
import { SITE } from "@/lib/site";

const MARQUEE = [
  "Logos", "Redes sociales", "Sitios web", "E-commerce", "Tarjetas", "Volantes", "Banners", "Vinilos",
  "Roll ups", "Backings", "Camisetas DTF", "Gorras", "Escarapelas", "Spots políticos", "Reels", "Papelones",
];

const PROYECTOS = [
  {
    titulo: "Campaña política 360°",
    piezas: ["Línea gráfica Premium", "Spot político", "Papelones con empalme", "Camisetas y gorras", "Reels 60 días"],
    secciones: ["audiovisual", "diseno", "gran-formato", "textil"],
    fondo: "bg-magenta text-white",
  },
  {
    titulo: "Lanzamiento de marca",
    piezas: ["Logo Premium + manual", "Web Profesional 2A", "Tarjetas mate + UV", "Plan de redes Medium"],
    secciones: ["diseno", "web", "imprenta"],
    fondo: "bg-amarillo text-tinta",
  },
  {
    titulo: "Feria y eventos",
    piezas: ["Backing tela 2 caras", "Roll up PVC", "Escarapelas plásticas", "Popman gota", "Volantes"],
    secciones: ["gran-formato", "imprenta"],
    fondo: "bg-cian text-white",
  },
  {
    titulo: "Punto de venta",
    piezas: ["Caja de luz Panaflex", "Vinilo laminado", "Etiquetas troqueladas", "Afiche de campaña"],
    secciones: ["gran-formato", "imprenta", "diseno"],
    fondo: "bg-tinta text-papel",
  },
];

const SECTORES = ["Campañas políticas", "Comercio", "Educación", "Salud", "Eventos", "Entidades públicas", "Emprendimientos", "Gastronomía"];

const PASOS = [
  { n: "01", t: "Cotiza", d: "Elige productos y calcula en tiempo real: paquetes, medidas o volumen." },
  { n: "02", t: "Descarga o envía", d: "Obtén el PDF oficial membretado o envíala por WhatsApp a ventas." },
  { n: "03", t: "Brief", d: "Cuéntanos objetivo, público y referencias para arrancar sin vueltas." },
  { n: "04", t: "Producción", d: "Aprobamos arte, producimos y entregamos en los tiempos acordados." },
];

export default function Home() {
  const principales = SECCIONES.filter((s) => s.principal);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b-2 border-tinta">
        <div aria-hidden className="trama absolute inset-y-0 right-0 hidden w-1/3 text-tinta/15 lg:block" />
        <MarcasRegistro />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pt-14 pb-16 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:pt-20">
          <div>
            <p className="etiqueta text-magenta">{SITE.nombreCompleto} · Catálogo 2026</p>
            <h1 className="font-display text-[clamp(2.75rem,7vw,6.25rem)]">
              Pensar
              <br />
              diferente,
              <br />
              <span className="bg-amarillo px-2 [box-decoration-break:clone]">ejecutar con</span>
              <br />
              <span className="text-magenta">criterio.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-tinta/75">
              Diseño, web, imprenta, gran formato, textil y audiovisual en un solo lugar. Precios publicados,
              cotización en tiempo real y PDF oficial en segundos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#cotizar" className="btn bg-tinta text-papel">
                Cotizar ahora <ArrowDown size={18} />
              </a>
              <Link href="/servicios" className="btn bg-white">
                Ver servicios <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block" aria-hidden>
            <div className="absolute top-6 right-0 h-64 w-52 rotate-6 border-2 border-tinta bg-magenta" />
            <div className="absolute top-24 right-20 h-72 w-56 -rotate-3 border-2 border-tinta bg-amarillo p-5">
              <p className="font-display text-5xl">CMYK</p>
              <div className="mt-6 flex gap-2">
                <span className="h-8 w-8 rounded-full bg-cian" />
                <span className="h-8 w-8 rounded-full bg-magenta" />
                <span className="h-8 w-8 rounded-full border-2 border-tinta bg-amarillo" />
                <span className="h-8 w-8 rounded-full bg-tinta" />
              </div>
              <p className="mt-6 font-mono text-xs">300 g · UV parcial · troquel</p>
            </div>
            <div className="absolute right-4 bottom-0 h-40 w-40 rounded-full border-2 border-tinta bg-cian" />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-b-2 border-tinta bg-tinta py-3 text-papel" aria-hidden>
        <div className="marquee flex w-max gap-8 whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="font-display flex items-center gap-8 text-xl">
              {m} <span className="text-amarillo">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* COTIZADOR RÁPIDO */}
      <section id="cotizar" className="scroll-mt-16 border-b-2 border-tinta bg-hueso">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="etiqueta text-magenta">Cotización en tiempo real</p>
              <h2 className="font-display text-4xl sm:text-6xl">Cotiza en 30 segundos</h2>
            </div>
            <p className="max-w-sm text-sm text-tinta/70">
              Agrega varios productos, activa factura con IVA si la necesitas y descarga el PDF oficial desde{" "}
              <Link href="/cotizacion" className="font-bold underline">
                Mi cotización
              </Link>
              .
            </p>
          </div>
          <CotizadorRapido />
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <p className="etiqueta text-magenta">6 líneas</p>
        <h2 className="font-display mb-10 text-4xl sm:text-6xl">Lo que hacemos</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {principales.map((s) => {
            const productos = productosDeSeccion(s);
            const desde = productos.length ? Math.min(...productos.map(precioDesde)) : null;
            return (
              <Link
                key={s.slug}
                href={`/servicios/${s.slug}`}
                className="group flex flex-col border-2 border-tinta bg-white transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--color-tinta)]"
              >
                <div className={`flex items-center justify-between px-5 py-4 ${ACENTO_FONDO[s.acento]}`}>
                  <span className="font-display text-4xl">{s.letra}</span>
                  <ArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-xl font-extrabold">{s.titulo}</h3>
                  <p className="mt-2 flex-1 text-sm text-tinta/70">{s.bajada}</p>
                  {desde !== null && (
                    <p className="mt-4 font-mono text-xs">
                      {productos.length} productos · desde <strong>{cop(desde)}</strong>
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/servicios/promocionales" className="btn bg-white">
            G · Promocionales & souvenirs
          </Link>
          <Link href="/guias" className="btn bg-white">
            H · Manuales & guías
          </Link>
        </div>
      </section>

      {/* SHOWCASE */}
      <section className="border-y-2 border-tinta bg-tinta text-papel">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <p className="etiqueta text-amarillo">Proyectos</p>
          <h2 className="font-display mb-3 text-4xl sm:text-6xl">Proyectos integrales</h2>
          <p className="mb-10 max-w-2xl text-papel/70">
            Combinaciones que más producimos. Cada pieza sale del mismo taller: diseño, impresión y producción bajo
            un solo criterio.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            {PROYECTOS.map((p, i) => (
              <article key={p.titulo} className={`relative overflow-hidden border-2 border-papel/20 p-7 ${p.fondo}`}>
                <span aria-hidden className="trama absolute -right-6 -bottom-6 h-40 w-40 rounded-full opacity-30" />
                <span className="font-mono text-xs opacity-70">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display mt-2 text-3xl">{p.titulo}</h3>
                <ul className="relative mt-5 flex flex-wrap gap-2">
                  {p.piezas.map((pz) => (
                    <li key={pz} className="border border-current px-2.5 py-1 text-xs font-bold">
                      {pz}
                    </li>
                  ))}
                </ul>
                <div className="relative mt-6 flex flex-wrap gap-3 text-sm font-extrabold">
                  {p.secciones.map((slug) => {
                    const s = SECCIONES.find((x) => x.slug === slug)!;
                    return (
                      <Link key={slug} href={`/servicios/${slug}`} className="underline underline-offset-4 hover:no-underline">
                        {s.titulo} →
                      </Link>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16">
            <h3 className="etiqueta text-papel/50">Sectores y organizaciones con los que trabajamos</h3>
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
              {SECTORES.map((s) => (
                <li key={s} className="font-display text-2xl text-papel/80 sm:text-3xl">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="font-display mb-10 text-4xl sm:text-6xl">Cómo funciona</h2>
        <ol className="grid gap-px border-2 border-tinta bg-tinta sm:grid-cols-2 lg:grid-cols-4">
          {PASOS.map((p) => (
            <li key={p.n} className="bg-papel p-6">
              <span className="font-display text-5xl text-magenta">{p.n}</span>
              <h3 className="mt-3 text-xl font-extrabold">{p.t}</h3>
              <p className="mt-2 text-sm text-tinta/70">{p.d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-col items-start justify-between gap-6 border-2 border-tinta bg-amarillo p-8 sm:flex-row sm:items-center">
          <p className="font-display text-3xl sm:text-4xl">¿Ya tienes claro lo que necesitas?</p>
          <Link href="/brief" className="btn bg-tinta text-papel">
            Iniciar brief <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

/** Marcas de registro de imprenta en las esquinas del hero. */
function MarcasRegistro() {
  const marca = (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="6" />
      <path d="M12 0v24M0 12h24" />
    </svg>
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-3 text-tinta/40">
      <span className="absolute top-0 left-0">{marca}</span>
      <span className="absolute top-0 right-0">{marca}</span>
      <span className="absolute bottom-0 left-0">{marca}</span>
      <span className="absolute right-0 bottom-0">{marca}</span>
    </div>
  );
}
