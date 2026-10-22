"use client";

import { useState } from "react";
import { Check, MessageSquarePlus } from "lucide-react";
import { useCotizacion } from "@/lib/store";
import type { ProductoACotizar } from "@/lib/types";

/** Producto sin precio publicado: se agrega a la cotización para que un asesor lo valore. */
export function ACotizarCard({ item }: { item: ProductoACotizar }) {
  const agregar = useCotizacion((s) => s.agregar);
  const [cantidad, setCantidad] = useState("1");
  const [nota, setNota] = useState("");
  const [agregado, setAgregado] = useState(false);

  function onAgregar() {
    const n = Math.max(1, Math.floor(Number(cantidad) || 1));
    agregar({
      productoId: item.id,
      nombre: item.nombre,
      modulo: "X",
      detalle: [item.descripcion, ...(nota.trim() ? [`Especificaciones: ${nota.trim()}`] : [])],
      cantidad: n,
      unidad: "Unidad",
      subtotal: null,
    });
    setAgregado(true);
    setNota("");
    setTimeout(() => setAgregado(false), 2500);
  }

  return (
    <article className="flex flex-col border-2 border-dashed border-tinta bg-papel p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg leading-tight font-extrabold">{item.nombre}</h3>
        <span className="shrink-0 bg-magenta px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase">
          A cotizar
        </span>
      </div>
      <p className="mt-2 flex-1 text-sm text-tinta/75">{item.descripcion}</p>
      <div className="mt-4 grid grid-cols-[80px_1fr] gap-2">
        <input
          type="number"
          min={1}
          aria-label={`Cantidad de ${item.nombre}`}
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="campo font-mono"
        />
        <input
          type="text"
          aria-label={`Especificaciones de ${item.nombre}`}
          placeholder="Medidas, colores, técnica…"
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          className="campo"
        />
      </div>
      <button type="button" onClick={onAgregar} className="btn mt-3 self-start bg-white">
        {agregado ? <Check size={16} /> : <MessageSquarePlus size={16} />}
        {agregado ? "Agregado" : "Solicitar precio"}
      </button>
    </article>
  );
}
