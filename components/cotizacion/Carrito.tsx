"use client";

import Link from "next/link";
import { useState } from "react";
import { FileDown, FileText, Loader2, MessageCircle, Trash2, X } from "lucide-react";
import { IvaToggle, MonedaSelector } from "@/components/cotizador/Preferencias";
import { armarDatos, descargarPdf, textoWhatsApp, urlWhatsApp } from "@/lib/export";
import { cantidadTexto, formatear, resumen, valorLinea } from "@/lib/money";
import { SITE } from "@/lib/site";
import { useCotizacion, useHidratado, usePreferencias } from "@/lib/store";

const MODULO = { A: "Tarifa fija", B: "Por medida", C: "Por volumen", X: "Por cotizar" } as const;

export function Carrito() {
  const hidratado = useHidratado();
  const { moneda, conIva, tasas } = usePreferencias();
  const lineas = useCotizacion((s) => s.lineas);
  const numero = useCotizacion((s) => s.numero);
  const brief = useCotizacion((s) => s.brief);
  const quitar = useCotizacion((s) => s.quitar);
  const vaciar = useCotizacion((s) => s.vaciar);
  const [generando, setGenerando] = useState(false);
  const [errorPdf, setErrorPdf] = useState<string | null>(null);

  if (!hidratado) {
    return <div className="h-64 animate-pulse border-2 border-tinta/20 bg-white" aria-busy />;
  }

  if (lineas.length === 0) {
    return (
      <div className="border-2 border-dashed border-tinta p-10 text-center">
        <p className="font-display text-3xl">Tu cotización está vacía</p>
        <p className="mt-3 text-tinta/70">Agrega productos desde el cotizador rápido o el catálogo.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/#cotizar" className="btn bg-amarillo">Cotizador rápido</Link>
          <Link href="/servicios" className="btn bg-white">Ver catálogo</Link>
        </div>
      </div>
    );
  }

  const r = resumen(lineas, moneda, tasas, conIva, SITE.iva);
  const datos = () => armarDatos({ numero, lineas, moneda, tasas, conIva, brief });

  async function onPdf() {
    setGenerando(true);
    setErrorPdf(null);
    try {
      await descargarPdf(datos());
    } catch {
      setErrorPdf("No se pudo generar el PDF. Intenta de nuevo.");
    } finally {
      setGenerando(false);
    }
  }

  function onWhatsApp() {
    window.open(urlWhatsApp(textoWhatsApp(datos())), "_blank", "noopener");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-sm">
            N° <strong>{numero}</strong> · {lineas.length} ítem(s)
          </p>
          <button
            type="button"
            onClick={() => confirm("¿Vaciar la cotización?") && vaciar()}
            className="flex items-center gap-1 text-sm font-bold text-gris hover:text-magenta"
          >
            <X size={16} /> Vaciar
          </button>
        </div>

        <ol className="divide-y-2 divide-tinta border-2 border-tinta bg-white">
          {lineas.map((l, i) => {
            const v = valorLinea(l, moneda, tasas);
            return (
              <li key={l.id} className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 sm:p-5">
                <span className="font-mono text-sm text-gris">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold">{l.nombre}</h2>
                    <span
                      className={`px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                        l.modulo === "X" ? "bg-magenta text-white" : "bg-hueso"
                      }`}
                    >
                      {MODULO[l.modulo]}
                    </span>
                  </div>
                  <ul className="mt-1 space-y-0.5 text-sm text-tinta/70">
                    {l.detalle.map((d, j) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ul>
                  <p className="mt-2 font-mono text-xs">
                    Cantidad: {cantidadTexto(l.cantidad, l.unidad)}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between gap-2">
                  <span className="font-mono font-bold whitespace-nowrap">
                    {v === null ? "Por cotizar" : formatear(v, moneda)}
                  </span>
                  <button
                    type="button"
                    onClick={() => quitar(l.id)}
                    aria-label={`Quitar ${l.nombre}`}
                    className="text-gris hover:text-magenta"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-xs text-gris">
          ¿Necesitas cambiar una cantidad? Quita el ítem y vuelve a cotizarlo: los precios por volumen cambian según
          el rango.
        </p>
      </div>

      <aside className="h-fit border-2 border-tinta bg-tinta text-papel lg:sticky lg:top-24">
        <div className="flex items-center justify-between gap-3 border-b border-white/15 px-5 py-4">
          <span className="etiqueta mb-0! text-papel/60">Moneda</span>
          <MonedaSelector oscuro />
        </div>
        <dl className="space-y-2 px-5 py-5 font-mono text-sm" aria-live="polite">
          <div className="flex justify-between">
            <dt className="text-papel/60">Subtotal</dt>
            <dd>{formatear(r.subtotal, moneda)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-papel/60">IVA {conIva ? `${SITE.iva * 100}%` : "(no aplica)"}</dt>
            <dd>{formatear(r.iva, moneda)}</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-white/15 pt-3">
            <dt className="etiqueta mb-0! text-amarillo">Total</dt>
            <dd className="font-display text-4xl">{formatear(r.total, moneda)}</dd>
          </div>
          {r.porCotizar > 0 && (
            <p className="pt-1 font-sans text-xs text-amarillo">
              + {r.porCotizar} ítem(s) por cotizar con asesor (no incluidos en el total).
            </p>
          )}
          {moneda !== "COP" && (
            <p className="font-sans text-[11px] text-papel/50">Referencia según tasa vigente; se revalida en COP al cierre.</p>
          )}
        </dl>
        <div className="bg-papel px-5 py-4 text-tinta">
          <IvaToggle />
        </div>
        <div className="grid gap-2 border-t-2 border-tinta bg-papel p-4 text-tinta">
          <button type="button" onClick={onPdf} disabled={generando} className="btn bg-amarillo">
            {generando ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
            Descargar cotización oficial PDF
          </button>
          {errorPdf && <p className="text-sm font-bold text-magenta">{errorPdf}</p>}
          <button type="button" onClick={onWhatsApp} className="btn bg-[#25D366]">
            <MessageCircle size={18} /> Enviar por WhatsApp
          </button>
          <Link href="/brief" className="btn bg-white">
            <FileText size={18} /> {brief ? "Editar brief" : "Iniciar brief"}
          </Link>
          {!brief && (
            <p className="text-xs text-gris">Completa el brief para que el PDF salga a nombre de tu empresa.</p>
          )}
        </div>
      </aside>
    </div>
  );
}
