import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ACENTO_FONDO } from "@/components/catalogo/acentos";
import { ACotizarCard } from "@/components/catalogo/ACotizarCard";
import { ProductoCard } from "@/components/catalogo/ProductoCard";
import { AVISOS } from "@/lib/avisos";
import { agruparPorSubcategoria, getSeccion, productosDeSeccion, SECCIONES } from "@/lib/catalog";

export function generateStaticParams() {
  return SECCIONES.map((s) => ({ seccion: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/servicios/[seccion]">): Promise<Metadata> {
  const seccion = getSeccion((await params).seccion);
  return seccion ? { title: seccion.titulo, description: seccion.bajada } : {};
}

// Avisos relevantes por sección.
const AVISOS_SECCION: Record<string, string[]> = {
  imprenta: ["cupos", "excedente"],
  textil: ["excedente"],
  "gran-formato": ["excedente"],
  diseno: ["moneda"],
};

export default async function SeccionPage({ params }: PageProps<"/servicios/[seccion]">) {
  const seccion = getSeccion((await params).seccion);
  if (!seccion) notFound();

  const grupos = agruparPorSubcategoria(productosDeSeccion(seccion));
  const avisos = AVISOS.filter((a) => a.id === "iva" || AVISOS_SECCION[seccion.slug]?.includes(a.id));
  const otras = SECCIONES.filter((s) => s.slug !== seccion.slug);

  return (
    <div>
      <header className="border-b-2 border-tinta bg-tinta text-papel">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:flex-row sm:items-end sm:px-6">
          <span className={`font-display grid h-24 w-24 shrink-0 place-items-center text-6xl ${ACENTO_FONDO[seccion.acento]}`}>
            {seccion.letra}
          </span>
          <div>
            <Link href="/servicios" className="etiqueta text-papel/60 hover:text-amarillo">
              ← Servicios
            </Link>
            <h1 className="font-display text-4xl sm:text-6xl">{seccion.titulo}</h1>
            <p className="mt-3 max-w-2xl text-papel/75">{seccion.bajada}</p>
          </div>
        </div>
        {grupos.length > 1 && (
          <nav aria-label="Subcategorías" className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-6 sm:px-6">
            {grupos.map((g, i) => (
              <a
                key={g.titulo}
                href={`#grupo-${i}`}
                className="shrink-0 border border-papel/30 px-3 py-1.5 font-mono text-xs uppercase hover:bg-amarillo hover:text-tinta"
              >
                {g.titulo}
              </a>
            ))}
          </nav>
        )}
      </header>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {grupos.map((g, i) => (
          <section key={g.titulo} id={`grupo-${i}`} className="mb-14 scroll-mt-24">
            <h2 className="mb-5 flex items-center gap-3 text-2xl font-extrabold">
              <span className="font-mono text-sm text-magenta">{String(i + 1).padStart(2, "0")}</span>
              {g.titulo}
            </h2>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {g.productos.map((p) => (
                <ProductoCard key={p.id} producto={p} />
              ))}
            </div>
          </section>
        ))}

        {seccion.aCotizar.length > 0 && (
          <section className="mb-14">
            <h2 className="mb-2 text-2xl font-extrabold">
              {grupos.length ? "También hacemos" : "Catálogo"}
            </h2>
            <p className="mb-5 text-sm text-tinta/70">
              Productos con precio según referencia, cantidad y marcación. Agrégalos a tu cotización y un asesor te
              confirma el valor.
            </p>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {seccion.aCotizar.map((item) => (
                <ACotizarCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        <aside className="grid gap-4 border-t-2 border-tinta pt-8 md:grid-cols-2">
          {avisos.map((a) => (
            <div key={a.id} className="border-l-4 border-amarillo bg-white p-4">
              <h3 className="etiqueta">{a.titulo}</h3>
              <p className="text-sm text-tinta/75">{a.texto}</p>
            </div>
          ))}
        </aside>

        <nav aria-label="Otras secciones" className="mt-12 flex flex-wrap gap-2">
          {otras.map((s) => (
            <Link key={s.slug} href={`/servicios/${s.slug}`} className="btn bg-white py-2! text-xs">
              {s.letra} · {s.titulo}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
