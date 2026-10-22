"use client";

import type { Producto } from "@/lib/types";
import { CotizadorMedida } from "./CotizadorMedida";
import { CotizadorPaquete } from "./CotizadorPaquete";
import { CotizadorVolumen } from "./CotizadorVolumen";

/** Elige el algoritmo de cotización según el modo del producto. */
export function Cotizador({ producto }: { producto: Producto }) {
  switch (producto.modo) {
    case "paquete":
      return <CotizadorPaquete key={producto.id} producto={producto} />;
    case "area":
    case "lineal":
      return <CotizadorMedida key={producto.id} producto={producto} />;
    default:
      return <CotizadorVolumen key={producto.id} producto={producto} />;
  }
}
