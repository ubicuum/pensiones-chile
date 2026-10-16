import { FONDOS_GENERACIONALES, FG_CONTEXTO, FG_VERIFICACION, FG_FUENTES, FG_LAGUNAS } from "../data/fondosGeneracionales";
import SimulacionFondos from "./SimulacionFondos";

const estilosNota = { padding: "8px 12px", fontSize: 13, color: "#9fb0c9", fontFamily: "var(--font-mono)", background: "#0a101f", lineHeight: 1.5 };
const estilosNota16 = { ...estilosNota, padding: "8px 16px" };

const colorEtapa = (tipo) => {
  if (tipo.includes("Crecimiento máximo")) return "#fb2c36";
  if (tipo === "Crecimiento") return "#fe6e00";
  if (tipo === "Equilibrado") return "#fac800";
  if (tipo === "Moderado") return "#54a2ff";
  return "#00c758";
};

export default function FondosGeneracionales() {
  const fg = FONDOS_GENERACIONALES;
  const ctx = FG_CONTEXTO;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Encabezado de la sección */}
      <div className="table-panel" style={{ border: "1px solid #2b3647" }}>
        <div className="panel-header">
          <div className="panel-title">Fondos Generacionales · el fin de tu derecho a elegir el riesgo</div>
          <span className="badge warn">Tema actual y sensible</span>
        </div>
        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <span className="badge accent">Ley 21.735</span>
            <span style={{ fontSize: 11, color: "#ff6568", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              Adiós a los multifondos A, B, C, D y E · 1 de abril de 2027
            </span>
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 18, color: "#fff", fontWeight: 800, lineHeight: 1.35 }}>
            La reforma "te protege" automatizando tu riesgo por fecha de nacimiento.{" "}
            <span style={{ color: "#fb2c36" }}>Pero el mismo diseño te sustrae la decisión</span> y deja a las AFP
            midiéndose contra una vara que ellas mismas eligen.
          </h3>
          <p style={{ margin: 0, fontSize: 13.5, color: "#c9d3e2", lineHeight: 1.65, maxWidth: 1050 }}>
            Los fondos generacionales (FG) reemplazan a los multifondos: se agrupa a los afiliados{" "}
            <strong>por rango de edad</strong> y el riesgo baja solo con la edad (glidepath). La Superintendencia de
            Pensiones emitió el <strong>1 de septiembre de 2026</strong> el Régimen de Inversión definitivo, con entrada
            en vigencia el <strong>1 de abril de 2027</strong>. Lo que sigue está separado en lo que la fuente oficial
            dice y lo que eso significa para tu bolsillo.
          </p>
        </div>

        <div className="kpi-grid" style={{ padding: "12px 16px 0" }}>
          <div className="kpi">
            <div className="kpi-label">Fondos generacionales</div>
            <div className="kpi-value" style={{ color: "#fac800" }}>{ctx.nFondos}</div>
            <div className="kpi-sub">inicial + 8 intermedios + consolidación</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Entrada en vigencia</div>
            <div className="kpi-value" style={{ color: "#fb2c36", fontSize: 20 }}>{ctx.entradaVigencia}</div>
            <div className="kpi-sub">reemplaza multifondos A-E</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Banda de desempeño</div>
            <div className="kpi-value" style={{ color: "#fe6e00" }}>±{ctx.bandaMin}–{ctx.bandaMax}</div>
            <div className="kpi-sub">% anual vs cartera de referencia</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Evaluación</div>
            <div className="kpi-value" style={{ color: "#54a2ff" }}>{ctx.evaluacionMeses} m</div>
            <div className="kpi-sub">meses móviles, medición mensual</div>
          </div>
        </div>
      </div>

      {/* Simulación interactiva: tu elección vs tu edad */}
      <SimulacionFondos />

      {/* La estructura: 10 fondos */}
      <div className="table-panel" style={{ border: "1px solid #2b3647" }}>
        <div className="panel-header">
          <div className="panel-title">Los 10 fondos · asignados por tu año de nacimiento, no por tu decisión</div>
        </div>
        <div style={{ padding: "8px 16px 0" }}>
          <p style={{ margin: 0, fontSize: 12.5, color: "#9fb0c9", lineHeight: 1.6 }}>
            El color indica el nivel de riesgo de cada cohorte: cuanto más cerca del retiro, más conservador. Nota que
            este esquema <strong>te coloca en una etapa que no eliges</strong> — tu tolerancia al riesgo no aparece por
            ningún lado.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.6fr 1.5fr 1.5fr 1.6fr",
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
          <span>Etapa</span>
          <span>Rango de edad</span>
          <span>Nombre</span>
          <span>Tipo</span>
        </div>
        {fg.estructura.map((e) => (
          <div
            key={e.etapa}
            style={{
              display: "grid",
              gridTemplateColumns: "0.6fr 1.5fr 1.5fr 1.6fr",
              gap: 10,
              padding: "6px 16px",
              borderBottom: "1px solid #16223a",
              fontFamily: "var(--font-mono)",
              fontSize: 12.5,
              alignItems: "center",
              background: e.nombre === "Fondo de Consolidación" ? "rgba(0,199,88,0.04)" : "transparent",
            }}
          >
            <span style={{ color: "#62748e", fontWeight: 700 }}>
              {e.etapa === 1 ? "Inicial" : e.etapa === 10 ? "10" : e.etapa}
            </span>
            <span style={{ color: "#e4eaf4", fontWeight: 700 }}>{e.rango}</span>
            <span style={{ color: "#c9d3e2" }}>{e.nombre}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 7, color: colorEtapa(e.tipo), fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: colorEtapa(e.tipo), display: "inline-block" }} />
              {e.tipo}
            </span>
          </div>
        ))}
        <div style={estilosNota16}>
          <strong>Rotación:</strong> {fg.asignacion.rotacion}
        </div>
      </div>

      {/* El cambio de fondo: lo que pierdes */}
      <div className="table-panel" style={{ border: "1px solid #2b3647" }}>
        <div className="panel-header">
          <div className="panel-title">Lo que cambia para ti: se acaba la elección del fondo obligatorio</div>
        </div>
        <div style={{ padding: "12px 16px 0" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#c9d3e2", lineHeight: 1.65, maxWidth: 1050 }}>
            <strong style={{ color: "#fff" }}>Cuenta obligatoria:</strong> {fg.asignacion.obligatorio}
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, marginTop: 8 }}>
          <div style={{ padding: "12px 16px", borderRight: "1px solid #1d293d", borderBottom: "1px solid #1d293d", background: "rgba(251,44,54,0.03)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#ff6568", marginBottom: 6 }}>
              ANTES (multifondos)
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: "#c9d3e2", lineHeight: 1.6 }}>
              Podías elegir entre A (más riesgo) y E (menos riesgo). Tú decidías cuánto riesgo asumías con tu propio
              ahorro, según tu edad, tu historia y tu tolerancia.
            </p>
          </div>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #1d293d", background: "rgba(0,199,88,0.03)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#00c758", marginBottom: 6 }}>
              DESPUÉS (fondos generacionales)
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: "#c9d3e2", lineHeight: 1.6 }}>
              Tu fecha de nacimiento fija tu fondo. El riesgo lo administra el FG automáticamente. Un joven conservador
              no puede optar a menor riesgo en su cuenta obligatoria: {fg.asignacion.perdidaDeDecision}
            </p>
          </div>
        </div>
        <div style={estilosNota16}>
          <strong>Matiz que casi nadie repite:</strong> los ahorros voluntarios (APV, depósitos convenidos, Cuenta 2){" "}
          <strong>SÍ</strong> se podrán depositar en el FG que tú quieras. {fg.asignacion.voluntario}
        </div>
      </div>

      {/* Lagunas previsionales: el cruce con los FG */}
      <div className="table-panel" style={{ border: "1px solid #2b3647" }}>
        <div className="panel-header">
          <div className="panel-title">Lagunas previsionales: el cruce con los FG que nadie discute</div>
          <span className="badge warn">la trampa escondida</span>
        </div>
        <div style={{ padding: "12px 16px 0" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#c9d3e2", lineHeight: 1.65, maxWidth: 1050 }}>
            <strong style={{ color: "#fff" }}>En la ASIGNACIÓN (cómo te ubican): no incide.</strong>{" "}
            {FG_LAGUNAS.asignacionNoIncluye}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, marginTop: 8 }}>
          <div style={{ padding: "12px 16px", borderRight: "1px solid #1d293d", borderBottom: "1px solid #1d293d", background: "rgba(84,162,255,0.03)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#54a2ff", marginBottom: 6 }}>
              Efecto directo (ya existente)
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: "#c9d3e2", lineHeight: 1.6 }}>
              {FG_LAGUNAS.efectoDoble.directo}
            </p>
          </div>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #1d293d", background: "rgba(251,44,54,0.04)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#ff6568", marginBottom: 6 }}>
              El efecto agravado por los FG
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: "#c9d3e2", lineHeight: 1.6 }}>
              {FG_LAGUNAS.efectoDoble.palancaPerdida}
            </p>
          </div>
        </div>

        <div style={estilosNota16}>
          <strong>Para dimensionar el problema:</strong> {FG_LAGUNAS.dimension.p40}{" "}
          {FG_LAGUNAS.dimension.densidadFemenina}
        </div>
        <div style={estilosNota16}>
          <strong>El matiz secuencial:</strong> {FG_LAGUNAS.seguroLagunas.definicion}{" "}
          {FG_LAGUNAS.seguroLagunas.inversionFondo}{" "}
          <span style={{ color: "#9fb0c9" }}>({FG_LAGUNAS.seguroLagunas.estimacionSupen})</span>
        </div>
        <div
          style={{
            ...estilosNota16,
            color: "#ffd166",
            borderTop: "1px solid #1d293d",
            backgroundColor: "rgba(250,200,0,0.04)",
          }}
        >
          <strong>Conclusión fiscalizadora:</strong> {FG_LAGUNAS.conclusion}
        </div>
      </div>

      {/* Mecanismo de premio/castigo */}
      <div className="table-panel" style={{ border: "1px solid #2b3647" }}>
        <div className="panel-header">
          <div className="panel-title">El premio y el castigo: la asimetría que conviene mirar de cerca</div>
          <span className="badge accent">mecanismo</span>
        </div>
        <div style={{ padding: "12px 16px 0" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#c9d3e2", lineHeight: 1.6, maxWidth: 1050 }}>
            La Ley 21.735 busca alinear los intereses de las AFP con los de los afiliados mediante un mecanismo de{" "}
            <strong>retribución (premio)</strong> y <strong>compensación (castigo)</strong> por rentabilidad. Así lo
            define el régimen:
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr 1fr 1fr",
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
          <span>Aspecto</span>
          <span>Detalle</span>
          <span>¿Qué se compara?</span>
          <span>Consecuencia</span>
        </div>
        {[
          { a: "Evaluación", d: fg.mecanismo.evaluacion, q: "Rentabilidad del FG vs cartera de referencia", c: "—" },
          { a: "Banda", d: fg.mecanismo.banda, q: "Rentabilidad de referencia ± banda", c: "Marca el umbral de premio/castigo" },
          { a: "Dentro de la banda", d: fg.mecanismo.dentro, q: "Desempeño sobre la referencia entre ±banda", c: fg.mecanismo.dentro },
          { a: "Sobre la banda", d: fg.mecanismo.sobre, q: "Rentabilidad sobre el límite máximo", c: fg.mecanismo.sobre },
          { a: "Bajo la banda", d: fg.mecanismo.bajo, q: "Rentabilidad bajo el límite inferior", c: fg.mecanismo.bajo },
        ].map((r, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 1fr 1fr 1fr",
              gap: 10,
              padding: "6px 16px",
              borderBottom: "1px solid #16223a",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              alignItems: "center",
              background:
                i === 3 ? "rgba(250,200,0,0.05)" : i === 4 ? "rgba(251,44,54,0.05)" : "transparent",
            }}
          >
            <span style={{ color: "#e4eaf4", fontWeight: 700 }}>{r.a}</span>
            <span style={{ color: "#c9d3e2", lineHeight: 1.4 }}>{r.d}</span>
            <span style={{ color: "#a9b7cc", lineHeight: 1.4 }}>{r.q}</span>
            <span style={{ color: i === 3 ? "#fac800" : i === 4 ? "#ff6568" : "#9fb0c9", lineHeight: 1.4 }}>{r.c}</span>
          </div>
        ))}
        <div style={estilosNota16}>
          <strong>La asimetría que importa (análisis sustentado):</strong> {fg.mecanismo.critica}
        </div>
        <div style={estilosNota16}>
          <strong>Por qué es relevante:</strong> {fg.mecanismo.autodefinicion}
        </div>
      </div>

      {/* Glidepath + categorías + transición */}
      <div className="dash-grid-2">
        <div className="table-panel" style={{ border: "1px solid #2b3647" }}>
          <div className="panel-header">
            <div className="panel-title">Glidepath: el riesgo que baja solo</div>
          </div>
          <div style={{ padding: "12px 16px 0" }}>
            <p style={{ margin: 0, fontSize: 12.5, color: "#c9d3e2", lineHeight: 1.6 }}>
              {fg.glidepath.definicion}
            </p>
            <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "#9fb0c9", lineHeight: 1.6 }}>
              <strong style={{ color: "#fff" }}>Lógica oficial:</strong> {fg.glidepath.logicaOficial}
            </p>
            <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "#9fb0c9", lineHeight: 1.6 }}>
              <strong style={{ color: "#fff" }}>El cambio de reglas:</strong> {fg.glidepath.tope}
            </p>
          </div>
          <div style={estilosNota16}>
            <strong>Asesoría:</strong> {fg.glidepath.asesoria}
          </div>
        </div>

        <div className="table-panel" style={{ border: "1px solid #2b3647" }}>
          <div className="panel-header">
            <div className="panel-title">11 categorías de activos en 2 grupos</div>
          </div>
          <div style={{ padding: "12px 16px 0" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#fb2c36", marginBottom: 5 }}>
              Crecimiento (riesgo)
            </div>
            <ul style={{ margin: "0 0 12px", paddingLeft: 16, fontSize: 12.5, color: "#c9d3e2", lineHeight: 1.7 }}>
              {fg.categorias.crecimiento.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#00c758", marginBottom: 5 }}>
              Protección
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, color: "#c9d3e2", lineHeight: 1.7 }}>
              {fg.categorias.proteccion.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Transición + perfeccionamientos */}
      <div className="table-panel" style={{ border: "1px solid #2b3647" }}>
        <div className="panel-header">
          <div className="panel-title">La transición que no vende en pánico — y lo que se afinó en silencio</div>
        </div>
        <div className="dash-grid-2">
          <div style={{ padding: "12px 16px 0" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#54a2ff", marginBottom: 6 }}>
              Transición multifondos → FG
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: "#c9d3e2", lineHeight: 1.6 }}>
              {fg.transicion.definicion} {fg.transicion.propositoOficial}
            </p>
            <div style={{ ...estilosNota, marginTop: 8 }}>
              <strong>Crítica:</strong> {fg.transicion.critica}
            </div>
          </div>
          <div style={{ padding: "12px 16px 0" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#fac800", marginBottom: 6 }}>
              Perfeccionamientos vs. borrador de julio-2026
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, color: "#c9d3e2", lineHeight: 1.7 }}>
              {fg.perfeccionamientos.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <div style={{ ...estilosNota, marginTop: 8 }}>
              <strong>Lectura:</strong> {fg.lecturaPerfeccionamientos}
            </div>
          </div>
        </div>
      </div>

      {/* Verificación OSINT */}
      <div className="table-panel" style={{ border: "1px solid #2b3647" }}>
        <div className="panel-header">
          <div className="panel-title">Verificación de cada dato (no creas todo lo que lees)</div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2.4fr 1.1fr 1.5fr",
            gap: 10,
            padding: "8px 16px",
            background: "#0f172b",
            borderBottom: "1px solid #1d293d",
            color: "#7d8faa",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: 0.7,
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>Dato</span>
          <span>Estado</span>
          <span>Fuente</span>
        </div>
        {FG_VERIFICACION.map((v, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "2.4fr 1.1fr 1.5fr",
              gap: 10,
              padding: "6px 16px",
              borderBottom: "1px solid #16223a",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              alignItems: "center",
              background: v.estado.startsWith("NO") ? "rgba(251,44,54,0.06)" : "transparent",
            }}
          >
            <span style={{ color: "#e4eaf4", lineHeight: 1.4 }}>{v.dato}</span>
            <span style={{ color: v.estado.startsWith("NO") ? "#ff6568" : "#00c758", fontWeight: 700 }}>{v.estado}</span>
            <span style={{ color: "#9fb0c9", lineHeight: 1.4 }}>{v.fuente}</span>
          </div>
        ))}
      </div>

      {/* Fuentes */}
      <div
        style={{
          border: "1px solid #2b3647",
          borderRadius: 10,
          padding: "14px 18px",
          background: "#0a101f",
        }}
      >
        <div style={{ fontSize: 11, color: "#9fb0c9", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
          Fuentes · Fondos Generacionales
        </div>
        <p style={{ margin: 0, fontSize: 12.5, color: "#9fb0c9", lineHeight: 1.6 }}>{FG_FUENTES}</p>
        <p style={{ margin: "10px 0 0", fontSize: 12, color: "#62748e", lineHeight: 1.6 }}>
          Este panel es una lectura editorial sobre un régimen público en transición: aun están por publicarse las
          instrucciones operativas definitivas para los saldos voluntarios y los índices de referencia de cada
          categoría. Las cifras de fondo (bandas, evaluaciones, estructura) están verificadas en el régimen oficial;
          las interpretaciones sobre asimetría y pérdida de decisión son opinión sustentada, no información atribuida
          como hecho a ninguna autoridad.
        </p>
      </div>
    </div>
  );
}
