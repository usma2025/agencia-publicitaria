import { cantidadTexto, formatear, resumen, valorLinea } from "./money";
import { SITE } from "./site";
import type { Brief } from "./store";
import type { LineaCotizacion, Moneda } from "./types";

/** Instantánea formateada de la cotización, común al PDF y a WhatsApp. */
export type DatosCotizacion = {
  numero: string;
  fecha: string;
  vence: string;
  moneda: Moneda;
  conIva: boolean;
  cliente: Pick<Brief, "nombre" | "empresa" | "email" | "telefono"> | null;
  lineas: { nombre: string; detalle: string[]; cantidad: number; unidad: string; valor: string }[];
  subtotal: string;
  iva: string;
  total: string;
  porCotizar: number;
};

export function armarDatos(input: {
  numero: string;
  lineas: LineaCotizacion[];
  moneda: Moneda;
  tasas: Record<Moneda, number>;
  conIva: boolean;
  brief: Brief | null;
}): DatosCotizacion {
  const { moneda, tasas, conIva } = input;
  const r = resumen(input.lineas, moneda, tasas, conIva, SITE.iva);
  const hoy = new Date();
  const vence = new Date(hoy.getTime() + SITE.validezDias * 86_400_000);
  const fecha = (d: Date) => d.toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });

  return {
    numero: input.numero,
    fecha: fecha(hoy),
    vence: fecha(vence),
    moneda,
    conIva,
    cliente: input.brief,
    lineas: input.lineas.map((l) => {
      const v = valorLinea(l, moneda, tasas);
      return {
        nombre: l.nombre,
        detalle: l.detalle,
        cantidad: l.cantidad,
        unidad: l.unidad,
        valor: v === null ? "Por cotizar" : formatear(v, moneda),
      };
    }),
    subtotal: formatear(r.subtotal, moneda),
    iva: formatear(r.iva, moneda),
    total: formatear(r.total, moneda),
    porCotizar: r.porCotizar,
  };
}

export function textoWhatsApp(d: DatosCotizacion) {
  const lineas = d.lineas.map(
    (l, i) => `${i + 1}. *${l.nombre}* — ${cantidadTexto(l.cantidad, l.unidad)}\n   ${l.detalle.slice(0, 3).join(" · ")}\n   Valor: ${l.valor}`,
  );
  return [
    `Hola ${SITE.marca}, quiero confirmar esta cotización:`,
    "",
    `*Cotización ${d.numero}* (${d.fecha})`,
    ...(d.cliente?.nombre ? [`Cliente: ${d.cliente.nombre}${d.cliente.empresa ? ` — ${d.cliente.empresa}` : ""}`] : []),
    "",
    ...lineas,
    "",
    `Subtotal: ${d.subtotal}`,
    ...(d.conIva ? [`IVA ${SITE.iva * 100}%: ${d.iva}`] : ["Sin factura formal (recibo)"]),
    `*TOTAL: ${d.total}*${d.moneda !== "COP" ? " (referencia)" : ""}`,
    ...(d.porCotizar ? [`\n${d.porCotizar} ítem(s) pendientes de valorar por un asesor.`] : []),
  ].join("\n");
}

export function urlWhatsApp(texto: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(texto)}`;
}

export async function descargarPdf(d: DatosCotizacion) {
  const [{ pdf }, { CotizacionPDF }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("@/components/pdf/CotizacionPDF"),
  ]);
  const blob = await pdf(CotizacionPDF({ datos: d })).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Cotizacion-${d.numero}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
