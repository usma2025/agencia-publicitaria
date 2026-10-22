import type { Metadata } from "next";
import { BriefForm } from "@/components/brief/BriefForm";

export const metadata: Metadata = {
  title: "Iniciar brief",
  description: "Cuéntanos tu proyecto: objetivo, público, referencias y fechas.",
};

export default function BriefPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="etiqueta text-magenta">Brief interactivo</p>
      <h1 className="font-display text-5xl sm:text-7xl">Iniciar brief</h1>
      <p className="mt-4 mb-10 max-w-2xl text-lg text-tinta/75">
        Entre más claro el brief, menos rondas de ajustes. Toma 3 minutos y queda vinculado a tu cotización.
      </p>
      <BriefForm />
    </div>
  );
}
