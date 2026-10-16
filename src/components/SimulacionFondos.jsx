import { useState } from "react";
import {
  FG_MULTIFONDOS_REAL,
  FG_GANADOR_POR_ANIO,
  FG_DILEMA,
  FG_EDADES,
} from "../data/fondosGeneracionales";

const estilosNota = { padding: "8px 12px", fontSize: 13, color: "#9fb0c9", fontFamily: "var(--font-mono)", background: "#0a101f", lineHeight: 1.5 };

const FONDO_COLOR = {
  A: "#f87171",
  B: "#fb923c",
  C: "#fbbf24",
  D: "#60a5fa",
  E: "#34d399",
};

function formatearPesos(v) {
  return "$" + Math.round(v).toLocaleString("es-CL");
}

export default function SimulacionFondos() {
  const [edad, setEdad] = useState(30);
  const filaEdad = FG_EDADES.find((e) => e.edad === edad) || FG_EDADES[1];

  const base = FG_DILEMA.base;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="table-panel" style={{ border: "1px solid #2b3647" }}>
        <div className="panel-header">
          <div className="panel-title">Simulación · tu elección vs tu edad</div>
          <span className="badge accent">datos reales del sistema</span>
        </div>

        <div className="dash-grid-2" style={{ padding: "14px 16px 0" }}>
          {/* Selector de edad */}
          <div style={{ background: "#0f172b", border: "1px solid #243449", borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, color: "#9fb0c9", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
              Tu edad hoy
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {FG_EDADES.map((e) => (
                <button
                  key={e.edad}
                  onClick={() => setEdad(e.edad)}
                  style={{
                    minWidth: 44,
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: edad === e.edad ? `1px solid ${e.color}` : "1px solid #1d293d",
                    background: edad === e.edad ? `${e.color}1a` : "transparent",
                    color: edad === e.edad ? e.color : "#62748e",
                    fontWeight: edad === e.edad ? 700 : 600,
                    fontSize: 12.5,
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {e.edad}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 16, padding: "10px 12px", borderRadius: 8, background: `${filaEdad.color}14`, border: `1px solid ${filaEdad.color}40` }}>
              <div style={{ fontSize: 11, color: "#9fb0c9", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Con los FG (abr-2027):</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: filaEdad.color, fontFamily: "var(--font-mono)" }}>
                {filaEdad.fg} · {filaEdad.nivel}
              </div>
              <div style={{ marginTop: 10, padding: "8px 10px", borderRadius: 6, background: "rgba(0,199,88,0.06)", border: "1px solid rgba(0,199,88,0.25)" }}>
                <div style={{ fontSize: 11, color: "#00c758", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>
                  Hoy (multifondos) tu equivalente era
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: FONDO_COLOR[filaEdad.equivalenteHoy.split("/")[0]] || "#fff", fontFamily: "var(--font-mono)" }}>
                  Fondo {filaEdad.equivalenteHoy} — y era tu elección
                </div>
              </div>
            </div>

            <div style={estilosNota}>
              <strong style={{ color: "#ff6568" }}>{filaEdad.contraste}</strong>
            </div>
          </div>

          {/* Qué dejaste de decidir */}
          <div style={{ background: "#0f172b", border: "1px solid #243449", borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, color: "#9fb0c9", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
              El dilema de fondo
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#c9d3e2", lineHeight: 1.65 }}>
              {FG_DILEMA.explicacion}
            </p>
            <div style={{ ...estilosNota, marginTop: 10, background: "rgba(251,44,54,0.06)" }}>
              <strong style={{ color: "#ff6568" }}>Lo que el sistema nuevo esconde, en una línea:</strong>{" "}
              {FG_DILEMA.criticaClave}
            </div>
          </div>
        </div>
      </div>

      {/* Rentabilidad real A-E por año */}
      <div className="table-panel" style={{ border: "1px solid #2b3647" }}>
        <div className="panel-header">
          <div className="panel-title">Rentabilidad real de los multifondos A-E · % anual (sistema)</div>
          <span className="badge live">no es pronóstico ni hipótesis</span>
        </div>
        <div style={{ padding: "8px 16px 0" }}>
          <p style={{ margin: 0, fontSize: 12.5, color: "#9fb0c9", lineHeight: 1.6 }}>
            Estos son los rendimientos efectivos de los fondos A-E en años cerrados. Observa qué fondo ganó en cada
            año: <strong>nadie acertó siempre</strong>. Esta dispersión anual es exactamente lo que el FG automatiza
            por edad.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.6fr 1fr 1fr 1fr 1fr 1fr 2fr",
            gap: 10,
            padding: "8px 16px",
            marginTop: 8,
            background: "#0f172b",
            borderBottom: "1px solid #1d293d",
            color: "#7d8faa",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: 0.7,
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>Año</span>
          {["A", "B", "C", "D", "E"].map((l) => (
            <span key={l} style={{ color: FONDO_COLOR[l] }}>Fondo {l}</span>
          ))}
          <span>¿Quién ganó?</span>
        </div>
        {FG_MULTIFONDOS_REAL.map((f) => {
          const ganador = FG_GANADOR_POR_ANIO.find((g) => g.anio === f.anio);
          const max = Math.max(f.A, f.B, f.C, f.D, f.E);
          return (
            <div
              key={f.anio}
              style={{
                display: "grid",
                gridTemplateColumns: "0.6fr 1fr 1fr 1fr 1fr 1fr 2fr",
                gap: 10,
                padding: "6px 16px",
                borderBottom: "1px solid #16223a",
                fontFamily: "var(--font-mono)",
                fontSize: 12.5,
                alignItems: "center",
              }}
            >
              <span style={{ color: "#fff", fontWeight: 700 }}>{f.anio}</span>
              {["A", "B", "C", "D", "E"].map((l) => (
                <span
                  key={l}
                  style={{
                    color: f[l] === max ? "#fff" : "#9fb0c9",
                    fontWeight: f[l] === max ? 800 : 400,
                    background: l === ganador.fondo ? `${FONDO_COLOR[l]}22` : "transparent",
                    padding: "2px 6px",
                    borderRadius: 4,
                  }}
                >
                  {f[l].toFixed(1)}%
                </span>
              ))}
              <span style={{ color: FONDO_COLOR[ganador.fondo], fontWeight: 700, fontSize: 11.5, lineHeight: 1.4 }}>
                {ganador.mensaje}
              </span>
            </div>
          );
        })}
      </div>

      {/* Diferencia en pesos sobre $1.000.000 */}
      <div className="table-panel" style={{ border: "1px solid #2b3647" }}>
        <div className="panel-header">
          <div className="panel-title">En pesos: qué significa esa dispersión sobre {formatearPesos(base)}</div>
        </div>
        <div style={{ padding: "8px 16px 0" }}>
          <p style={{ margin: 0, fontSize: 12.5, color: "#9fb0c9", lineHeight: 1.6 }}>
            Saldo supuesto de {formatearPesos(base)}: lo que habrías recibido en cada año según el fondo en que
            estuvieras. El rango entre el mejor y el peor fondo en un solo año muestra cuánto pesa la elección — y
            cuánto pierde de vista el FG al fijar tu fondo por edad.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.8fr 1fr 1fr 1fr 1fr 1fr",
            gap: 10,
            padding: "8px 16px",
            marginTop: 8,
            background: "#0f172b",
            borderBottom: "1px solid #1d293d",
            color: "#7d8faa",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: 0.7,
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>Año</span>
          {["A", "B", "C", "D", "E"].map((l) => (
            <span key={l} style={{ color: FONDO_COLOR[l] }}>Fondo {l}</span>
          ))}
        </div>
        {FG_MULTIFONDOS_REAL.map((f) => {
          const max = Math.max(f.A, f.B, f.C, f.D, f.E);
          const min = Math.min(f.A, f.B, f.C, f.D, f.E);
          return (
            <div
              key={f.anio}
              style={{
                display: "grid",
                gridTemplateColumns: "0.8fr 1fr 1fr 1fr 1fr 1fr",
                gap: 10,
                padding: "6px 16px",
                borderBottom: "1px solid #16223a",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                alignItems: "center",
              }}
            >
              <span style={{ color: "#fff", fontWeight: 700 }}>{f.anio}</span>
              {["A", "B", "C", "D", "E"].map((l) => {
                const ganancia = base * (f[l] / 100);
                const esMax = f[l] === max;
                const esMin = f[l] === min;
                return (
                  <span
                    key={l}
                    style={{
                      color: esMax ? "#00c758" : esMin ? "#ff6568" : "#9fb0c9",
                      fontWeight: esMax || esMin ? 800 : 400,
                    }}
                  >
                    +{formatearPesos(ganancia)}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Aviso de honestidad */}
      <div
        style={{
          border: "1px solid #2b3647",
          borderRadius: 10,
          padding: "14px 18px",
          background: "#0a101f",
        }}
      >
        <div style={{ fontSize: 11, color: "#9fb0c9", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
          Filtro crítico · no creas todo lo que lees
        </div>
        <p style={{ margin: 0, fontSize: 12.5, color: "#9fb0c9", lineHeight: 1.6 }}>
          Estas cifras de rentabilidad son <strong>reales y pasadas</strong> (multifondos A-E, spensiones.cl). Los
          fondos generacionales <strong>aún no operan</strong> (entran el 1-abr-2027), por lo que <strong>no existe
          resultado real de un FG para comparar</strong>. Este panel no pronostica cuánto rendirá un FG: solo muestra
          la dispersión anual que el nuevo diseño <strong>automatiza por edad</strong> y la decisión de riesgo que el
          afiliado pierde en la cuenta obligatoria. La rentabilidad pasada de A-E no es garantía de resultados
          futuros de ningún fondo generacional.
        </p>
      </div>
    </div>
  );
}
