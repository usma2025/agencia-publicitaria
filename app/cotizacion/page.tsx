import type { Metadata } from "next";
import { Carrito } from "@/components/cotizacion/Carrito";

export const metadata: Metadata = {
  title: "Mi cotización",
  description: "Revisa tu cotización, descárgala en PDF o envíala por WhatsApp.",
};

export default function CotizacionPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="etiqueta text-magenta">Carrito de cotización</p>
      <h1 className="font-display mb-10 text-5xl sm:text-7xl">Mi cotización</h1>
      <Carrito />
    </div>
  );
}
