// Datos de la marca y parámetros comerciales. Editar aquí antes de publicar.
export const SITE = {
  // Nombre pendiente: reemplazar "Por definir" cuando se elija la marca.
  marca: "Por definir",
  nombreCompleto: "Por definir Agencia Publicitaria",
  lema: "Pensar diferente, ejecutar con criterio",
  descripcion:
    "Diseño, web, imprenta, gran formato, textil y audiovisual. Cotiza en tiempo real y recibe tu cotización oficial en PDF o por WhatsApp.",
  // Número de ventas en formato internacional sin "+" ni espacios (ej. 573001234567).
  whatsapp: "573000000000",
  email: "ventas@pordefinir.com",
  ciudad: "Colombia",
  facturador: "Grupo EFI SAS",
  validezDias: 15,
  iva: 0.19,
  excedente: 0.1,
};

/** Tasas de referencia (unidades de moneda por 1 COP) si falla la consulta en línea. */
export const TASAS_RESPALDO = {
  COP: 1,
  USD: 1 / 4000,
  EUR: 1 / 4500,
  MXN: 1 / 215,
} as const;

export const API_TASAS = "https://open.er-api.com/v6/latest/COP";
