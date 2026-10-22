// Convierte data/precios.csv (fuente única de precios) en data/catalog.json,
// agrupando filas por producto y asignando el módulo de cotización (A, B o C).
// Se ejecuta automáticamente antes de `dev` y `build`.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const csvPath = join(root, "data", "precios.csv");
const outPath = join(root, "data", "catalog.json");

// Módulo A: servicios de tarifa fija / paquetes.
const CATEGORIAS_PAQUETE = new Set(["diseno_grafico", "servicios_web", "audiovisual"]);
// Filas que no son productos sino adicionales de impresión láser.
const SUBCATEGORIAS_ADICIONAL = new Set(["adicionales"]);

// El CSV viene sin tildes; se restauran solo para mostrar en la web.
const ACENTOS = {
  Creacion: "Creación", Ilustracion: "Ilustración", Infografia: "Infografía",
  Cartografia: "Cartografía", Campanas: "Campañas", Diseno: "Diseño", diseno: "diseño",
  Politico: "Político", Politica: "Política", Impresion: "Impresión", impresion: "impresión",
  Arana: "Araña", Polialgodon: "Polialgodón", Algodon: "Algodón", Poliester: "Poliéster",
  Sublimacion: "Sublimación", Serigrafia: "Serigrafía", Liston: "Listón", Plastica: "Plástica",
  plastico: "plástico", Dias: "Días", Fotografico: "Fotográfico", fotografico: "fotográfico",
  Publica: "Pública", Papelon: "Papelón", tamano: "tamaño", basico: "básico", Basico: "Básico",
  Proteccion: "Protección", Didactica: "Didáctica", translucida: "translúcida",
  retratil: "retráctil", inyeccion: "inyección", Implementacion: "Implementación",
  sabado: "sábado", Multipagina: "Multipágina", humoristico: "humorístico", iconos: "íconos",
  portatil: "portátil", acrilico: "acrílico", Estandar: "Estándar", Pagina: "Página",
  Plastico: "Plástico",
};

// Productos que en el CSV vienen como filas separadas pero se venden como un
// solo servicio con opciones (ej. Web Esencial 1A vs 1B).
const AGRUPACIONES = [
  { patron: /^(Paquete Web (?:Esencial|Profesional|Avanzado)) (\w+)$/, prefijo: (m) => m[2] },
  { patron: /^(Spot Politico) (Opción \d+)$/, prefijo: (m) => m[2] },
  { patron: /^(Paquete TikTok\/Reels) (\d+)$/, prefijo: (m) => `Paquete ${m[2]}` },
  { patron: /^(Infografia) (.+)$/, prefijo: (m) => `Tipo ${m[2]}`, soloPrefijo: true },
];

function agrupar(producto, variante) {
  for (const { patron, prefijo, soloPrefijo } of AGRUPACIONES) {
    const m = producto.match(patron);
    if (m) return [m[1], soloPrefijo ? prefijo(m) : `${prefijo(m)} · ${variante}`];
  }
  return [producto, variante];
}

function acentuar(texto) {
  return texto.replace(/[A-Za-zÁÉÍÓÚáéíóúñÑ_]+/g, (w) => ACENTOS[w] ?? w);
}

function slug(texto) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Parser CSV mínimo con soporte de comillas.
function parseLinea(linea) {
  const campos = [];
  let actual = "";
  let enComillas = false;
  for (let i = 0; i < linea.length; i++) {
    const c = linea[i];
    if (c === '"') {
      if (enComillas && linea[i + 1] === '"') {
        actual += '"';
        i++;
      } else enComillas = !enComillas;
    } else if (c === "," && !enComillas) {
      campos.push(actual);
      actual = "";
    } else actual += c;
  }
  campos.push(actual);
  return campos;
}

const lineas = readFileSync(csvPath, "utf8").replace(/^﻿/, "").split(/\r?\n/).filter((l) => l.trim());
const cabecera = parseLinea(lineas[0]);
const filas = lineas.slice(1).map((linea) => {
  const campos = parseLinea(linea);
  // Si las notas traen comas sin comillas, se unen al último campo.
  if (campos.length > cabecera.length) {
    campos.splice(cabecera.length - 1, campos.length, campos.slice(cabecera.length - 1).join(","));
  }
  return Object.fromEntries(cabecera.map((k, i) => [k, (campos[i] ?? "").trim()]));
});

function modoDe(categoria, unidad, variantes) {
  if (CATEGORIAS_PAQUETE.has(categoria)) return "paquete";
  if (unidad === "M2") return "area";
  if (unidad === "Metro Lineal") return "lineal";
  if (unidad === "Paquete") return "unidad";
  const minimos = new Set(variantes.map((v) => v.cantidadMinima));
  // Mínimos distintos (o un único escalón con mínimo) => escalonado por volumen.
  if (minimos.size === variantes.length) return "volumen";
  return "unidad";
}

const productos = new Map();
const adicionales = [];

for (const f of filas) {
  const [nombreProducto, nombreVariante] = agrupar(f.producto_servicio, f.variante_opcion);
  const variante = {
    id: slug(`${f.producto_servicio}-${f.variante_opcion}`),
    nombre: acentuar(nombreVariante),
    cantidadMinima: Number(f.cantidad_minima) || 1,
    precioCop: Number(f.precio_cop),
    precioUsd: f.precio_usd ? Number(f.precio_usd) : null,
    incluyeIva: f.incluye_iva === "true",
    notas: acentuar(f.notas_tecnicas),
  };

  if (SUBCATEGORIAS_ADICIONAL.has(f.subcategoria)) {
    adicionales.push({
      id: slug(f.producto_servicio),
      categoria: f.categoria_id,
      nombre: acentuar(f.producto_servicio),
      unidad: f.unidad_medida,
      precioCop: variante.precioCop,
      notas: variante.notas,
    });
    continue;
  }

  const key = `${f.categoria_id}|${nombreProducto}`;
  if (!productos.has(key)) {
    productos.set(key, {
      id: slug(`${f.categoria_id}-${nombreProducto}`),
      categoria: f.categoria_id,
      subcategoria: f.subcategoria,
      nombre: acentuar(nombreProducto),
      unidad: f.unidad_medida,
      variantes: [],
    });
  }
  productos.get(key).variantes.push(variante);
}

const lista = [...productos.values()].map((p) => {
  p.variantes.sort((a, b) => a.cantidadMinima - b.cantidadMinima);
  return { ...p, modo: modoDe(p.categoria, p.unidad, p.variantes) };
});

writeFileSync(outPath, JSON.stringify({ productos: lista, adicionales }, null, 2) + "\n");
const porModo = lista.reduce((acc, p) => ((acc[p.modo] = (acc[p.modo] ?? 0) + 1), acc), {});
console.log(`catalog.json: ${lista.length} productos, ${adicionales.length} adicionales`, porModo);
