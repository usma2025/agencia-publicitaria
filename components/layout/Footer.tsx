import Link from "next/link";
import { AVISOS } from "@/lib/avisos";
import { SECCIONES } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 bg-tinta text-papel">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Logo invertido />
            <p className="font-display mt-6 max-w-sm text-3xl text-amarillo">{SITE.lema}.</p>
            <p className="mt-4 text-sm text-papel/70">
              <a className="underline-offset-4 hover:underline" href={`https://wa.me/${SITE.whatsapp}`}>
                WhatsApp de ventas
              </a>
              {" · "}
              <a className="underline-offset-4 hover:underline" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
            </p>
          </div>
          <nav aria-label="Servicios">
            <h2 className="etiqueta text-papel/50">Servicios</h2>
            <ul className="space-y-1.5 text-sm">
              {SECCIONES.map((s) => (
                <li key={s.slug}>
                  <Link className="hover:text-amarillo" href={`/servicios/${s.slug}`}>
                    {s.titulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Herramientas">
            <h2 className="etiqueta text-papel/50">Herramientas</h2>
            <ul className="space-y-1.5 text-sm">
              <li><Link className="hover:text-amarillo" href="/#cotizar">Cotizador rápido</Link></li>
              <li><Link className="hover:text-amarillo" href="/cotizacion">Mi cotización</Link></li>
              <li><Link className="hover:text-amarillo" href="/brief">Iniciar brief</Link></li>
              <li><Link className="hover:text-amarillo" href="/guias">Manuales y guías</Link></li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 grid gap-6 border-t border-white/15 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {AVISOS.map((a) => (
            <div key={a.id}>
              <h3 className="etiqueta text-amarillo">{a.titulo}</h3>
              <p className="text-xs leading-relaxed text-papel/65">{a.texto}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 font-mono text-[11px] text-papel/40">
          © {SITE.nombreCompleto}. Precios en COP sin IVA, sujetos a cambio sin previo aviso.
        </p>
      </div>
    </footer>
  );
}
