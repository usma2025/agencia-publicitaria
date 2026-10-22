import type { Seccion } from "@/lib/catalog";

// Clases completas (Tailwind necesita verlas literales en el código).
export const ACENTO_FONDO: Record<Seccion["acento"], string> = {
  amarillo: "bg-amarillo text-tinta",
  magenta: "bg-magenta text-white",
  cian: "bg-cian text-white",
};

export const ACENTO_TEXTO: Record<Seccion["acento"], string> = {
  amarillo: "text-amarillo",
  magenta: "text-magenta",
  cian: "text-cian",
};
