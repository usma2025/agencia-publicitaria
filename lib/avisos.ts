import { SITE } from "./site";

// Reglas de negocio y transparencia que se muestran en cotizadores, PDF y pie de página.
export const AVISOS = [
  {
    id: "iva",
    titulo: "Impuestos y facturación",
    texto: `Todos los precios están expresados sin el ${SITE.iva * 100}% de IVA ni otros impuestos. Si requieres factura electrónica formal (operada por ${SITE.facturador}) se suma automáticamente el ${SITE.iva * 100}% de IVA al subtotal. Sin factura formal, la compra se gestiona mediante recibo manteniendo el costo inicial.`,
  },
  {
    id: "excedente",
    titulo: `Política de excedentes (regla ${SITE.excedente * 100}%)`,
    texto: `En impresiones o estampados sobre sustratos o prendas suministradas por el cliente, se debe entregar un ${SITE.excedente * 100}% de excedente de material para pruebas de calibración y ajustes de máquina.`,
  },
  {
    id: "moneda",
    titulo: "Variación comercial y moneda extranjera",
    texto:
      "Los valores en USD, EUR y MXN son de referencia, calculados con la tasa de cambio vigente. El valor final en pesos colombianos (COP) se revalida al cierre del contrato.",
  },
  {
    id: "cupos",
    titulo: "Sistema de cupos",
    texto:
      "La impresión en cupos es un sistema masivo agrupado. Puede existir una variación de color de hasta un 10% con respecto a la pantalla. Mantén la caja tipográfica a mínimo 4 mm del borde.",
  },
] as const;
