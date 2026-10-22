"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Check, Mail, MessageCircle } from "lucide-react";
import { SECCIONES } from "@/lib/catalog";
import { urlWhatsApp } from "@/lib/export";
import { cantidadTexto } from "@/lib/money";
import { SITE } from "@/lib/site";
import { useCotizacion, useHidratado, type Brief } from "@/lib/store";

type Campo = { name: keyof Brief; label: string; tipo?: string; requerido?: boolean; area?: boolean; placeholder?: string };

const CONTACTO: Campo[] = [
  { name: "nombre", label: "Nombre completo", requerido: true },
  { name: "empresa", label: "Empresa / marca / campaña" },
  { name: "email", label: "Correo", tipo: "email", requerido: true },
  { name: "telefono", label: "Teléfono / WhatsApp", tipo: "tel", requerido: true },
];

const PROYECTO: Campo[] = [
  { name: "objetivo", label: "¿Qué quieres lograr?", area: true, requerido: true, placeholder: "Lanzar una marca, ganar una elección, vender más en temporada…" },
  { name: "publico", label: "Público objetivo", area: true, placeholder: "Edad, ubicación, intereses, tipo de cliente…" },
  { name: "mensaje", label: "Mensaje clave y tono", area: true, placeholder: "Qué deben recordar y cómo debe sentirse." },
  { name: "referencias", label: "Referencias (links, marcas, estilos)", area: true },
  { name: "fechaEntrega", label: "Fecha deseada de entrega", tipo: "date" },
  { name: "presupuesto", label: "Presupuesto estimado" },
];

const VACIO: Brief = {
  nombre: "", empresa: "", email: "", telefono: "", objetivo: "", publico: "",
  mensaje: "", referencias: "", fechaEntrega: "", presupuesto: "",
};

export function BriefForm() {
  const hidratado = useHidratado();
  const briefGuardado = useCotizacion((s) => s.brief);
  const lineas = useCotizacion((s) => s.lineas);
  const guardarBrief = useCotizacion((s) => s.guardarBrief);
  const asegurarNumero = useCotizacion((s) => s.asegurarNumero);
  const [lineasInteres, setLineasInteres] = useState<string[]>([]);
  const [enviado, setEnviado] = useState<{ texto: string } | null>(null);

  if (!hidratado) return <div className="h-96 animate-pulse border-2 border-tinta/20 bg-white" aria-busy />;

  const inicial = briefGuardado ?? VACIO;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const brief = Object.fromEntries(Object.keys(VACIO).map((k) => [k, String(fd.get(k) ?? "").trim()])) as Brief;
    guardarBrief(brief);
    const numero = asegurarNumero();

    const texto = [
      `*BRIEF ${SITE.marca}* — Cotización ${numero}`,
      "",
      `*Cliente:* ${brief.nombre}${brief.empresa ? ` (${brief.empresa})` : ""}`,
      `*Contacto:* ${brief.email} · ${brief.telefono}`,
      ...(lineasInteres.length ? [`*Líneas de interés:* ${lineasInteres.join(", ")}`] : []),
      `*Objetivo:* ${brief.objetivo}`,
      ...(brief.publico ? [`*Público:* ${brief.publico}`] : []),
      ...(brief.mensaje ? [`*Mensaje y tono:* ${brief.mensaje}`] : []),
      ...(brief.referencias ? [`*Referencias:* ${brief.referencias}`] : []),
      ...(brief.fechaEntrega ? [`*Fecha deseada:* ${brief.fechaEntrega}`] : []),
      ...(brief.presupuesto ? [`*Presupuesto:* ${brief.presupuesto}`] : []),
      ...(lineas.length ? ["", `*Ítems cotizados (${lineas.length}):*`, ...lineas.map((l) => `• ${l.nombre} — ${cantidadTexto(l.cantidad, l.unidad)}`)] : []),
    ].join("\n");
    setEnviado({ texto });
  }

  if (enviado) {
    return (
      <div className="border-2 border-tinta bg-white p-8">
        <span className="grid h-12 w-12 place-items-center bg-amarillo">
          <Check />
        </span>
        <h2 className="font-display mt-4 text-3xl">Brief listo</h2>
        <p className="mt-2 max-w-xl text-tinta/70">
          Quedó guardado y vinculado a tu cotización. Envíalo a nuestro equipo para iniciar:
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={urlWhatsApp(enviado.texto)} target="_blank" rel="noopener" className="btn bg-[#25D366]">
            <MessageCircle size={18} /> Enviar por WhatsApp
          </a>
          <a
            href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Brief ${SITE.marca}`)}&body=${encodeURIComponent(enviado.texto.replaceAll("*", ""))}`}
            className="btn bg-white"
          >
            <Mail size={18} /> Enviar por correo
          </a>
          <Link href="/cotizacion" className="btn bg-amarillo">
            Ver cotización
          </Link>
          <button type="button" onClick={() => setEnviado(null)} className="btn bg-white">
            Editar brief
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-8">
        <fieldset className="border-2 border-tinta bg-white p-5 sm:p-6">
          <legend className="font-display bg-tinta px-3 py-1 text-lg text-papel">01 · Contacto</legend>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            {CONTACTO.map((c) => (
              <CampoBrief key={c.name} campo={c} valor={inicial[c.name]} />
            ))}
          </div>
        </fieldset>

        <fieldset className="border-2 border-tinta bg-white p-5 sm:p-6">
          <legend className="font-display bg-tinta px-3 py-1 text-lg text-papel">02 · Líneas de interés</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {SECCIONES.map((s) => (
              <label
                key={s.slug}
                className="cursor-pointer border-2 border-tinta px-3 py-2 text-sm font-bold has-checked:bg-amarillo has-focus-visible:outline-3 has-focus-visible:outline-magenta"
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={lineasInteres.includes(s.titulo)}
                  onChange={(e) =>
                    setLineasInteres((prev) => (e.target.checked ? [...prev, s.titulo] : prev.filter((x) => x !== s.titulo)))
                  }
                />
                {s.titulo}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="border-2 border-tinta bg-white p-5 sm:p-6">
          <legend className="font-display bg-tinta px-3 py-1 text-lg text-papel">03 · Proyecto</legend>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            {PROYECTO.map((c) => (
              <CampoBrief key={c.name} campo={c} valor={inicial[c.name]} />
            ))}
          </div>
        </fieldset>
      </div>

      <aside className="h-fit space-y-4 border-2 border-tinta bg-hueso p-5 lg:sticky lg:top-24">
        <h2 className="etiqueta">Cotización vinculada</h2>
        {lineas.length ? (
          <ul className="space-y-1 text-sm">
            {lineas.map((l) => (
              <li key={l.id} className="flex justify-between gap-2 border-b border-dashed border-tinta/20 pb-1">
                <span>{l.nombre}</span>
                <span className="shrink-0 font-mono text-xs">×{l.cantidad}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-tinta/70">
            Aún no tienes ítems. Puedes enviar el brief igual o{" "}
            <Link href="/#cotizar" className="font-bold underline">
              cotizar primero
            </Link>
            .
          </p>
        )}
        <button type="submit" className="btn w-full bg-amarillo">
          Guardar y continuar
        </button>
      </aside>
    </form>
  );
}

function CampoBrief({ campo, valor }: { campo: Campo; valor: string }) {
  const id = `brief-${campo.name}`;
  return (
    <div className={campo.area ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="etiqueta">
        {campo.label}
        {campo.requerido && <span className="text-magenta"> *</span>}
      </label>
      {campo.area ? (
        <textarea id={id} name={campo.name} defaultValue={valor} required={campo.requerido} rows={3} placeholder={campo.placeholder} className="campo" />
      ) : (
        <input id={id} name={campo.name} type={campo.tipo ?? "text"} defaultValue={valor} required={campo.requerido} className="campo" />
      )}
    </div>
  );
}
