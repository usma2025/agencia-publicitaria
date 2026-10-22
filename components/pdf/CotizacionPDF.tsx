import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { AVISOS } from "@/lib/avisos";
import type { DatosCotizacion } from "@/lib/export";
import { cantidadTexto } from "@/lib/money";
import { SITE } from "@/lib/site";

const C = { tinta: "#0b0b0b", papel: "#f4f1ea", amarillo: "#ffd400", magenta: "#e5007d", gris: "#6b6862" };

const s = StyleSheet.create({
  page: { paddingBottom: 60, fontFamily: "Helvetica", fontSize: 9, color: C.tinta },
  membrete: { backgroundColor: C.tinta, paddingHorizontal: 36, paddingVertical: 22, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  marca: { fontFamily: "Helvetica-Bold", fontSize: 30, color: C.amarillo, letterSpacing: -1 },
  agencia: { color: C.papel, fontSize: 9, marginTop: 2 },
  lema: { color: C.papel, fontSize: 8, opacity: 0.7, marginTop: 6 },
  docTitulo: { color: C.papel, fontFamily: "Helvetica-Bold", fontSize: 14, textAlign: "right" },
  docNumero: { color: C.amarillo, fontSize: 10, textAlign: "right", marginTop: 3 },
  franja: { flexDirection: "row", height: 5 },
  body: { paddingHorizontal: 36, paddingTop: 20 },
  meta: { flexDirection: "row", justifyContent: "space-between", marginBottom: 18, gap: 16 },
  metaBloque: { flex: 1 },
  metaLabel: { fontSize: 7, color: C.gris, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
  metaValor: { fontSize: 9, fontFamily: "Helvetica-Bold" },
  thead: { flexDirection: "row", backgroundColor: C.tinta, color: C.papel, paddingVertical: 6, paddingHorizontal: 6, fontFamily: "Helvetica-Bold", fontSize: 8 },
  fila: { flexDirection: "row", paddingVertical: 7, paddingHorizontal: 6, borderBottomWidth: 0.5, borderBottomColor: "#cfcac0" },
  cNum: { width: 20 },
  cDesc: { flex: 1, paddingRight: 8 },
  cCant: { width: 70, textAlign: "center" },
  cValor: { width: 90, textAlign: "right" },
  nombre: { fontFamily: "Helvetica-Bold", fontSize: 9.5 },
  detalle: { fontSize: 7.5, color: C.gris, marginTop: 1.5 },
  totales: { marginTop: 14, marginLeft: "auto", width: 220 },
  totFila: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  totFinal: { flexDirection: "row", justifyContent: "space-between", backgroundColor: C.amarillo, padding: 8, marginTop: 4 },
  totFinalTexto: { fontFamily: "Helvetica-Bold", fontSize: 12 },
  nota: { marginTop: 10, fontSize: 8, color: C.magenta },
  condiciones: { marginTop: 22, borderTopWidth: 1.5, borderTopColor: C.tinta, paddingTop: 10 },
  condTitulo: { fontFamily: "Helvetica-Bold", fontSize: 8, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 },
  aviso: { marginBottom: 5, fontSize: 7.5, lineHeight: 1.35 },
  avisoTitulo: { fontFamily: "Helvetica-Bold" },
  pie: { position: "absolute", bottom: 24, left: 36, right: 36, flexDirection: "row", justifyContent: "space-between", fontSize: 7, color: C.gris, borderTopWidth: 0.5, borderTopColor: "#cfcac0", paddingTop: 6 },
});

export function CotizacionPDF({ datos: d }: { datos: DatosCotizacion }) {
  return (
    <Document title={`Cotización ${d.numero}`} author={SITE.nombreCompleto} subject="Cotización comercial">
      <Page size="LETTER" style={s.page}>
        <View style={s.membrete}>
          <View>
            <Text style={s.marca}>{SITE.marca}</Text>
            <Text style={s.agencia}>Agencia Publicitaria</Text>
            <Text style={s.lema}>{SITE.lema}</Text>
          </View>
          <View>
            <Text style={s.docTitulo}>COTIZACIÓN</Text>
            <Text style={s.docNumero}>N° {d.numero}</Text>
          </View>
        </View>
        <View style={s.franja}>
          <View style={{ flex: 1, backgroundColor: "#00a0e3" }} />
          <View style={{ flex: 1, backgroundColor: C.magenta }} />
          <View style={{ flex: 1, backgroundColor: C.amarillo }} />
          <View style={{ flex: 1, backgroundColor: C.tinta }} />
        </View>

        <View style={s.body}>
          <View style={s.meta}>
            <View style={s.metaBloque}>
              <Text style={s.metaLabel}>Cliente</Text>
              <Text style={s.metaValor}>{d.cliente?.nombre || "—"}</Text>
              {d.cliente?.empresa ? <Text>{d.cliente.empresa}</Text> : null}
              {d.cliente?.email ? <Text>{d.cliente.email}</Text> : null}
              {d.cliente?.telefono ? <Text>{d.cliente.telefono}</Text> : null}
            </View>
            <View style={s.metaBloque}>
              <Text style={s.metaLabel}>Fecha de emisión</Text>
              <Text style={s.metaValor}>{d.fecha}</Text>
              <Text style={[s.metaLabel, { marginTop: 6 }]}>Válida hasta</Text>
              <Text style={s.metaValor}>{d.vence}</Text>
            </View>
            <View style={s.metaBloque}>
              <Text style={s.metaLabel}>Moneda</Text>
              <Text style={s.metaValor}>{d.moneda}{d.moneda !== "COP" ? " (referencia)" : ""}</Text>
              <Text style={[s.metaLabel, { marginTop: 6 }]}>Facturación</Text>
              <Text style={s.metaValor}>
                {d.conIva ? `Factura electrónica (${SITE.facturador})` : "Recibo (sin factura formal)"}
              </Text>
            </View>
          </View>

          <View style={s.thead}>
            <Text style={s.cNum}>#</Text>
            <Text style={s.cDesc}>Producto / servicio</Text>
            <Text style={s.cCant}>Cantidad</Text>
            <Text style={s.cValor}>Valor</Text>
          </View>
          {d.lineas.map((l, i) => (
            <View key={i} style={s.fila} wrap={false}>
              <Text style={s.cNum}>{i + 1}</Text>
              <View style={s.cDesc}>
                <Text style={s.nombre}>{l.nombre}</Text>
                {l.detalle.map((t, j) => (
                  <Text key={j} style={s.detalle}>{t}</Text>
                ))}
              </View>
              <Text style={s.cCant}>{cantidadTexto(l.cantidad, l.unidad)}</Text>
              <Text style={s.cValor}>{l.valor}</Text>
            </View>
          ))}

          <View style={s.totales} wrap={false}>
            <View style={s.totFila}>
              <Text>Subtotal</Text>
              <Text>{d.subtotal}</Text>
            </View>
            <View style={s.totFila}>
              <Text>IVA {d.conIva ? `${SITE.iva * 100}%` : "(no aplica)"}</Text>
              <Text>{d.iva}</Text>
            </View>
            <View style={s.totFinal}>
              <Text style={s.totFinalTexto}>TOTAL</Text>
              <Text style={s.totFinalTexto}>{d.total}</Text>
            </View>
          </View>
          {d.porCotizar > 0 && (
            <Text style={s.nota}>
              {d.porCotizar} ítem(s) marcados “Por cotizar” no están incluidos en el total; un asesor confirmará su valor.
            </Text>
          )}

          <View style={s.condiciones} wrap={false}>
            <Text style={s.condTitulo}>Condiciones comerciales</Text>
            <Text style={s.aviso}>
              <Text style={s.avisoTitulo}>Validez: </Text>
              {SITE.validezDias} días calendario desde la fecha de emisión. Producción sujeta a aprobación de arte y pago.
            </Text>
            {AVISOS.map((a) => (
              <Text key={a.id} style={s.aviso}>
                <Text style={s.avisoTitulo}>{a.titulo}: </Text>
                {a.texto}
              </Text>
            ))}
          </View>
        </View>

        <View style={s.pie} fixed>
          <Text>{SITE.nombreCompleto} · {SITE.email} · WhatsApp +{SITE.whatsapp}</Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
