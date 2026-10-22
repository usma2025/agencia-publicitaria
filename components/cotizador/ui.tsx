"use client";

import { useId } from "react";
import { cop } from "@/lib/money";
import type { Variante } from "@/lib/types";

export function OpcionesVariante({
  variantes,
  valor,
  onChange,
  mostrarPrecio = true,
}: {
  variantes: Variante[];
  valor: string;
  onChange: (id: string) => void;
  mostrarPrecio?: boolean;
}) {
  const name = useId();
  if (variantes.length === 1) return null;
  return (
    <fieldset>
      <legend className="etiqueta">Opción</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {variantes.map((v) => (
          <label
            key={v.id}
            className="flex cursor-pointer flex-col border-2 border-tinta bg-white p-3 transition-colors has-checked:bg-amarillo has-focus-visible:outline-3 has-focus-visible:outline-magenta"
          >
            <input
              type="radio"
              name={name}
              className="sr-only"
              checked={valor === v.id}
              onChange={() => onChange(v.id)}
            />
            <span className="flex items-baseline justify-between gap-2">
              <span className="font-extrabold">{v.nombre}</span>
              {mostrarPrecio && <span className="font-mono text-sm font-bold">{cop(v.precioCop)}</span>}
            </span>
            {v.notas && <span className="mt-1 text-xs leading-snug text-tinta/70">{v.notas}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function CampoNumero({
  label,
  valor,
  onChange,
  min = 0,
  step = 1,
  sufijo,
  ayuda,
}: {
  label: string;
  valor: string;
  onChange: (v: string) => void;
  min?: number;
  step?: number;
  sufijo?: string;
  ayuda?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="etiqueta">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          className="campo pr-12 font-mono"
        />
        {sufijo && (
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-xs text-gris">
            {sufijo}
          </span>
        )}
      </div>
      {ayuda && <p className="mt-1 text-xs text-gris">{ayuda}</p>}
    </div>
  );
}

export function aNumero(valor: string) {
  const n = Number(valor.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}
