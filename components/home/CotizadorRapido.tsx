"use client";

import { useId, useState } from "react";
import { Cotizador } from "@/components/cotizador/Cotizador";
import { MODULO_DE, PRODUCTOS, SECCIONES } from "@/lib/catalog";

const TABS = [
  { modulo: "A", titulo: "Servicios fijos", bajada: "Diseño, web y audiovisual", inicial: "diseno-grafico-creacion-de-logo" },
  { modulo: "B", titulo: "Gran formato", bajada: "Por m² o metro lineal", inicial: "gran-formato-banner-impresion-media-baja" },
  { modulo: "C", titulo: "Volumen", bajada: "Cupos, textil, escarapelas", inicial: "textil-algodon-color-1-cara-dtf" },
] as const;

type Modulo = (typeof TABS)[number]["modulo"];

export function CotizadorRapido() {
  const id = useId();
  const [modulo, setModulo] = useState<Modulo>("A");
  const [seleccion, setSeleccion] = useState<Record<Modulo, string>>({
    A: TABS[0].inicial,
    B: TABS[1].inicial,
    C: TABS[2].inicial,
  });

  const producto = PRODUCTOS.find((p) => p.id === seleccion[modulo]) ?? PRODUCTOS.find((p) => MODULO_DE[p.modo] === modulo)!;
  const grupos = SECCIONES.map((s) => ({
    seccion: s,
    productos: PRODUCTOS.filter((p) => s.categorias.includes(p.categoria) && MODULO_DE[p.modo] === modulo),
  })).filter((g) => g.productos.length > 0);

  return (
    <div className="border-2 border-tinta bg-papel shadow-[10px_10px_0_var(--color-tinta)]">
      <div role="tablist" aria-label="Tipo de cotización" className="grid grid-cols-3 border-b-2 border-tinta">
        {TABS.map((t) => {
          const activo = t.modulo === modulo;
          return (
            <button
              key={t.modulo}
              type="button"
              role="tab"
              id={`${id}-tab-${t.modulo}`}
              aria-selected={activo}
              aria-controls={`${id}-panel`}
              onClick={() => setModulo(t.modulo)}
              className={`border-r-2 border-tinta px-3 py-4 text-left transition-colors last:border-r-0 sm:px-5 ${
                activo ? "bg-amarillo" : "bg-white hover:bg-hueso"
              }`}
            >
              <span className="font-mono text-[10px] font-bold text-magenta">MÓDULO {t.modulo}</span>
              <span className="block text-sm leading-tight font-extrabold sm:text-lg">{t.titulo}</span>
              <span className="hidden text-xs text-tinta/60 sm:block">{t.bajada}</span>
            </button>
          );
        })}
      </div>

      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${modulo}`} className="p-4 sm:p-6">
        <label htmlFor={`${id}-producto`} className="etiqueta">
          Producto o servicio
        </label>
        <select
          id={`${id}-producto`}
          className="campo mb-6 text-lg"
          value={producto.id}
          onChange={(e) => setSeleccion((s) => ({ ...s, [modulo]: e.target.value }))}
        >
          {grupos.map((g) => (
            <optgroup key={g.seccion.slug} label={g.seccion.titulo}>
              {g.productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <Cotizador producto={producto} />
      </div>
    </div>
  );
}
