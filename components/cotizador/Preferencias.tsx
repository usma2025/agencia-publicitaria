"use client";

import { useEffect } from "react";
import { SITE } from "@/lib/site";
import { useCotizacion, usePreferencias } from "@/lib/store";
import type { Moneda } from "@/lib/types";

const MONEDAS: Moneda[] = ["COP", "USD", "EUR", "MXN"];

export function MonedaSelector({ oscuro = false }: { oscuro?: boolean }) {
  const { moneda } = usePreferencias();
  const setMoneda = useCotizacion((s) => s.setMoneda);
  const tasasEnLinea = useCotizacion((s) => s.tasasEnLinea);
  const cargarTasas = useCotizacion((s) => s.cargarTasas);

  // Si la moneda guardada no es COP, actualiza las tasas al montar.
  useEffect(() => {
    if (moneda !== "COP" && !tasasEnLinea) void cargarTasas();
  }, [moneda, tasasEnLinea, cargarTasas]);

  return (
    <div role="radiogroup" aria-label="Moneda" className="inline-flex border-2 border-current">
      {MONEDAS.map((m) => (
        <button
          key={m}
          type="button"
          role="radio"
          aria-checked={moneda === m}
          onClick={() => setMoneda(m)}
          className={`px-2.5 py-1 font-mono text-xs font-bold transition-colors ${
            moneda === m
              ? oscuro
                ? "bg-amarillo text-tinta"
                : "bg-tinta text-papel"
              : "hover:bg-amarillo hover:text-tinta"
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}

export function IvaToggle() {
  const { conIva } = usePreferencias();
  const setIva = useCotizacion((s) => s.setIva);
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={conIva}
        onChange={(e) => setIva(e.target.checked)}
      />
      <span
        aria-hidden
        className="relative mt-0.5 h-6 w-11 shrink-0 border-2 border-tinta bg-white transition-colors peer-checked:bg-magenta peer-focus-visible:outline-3 peer-focus-visible:outline-magenta after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:bg-tinta after:transition-transform peer-checked:after:translate-x-5 peer-checked:after:bg-white"
      />
      <span>
        <strong className="font-extrabold">¿Requiere factura electrónica formal?</strong>
        <span className="block text-xs text-gris">
          {conIva
            ? `Se suma ${SITE.iva * 100}% de IVA. Facturación por ${SITE.facturador}.`
            : "Sin factura formal: se gestiona con recibo, sin IVA."}
        </span>
      </span>
    </label>
  );
}
