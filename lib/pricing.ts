// Motor de cotización. Funciones puras (sin React) para los tres módulos.
// Todos los valores en COP y sin IVA.

export type Extra = { nombre: string; precio: number; cantidad: number };

/** Módulo A — tarifa fija: Subtotal = Precio base × cantidad + adicionales. */
export function calcularPaquete(input: { precioBase: number; cantidad: number; extras: Extra[] }) {
  const base = input.precioBase * input.cantidad;
  const extras = input.extras.reduce((s, e) => s + e.precio * e.cantidad, 0);
  return { base, extras, subtotal: base + extras };
}

export type AcabadoAplicado = { nombre: string; precio: number | null; por: "m2" | "pieza" };

export const COBRO_MINIMO_M2 = 1;

/**
 * Módulo B — por m² o metro lineal.
 * Área efectiva = MAX(ancho × alto, 1 m²). Metro lineal: cobro = metros × precio × cantidad.
 * Los acabados por m² se cobran sobre el área efectiva; los acabados por pieza, por unidad.
 */
export function calcularMedida(input: {
  modo: "area" | "lineal";
  precio: number;
  cantidad: number;
  ancho: number;
  alto: number;
  acabados: AcabadoAplicado[];
}) {
  const { modo, precio, cantidad, ancho, alto, acabados } = input;
  const acabadosM2 = acabados.filter((a) => a.por === "m2").reduce((s, a) => s + (a.precio ?? 0), 0);
  const acabadosPieza = acabados.filter((a) => a.por === "pieza").reduce((s, a) => s + (a.precio ?? 0), 0);
  const porConfirmar = acabados.filter((a) => a.precio === null).map((a) => a.nombre);

  if (modo === "lineal") {
    const unitario = ancho * precio + acabadosPieza;
    return {
      areaReal: ancho,
      areaEfectiva: ancho,
      aplicaMinimo: false,
      unitario,
      subtotal: unitario * cantidad,
      porConfirmar,
    };
  }

  const areaReal = ancho * alto;
  const areaEfectiva = Math.max(areaReal, COBRO_MINIMO_M2);
  const unitario = areaEfectiva * (precio + acabadosM2) + acabadosPieza;
  return {
    areaReal,
    areaEfectiva,
    aplicaMinimo: areaReal < COBRO_MINIMO_M2,
    unitario,
    subtotal: Math.round(unitario * cantidad),
    porConfirmar,
  };
}

export type Escalon = { nombre: string; cantidadMinima: number; precio: number };

/** Escalón vigente: el de mayor cantidad mínima que no supera la cantidad pedida. */
export function escalonPara(escalones: Escalon[], cantidad: number) {
  let vigente: Escalon | null = null;
  for (const e of [...escalones].sort((a, b) => a.cantidadMinima - b.cantidadMinima)) {
    if (cantidad >= e.cantidadMinima) vigente = e;
  }
  return vigente;
}

/** Módulo C — escalonado por volumen: precio unitario del rango × cantidad (+ adicionales por unidad). */
export function calcularVolumen(input: { escalones: Escalon[]; cantidad: number; adicionalUnitario?: number }) {
  const ordenados = [...input.escalones].sort((a, b) => a.cantidadMinima - b.cantidadMinima);
  const escalon = escalonPara(ordenados, input.cantidad);
  if (!escalon) return { ok: false as const, minimo: ordenados[0].cantidadMinima };
  const siguiente = ordenados.find((e) => e.cantidadMinima > input.cantidad) ?? null;
  const unitario = escalon.precio + (input.adicionalUnitario ?? 0);
  return { ok: true as const, escalon, siguiente, unitario, subtotal: unitario * input.cantidad };
}
