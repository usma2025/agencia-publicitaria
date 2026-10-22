"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCotizacion, useHidratado } from "@/lib/store";
import { Logo } from "./Logo";

const NAV = [
  { href: "/servicios", label: "Servicios" },
  { href: "/#cotizar", label: "Cotizar" },
  { href: "/guias", label: "Guías" },
  { href: "/brief", label: "Brief" },
];

export function Header() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const hidratado = useHidratado();
  const cantidad = useCotizacion((s) => s.lineas.length);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-tinta bg-papel/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Inicio" onClick={() => setAbierto(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {NAV.map((item) => {
            const activo = item.href !== "/#cotizar" && pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-extrabold uppercase tracking-wide transition-colors hover:bg-amarillo ${
                  activo ? "bg-tinta text-papel hover:text-tinta" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cotizacion"
            onClick={() => setAbierto(false)}
            className="btn bg-amarillo px-3! py-2!"
            aria-label={`Mi cotización${hidratado ? `, ${cantidad} ítems` : ""}`}
          >
            <ShoppingBag size={18} strokeWidth={2.5} />
            <span className="hidden sm:inline">Mi cotización</span>
            {hidratado && cantidad > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-magenta px-1 font-mono text-[11px] text-white">
                {cantidad}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="btn p-2! md:hidden"
            aria-expanded={abierto}
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setAbierto((v) => !v)}
          >
            {abierto ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {abierto && (
        <nav className="border-t-2 border-tinta bg-tinta md:hidden" aria-label="Móvil">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setAbierto(false)}
              className="font-display block border-b border-white/10 px-6 py-4 text-2xl text-papel hover:text-amarillo"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
