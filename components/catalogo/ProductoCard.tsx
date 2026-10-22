"use client";

import { useState } from "react";
import { Calculator, X } from "lucide-react";
import { Cotizador } from "@/components/cotizador/Cotizador";
import { MODULO_DE, precioDesde } from "@/lib/catalog";
import { cop } from "@/lib/money";
import type { Producto } from "@/lib/types";

const UNIDAD: Record<string, string> = {
  M2: "m²",
  "Metro Lineal": "metro lineal",
  Mensual: "mes",
  Proyecto: "proyecto",
  Unidad: "unidad",
  Paquete: "paquete",
  Cara: "cara",
};

const MODULO_LABEL = { A: "Tarifa fija", B: "Por medida", C: "Por volumen" } as const;

export function ProductoCard({ producto }: { producto: Producto }) {
  const [abierto, setAbierto] = useState(false);
  const modulo = MODULO_DE[producto.modo];
  const varios = producto.variantes.length > 1;

  return (
    <article
      id={producto.id}
      className={`scroll-mt-24 border-2 border-tinta bg-white transition-shadow ${
        abierto ? "col-span-full shadow-[8px_8px_0_var(--color-tinta)]" : "hover:shadow-[6px_6px_0_var(--color-tinta)]"
      }`}
    >
      <div className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg leading-tight font-extrabold">{producto.nombre}</h3>
          <span className="shrink-0 bg-hueso px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
            {MODULO_LABEL[modulo]}
          </span>
        </div>

        <p className="mt-2 font-mono text-sm">
          {varios && <span className="text-gris">desde </span>}
          <strong className="text-base">{cop(precioDesde(producto))}</strong>
          <span className="text-gris"> / {UNIDAD[producto.unidad] ?? producto.unidad}</span>
        </p>

        {!abierto && (
          <ul className="mt-3 flex-1 space-y-1 text-sm">
            {producto.variantes.slice(0, 5).map((v) => (
              <li key={v.id} className="flex justify-between gap-3 border-b border-dashed border-tinta/15 pb-1">
                <span className="text-tinta/80">{varios ? v.nombre : v.notas}</span>
                {varios && <span className="shrink-0 font-mono text-xs">{cop(v.precioCop)}</span>}
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          className={`btn mt-4 self-start ${abierto ? "bg-white" : "bg-amarillo"}`}
        >
          {abierto ? <X size={16} /> : <Calculator size={16} />}
          {abierto ? "Cerrar" : "Cotizar"}
        </button>

        {abierto && (
          <div className="mt-5 border-t-2 border-tinta pt-5">
            <Cotizador producto={producto} />
          </div>
        )}
      </div>
    </article>
  );
}
