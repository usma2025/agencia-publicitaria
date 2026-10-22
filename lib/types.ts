export type Modo = "paquete" | "area" | "lineal" | "volumen" | "unidad";

export type Variante = {
  id: string;
  nombre: string;
  cantidadMinima: number;
  precioCop: number;
  precioUsd: number | null;
  incluyeIva: boolean;
  notas: string;
};

export type Producto = {
  id: string;
  categoria: string;
  subcategoria: string;
  nombre: string;
  unidad: string;
  modo: Modo;
  variantes: Variante[];
};

export type Adicional = {
  id: string;
  categoria: string;
  nombre: string;
  unidad: string;
  precioCop: number;
  notas: string;
};

/** Producto sin precio publicado: se agrega a la cotización como "por cotizar". */
export type ProductoACotizar = {
  id: string;
  nombre: string;
  descripcion: string;
};

export type Moneda = "COP" | "USD" | "EUR" | "MXN";

/** Módulo de cotización que generó la línea (X = sin precio publicado). */
export type Modulo = "A" | "B" | "C" | "X";

export type LineaCotizacion = {
  id: string;
  productoId: string;
  nombre: string;
  modulo: Modulo;
  /** Detalle legible: variante, medidas, acabados, adicionales. */
  detalle: string[];
  cantidad: number;
  unidad: string;
  /** Subtotal en COP sin IVA; null cuando el ítem se cotiza con asesor. */
  subtotal: number | null;
  /** Precio base oficial en USD (planes con tarifa en dólares) y su equivalente COP. */
  referenciaUsd?: { baseCop: number; baseUsd: number };
};
