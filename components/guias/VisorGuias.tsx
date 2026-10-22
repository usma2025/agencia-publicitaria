"use client";

import { useState } from "react";
import { GUIAS, type BloqueGuia } from "@/lib/guias";

export function VisorGuias() {
  const [activa, setActiva] = useState(GUIAS[0].id);
  const guia = GUIAS.find((g) => g.id === activa) ?? GUIAS[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <div role="tablist" aria-label="Guías" aria-orientation="vertical" className="flex gap-2 overflow-x-auto lg:flex-col">
        {GUIAS.map((g, i) => {
          const sel = g.id === guia.id;
          return (
            <button
              key={g.id}
              type="button"
              role="tab"
              id={`tab-${g.id}`}
              aria-selected={sel}
              aria-controls="panel-guia"
              onClick={() => setActiva(g.id)}
              className={`min-w-56 shrink-0 border-2 border-tinta p-4 text-left transition-colors lg:min-w-0 ${
                sel ? "bg-tinta text-papel" : "bg-white hover:bg-amarillo"
              }`}
            >
              <span className={`font-mono text-xs ${sel ? "text-amarillo" : "text-magenta"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="block font-extrabold">{g.titulo}</span>
              <span className={`block text-xs ${sel ? "text-papel/60" : "text-tinta/60"}`}>{g.resumen}</span>
            </button>
          );
        })}
      </div>

      <article
        id="panel-guia"
        role="tabpanel"
        aria-labelledby={`tab-${guia.id}`}
        className="border-2 border-tinta bg-white p-6 sm:p-10"
      >
        <h2 className="font-display text-3xl sm:text-5xl">{guia.titulo}</h2>
        <div className="mt-6 max-w-3xl space-y-5">
          {guia.bloques.map((b, i) => (
            <Bloque key={i} bloque={b} />
          ))}
        </div>
      </article>
    </div>
  );
}

function Bloque({ bloque }: { bloque: BloqueGuia }) {
  switch (bloque.tipo) {
    case "p":
      return <p className="text-tinta/80">{bloque.texto}</p>;
    case "lista":
      return (
        <ul className="space-y-2">
          {bloque.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden className="mt-2 h-2 w-2 shrink-0 bg-magenta" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "tabla":
      return (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full border-2 border-tinta text-sm">
              <thead className="bg-tinta text-papel">
                <tr>
                  {bloque.columnas.map((c) => (
                    <th key={c} scope="col" className="px-3 py-2 text-left font-mono text-xs uppercase">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bloque.filas.map((f) => (
                  <tr key={f[0]} className="border-t border-tinta/15 even:bg-papel">
                    {f.map((celda, j) => (
                      <td key={j} className={`px-3 py-2 ${j === 0 ? "font-bold" : "font-mono"}`}>
                        {celda}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {bloque.nota && <p className="mt-2 text-xs text-gris">{bloque.nota}</p>}
        </div>
      );
  }
}
