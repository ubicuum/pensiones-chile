import { useMemo, useState } from "react";
import {
  getRentabilidadFondos,
  getValorCuotaTabla,
  getComisiones,
  AFP_COLORS,
  PERIODO_DATOS,
} from "../data/realData";
import { AFILIADOS_POR_AFP, AFILIADOS_CORTE } from "../data/afiliados";

const fmtPesos = (v) => {
  if (v == null) return "—";
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)} B`;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)} Mil M`;
  return `$${Math.round(v).toLocaleString("es-CL")}`;
};

const fmtCuota = (v) => (v == null ? "—" : `$${v.toFixed(2)}`);

const FONDOS = ["A", "B", "C", "D", "E"];

export default function CuadroPosiciones() {
  const [fondo, setFondo] = useState("C");

  const filas = useMemo(() => {
    const rent = (getRentabilidadFondos() || []).filter(
      (r) => r.fondo === fondo && r.afp !== "SISTEMA"
    );
    const cuotas = (getValorCuotaTabla() || []).filter((c) => c.fondo === fondo);
    const comisiones = new Map((getComisiones() || []).map((c) => [c.name, c.comision]));

    const cuotaMap = new Map(cuotas.map((c) => [c.afp, c]));
    const afpNorm = (n) => {
      const norm = { Capital: "Capital", Cuprum: "Cuprum", Habitat: "Habitat", Modelo: "Modelo", "Plan Vital": "Planvital", "PLANVITAL": "Planvital", PROVIDA: "Provida", Provida: "Provida", CAPITAL: "Capital", CUPRUM: "Cuprum", HABITAT: "Habitat", MODELO: "Modelo", UNO: "Uno", Uno: "Uno" };
      return norm[n] || (n[0] + n.slice(1).toLowerCase());
    };

    return rent
      .map((r) => {
        const nombre = afpNorm(r.afp);
        const c = cuotaMap.get(r.afp) || cuotaMap.get(nombre) || {};
        return {
          nombre,
          color: AFP_COLORS[nombre] || "#54a2ff",
          cuota: c?.cuota,
          patrimonio: c?.patrimonio,
          mes: r.mes,
          ultimos12m: r.ultimos12m,
          acumuladoAnio: r.acumuladoAnio,
          prom60m: r.prom60m,
          comision: comisiones.get(nombre) ?? null,
          afiliados: AFILIADOS_POR_AFP[nombre] ?? null,
        };
      })
      .filter((r) => r.ultimos12m != null)
      .sort((a, b) => (b.ultimos12m ?? -Infinity) - (a.ultimos12m ?? -Infinity))
      .map((r, i) => ({ ...r, pos: i + 1 }));
  }, [fondo]);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#62748e", fontWeight: 700 }}>
          Carrera: Fondo
        </span>
        {FONDOS.map((f) => (
          <button
            key={f}
            onClick={() => setFondo(f)}
            style={{
              width: 30,
              height: 30,
              borderRadius: 5,
              border: `1px solid ${fondo === f ? "#fac800" : "#243449"}`,
              background: fondo === f ? "#fac800" : "#0f172b",
              color: fondo === f ? "#05060a" : "#62748e",
              fontWeight: 800,
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
            }}
          >
            {f}
          </button>
        ))}
        <span style={{ fontSize: 11, color: "#45556c", marginLeft: 8, fontFamily: "var(--font-mono)" }}>
          {PERIODO_DATOS ? `· ${PERIODO_DATOS}` : ""}
        </span>
      </div>

      <div style={{ border: "1px solid #1d293d", borderRadius: 8, overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "34px 1fr 110px 90px 100px 120px 80px 90px",
            gap: 8,
            padding: "8px 12px",
            background: "#0f172b",
            borderBottom: "1px solid #1d293d",
            color: "#45556c",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: 0.8,
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
          }}
        >
          <span>#</span>
          <span>AFP</span>
          <span style={{ textAlign: "right" }}>Cuota</span>
          <span style={{ textAlign: "right" }}>Mes %</span>
          <span style={{ textAlign: "right" }}>12m %</span>
          <span style={{ textAlign: "right" }}>Patrimonio</span>
          <span style={{ textAlign: "right" }}>Com. %</span>
          <span style={{ textAlign: "right" }}>Afiliados</span>
        </div>

        {filas.map((r) => {
          const lead = r.pos === 1;
          const doce = r.ultimos12m;
          const mes = r.mes;
          return (
            <div
              key={r.nombre}
              style={{
                display: "grid",
                gridTemplateColumns: "34px 1fr 110px 90px 100px 120px 80px 90px",
                gap: 8,
                padding: "7px 12px",
                borderBottom: "1px solid #16223a",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                background: lead ? "rgba(250,200,0,0.06)" : "transparent",
                alignItems: "center",
              }}
            >
              <span style={{ color: lead ? "#fac800" : "#45556c", fontWeight: 800, textAlign: "right" }}>
                {String(r.pos).padStart(2, "0")}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 8, color: "#e4eaf4", fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: r.color, display: "inline-block", flexShrink: 0 }} />
                {r.nombre}
                {lead && <span style={{ color: "#fac800", fontSize: 10 }}>●</span>}
              </span>
              <span style={{ textAlign: "right", color: "#b9c4d4", fontVariantNumeric: "tabular-nums" }}>
                {fmtCuota(r.cuota)}
              </span>
              <span style={{ textAlign: "right", color: mes >= 0 ? "#00c758" : "#ff6568" }}>
                {mes == null ? "—" : `${mes >= 0 ? "+" : ""}${mes.toFixed(2)}`}
              </span>
              <span style={{ textAlign: "right", color: doce >= 0 ? "#00c758" : "#ff6568", fontWeight: 700 }}>
                {doce == null ? "—" : `${doce >= 0 ? "+" : ""}${doce.toFixed(2)}`}
              </span>
              <span style={{ textAlign: "right", color: "#b9c4d4" }}>{fmtPesos(r.patrimonio)}</span>
              <span
                style={{
                  textAlign: "right",
                  color: r.comision != null && r.comision > 1 ? "#fe6e00" : "#00c758",
                  fontWeight: 700,
                }}
              >
                {r.comision == null ? "—" : r.comision.toFixed(2)}
              </span>
              <span style={{ textAlign: "right", color: "#b9c4d4" }}>
                {r.afiliados == null ? "—" : `${(r.afiliados / 1e6).toFixed(1)} M`}
              </span>
            </div>
          );
        })}

        <div
          style={{
            padding: "8px 12px",
            fontSize: 13,
            color: "#8fa1bd",
            fontFamily: "var(--font-mono)",
            background: "#0a101f",
          }}
        >
          Comisiones: Superintendencia de Pensiones · Afiliados: {AFILIADOS_CORTE} (Supen) · Rent.: dato real {PERIODO_DATOS}
        </div>
      </div>
    </div>
  );
}
