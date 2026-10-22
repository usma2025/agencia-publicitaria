"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PIEZAS_EXTRA } from "@/lib/catalog";
import { cop } from "@/lib/money";
import { calcularPaquete } from "@/lib/pricing";
import type { Producto } from "@/lib/types";
import { PanelTotal, type LineaBorrador } from "./PanelTotal";
import { aNumero, CampoNumero, OpcionesVariante } from "./ui";

/** Módulo A — tarifa fija y selección de paquetes (diseño, web, audiovisual). */
export function CotizadorPaquete({ producto }: { producto: Producto }) {
  const [varianteId, setVarianteId] = useState(producto.variantes[0].id);
  const [cantidadTxt, setCantidadTxt] = useState("1");
  const [extras, setExtras] = useState<{ id: string; cantidad: number }[]>([]);
  const [extraSel, setExtraSel] = useState(PIEZAS_EXTRA[0]?.id ?? "");

  const variante = producto.variantes.find((v) => v.id === varianteId) ?? producto.variantes[0];
  const cantidad = Math.max(0, Math.floor(aNumero(cantidadTxt)));
  const permiteExtras = producto.subcategoria !== "ilustracion" && producto.subcategoria !== "infografias";
  const etiquetaCantidad = producto.unidad === "Mensual" ? "Meses" : producto.unidad === "Unidad" ? "Unidades" : "Proyectos";

  const extrasDetalle = extras
    .map((e) => ({ pieza: PIEZAS_EXTRA.find((p) => p.id === e.id)!, cantidad: e.cantidad }))
    .filter((e) => e.pieza && e.cantidad > 0);

  const calculo = calcularPaquete({
    precioBase: variante.precioCop,
    cantidad,
    extras: extrasDetalle.map((e) => ({ nombre: e.pieza.nombre, precio: e.pieza.precioCop, cantidad: e.cantidad })),
  });

  const error = cantidad < 1 ? "La cantidad debe ser al menos 1." : null;

  const linea: LineaBorrador = {
    productoId: producto.id,
    nombre: producto.nombre,
    modulo: "A",
    detalle: [
      ...(producto.variantes.length > 1 ? [variante.nombre] : []),
      variante.notas,
      ...extrasDetalle.map((e) => `+ ${e.cantidad} × ${e.pieza.nombre} (${cop(e.pieza.precioCop)} c/u)`),
    ].filter(Boolean),
    cantidad,
    unidad: producto.unidad,
    subtotal: calculo.subtotal,
    referenciaUsd: variante.precioUsd ? { baseCop: calculo.base, baseUsd: variante.precioUsd * cantidad } : undefined,
  };

  function agregarExtra() {
    if (!extraSel) return;
    setExtras((prev) =>
      prev.some((e) => e.id === extraSel)
        ? prev.map((e) => (e.id === extraSel ? { ...e, cantidad: e.cantidad + 1 } : e))
        : [...prev, { id: extraSel, cantidad: 1 }],
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-5">
        <OpcionesVariante variantes={producto.variantes} valor={variante.id} onChange={setVarianteId} />
        {producto.variantes.length === 1 && variante.notas && (
          <p className="border-l-4 border-amarillo bg-white px-3 py-2 text-sm">{variante.notas}</p>
        )}

        {producto.unidad !== "Proyecto" && (
          <div className="max-w-48">
            <CampoNumero label={etiquetaCantidad} valor={cantidadTxt} onChange={setCantidadTxt} min={1} />
          </div>
        )}

        {permiteExtras && (
          <fieldset className="border-2 border-dashed border-tinta/40 p-4">
            <legend className="etiqueta px-1">Piezas / aplicaciones extra</legend>
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                aria-label="Pieza extra"
                className="campo"
                value={extraSel}
                onChange={(e) => setExtraSel(e.target.value)}
              >
                {PIEZAS_EXTRA.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} — {cop(p.precioCop)}
                  </option>
                ))}
              </select>
              <button type="button" onClick={agregarExtra} className="btn bg-white">
                <Plus size={16} /> Añadir
              </button>
            </div>
            {extras.length > 0 && (
              <ul className="mt-3 divide-y divide-tinta/10 bg-white">
                {extras.map((e) => {
                  const pieza = PIEZAS_EXTRA.find((p) => p.id === e.id);
                  if (!pieza) return null;
                  return (
                    <li key={e.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                      <span className="flex-1">{pieza.nombre}</span>
                      <input
                        type="number"
                        min={1}
                        aria-label={`Cantidad de ${pieza.nombre}`}
                        value={e.cantidad}
                        onChange={(ev) =>
                          setExtras((prev) =>
                            prev.map((x) =>
                              x.id === e.id ? { ...x, cantidad: Math.max(1, Math.floor(aNumero(ev.target.value))) } : x,
                            ),
                          )
                        }
                        className="w-16 border-2 border-tinta px-2 py-1 font-mono"
                      />
                      <span className="w-24 text-right font-mono">{cop(pieza.precioCop * e.cantidad)}</span>
                      <button
                        type="button"
                        aria-label={`Quitar ${pieza.nombre}`}
                        onClick={() => setExtras((prev) => prev.filter((x) => x.id !== e.id))}
                        className="text-gris hover:text-magenta"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </fieldset>
        )}
      </div>

      <PanelTotal
        linea={error ? null : linea}
        error={error}
        desglose={[
          { label: `Base${cantidad > 1 ? ` × ${cantidad}` : ""}`, valor: cop(calculo.base) },
          ...(calculo.extras > 0 ? [{ label: "Adicionales", valor: cop(calculo.extras) }] : []),
          ...(variante.precioUsd ? [{ label: "Tarifa oficial USD", valor: `US$ ${variante.precioUsd.toLocaleString("en-US")}` }] : []),
        ]}
      />
    </div>
  );
}
