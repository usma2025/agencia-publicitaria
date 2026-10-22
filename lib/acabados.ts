// Acabados del módulo B (gran formato y vinilos).
// Los valores con precio se derivan de la lista oficial (diferencia entre
// materiales con y sin acabado). `precio: null` = se confirma con un asesor.
export type Acabado = {
  id: string;
  nombre: string;
  precio: number | null;
  por: "m2" | "pieza";
  nota?: string;
};

const LAMINADO_VINILO: Acabado = {
  id: "laminado",
  nombre: "Laminado mate / brillante",
  precio: 18000, // Vinilo laminado 54.500 − vinilo blanco 36.500
  por: "m2",
};
const CORTE_VINILO: Acabado = {
  id: "semicorte",
  nombre: "Corte / semicorte en plotter",
  precio: 2500, // Vinilo corte 39.000 − vinilo blanco 36.500
  por: "m2",
};
const LAMINADO_ETIQUETA: Acabado = {
  id: "laminado",
  nombre: "Laminado mate / brillante",
  precio: 13000, // Etiqueta laminada 59.000 − etiqueta corte 46.000
  por: "m2",
};
const OJALES: Acabado = { id: "ojales", nombre: "Ojales", precio: null, por: "pieza" };
const BOLSILLOS: Acabado = { id: "bolsillos", nombre: "Bolsillos para tubo", precio: null, por: "pieza" };
const EMPALME: Acabado = { id: "empalme", nombre: "Empalme / termosellado", precio: null, por: "pieza" };

export const ACABADOS: Record<string, Acabado[]> = {
  "gran-formato-banner-impresion-media-baja": [
    { ...OJALES, precio: 0, nota: "Incluido" },
    { ...BOLSILLOS, precio: 0, nota: "Incluido" },
    EMPALME,
  ],
  "gran-formato-banner-mesh": [OJALES, BOLSILLOS, EMPALME],
  "gran-formato-banner-panaflex": [OJALES, EMPALME],
  "gran-formato-impresion-en-tela": [BOLSILLOS],
  "gran-formato-vinilo-blanco-adhesivo": [LAMINADO_VINILO, CORTE_VINILO],
  "gran-formato-vinilo-adhesivo-laminado": [CORTE_VINILO],
  "gran-formato-vinilo-adhesivo-corte": [LAMINADO_VINILO],
  "etiquetas-etiqueta-vinilo-adhesivo-corte": [LAMINADO_ETIQUETA],
  "etiquetas-etiqueta-vinilo-troquelado": [LAMINADO_ETIQUETA],
};
