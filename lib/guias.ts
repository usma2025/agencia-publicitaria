import { SITE } from "./site";

// Contenido del visor de guías técnicas. Los tiempos de entrega son estimados
// en días hábiles contados desde la aprobación del arte y el pago.
export type BloqueGuia =
  | { tipo: "p"; texto: string }
  | { tipo: "lista"; items: string[] }
  | { tipo: "tabla"; columnas: string[]; filas: string[][]; nota?: string };

export type Guia = { id: string; titulo: string; resumen: string; bloques: BloqueGuia[] };

export const GUIAS: Guia[] = [
  {
    id: "vinilo",
    titulo: "Instructivo de vinilo y corte",
    resumen: "Cómo preparar archivos para vinilo impreso, corte y troquelado.",
    bloques: [
      { tipo: "p", texto: "Para que el plotter de corte siga tu diseño con precisión, el archivo debe cumplir con estas condiciones:" },
      {
        tipo: "lista",
        items: [
          "Formatos vectoriales: AI, PDF, EPS o SVG. Textos convertidos a curvas.",
          "Línea de corte en una capa independiente, trazo de 0,25 pt en magenta 100%, sin relleno.",
          "Deja 3 mm de sangrado alrededor de cada pieza y 3 mm de separación entre piezas.",
          "Detalles y letras de corte con grosor mínimo de 2 mm; por debajo de eso el vinilo se desprende.",
          "Imágenes a 150 dpi como mínimo al tamaño real de impresión, en modo CMYK.",
          "El cobro mínimo en materiales por m² es de 1 m², aunque la pieza sea más pequeña.",
        ],
      },
      { tipo: "p", texto: "Instalación recomendada:" },
      {
        tipo: "lista",
        items: [
          "Superficie limpia, seca y libre de grasa (alcohol isopropílico).",
          "Aplicar de centro a bordes con espátula para evitar burbujas.",
          "Esperar 48 horas antes de lavar o exponer a lluvia.",
        ],
      },
    ],
  },
  {
    id: "cupos",
    titulo: "Manual de cupos",
    resumen: "Qué es la impresión en cupos y cómo enviar tu arte.",
    bloques: [
      {
        tipo: "p",
        texto:
          "La impresión en cupos agrupa trabajos de varios clientes en un mismo pliego para reducir costos. Por eso las cantidades, papeles y acabados son fijos según cada paquete.",
      },
      {
        tipo: "lista",
        items: [
          "Arte final en PDF, modo CMYK, 300 dpi, con 2 mm de sangrado por lado.",
          "Caja tipográfica: textos y logos a mínimo 4 mm del borde de corte.",
          "Tolerancia de color de hasta 10% con respecto a la pantalla.",
          "Fondos negros con negro enriquecido (C40 M30 Y30 K100). Textos pequeños en K100.",
          "Para UV parcial envía un archivo adicional con la máscara en negro 100%.",
          "Una vez aprobado el arte no se aceptan cambios de cantidad ni de contenido.",
        ],
      },
    ],
  },
  {
    id: "tallas",
    titulo: "Guía de tallas",
    resumen: "Medidas de referencia para camisetas y chalecos.",
    bloques: [
      {
        tipo: "tabla",
        columnas: ["Talla", "Ancho de pecho (cm)", "Largo (cm)"],
        filas: [
          ["XS", "44", "64"],
          ["S", "47", "67"],
          ["M", "50", "70"],
          ["L", "53", "73"],
          ["XL", "56", "76"],
          ["XXL", "59", "78"],
        ],
        nota: "Medidas aproximadas de camiseta adulto, prenda extendida. Pueden variar ±2 cm según la referencia. Solicita una muestra física para pedidos grandes.",
      },
      { tipo: "p", texto: "Gorras: talla única con ajuste trasero (broche o velcro). Chalecos: tallas S a XXL." },
    ],
  },
  {
    id: "tiempos",
    titulo: "Tiempos de entrega",
    resumen: "Plazos estimados por línea de producto.",
    bloques: [
      {
        tipo: "tabla",
        columnas: ["Línea", "Tiempo estimado"],
        filas: [
          ["Impresión láser digital", "1 día hábil"],
          ["Cupos (tarjetas, volantes, postales, separadores)", "3 a 5 días hábiles"],
          ["Escarapelas, etiquetas y adhesivos", "2 a 4 días hábiles"],
          ["Gran formato (banners, vinilos, papelones)", "1 a 3 días hábiles"],
          ["Estructuras (arañas, roll ups, backings, popmans)", "2 a 4 días hábiles"],
          ["Textil y estampados", "5 a 8 días hábiles"],
          ["Diseño de logo y líneas gráficas", "5 a 15 días hábiles según paquete"],
          ["Sitios web", "3 a 8 semanas según paquete"],
          ["Spots políticos", "12 a 26 días según opción (preproducción + producción + postproducción)"],
        ],
        nota: "Los tiempos corren desde la aprobación del arte y el pago. Pueden variar en temporada alta o campañas electorales.",
      },
    ],
  },
  {
    id: "excedentes",
    titulo: `Política de excedentes (${SITE.excedente * 100}%)`,
    resumen: "Material adicional cuando el cliente suministra prendas o sustratos.",
    bloques: [
      {
        tipo: "p",
        texto: `Cuando el cliente entrega directamente las prendas o el material a imprimir, debe incluir un ${SITE.excedente * 100}% adicional sobre la cantidad requerida.`,
      },
      {
        tipo: "lista",
        items: [
          "El excedente cubre pruebas de calibración de color, presión y temperatura.",
          `Ejemplo: para 100 camisetas estampadas se deben entregar ${Math.ceil(100 * (1 + SITE.excedente))} unidades.`,
          "El material sobrante no utilizado se devuelve junto con el pedido.",
          "Sin excedente, el riesgo por piezas de prueba o merma corre por cuenta del cliente.",
        ],
      },
    ],
  },
];
