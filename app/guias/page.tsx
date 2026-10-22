import type { Metadata } from "next";
import { VisorGuias } from "@/components/guias/VisorGuias";

export const metadata: Metadata = {
  title: "Manuales y guías",
  description: "Instructivo de vinilo y corte, manual de cupos, guía de tallas, tiempos de entrega y política de excedentes.",
};

export default function GuiasPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="etiqueta text-magenta">H · Transparencia</p>
      <h1 className="font-display text-5xl sm:text-7xl">Manuales & guías</h1>
      <p className="mt-4 mb-10 max-w-2xl text-lg text-tinta/75">
        Todo lo que necesitas saber antes de enviar tu arte: formatos, tolerancias, tallas y plazos.
      </p>
      <VisorGuias />
    </div>
  );
}
