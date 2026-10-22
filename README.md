# Por definir Agencia Publicitaria — Web y cotizadores

Next.js 16 (App Router) · Tailwind CSS 4 · Zustand · @react-pdf/renderer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Precios

`data/precios.csv` es la única fuente de precios. Antes de `dev`/`build` se ejecuta
`npm run catalog`, que lo convierte en `data/catalog.json` y asigna el módulo de cotización:

| Módulo | Regla | Productos |
| --- | --- | --- |
| A — Tarifa fija | Base × cantidad + piezas extra | `diseno_grafico`, `servicios_web`, `audiovisual` |
| B — Por medida | MAX(ancho × alto, 1 m²) × (precio + acabados m²) × piezas; metro lineal sin mínimo | unidad `M2` / `Metro Lineal` |
| C — Volumen | Precio del rango según cantidad mínima × cantidad | resto (escalones o paquetes) |

IVA (19%) y moneda se aplican sobre el subtotal desde el carrito.

## Dónde editar

| Qué | Archivo |
| --- | --- |
| Marca, WhatsApp, correo, validez, IVA | `lib/site.ts` |
| Secciones y productos "a cotizar" (sin precio) | `lib/catalog.ts` |
| Acabados de gran formato | `lib/acabados.ts` |
| Avisos legales / reglas de negocio | `lib/avisos.ts` |
| Guías (vinilo, cupos, tallas, tiempos, excedentes) | `lib/guias.ts` |
| Motor de cálculo | `lib/pricing.ts` |
