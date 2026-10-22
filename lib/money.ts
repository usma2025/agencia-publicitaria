import type { LineaCotizacion, Moneda } from "./types";

const LOCALES: Record<Moneda, string> = { COP: "es-CO", USD: "en-US", EUR: "es-ES", MXN: "es-MX" };

export function formatear(valor: number, moneda: Moneda = "COP") {
  return new Intl.NumberFormat(LOCALES[moneda], {
    style: "currency",
    currency: moneda,
    maximumFractionDigits: moneda === "COP" ? 0 : 2,
    minimumFractionDigits: moneda === "COP" ? 0 : 2,
  }).format(valor);
}

export const cop = (valor: number) => formatear(valor, "COP");

const UNIDADES: Record<string, [string, string]> = {
  Unidad: ["unidad", "unidades"],
  Pieza: ["pieza", "piezas"],
  Proyecto: ["proyecto", "proyectos"],
  Paquete: ["paquete", "paquetes"],
  Cara: ["cara", "caras"],
  Mensual: ["mes", "meses"],
};

/** "1 unidad", "50 unidades", "3 meses"… */
export function cantidadTexto(cantidad: number, unidad: string) {
  const [uno, varios] = UNIDADES[unidad] ?? [unidad.toLowerCase(), unidad.toLowerCase()];
  return `${cantidad} ${cantidad === 1 ? uno : varios}`;
}

/** Valor de una línea en la moneda elegida. Los planes con tarifa oficial en USD la respetan. */
export function valorLinea(linea: LineaCotizacion, moneda: Moneda, tasas: Record<Moneda, number>) {
  if (linea.subtotal === null) return null;
  if (moneda === "USD" && linea.referenciaUsd) {
    const resto = linea.subtotal - linea.referenciaUsd.baseCop;
    return linea.referenciaUsd.baseUsd + resto * tasas.USD;
  }
  return linea.subtotal * tasas[moneda];
}

export function resumen(
  lineas: LineaCotizacion[],
  moneda: Moneda,
  tasas: Record<Moneda, number>,
  conIva: boolean,
  tasaIva: number,
) {
  const subtotal = lineas.reduce((s, l) => s + (valorLinea(l, moneda, tasas) ?? 0), 0);
  const iva = conIva ? subtotal * tasaIva : 0;
  const porCotizar = lineas.filter((l) => l.subtotal === null).length;
  return { subtotal, iva, total: subtotal + iva, porCotizar };
}
