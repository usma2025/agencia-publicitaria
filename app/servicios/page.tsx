import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ACENTO_FONDO } from "@/components/catalogo/acentos";
import { agruparPorSubcategoria, productosDeSeccion, SECCIONES } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Catálogo completo de servicios y productos con precios y cotizador en tiempo real.",
};

export default function ServiciosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="etiqueta text-magenta">Catálogo 2026</p>
      <h1 className="font-display text-5xl sm:text-7xl">Servicios</h1>
      <p className="mt-4 max-w-2xl text-lg text-tinta/75">
        Todo lo que hacemos, con precio publicado y cotizador en tiempo real. Precios en COP sin IVA.
      </p>

      <ol className="mt-12 grid gap-px border-2 border-tinta bg-tinta sm:grid-cols-2">
        {SECCIONES.map((s) => {
          const grupos = agruparPorSubcategoria(productosDeSeccion(s));
          return (
            <li key={s.slug} className="bg-papel">
              <Link href={`/servicios/${s.slug}`} className="group flex h-full gap-5 p-6 hover:bg-white">
                <span className={`font-display grid h-14 w-14 shrink-0 place-items-center text-3xl ${ACENTO_FONDO[s.acento]}`}>
                  {s.letra}
                </span>
                <span className="flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-xl font-extrabold">{s.titulo}</span>
                    <ArrowUpRight className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                  <span className="mt-1 block text-sm text-tinta/70">{s.bajada}</span>
                  <span className="mt-3 flex flex-wrap gap-1.5">
                    {(grupos.length ? grupos.map((g) => g.titulo) : s.aCotizar.slice(0, 5).map((a) => a.nombre)).map((t) => (
                      <span key={t} className="border border-tinta/25 px-2 py-0.5 font-mono text-[10px] uppercase">
                        {t}
                      </span>
                    ))}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
        <li className="bg-tinta text-papel">
          <Link href="/guias" className="group flex h-full gap-5 p-6 hover:bg-carbon">
            <span className="font-display grid h-14 w-14 shrink-0 place-items-center bg-papel text-3xl text-tinta">H</span>
            <span className="flex-1">
              <span className="flex items-start justify-between gap-2">
                <span className="text-xl font-extrabold">Manuales, Guías & Transparencia</span>
                <ArrowUpRight className="shrink-0" />
              </span>
              <span className="mt-1 block text-sm text-papel/70">
                Instructivo de vinilo, manual de cupos, guía de tallas, tiempos de entrega y política de excedentes.
              </span>
            </span>
          </Link>
        </li>
      </ol>
    </div>
  );
}
