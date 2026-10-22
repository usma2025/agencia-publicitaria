"use client";

import { useState } from "react";
import { ADICIONALES_LASER } from "@/lib/catalog";
import { AVISOS } from "@/lib/avisos";
import { cop } from "@/lib/money";
import { calcularVolumen } from "@/lib/pricing";
import type { Producto } from "@/lib/types";
import { PanelTotal, type LineaBorrador } from "./PanelTotal";
import { aNumero, CampoNumero, OpcionesVariante } from "./ui";

const AVISO_CUPOS = AVISOS.find((a) => a.id === "cupos")!;

/** Módulo C — escalonado por volumen (escarapelas, textil, retablos, láser) o por paquete/unidad. */
export function CotizadorVolumen({ producto }: { producto: Producto }) {
  return producto.modo === "volumen" ? <PorEscalones producto={producto} /> : <PorUnidad producto={producto} />;
}

function PorEscalones({ producto }: { producto: Producto }) {
  const minimo = producto.variantes[0].cantidadMinima;
  const [cantidadTxt, setCantidadTxt] = useState(String(minimo));
  const [adicionalesSel, setAdicionalesSel] = useState<string[]>([]);

  const cantidad = Math.floor(aNumero(cantidadTxt));
  const adicionales = producto.subcategoria === "impresion" ? ADICIONALES_LASER : [];
  const elegidos = adicionales.filter((a) => adicionalesSel.includes(a.id));
  const adicionalUnitario = elegidos.reduce((s, a) => s + a.precioCop, 0);
  const escalones = producto.variantes.map((v) => ({ nombre: v.nombre, cantidadMinima: v.cantidadMinima, precio: v.precioCop }));
  const calculo = calcularVolumen({ escalones, cantidad, adicionalUnitario });
  const unidad = producto.unidad === "Cara" ? "caras" : "unidades";

  const error = calculo.ok ? null : `Pedido mínimo: ${calculo.minimo} ${unidad}.`;
  const linea: LineaBorrador | null = calculo.ok
    ? {
        productoId: producto.id,
        nombre: producto.nombre,
        modulo: "C",
        detalle: [
          `Rango ${calculo.escalon.nombre}: ${cop(calculo.escalon.precio)} c/u`,
          ...elegidos.map((a) => `+ ${a.nombre} (${cop(a.precioCop)} por ${a.unidad.toLowerCase()})`),
          producto.variantes[0].notas,
        ].filter(Boolean),
        cantidad,
        unidad: producto.unidad,
        subtotal: calculo.subtotal,
      }
    : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-5">
        <div className="max-w-56">
          <CampoNumero
            label={`Cantidad (${unidad})`}
            valor={cantidadTxt}
            onChange={setCantidadTxt}
            min={minimo}
            ayuda={`Mínimo ${minimo} ${unidad}`}
          />
        </div>

        <table className="w-full border-2 border-tinta bg-white text-sm">
          <caption className="etiqueta text-left">Precio unitario por rango</caption>
          <thead className="bg-tinta text-papel">
            <tr>
              <th scope="col" className="px-3 py-2 text-left font-mono text-xs uppercase">Rango</th>
              <th scope="col" className="px-3 py-2 text-left font-mono text-xs uppercase">Desde</th>
              <th scope="col" className="px-3 py-2 text-right font-mono text-xs uppercase">Valor c/u</th>
            </tr>
          </thead>
          <tbody>
            {producto.variantes.map((v) => {
              const activo = calculo.ok && calculo.escalon.cantidadMinima === v.cantidadMinima;
              return (
                <tr key={v.id} className={activo ? "bg-amarillo font-extrabold" : "border-t border-tinta/10"}>
                  <td className="px-3 py-2">{v.nombre}</td>
                  <td className="px-3 py-2 font-mono">{v.cantidadMinima}+</td>
                  <td className="px-3 py-2 text-right font-mono">{cop(v.precioCop)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {calculo.ok && calculo.siguiente && (
          <p className="border-l-4 border-magenta bg-white px-3 py-2 text-sm">
            Con <strong>{calculo.siguiente.cantidadMinima} {unidad}</strong> el valor baja a{" "}
            <strong className="font-mono">{cop(calculo.siguiente.precio)}</strong> c/u
            {" "}(hoy pagas {cop(calculo.escalon.precio)} c/u).
          </p>
        )}

        {adicionales.length > 0 && (
          <fieldset>
            <legend className="etiqueta">Adicionales</legend>
            <div className="flex flex-wrap gap-2">
              {adicionales.map((a) => (
                <label
                  key={a.id}
                  className="cursor-pointer border-2 border-tinta bg-white px-3 py-2 text-sm has-checked:bg-tinta has-checked:text-papel has-focus-visible:outline-3 has-focus-visible:outline-magenta"
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={adicionalesSel.includes(a.id)}
                    onChange={(e) =>
                      setAdicionalesSel((prev) => (e.target.checked ? [...prev, a.id] : prev.filter((x) => x !== a.id)))
                    }
                  />
                  <span className="font-bold">{a.nombre.replace("Adicional ", "")}</span>{" "}
                  <span className="font-mono text-xs opacity-70">
                    +{cop(a.precioCop)}/{a.unidad.toLowerCase()}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      <PanelTotal
        linea={linea}
        error={error}
        desglose={
          calculo.ok
            ? [
                { label: "Rango aplicado", valor: calculo.escalon.nombre },
                { label: "Valor unitario", valor: cop(calculo.unitario) },
                { label: "Cantidad", valor: String(cantidad) },
              ]
            : []
        }
      />
    </div>
  );
}

function PorUnidad({ producto }: { producto: Producto }) {
  const [varianteId, setVarianteId] = useState(producto.variantes[0].id);
  const [cantidadTxt, setCantidadTxt] = useState("1");
  const variante = producto.variantes.find((v) => v.id === varianteId) ?? producto.variantes[0];
  const cantidad = Math.floor(aNumero(cantidadTxt));
  const esPaquete = producto.unidad === "Paquete";
  const subtotal = variante.precioCop * cantidad;
  const error = cantidad < 1 ? "La cantidad debe ser al menos 1." : null;

  const linea: LineaBorrador = {
    productoId: producto.id,
    nombre: producto.nombre,
    modulo: "C",
    detalle: [
      esPaquete ? `${cantidad} × paquete de ${variante.nombre.toLowerCase()}` : variante.nombre,
      variante.notas,
    ].filter(Boolean),
    cantidad,
    unidad: esPaquete ? "Paquete" : producto.unidad,
    subtotal,
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-5">
        <OpcionesVariante variantes={producto.variantes} valor={variante.id} onChange={setVarianteId} />
        {producto.variantes.length === 1 && (
          <p className="border-l-4 border-amarillo bg-white px-3 py-2 text-sm">
            <strong>{variante.nombre}</strong> · <span className="font-mono">{cop(variante.precioCop)}</span>
            {esPaquete ? " por paquete" : " c/u"}. {variante.notas}
          </p>
        )}
        <div className="max-w-56">
          <CampoNumero
            label={esPaquete ? "Número de paquetes" : "Cantidad"}
            valor={cantidadTxt}
            onChange={setCantidadTxt}
            min={1}
            ayuda={esPaquete ? `Total: ${(Math.max(cantidad, 0) * variante.cantidadMinima).toLocaleString("es-CO")} unidades` : undefined}
          />
        </div>
        {producto.categoria === "imprenta_cupos" && (
          <p className="text-xs text-gris">
            <strong className="text-tinta">{AVISO_CUPOS.titulo}:</strong> {AVISO_CUPOS.texto}
          </p>
        )}
      </div>

      <PanelTotal
        linea={error ? null : linea}
        error={error}
        desglose={[
          { label: esPaquete ? "Valor por paquete" : "Valor unitario", valor: cop(variante.precioCop) },
          { label: esPaquete ? "Paquetes" : "Cantidad", valor: String(Math.max(cantidad, 0)) },
        ]}
      />
    </div>
  );
}
