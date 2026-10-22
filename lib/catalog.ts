import data from "@/data/catalog.json";
import type { Adicional, Modo, Producto, ProductoACotizar } from "./types";

export const PRODUCTOS = data.productos as Producto[];
export const ADICIONALES_LASER = data.adicionales as Adicional[];

export type Seccion = {
  slug: string;
  letra: string;
  titulo: string;
  bajada: string;
  categorias: string[];
  acento: "amarillo" | "magenta" | "cian";
  /** Productos ofertados sin precio publicado en lista. */
  aCotizar: ProductoACotizar[];
  principal: boolean;
};

export const SECCIONES: Seccion[] = [
  {
    slug: "diseno",
    letra: "A",
    titulo: "Diseño Gráfico & Marca",
    bajada: "Logos, planes permanentes, redes sociales, líneas gráficas, ilustración e infografía.",
    categorias: ["diseno_grafico"],
    acento: "amarillo",
    principal: true,
    aCotizar: [],
  },
  {
    slug: "web",
    letra: "B",
    titulo: "Web & E-commerce",
    bajada: "Sitios esenciales, profesionales y tiendas en línea. Con diseño o solo desarrollo.",
    categorias: ["servicios_web"],
    acento: "cian",
    principal: true,
    aCotizar: [],
  },
  {
    slug: "imprenta",
    letra: "C",
    titulo: "Imprenta & Producción Gráfica",
    bajada: "Sistema de cupos, láser digital, plotter, escarapelas, etiquetas, stickers y retablos.",
    categorias: ["imprenta_cupos", "laser_digital", "etiquetas", "retablos"],
    acento: "magenta",
    principal: true,
    aCotizar: [
      { id: "carnet-pvc", nombre: "Carnets PVC", descripcion: "Carnets en PVC full color, con o sin datos variables." },
      { id: "escarapela-cinta", nombre: "Cintas para escarapela", descripcion: "Cintas lisas o sublimadas con gancho." },
      { id: "sellos", nombre: "Sellos", descripcion: "Sellos automáticos y de madera." },
      { id: "retablo-mdf", nombre: "Retablos en MDF", descripcion: "Retablos en MDF con impresión, medidas a convenir." },
    ],
  },
  {
    slug: "gran-formato",
    letra: "D",
    titulo: "Gran Formato & Estructuras",
    bajada: "Banners, vinilos, papelones, arañas, roll ups, backings y popmans.",
    categorias: ["gran_formato"],
    acento: "amarillo",
    principal: true,
    aCotizar: [
      { id: "vinilo-transparente", nombre: "Vinilo transparente", descripcion: "Impresión sobre vinilo transparente." },
      { id: "vinilo-microperforado", nombre: "Vinilo microperforado", descripcion: "Para vidrios y vehículos, visibilidad desde el interior." },
      { id: "backing-popup", nombre: "Backing Pop-Up", descripcion: "Estructura pop-up con impresión, medidas a convenir." },
    ],
  },
  {
    slug: "textil",
    letra: "E",
    titulo: "Textil, Estampados & Dotaciones",
    bajada: "Camisetas DTF, sublimación y serigrafía; gorras y chalecos.",
    categorias: ["textil"],
    acento: "magenta",
    principal: true,
    aCotizar: [
      { id: "gorra-screen", nombre: "Gorras con estampado screen", descripcion: "Gorras estampadas en serigrafía por volumen." },
      { id: "chaleco-industria", nombre: "Chaleco tipo industria", descripcion: "Chaleco de dotación con marcación." },
    ],
  },
  {
    slug: "audiovisual",
    letra: "F",
    titulo: "Audiovisual & Campañas Políticas",
    bajada: "Edición de reels y TikToks, spots políticos y piezas para campaña.",
    categorias: ["audiovisual"],
    acento: "cian",
    principal: true,
    aCotizar: [
      {
        id: "piezas-campana",
        nombre: "Piezas de diseño e impresos para campaña",
        descripcion: "Tarjetones, volantes, pendones y material electoral.",
      },
    ],
  },
  {
    slug: "promocionales",
    letra: "G",
    titulo: "Promocionales & Souvenirs",
    bajada: "Mugs, termos, botilitos, agendas, libretas, esferos, llaveros, maletas y novedades.",
    categorias: [],
    acento: "amarillo",
    principal: false,
    aCotizar: [
      { id: "mugs", nombre: "Mugs", descripcion: "Mugs sublimados blancos, mágicos o de color." },
      { id: "termos", nombre: "Termos", descripcion: "Termos metálicos marcados en láser o DTF UV." },
      { id: "botilitos", nombre: "Botilitos", descripcion: "Botilitos plásticos y metálicos." },
      { id: "agendas", nombre: "Agendas", descripcion: "Agendas personalizadas con logo." },
      { id: "libretas", nombre: "Libretas", descripcion: "Libretas ecológicas y corporativas." },
      { id: "esferos", nombre: "Esferos", descripcion: "Esferos marcados a 1 tinta o full color." },
      { id: "llaveros", nombre: "Llaveros", descripcion: "Llaveros en acrílico, metal o PVC." },
      { id: "maletas", nombre: "Maletas", descripcion: "Maletas, morrales y tote bags marcados." },
      { id: "novedades", nombre: "Novedades", descripcion: "Artículos promocionales de temporada." },
    ],
  },
];

const ETIQUETAS_SUBCATEGORIA: Record<string, string> = {
  "diseno_grafico/logos": "Creación de logos",
  "diseno_grafico/planes_permanentes": "Paquetes de diseño permanente",
  "diseno_grafico/redes_sociales": "Redes sociales & persona pública",
  "diseno_grafico/lineas_graficas": "Líneas gráficas & campañas",
  "diseno_grafico/ilustracion": "Ilustraciones",
  "diseno_grafico/infografias": "Infografías",
  "servicios_web/sitios_web": "Sitios web",
  "imprenta_cupos/tarjetas": "Tarjetas de presentación (cupos)",
  "imprenta_cupos/volantes": "Volantes (cupos)",
  "imprenta_cupos/postales": "Postales",
  "imprenta_cupos/separadores": "Separadores",
  "imprenta_cupos/escarapelas": "Escarapelas",
  "laser_digital/impresion": "Impresión láser digital",
  "laser_digital/plotter_inyeccion": "Impresión a pliego — plotter de inyección",
  "etiquetas/vinilo": "Etiquetas y stickers en vinilo",
  "etiquetas/papel": "Adhesivos de seguridad",
  "retablos/liston": "Retablos en listón",
  "gran_formato/banner": "Banners",
  "gran_formato/tela": "Impresión en tela",
  "gran_formato/papel": "Papel plotter",
  "gran_formato/vinilos": "Vinilo adhesivo",
  "gran_formato/papelones": "Papelones para fijación masiva",
  "gran_formato/estructuras": "Estructuras publicitarias",
  "textil/camisetas": "Camisetas",
  "textil/gorras": "Gorras publicitarias",
  "textil/chalecos": "Chalecos",
  "audiovisual/tiktok": "Edición de videos / Reels / TikToks",
  "audiovisual/spots": "Spots políticos de campaña",
};

export function etiquetaSubcategoria(p: Pick<Producto, "categoria" | "subcategoria">) {
  return ETIQUETAS_SUBCATEGORIA[`${p.categoria}/${p.subcategoria}`] ?? p.subcategoria;
}

export function getSeccion(slug: string) {
  return SECCIONES.find((s) => s.slug === slug);
}

export function seccionDeProducto(p: Producto) {
  return SECCIONES.find((s) => s.categorias.includes(p.categoria));
}

export function productosDeSeccion(seccion: Seccion) {
  return PRODUCTOS.filter((p) => seccion.categorias.includes(p.categoria));
}

/** Agrupa productos por subcategoría conservando el orden del CSV. */
export function agruparPorSubcategoria(productos: Producto[]) {
  const grupos = new Map<string, { titulo: string; productos: Producto[] }>();
  for (const p of productos) {
    const key = `${p.categoria}/${p.subcategoria}`;
    if (!grupos.has(key)) grupos.set(key, { titulo: etiquetaSubcategoria(p), productos: [] });
    grupos.get(key)!.productos.push(p);
  }
  return [...grupos.values()];
}

export const MODULO_DE: Record<Modo, "A" | "B" | "C"> = {
  paquete: "A",
  area: "B",
  lineal: "B",
  volumen: "C",
  unidad: "C",
};

export function productosPorModulo(modulo: "A" | "B" | "C") {
  return PRODUCTOS.filter((p) => MODULO_DE[p.modo] === modulo);
}

/** Piezas extra que se pueden sumar a un paquete fijo (módulo A). */
export const PIEZAS_EXTRA = PRODUCTOS.filter(
  (p) => p.subcategoria === "ilustracion" || p.subcategoria === "infografias",
).flatMap((p) =>
  p.variantes.map((v) => ({
    id: v.id,
    nombre: p.variantes.length > 1 ? `${p.nombre} — ${v.nombre}` : p.nombre,
    precioCop: v.precioCop,
  })),
);

export function precioDesde(p: Producto) {
  return Math.min(...p.variantes.map((v) => v.precioCop));
}
