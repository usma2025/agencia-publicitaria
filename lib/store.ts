"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { API_TASAS, TASAS_RESPALDO } from "./site";
import type { LineaCotizacion, Moneda } from "./types";

export type Brief = {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  objetivo: string;
  publico: string;
  mensaje: string;
  referencias: string;
  fechaEntrega: string;
  presupuesto: string;
};

type Estado = {
  numero: string;
  lineas: LineaCotizacion[];
  conIva: boolean;
  moneda: Moneda;
  tasas: Record<Moneda, number>;
  tasasEnLinea: boolean;
  brief: Brief | null;
  agregar: (linea: Omit<LineaCotizacion, "id">) => void;
  quitar: (id: string) => void;
  asegurarNumero: () => string;
  vaciar: () => void;
  setIva: (v: boolean) => void;
  setMoneda: (m: Moneda) => void;
  cargarTasas: () => Promise<void>;
  guardarBrief: (b: Brief) => void;
};

function nuevoNumero() {
  const d = new Date();
  const fecha = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const sufijo = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `COT-${fecha}-${sufijo}`;
}

export const useCotizacion = create<Estado>()(
  persist(
    (set, get) => ({
      // Se asigna al agregar el primer ítem (no en el render del servidor).
      numero: "",
      lineas: [],
      conIva: false,
      moneda: "COP",
      tasas: { ...TASAS_RESPALDO },
      tasasEnLinea: false,
      brief: null,
      agregar: (linea) =>
        set((s) => ({
          numero: s.numero || nuevoNumero(),
          lineas: [...s.lineas, { ...linea, id: crypto.randomUUID() }],
        })),
      quitar: (id) => set((s) => ({ lineas: s.lineas.filter((l) => l.id !== id) })),
      asegurarNumero: () => {
        if (!get().numero) set({ numero: nuevoNumero() });
        return get().numero;
      },
      vaciar: () => set({ lineas: [], numero: "", brief: null }),
      setIva: (conIva) => set({ conIva }),
      setMoneda: (moneda) => {
        set({ moneda });
        if (moneda !== "COP" && !get().tasasEnLinea) void get().cargarTasas();
      },
      cargarTasas: async () => {
        try {
          const res = await fetch(API_TASAS);
          const json = (await res.json()) as { result: string; rates: Record<string, number> };
          if (json.result !== "success") return;
          set({
            tasas: { COP: 1, USD: json.rates.USD, EUR: json.rates.EUR, MXN: json.rates.MXN },
            tasasEnLinea: true,
          });
        } catch {
          // Sin conexión: se mantienen las tasas de respaldo.
        }
      },
      guardarBrief: (brief) => set({ brief }),
    }),
    {
      name: "agencia-cotizacion",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ numero: s.numero, lineas: s.lineas, conIva: s.conIva, moneda: s.moneda, brief: s.brief }),
    },
  ),
);

const sinSuscripcion = () => () => {};

/** true solo en el cliente, tras hidratar; evita desajustes con el estado persistido. */
export function useHidratado() {
  return useSyncExternalStore(sinSuscripcion, () => true, () => false);
}

/** IVA, moneda y tasas; valores por defecto durante el render del servidor. */
export function usePreferencias() {
  const hidratado = useHidratado();
  const moneda = useCotizacion((s) => s.moneda);
  const conIva = useCotizacion((s) => s.conIva);
  const tasas = useCotizacion((s) => s.tasas);
  return hidratado
    ? { moneda, conIva, tasas }
    : { moneda: "COP" as Moneda, conIva: false, tasas: { ...TASAS_RESPALDO } };
}
