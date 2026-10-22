"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { formatear, valorLinea } from "@/lib/money";
import { SITE } from "@/lib/site";
import { useCotizacion, usePreferencias } from "@/lib/store";
import type { LineaCotizacion } from "@/lib/types";
import { IvaToggle, MonedaSelector } from "./Preferencias";

export type LineaBorrador = Omit<LineaCotizacion, "id">;

export function PanelTotal({
  linea,
  error,
  desglose,
}: {
  linea: LineaBorrador | null;
  error?: string | null;
  desglose?: { label: string; valor: string }[];
}) {
  const { moneda, conIva, tasas } = usePreferencias();
  const agregar = useCotizacion((s) => s.agregar);
  const [agregado, setAgregado] = useState(false);

  const subtotal = linea ? valorLinea({ ...linea, id: "" }, moneda, tasas) : null;
  const iva = subtotal !== null && conIva ? subtotal * SITE.iva : 0;

  function onAgregar() {
    if (!linea) return;
    agregar(linea);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2500);
  }

  return (
    <div className="border-2 border-tinta bg-tinta text-papel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 px-4 py-3">
        <span className="etiqueta mb-0! text-papel/60">Moneda</span>
        <MonedaSelector oscuro />
      </div>

      {desglose && desglose.length > 0 && (
        <dl className="space-y-1 border-b border-white/15 px-4 py-3 font-mono text-xs">
          {desglose.map((d) => (
            <div key={d.label} className="flex justify-between gap-4">
              <dt className="text-papel/60">{d.label}</dt>
              <dd className="text-right">{d.valor}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="px-4 py-4" aria-live="polite">
        {error ? (
          <p className="font-bold text-amarillo">{error}</p>
        ) : subtotal === null ? (
          <p className="text-papel/70">Este ítem se cotiza con un asesor.</p>
        ) : (
          <dl className="space-y-1">
            <div className="flex justify-between font-mono text-sm">
              <dt className="text-papel/60">Subtotal</dt>
              <dd>{formatear(subtotal, moneda)}</dd>
            </div>
            {conIva && (
              <div className="flex justify-between font-mono text-sm">
                <dt className="text-papel/60">IVA {SITE.iva * 100}%</dt>
                <dd>{formatear(iva, moneda)}</dd>
              </div>
            )}
            <div className="flex items-baseline justify-between gap-3 pt-2">
              <dt className="etiqueta mb-0! text-amarillo">Total</dt>
              <dd className="font-display text-3xl sm:text-4xl">{formatear(subtotal + iva, moneda)}</dd>
            </div>
            {moneda !== "COP" && (
              <p className="pt-1 text-[11px] text-papel/50">Valor de referencia. Se revalida en COP al cierre.</p>
            )}
          </dl>
        )}
      </div>

      <div className="bg-papel px-4 py-4 text-tinta">
        <IvaToggle />
      </div>

      <div className="flex flex-wrap gap-2 border-t-2 border-tinta bg-papel p-3">
        <button type="button" onClick={onAgregar} disabled={!linea || !!error} className="btn flex-1 bg-amarillo">
          {agregado ? <Check size={18} /> : <Plus size={18} />}
          {agregado ? "Agregado" : "Agregar a cotización"}
        </button>
        {agregado && (
          <Link href="/cotizacion" className="btn bg-white">
            Ver cotización
          </Link>
        )}
      </div>
    </div>
  );
}
