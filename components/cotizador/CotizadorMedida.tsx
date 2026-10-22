"use client";

import { useState } from "react";
import { ACABADOS } from "@/lib/acabados";
import { cop } from "@/lib/money";
import { calcularMedida, COBRO_MINIMO_M2 } from "@/lib/pricing";
import type { Producto } from "@/lib/types";
import { PanelTotal, type LineaBorrador } from "./PanelTotal";
import { aNumero, CampoNumero, OpcionesVariante } from "./ui";

const m2 = (n: number) => `${n.toLocaleString("es-CO", { maximumFractionDigits: 2 })} m²`;

/** Módulo B — por metro cuadrado o metro lineal (gran formato, vinilos, etiquetas). */
export function CotizadorMedida({ producto }: { producto: Producto }) {
  const lineal = producto.modo === "lineal";
  const [varianteId, setVarianteId] = useState(producto.variantes[0].id);
  const [anchoTxt, setAnchoTxt] = useState("1");
  const [altoTxt, setAltoTxt] = useState("1");
  const [cantidadTxt, setCantidadTxt] = useState("1");
  const [acabadosSel, setAcabadosSel] = useState<string[]>([]);

  const variante = producto.variantes.find((v) => v.id === varianteId) ?? producto.variantes[0];
  const disponibles = ACABADOS[producto.id] ?? [];
  const acabados = disponibles.filter((a) => acabadosSel.includes(a.id));
  const ancho = aNumero(anchoTxt);
  const alto = aNumero(altoTxt);
  const cantidad = Math.floor(aNumero(cantidadTxt));

  const calculo = calcularMedida({ modo: lineal ? "lineal" : "area", precio: variante.precioCop, cantidad, ancho, alto, acabados });

  const error =
    ancho <= 0 || (!lineal && alto <= 0)
      ? "Ingresa medidas mayores a cero."
      : cantidad < 1
        ? "La cantidad debe ser al menos 1."
        : null;

  const medidas = lineal ? `${ancho} m lineales` : `${ancho} × ${alto} m (${m2(calculo.areaReal)})`;
  const linea: LineaBorrador = {
    productoId: producto.id,
    nombre: producto.nombre,
    modulo: "B",
    detalle: [
      ...(producto.variantes.length > 1 ? [variante.nombre] : []),
      `Medidas: ${medidas}`,
      ...(calculo.aplicaMinimo ? [`Cobro mínimo de ${COBRO_MINIMO_M2} m² por pieza`] : []),
      ...acabados.map((a) =>
        a.precio === null ? `Acabado: ${a.nombre} (valor por confirmar)` : `Acabado: ${a.nombre}${a.nota ? ` (${a.nota})` : ""}`,
      ),
    ],
    cantidad,
    unidad: "Pieza",
    subtotal: calculo.subtotal,
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-5">
        <OpcionesVariante variantes={producto.variantes} valor={variante.id} onChange={setVarianteId} />
        <p className="border-l-4 border-amarillo bg-white px-3 py-2 text-sm">
          <strong className="font-mono">{cop(variante.precioCop)}</strong> por {lineal ? "metro lineal" : "m²"}. {variante.notas}
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <CampoNumero
            label={lineal ? "Metros lineales" : "Ancho"}
            valor={anchoTxt}
            onChange={setAnchoTxt}
            step={0.01}
            sufijo="m"
            ayuda={lineal ? "Ancho de rollo fijo" : undefined}
          />
          {!lineal && <CampoNumero label="Alto" valor={altoTxt} onChange={setAltoTxt} step={0.01} sufijo="m" />}
          <CampoNumero label="Cantidad de piezas" valor={cantidadTxt} onChange={setCantidadTxt} min={1} sufijo="und" />
        </div>

        {disponibles.length > 0 && (
          <fieldset>
            <legend className="etiqueta">Acabados</legend>
            <div className="flex flex-wrap gap-2">
              {disponibles.map((a) => (
                <label
                  key={a.id}
                  className="cursor-pointer border-2 border-tinta bg-white px-3 py-2 text-sm transition-colors has-checked:bg-tinta has-checked:text-papel has-focus-visible:outline-3 has-focus-visible:outline-magenta"
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={acabadosSel.includes(a.id)}
                    onChange={(e) =>
                      setAcabadosSel((prev) => (e.target.checked ? [...prev, a.id] : prev.filter((x) => x !== a.id)))
                    }
                  />
                  <span className="font-bold">{a.nombre}</span>{" "}
                  <span className="font-mono text-xs opacity-70">
                    {a.nota ?? (a.precio === null ? "por confirmar" : `+${cop(a.precio)}/${a.por === "m2" ? "m²" : "pieza"}`)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {!lineal && (
          <div className="flex items-center gap-4 text-xs text-gris">
            <Previsualizacion ancho={ancho} alto={alto} />
            <p>
              Área real {m2(calculo.areaReal)} · se cobra {m2(calculo.areaEfectiva)} por pieza
              {calculo.aplicaMinimo && <strong className="text-magenta"> (aplica cobro mínimo de 1 m²)</strong>}.
            </p>
          </div>
        )}
      </div>

      <PanelTotal
        linea={error ? null : linea}
        error={error}
        desglose={[
          { label: lineal ? "Metros lineales" : "Área cobrada / pieza", valor: lineal ? `${ancho} m` : m2(calculo.areaEfectiva) },
          { label: "Valor por pieza", valor: cop(calculo.unitario) },
          { label: "Piezas", valor: String(Math.max(cantidad, 0)) },
          ...(calculo.porConfirmar.length
            ? [{ label: "Por confirmar", valor: calculo.porConfirmar.join(", ") }]
            : []),
        ]}
      />
    </div>
  );
}

/** Rectángulo proporcional a la pieza para dar referencia visual de formato. */
function Previsualizacion({ ancho, alto }: { ancho: number; alto: number }) {
  const max = Math.max(ancho, alto, 0.01);
  const w = Math.max(6, (ancho / max) * 56);
  const h = Math.max(6, (alto / max) * 56);
  return (
    <span aria-hidden className="grid h-16 w-16 shrink-0 place-items-center bg-hueso">
      <span className="block border-2 border-tinta bg-amarillo" style={{ width: w, height: h }} />
    </span>
  );
}
