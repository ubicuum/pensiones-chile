import {
  costoComisionCompuesto,
  proporcionRentabilidadAComision,
  desvioEnPesos,
  concentracion,
  aseguradorasSegundoActo,
  confesionReemplazo,
  RETIROS_DATOS,
  negocioAfp,
  comisionesFantasma,
  SIS_SIN_RIESGO,
  REFORMA,
  ESCENARIO,
  PARAISOS_FISCALES,
  ENCAJE_DOBLE_BENEFICIO,
  MULTAS_AFP,
  DUEÑOS_AFP,
  HALLAZGO15FONDO_E,
  HALLAZGO16RETIRO_ANTICIPADO,
  HALLAZGO17FONDO_E_CRISIS,
} from "../data/descubrimientos";

const fmtM = (v) => `$${(v / 1e6).toFixed(1)} M`;
const estilosNota = { padding: "8px 12px", fontSize: 13, color: "#9fb0c9", fontFamily: "var(--font-mono)", background: "#0a101f", lineHeight: 1.5 };
const estilosNota16 = { ...estilosNota, padding: "8px 16px" };

const acentos = {
  Capital: "#fbbf24",
  Cuprum: "#f87171",
  Habitat: "#6ee7b7",
  Modelo: "#60a5fa",
  "Plan Vital": "#34d399",
  Planvital: "#34d399",
  Provida: "#c084fc",
  Uno: "#a3e635",
};

const colorDe = (name) => acentos[name] || "#54a2ff";

export default function Descubrimiento() {
  const costo = costoComisionCompuesto();
  const proporcion = proporcionRentabilidadAComision("C");
  const desvio = desvioEnPesos();
  const conc = concentracion();
  const aseg = aseguradorasSegundoActo();
  const reemplazo = confesionReemplazo();
  const negocio = negocioAfp();
  const fantasma = comisionesFantasma();
  const sisRiesgo = SIS_SIN_RIESGO;
  const reforma = REFORMA;
  const paraisos = PARAISOS_FISCALES;
  const encaje = ENCAJE_DOBLE_BENEFICIO;
  const multas = MULTAS_AFP;
  const duenios = DUEÑOS_AFP;
  const h15 = HALLAZGO15FONDO_E;
  const h16 = HALLAZGO16RETIRO_ANTICIPADO;
  const h17 = HALLAZGO17FONDO_E_CRISIS;

  const kpis = [
    {
      label: "Costo real comisión a 40 años",
      value: `${costo.peor.pctDelSaldo.toFixed(1)}%`,
      sub: `de tu saldo final (${costo.peor.name})`,
      color: "#fb2c36",
    },
    {
      label: "Diferencia vs AFP más barata",
      value: fmtM(costo.deltaPeorVsMejor),
      sub: "Provida vs Uno · 40 años",
      color: "#fe6e00",
    },
    {
      label: "Patrimonio que controla el Top 3",
      value: `${conc.top3Patrimonio.toFixed(1)}%`,
      sub: "3 AFP del total del sistema",
      color: "#fac800",
    },
    {
      label: "Top 1 (Habitat)",
      value: `${conc.filas[0]?.pctPatrimonio.toFixed(1)}%`,
      sub: "del patrimonio · 1 sola AFP",
      color: "#6ee7b7",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Banner principal */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(251,44,54,0.10), rgba(250,200,0,0.05))",
          border: "1px solid #4a1f2a",
          borderRadius: 10,
          padding: "16px 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span className="badge warn">Hallazgo</span>
          <span style={{ fontSize: 11, color: "#ff6568", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
            No lo publica la Superintendencia
          </span>
        </div>
        <h2 style={{ margin: 0, fontSize: 19, color: "#fff", fontWeight: 800, lineHeight: 1.3 }}>
          Tu comisión no es “1,45%”. Es hasta el{" "}
          <span style={{ color: "#fac800" }}>14,5% de tu pensión final</span>.
        </h2>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: "#c9d3e2", lineHeight: 1.6, maxWidth: 940 }}>
          La comisión se cobra de tu <strong>sueldo</strong> (no del fondo), mes a mes, durante{" "}
          {ESCENARIO.anyos} años. Ese dinero que sale de tu bolsillo, si se hubiera invertido al
          mismo retorno real del sistema, habría crecido hasta convertirse en una parte enorme de
          tu capital de jubilación. La Superintendencia solo publica el % del sueldo — nunca este
          costo compuesto en pesos. Aquí lo desenterramos.
        </p>
      </div>

      {/* KPIs de hallazgos */}
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div className="kpi" key={k.label}>
            <div className="kpi-accent" style={{ background: `linear-gradient(90deg, ${k.color}, transparent)` }} />
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Hallazgo 1: costo comisión compuesto */}
      <div className="table-panel">
        <div className="panel-header">
          <div className="panel-title">Hallazgo 1 · Costo real de tu comisión (compuesto)</div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "34px 110px 90px 1fr 110px 130px 130px",
            gap: 10,
            padding: "8px 12px",
            background: "#0f172b",
            borderBottom: "1px solid #1d293d",
            color: "#45556c",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: 0.7,
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>#</span>
          <span>AFP</span>
          <span style={{ textAlign: "right" }}>Com. %</span>
          <span style={{ textAlign: "right" }}>Peso</span>
          <span>Costo compuesto</span>
          <span style={{ textAlign: "right" }}>% de pensión</span>
          <span style={{ textAlign: "right" }}>vs Más barata</span>
        </div>
        {costo.filas
          .slice()
          .sort((a, b) => b.costoCompuesto - a.costoCompuesto)
          .map((f, i) => {
            const worse = f.name === costo.peor.name;
            return (
              <div
                key={f.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "34px 110px 90px 1fr 110px 130px 130px",
                  gap: 10,
                  padding: "6px 12px",
                  borderBottom: "1px solid #16223a",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  alignItems: "center",
                  background: worse ? "rgba(251,44,54,0.06)" : "transparent",
                }}
              >
                <span style={{ color: i === 0 ? "#fb2c36" : "#45556c", fontWeight: 700 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 7, color: "#e4eaf4", fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: colorDe(f.name), display: "inline-block" }} />
                  {f.name}
                </span>
                <span style={{ textAlign: "right", color: "#b9c4d4" }}>{f.comision.toFixed(2)}</span>
                <span style={{ textAlign: "right", color: "#45556c", fontSize: 11 }}>
                  {"▮".repeat(Math.max(1, Math.round((f.costoCompuesto / costo.peor.costoCompuesto) * 20)))}
                </span>
                <span style={{ textAlign: "right", color: worse ? "#ff6568" : "#fff", fontWeight: 700 }}>
                  {fmtM(f.costoCompuesto)}
                </span>
                <span style={{ textAlign: "right", color: worse ? "#ff6568" : "#00c758", fontWeight: 700 }}>
                  {f.pctDelSaldo.toFixed(1)}%
                </span>
                <span style={{ textAlign: "right", color: "#62748e" }}>
                  {f.name === costo.mejor.name ? "—" : `+${fmtM(f.costoCompuesto - costo.mejor.costoCompuesto)}`}
                </span>
              </div>
            );
          })}
        <div style={{ padding: "8px 12px", fontSize: 13, color: "#9fb0c9", fontFamily: "var(--font-mono)", background: "#0a101f" }}>
          Escenario: sueldo ${ESCENARIO.sueldoMensual.toLocaleString("es-CL")} · {ESCENARIO.anyos} años · retorno real{" "}
          {ESCENARIO.retornoRealAnual * 100}% · cotización {ESCENARIO.baseCapital * 100}%. Datos de comisión: Superintendencia de
          Pensiones.
        </div>
      </div>

      {/* Hallazgo 2 + Hallazgo 3 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, minWidth: 0 }}>
        <div className="table-panel">
          <div className="panel-header">
            <div className="panel-title">Hallazgo 2 · De cada $100 que gana tu plata</div>
          </div>
          <div style={{ padding: "8px 12px", fontSize: 12.5, color: "#a9b7cc", lineHeight: 1.4 }}>
            Cuánto de la rentabilidad que genera tu saldo (Fondo C) se lo lleva la AFP en comisión
            cobrada de tu sueldo. Saldo típico ${(proporcion.saldoMedio / 1e6).toFixed(0)} M.
          </div>
          {proporcion.filas.map((f) => (
            <div
              key={f.name}
              style={{ display: "grid", gridTemplateColumns: "1fr 70px 120px", gap: 10, padding: "6px 12px", borderBottom: "1px solid #16223a", fontFamily: "var(--font-mono)", fontSize: 12, alignItems: "center" }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 7, color: "#e4eaf4", fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: colorDe(f.name), display: "inline-block" }} />
                {f.name}
              </span>
              <span style={{ textAlign: "right", color: "#b9c4d4" }}>com {f.comision?.toFixed(2)}%</span>
              <span style={{ textAlign: "right", color: f.pctRentabilidadConsumida > 15 ? "#ff6568" : "#00c758", fontWeight: 700 }}>
                {f.pctRentabilidadConsumida == null ? "—" : `${f.pctRentabilidadConsumida.toFixed(1)}%`}
              </span>
            </div>
          ))}
          <div style={{ padding: "8px 12px", fontSize: 12.5, color: "#7d8faa", fontFamily: "var(--font-mono)", background: "#0a101f" }}>
            rent. 12m real (Supen) · la cifra = comisión anual ÷ retorno anual del saldo.
          </div>
        </div>

        <div className="table-panel">
          <div className="panel-header">
            <div className="panel-title">Hallazgo 3 · El desvío traducido a pesos</div>
          </div>
          <div style={{ padding: "8px 12px", fontSize: 12.5, color: "#a9b7cc", lineHeight: 1.4 }}>
            En la auditoría encontramos ~4 p.p. entre la rentabilidad real que publica la Supen y la
            que se deduce de la cuota oficial. Aplicado sobre el patrimonio real del Fondo A, eso se
            convierte en dinero concreto.
          </div>
          {desvio.filas.map((f) => (
            <div
              key={f.afp}
              style={{ display: "grid", gridTemplateColumns: "1fr 90px 130px", gap: 10, padding: "6px 12px", borderBottom: "1px solid #16223a", fontFamily: "var(--font-mono)", fontSize: 12, alignItems: "center" }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 7, color: "#e4eaf4", fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: colorDe(f.afp), display: "inline-block" }} />
                {f.afp}
              </span>
              <span style={{ textAlign: "right", color: f.desvio != null && Math.abs(f.desvio) > 2 ? "#fbbf24" : "#62748e" }}>
                {f.desvio == null ? "—" : `${f.desvio.toFixed(1)}pp`}
              </span>
              <span style={{ textAlign: "right", color: "#fff", fontWeight: 700 }}>
                {f.desvioPatrimonio ? fmtM(f.desvioPatrimonio) : "—"}
              </span>
            </div>
          ))}
          <div style={{ padding: "8px 12px", fontSize: 12.5, color: "#7d8faa", fontFamily: "var(--font-mono)", background: "#0a101f" }}>
            desvío (p.p.) aplicado sobre el patrimonio del fondo × AFP.
          </div>
        </div>
      </div>

      {/* Hallazgo 4: Concentración */}
      <div className="table-panel">
        <div className="panel-header">
          <div className="panel-title">Hallazgo 4 · Quién controla tu ahorro</div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "34px 1fr 1fr 90px 110px 110px",
            gap: 10,
            padding: "8px 12px",
            background: "#0f172b",
            borderBottom: "1px solid #1d293d",
            color: "#45556c",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: 0.7,
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>#</span>
          <span>AFP</span>
          <span style={{ textAlign: "right" }}>Peso</span>
          <span style={{ textAlign: "right" }}>% Patrimonio</span>
          <span style={{ textAlign: "right" }}>% Afiliados</span>
          <span style={{ textAlign: "right" }}>Afiliados</span>
        </div>
        {conc.filas.map((f) => {
          const lead = f.pos === 1;
          return (
            <div
              key={f.afp}
              style={{
                display: "grid",
                gridTemplateColumns: "34px 1fr 1fr 90px 110px 110px",
                gap: 10,
                padding: "6px 12px",
                borderBottom: "1px solid #16223a",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                alignItems: "center",
                background: lead ? "rgba(250,200,0,0.06)" : "transparent",
              }}
            >
              <span style={{ color: lead ? "#fac800" : "#45556c", fontWeight: 700 }}>{String(f.pos).padStart(2, "0")}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 7, color: "#e4eaf4", fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: colorDe(f.afp), display: "inline-block" }} />
                {f.afp}
              </span>
              <span style={{ textAlign: "right" }}>
                <div style={{ height: 6, background: "#0f172b", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${f.pctPatrimonio}%`, height: "100%", background: lead ? "#fac800" : "#54a2ff" }} />
                </div>
              </span>
              <span style={{ textAlign: "right", color: "#fff", fontWeight: 700 }}>{f.pctPatrimonio.toFixed(1)}%</span>
              <span style={{ textAlign: "right", color: "#b9c4d4" }}>{f.pctAfiliados?.toFixed(1)}%</span>
              <span style={{ textAlign: "right", color: "#b9c4d4" }}>{f.afiliados ? `${(f.afiliados / 1e6).toFixed(1)} M` : "—"}</span>
            </div>
          );
        })}
        <div style={{ padding: "8px 12px", fontSize: 13, color: "#9fb0c9", fontFamily: "var(--font-mono)", background: "#0a101f" }}>
          El Top 3 (Habitat, Provida, Capital) administra el {conc.top3Patrimonio.toFixed(1)}% de todo el ahorro del sistema. Masas
          de dinero concentradas en pocas manos privadas.
        </div>
      </div>

      {/* Hallazgo 5: el segundo acto del robo */}
      <div
        className="table-panel"
        style={{ border: "1px solid #5b1b24" }}
      >
        <div className="panel-header">
          <div className="panel-title">Hallazgo 5 · Las aseguradoras: el segundo acto del robo</div>
        </div>

        {/* Confesión de grupo */}
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span className="badge warn">Confesión</span>
            <span style={{ fontSize: 11, color: "#ff6568", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              Está escrito en la memoria anual de la propia Confuturo
            </span>
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 17, color: "#fff", fontWeight: 800, lineHeight: 1.35 }}>
            Confuturo (líder en Rentas Vitalicias) y AFP Habitat son del{" "}
            <span style={{ color: "#fb2c36" }}>mismo grupo</span>: Inversiones La Construcción (ILC, de la
            Cámara Chilena de la Construcción).
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: "#c9d3e2", lineHeight: 1.6, maxWidth: 980 }}>
            Pagas tu AFP (<strong>Habitat</strong>) toda tu vida laboral — y cuando jubilas, si eliges renta
            vitalicia, tu saldo <strong>deja de ser tuyo, irrevocablemente</strong>, y pasa a{" "}
            <strong>Confuturo</strong> para que te lo devuelva de a cuotas. Es el mismo bolsillo entrando dos
            veces: primero por la comisión, después por tu capital. La Biblioteca del Congreso Nacional (2020)
            documenta además que <strong>Cuprum opera con Principal</strong> y{" "}
            <strong>Planvital con BiceVida</strong>; BCI Vida mantiene acuerdos con Capital, Cuprum, Habitat y
            Provida. Y las primas del SIS (1,62% → 2,00% en 2026) se licitan… en conjunto, por las AFP.
          </p>
        </div>

        {/* KPIs del segundo acto */}
        <div className="kpi-grid" style={{ padding: "12px 16px 0" }}>
          <div className="kpi">
            <div className="kpi-label">Cotización SIS vigente</div>
            <div className="kpi-value" style={{ color: "#fb2c36" }}>{aseg.sis.tasaVigente.toFixed(2)}%</div>
            <div className="kpi-sub">era 1,62% (abr-2026) · pagada de por vida</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Primas SIS por año</div>
            <div className="kpi-value" style={{ color: "#fac800" }}>US$ {aseg.sis.flujoAnualUSD.toLocaleString("es-CL")} M</div>
            <div className="kpi-sub">el contrato colectivo más grande de Chile</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Tasa media renta vitalicia</div>
            <div className="kpi-value" style={{ color: "#fe6e00" }}>{aseg.tasaRv.media.toFixed(2)}%</div>
            <div className="kpi-sub">{aseg.tasaRv.periodo} · vejez {(aseg.tasaRv.vejez).toFixed(2)}%</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Lo que cede la aseguradora</div>
            <div className="kpi-value" style={{ color: "#00c758" }}>
              {aseg.brechaTasa.toFixed(1)} p.p.
            </div>
            <div className="kpi-sub">vs {aseg.retornoRealSistema}% real del sistema</div>
          </div>
        </div>

        <div style={{ padding: "8px 16px", fontSize: 13, color: "#9fb0c9", fontFamily: "var(--font-mono)", background: "#0a101f" }}>
          SIS: tasa de cargo del empleador sobre la renta imponible (Supen) · {aseg.sis.cubre} · el flujo
          anual no capitaliza jamás en tu cuenta. Tasa RV: promedio de lo contratado en el mes, todo el
          mercado (Supen/CMF).
        </div>

        {/* Tabla de grupos */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1.6fr 1.4fr 1.2fr 1.3fr",
            gap: 10,
            padding: "8px 16px 8px 16px",
            background: "#0f172b",
            borderBottom: "1px solid #1d293d",
            color: "#45556c",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: 0.7,
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>Aseguradora</span>
          <span>Grupo controlador</span>
          <span>AFP vinculada</span>
          <span>Tipo de vínculo</span>
          <span style={{ textAlign: "right" }}>Nota</span>
        </div>
        {aseg.grupos.map((g) => {
          const esConfuturo = g.aseguradora === "Confuturo";
          return (
            <div
              key={g.aseguradora}
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 1.6fr 1.4fr 1.2fr 1.3fr",
                gap: 10,
                padding: "6px 16px",
                borderBottom: "1px solid #16223a",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                alignItems: "center",
                background: esConfuturo ? "rgba(251,44,54,0.07)" : "transparent",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 7, color: "#e4eaf4", fontWeight: 700 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: esConfuturo ? "#fb2c36" : "#54a2ff",
                    display: "inline-block",
                  }}
                />
                {g.aseguradora}
                {esConfuturo && (
                  <span style={{ color: "#fb2c36", fontSize: 9, letterSpacing: 0.5, border: "1px solid #5b1b24", borderRadius: 3, padding: "0 4px" }}>
                    ROBO EN 2 ACTOS
                  </span>
                )}
              </span>
              <span style={{ color: esConfuturo ? "#ffb9bc" : "#b9c4d4" }}>{g.grupo}</span>
              <span style={{ color: esConfuturo ? "#fac800" : "#c9d3e2", fontWeight: 600 }}>{g.afpVinculada}</span>
              <span style={{ color: "#62748e" }}>{g.relacion}</span>
              <span style={{ textAlign: "right", color: "#45556c" }}>{g.nota}</span>
            </div>
          );
        })}
        <div style={estilosNota16}>
          Fuentes: Memoria Confuturo 2025 (128.721 RV/mes, 15,9% del mercado) · CMF prospecto ILC · clasificaciones
          2026 (Fitch, Feller, Moody's Local: MetLife AAA; Confuturo/Zürich/Principal/Penta/Consorcio AA+) · Biblioteca
          del Congreso (2020) · Rankia (2026). La renta vitalicia, una vez contratada, es irrevocable: el afiliado
          pierde la propiedad de sus fondos.
        </div>
      </div>

      {/* Hallazgo 6: la confesión oficial */}
      <div className="table-panel" style={{ border: "1px solid #3a2f0a" }}>
        <div className="panel-header">
          <div className="panel-title">Hallazgo 6 · La confesión de la propia Superintendencia</div>
        </div>
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span className="badge warn">Dato oficial</span>
            <span style={{ fontSize: 11, color: "#ff6568", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              Lo admite el organismo que fiscaliza a las AFP
            </span>
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 17, color: "#fff", fontWeight: 800, lineHeight: 1.35 }}>
            Tu cotización te devuelve, sin ayuda del Estado, el{" "}
            <span style={{ color: "#fac800" }}>16% de tu sueldo</span> — y si eres mujer,{" "}
            <span style={{ color: "#fb2c36" }}>11%</span>.
          </h3>
          <p style={{ margin: 0, fontSize: 13.5, color: "#c9d3e2", lineHeight: 1.65, maxWidth: 1000 }}>
            La <strong>mediana</strong> de la <strong>tasa de reemplazo autofinanciada</strong> de quienes se
            pensionaron entre 2015 y 2023 es <strong>16%</strong> del último sueldo (Supen). El "promedio" que
            repite la industria disimula: las pocas pensiones altas lo inflan. Sumando la PGU se llega a 63% —
            o sea, la mitad de tu pensión "autofinanciada" la paga el Estado. Para quienes se jubilen en 2025 la
            proyección sube a 50,9%. La pensión promedio de vejez que entrega hoy el sistema:{" "}
            <strong>≈US$465 al mes</strong>.
          </p>
        </div>

        <div className="kpi-grid" style={{ padding: "12px 16px 0" }}>
          <div className="kpi">
            <div className="kpi-label">Reemplazo autofinanciado</div>
            <div className="kpi-value" style={{ color: "#fac800" }}>{reemplazo.pensionados2015_2023.total}%</div>
            <div className="kpi-sub">mediana · pensionados 2015-2023 (Supen)</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Mujeres</div>
            <div className="kpi-value" style={{ color: "#fb2c36" }}>{reemplazo.pensionados2015_2023.mujeres}%</div>
            <div className="kpi-sub">hombres {reemplazo.pensionados2015_2023.hombres}% · brecha de género</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Sumando PGU del Estado</div>
            <div className="kpi-value" style={{ color: "#00c758" }}>{reemplazo.conPGU.total}%</div>
            <div className="kpi-sub">la otra mitad la paga el fisco</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Pensión promedio de vejez</div>
            <div className="kpi-value" style={{ color: "#fff" }}>≈US$ {reemplazo.pensionPromedioVejezUSD}</div>
            <div className="kpi-sub">por mes · todo el sistema (Supen)</div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 110px 110px 130px",
            gap: 10,
            padding: "8px 16px",
            background: "#0f172b",
            borderBottom: "1px solid #1d293d",
            color: "#7d8faa",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: 0.7,
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>Grupo</span>
          <span style={{ textAlign: "right" }}>Autofinanciada</span>
          <span style={{ textAlign: "right" }}>+ PGU</span>
          <span style={{ textAlign: "right" }}>Futuros 2025</span>
        </div>
        {[
          { grupo: "Mujeres", auto: reemplazo.pensionados2015_2023.mujeres, pgu: reemplazo.conPGU.mujeres, futuro: null },
          { grupo: "Hombres", auto: reemplazo.pensionados2015_2023.hombres, pgu: reemplazo.conPGU.hombres, futuro: null },
          { grupo: "Total", auto: reemplazo.pensionados2015_2023.total, pgu: reemplazo.conPGU.total, futuro: reemplazo.futuros2025.total },
        ].map((f) => (
          <div
            key={f.grupo}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 110px 110px 130px",
              gap: 10,
              padding: "7px 16px",
              borderBottom: "1px solid #16223a",
              fontFamily: "var(--font-mono)",
              fontSize: 12.5,
              alignItems: "center",
              background: f.grupo === "Total" ? "rgba(250,200,0,0.05)" : "transparent",
            }}
          >
            <span style={{ color: "#e4eaf4", fontWeight: 700 }}>{f.grupo}</span>
            <span style={{ textAlign: "right", color: f.grupo === "Mujeres" ? "#fb2c36" : "#fbbf24", fontWeight: 700 }}>
              {f.auto}%
            </span>
            <span style={{ textAlign: "right", color: "#00c758" }}>{f.pgu}%</span>
            <span style={{ textAlign: "right", color: f.futuro == null ? "#45556c" : "#b9c4d4" }}>
              {f.futuro == null ? "—" : `${f.futuro.toFixed(1)}%`}
            </span>
          </div>
        ))}

        <div style={estilosNota}>
          Para entender este 16%: los retiros (2020-2022) sacaron <strong>US$50.000 millones</strong> — 25% de
          los fondos a jun-2020 y 18% del PIB (Supen DT-67). <strong>{RETIROS_DATOS.personasSinSaldoMillones} millones</strong> de
          afiliados quedaron con saldo $0, y la Supen estima que las pensiones futuras serán hasta{" "}
          <strong>{RETIROS_DATOS.pensionesMenoresMujeresPct}%</strong> menores para mujeres y{" "}
          <strong>{RETIROS_DATOS.pensionesMenoresHombresPct}%</strong> para hombres.
        </div>

        <div style={estilosNota}>
          <strong>El matiz legal de los retiros (para no caerte en el titular):</strong> los retiros no fueron ilegales —
          se dictaron por leyes especiales (<strong>Leyes 21.248, 21.295 y 21.330</strong>, 2020-2021) validadas por el
          Tribunal Constitucional (el 1º, STC Rol 9541-2020). El costo jurídico fue otro: perforaron el principio de{" "}
          <strong>intangibilidad de los fondos</strong> (DL 3.500, arts. 19-20, que los declaran "intangibles e
          inembargables") y dejaron el precedente que los proyectos de 4º, 5º y 6º retiro intentaron repetir sin éxito.
          Lo que la Supen sí sancionó <em>en el proceso</em>: multó a <strong>AFP Habitat (2.000 UF)</strong> y{" "}
          <strong>AFP Modelo (3.500 UF)</strong> (oct-2020) por su actuación en la discusión legislativa y la tramitación
          del retiro. El dato que queda en pie: el Estado demostró que los fondos "intocables" sí podían tocarse por
          ley… y aun así, la tasa de reemplazo autofinanciada de quienes se pensionaron entre 2015 y 2023 quedó en el
          mismo 16%.
        </div>

        <div style={estilosNota}>
          Fuente: Superintendencia de Pensiones · presentación del Superintendente (abr-2025). Método: la
          reemplazo es la mediana (no la media) del ratio pensión ÷ último sueldo; "autofinanciada" excluye la
          PGU. Discrepancia anotada: los retiros se contabilizan como US$50.000M (Supen DT-67) y US$48.339M en
          otras mediciones oficiales (fecha/cartera). La cifra de pensión promedio (US$465) es de documento SP.
        </div>
      </div>

      {/* Hallazgo 7: el negocio ganador */}
      <div className="table-panel" style={{ border: "1px solid #2c4a2a" }}>
        <div className="panel-header">
          <div className="panel-title">Hallazgo 7 · ¿Quién gana con tu plata?</div>
        </div>
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span className="badge warn">El negocio</span>
            <span style={{ fontSize: 11, color: "#ff6568", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              Ganancias récord mientras tu pensión sigue en 16%
            </span>
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 17, color: "#fff", fontWeight: 800, lineHeight: 1.35 }}>
            Las 7 AFP ganaron <span style={{ color: "#00c758" }}>US$762 millones</span> en 2025{" "}
            <span style={{ color: "#b9c4d4" }}>(+22%)</span> — y siguen subiendo en 2026.
          </h3>
          <p style={{ margin: 0, fontSize: 13.5, color: "#c9d3e2", lineHeight: 1.65, maxWidth: 1000 }}>
            Mientras los fondos rentaban 8-15% real (2025), tus comisiones crecieron, y la AFP ganó adicionalmente
            por su <strong>encaje</strong>: el ~1% del fondo que mantiene como capital propio, invertido en los{" "}
            <strong>mismos multifondos</strong>. Cuando sube la bolsa, la administradora cobra comisión Y gana por
            el encaje. Doble beneficio con tu dinero. Y el mismo año, tu reemplazo autofinanciado sigue siendo 16%.
          </p>
        </div>

        <div className="kpi-grid" style={{ padding: "12px 16px 0" }}>
          <div className="kpi">
            <div className="kpi-label">Utilidades AFP 2025</div>
            <div className="kpi-value" style={{ color: "#00c758" }}>US$ {negocio.utilidades2025.usd.toLocaleString("es-CL")} M</div>
            <div className="kpi-sub">+{negocio.utilidades2025.yoyPct}% vs 2024 · "récord"</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Primer semestre 2026</div>
            <div className="kpi-value" style={{ color: "#00c758" }}>US$ {negocio.utilidades1S2026.usd.toLocaleString("es-CL")} M</div>
            <div className="kpi-sub">+{negocio.utilidades1S2026.yoyPct}% a/a · sin freno</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Comisión directa (OCDE)</div>
            <div className="kpi-value" style={{ color: "#fb2c36" }}>{negocio.oecd.puestoPanelOCDE}</div>
            <div className="kpi-sub">{negocio.oecd.comisionDirectaPctActivos}% de activos por cotizaciones</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Adm. tu plata en total</div>
            <div className="kpi-value" style={{ color: "#fac800" }}>US$ {negocio.patrimonio.usd.toLocaleString("es-CL")} M</div>
            <div className="kpi-sub">{negocio.patrimonio.pctPIB}% del PIB · {negocio.patrimonio.corte}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, minWidth: 0 }}>
          <div>
            <div className="panel-header" style={{ borderBottom: "1px solid #1d293d" }}>
              <div className="panel-title">Utilidades por AFP · 2025</div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 90px 80px",
                gap: 10,
                padding: "7px 12px",
                background: "#0f172b",
                color: "#7d8faa",
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: 0.7,
                fontFamily: "var(--font-mono)",
              }}
            >
              <span>AFP</span>
              <span style={{ textAlign: "right" }}>US$ M</span>
              <span style={{ textAlign: "right" }}>+% a/a</span>
            </div>
            {negocio.porAfp.map((f, i) => (
              <div
                key={f.afp}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 90px 80px",
                  gap: 10,
                  padding: "6px 12px",
                  borderBottom: "1px solid #16223a",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12.5,
                  alignItems: "center",
                  background: i === 0 ? "rgba(0,199,88,0.05)" : "transparent",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 7, color: "#e4eaf4", fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: colorDe(f.afp), display: "inline-block" }} />
                  {f.afp}
                </span>
                <span style={{ textAlign: "right", color: "#fff", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  {f.usd.toLocaleString("es-CL")}
                </span>
                <span style={{ textAlign: "right", color: "#00c758" }}>+{f.yoyPct.toFixed(1)}%</span>
              </div>
            ))}
          </div>

          <div>
            <div className="panel-header" style={{ borderBottom: "1px solid #1d293d" }}>
              <div className="panel-title">Tus fondos rentaron 2025</div>
            </div>
            <div style={{ padding: "7px 12px 2px", fontSize: 12.5, color: "#a9b7cc", lineHeight: 1.4 }}>
              Rentabilidad <strong>real</strong> anual de cada multifondo (La Tercera) — mientras la utilidad de
              las AFP crecía más que tus pensiones.
            </div>
            {negocio.rentabilidadFondos2025.map((f) => (
              <div
                key={f.fondo}
                style={{
                  display: "grid",
                  gridTemplateColumns: "70px 1fr 70px",
                  gap: 10,
                  padding: "5px 12px",
                  borderBottom: "1px solid #16223a",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12.5,
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#b9c4d4", fontWeight: 700 }}>Fondo {f.fondo}</span>
                <span style={{ height: 5, background: "#0f172b", borderRadius: 3, overflow: "hidden" }}>
                  <span
                    style={{
                      width: `${Math.min(100, (f.real / 15) * 100)}%`,
                      height: "100%",
                      display: "block",
                      background: f.fondo === "A" ? "#fb2c36" : f.fondo === "C" ? "#fac800" : "#54a2ff",
                    }}
                  />
                </span>
                <span style={{ textAlign: "right", color: f.real >= 10 ? "#00c758" : "#b9c4d4", fontWeight: 700 }}>
                  +{f.real.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dónde va tu plata */}
        <div className="panel-header" style={{ borderTop: "1px solid #1d293d", borderBottom: "1px solid #1d293d" }}>
          <div className="panel-title">Y tu plata, ¿a quién financia?</div>
        </div>
        <div style={{ padding: "8px 12px", fontSize: 12.5, color: "#c9d3e2", lineHeight: 1.6 }}>
          Del patrimonio administrado (US$ {negocio.patrimonio.usd.toLocaleString("es-CL")}M),{" "}
          <strong>US$ {negocio.inversionChile.usd.toLocaleString("es-CL")}M ({negocio.inversionChile.pctTotal}%)</strong>{" "}
          se invierte en Chile y <strong>≈US$ {negocio.inversionPrivada.usd.toLocaleString("es-CL")}M</strong> está
          puesto en bancos y grandes empresas privadas — entre los mayores destinos: {negocio.inversionPrivada.destino}.
        </div>
        <div style={estilosNota}>
          <strong>Auto-crítica metodológica (para no caerte en el titular):</strong> "Chile tiene las comisiones más
          caras del mundo" es falso. En costo <em>total</em> sobre activos, Chile quedó en 0,898% vs 0,746% de la
          OCDE (2022, OECD Pensions at a Glance). Lo realmente caro es la comisión <em>directa</em> sobre
          cotizaciones ({negocio.oecd.comisionDirectaPctActivos}% de activos, {negocio.oecd.puestoPanelOCDE}) y que la AFP
          gana dos veces por el encaje cuando los mercados suben. {negocio.oecd.fuente}.
        </div>
        <div style={estilosNota}>
          Fuentes: utilidades 2025 y 1S-2026 = EEFF de las 7 AFP reportados por La Tercera y Diario de Santiago
          (coinciden entre sí; el DF reporta US$572M a sep-2025, coherente). Desglose por AFP y rentabilidad de
          fondos 2025 = cadena La Tercera → prensa (marcado: no es dato directo de la Supen). Inversión por
          destino: Supen informe de inversión de fondos (3T-2024) reagrupado por prensa, con años previos en otras
          cifras. Cifras en CLP convertidas a US$ por las propias fuentes.
        </div>
      </div>

      {/* Hallazgo 8: la comisión fantasma */}
      <div className="table-panel" style={{ border: "1px solid #3a2f0a" }}>
        <div className="panel-header">
          <div className="panel-title">Hallazgo 8 · La comisión fantasma que se come tu rentabilidad</div>
        </div>
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span className="badge warn">Dato oficial</span>
            <span style={{ fontSize: 11, color: "#ff6568", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              No aparece en tu cartola, pero sale de tu fondo
            </span>
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 17, color: "#fff", fontWeight: 800, lineHeight: 1.35 }}>
            Además de la comisión de la AFP, tu fondo paga{" "}
            <span style={{ color: "#fb2c36" }}>US$175 millones cada trimestre</span> a{" "}
            <span style={{ color: "#fac800" }}>gestores externos</span>.
          </h3>
          <p style={{ margin: 0, fontSize: 13.5, color: "#c9d3e2", lineHeight: 1.65, maxWidth: 1000 }}>
            Cuando el fondo invierte en <strong>fondos mutuos, fondos de inversión o índices</strong>, esos vehículos
            descuentan su comisión <strong>directamente del patrimonio</strong> — antes de que se calcule tu
            rentabilidad. Es una <strong>comisión indirecta "fantasma"</strong>: la asume el propio Fondo de
            Pensiones y nadie te la muestra en tu cartola. En el cuarto trimestre de 2025 sumaron{" "}
            <strong>US$175,26 millones = 0,29% anualizado de los activos</strong>. Y{" "}
            <strong>{fantasma.q4_2025.inversionExtranjeraPct}%</strong> de esas comisiones van por invertir en el{" "}
            <strong>exterior</strong> (BlackRock, Vanguard, etc.): tu ahorro obligatorio financiando la industria
            financiera global.
          </p>
        </div>

        <div className="kpi-grid" style={{ padding: "12px 16px 0" }}>
          <div className="kpi">
            <div className="kpi-label">Comisiones fantasma Q4-2025</div>
            <div className="kpi-value" style={{ color: "#fb2c36" }}>US$ {fantasma.q4_2025.totalTrimestralUSD}</div>
            <div className="kpi-sub">millones de US$ en un solo trimestre</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">% de los activos</div>
            <div className="kpi-value" style={{ color: "#fac800" }}>{fantasma.q4_2025.pctActivosAnualizado}%</div>
            <div className="kpi-sub">anualizado de todo el patrimonio</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Por cada $1.000.000 de saldo</div>
            <div className="kpi-value" style={{ color: "#fe6e00" }}>$ {fantasma.q4_2025.costoMensualPorMillon}</div>
            <div className="kpi-sub">pagas de más, al mes, sin enterarte</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Se va al extranjero</div>
            <div className="kpi-value" style={{ color: "#00c758" }}>{fantasma.q4_2025.inversionExtranjeraPct}%</div>
            <div className="kpi-sub">de la inversión fuera de Chile</div>
          </div>
        </div>

        {/* Costo total directo + indirecto */}
        <div className="panel-header" style={{ borderTop: "1px solid #1d293d", borderBottom: "1px solid #1d293d" }}>
          <div className="panel-title">El costo real de todo el sistema: directa + fantasma</div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr 90px 90px 90px",
            gap: 10,
            padding: "8px 16px",
            background: "#0f172b",
            borderBottom: "1px solid #1d293d",
            color: "#7d8faa",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: 0.7,
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>Año</span>
          <span>Peso</span>
          <span style={{ textAlign: "right" }}>Directa</span>
          <span style={{ textAlign: "right" }}>Fantasma</span>
          <span style={{ textAlign: "right" }}>Total</span>
        </div>
        {fantasma.evolucion
          .filter((d) => d.indirecta != null)
          .map((d) => (
            <div
              key={d.anio}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 90px 90px 90px",
                gap: 10,
                padding: "6px 16px",
                borderBottom: "1px solid #16223a",
                fontFamily: "var(--font-mono)",
                fontSize: 12.5,
                alignItems: "center",
              }}
            >
              <span style={{ color: "#b9c4d4", fontWeight: 700 }}>{d.anio}</span>
              <span style={{ height: 5, background: "#0f172b", borderRadius: 3, overflow: "hidden" }}>
                <span
                  style={{
                    width: `${Math.min(100, (d.total / 1) * 100)}%`,
                    height: "100%",
                    display: "block",
                    background: d.anio >= 2022 ? "#fb2c36" : "#fac800",
                  }}
                />
              </span>
              <span style={{ textAlign: "right", color: d.directa > 0.55 ? "#fb2c36" : "#b9c4d4" }}>
                {d.directa.toFixed(2)}%
              </span>
              <span style={{ textAlign: "right", color: "#fe6e00" }}>{d.indirecta.toFixed(2)}%</span>
              <span style={{ textAlign: "right", color: d.total > 0.85 ? "#fb2c36" : "#fff", fontWeight: 700 }}>
                {d.total.toFixed(2)}%
              </span>
            </div>
          ))}

        <div style={estilosNota}>
          La comisión <strong>directa</strong> subió de 0,47% (2019) a 0,60% (2023) de los activos — un{" "}
          <strong>{fantasma.oecd2022.costoAumentoPctRetiros}% de aumento</strong> provocado por los retiros de
          2020-2022, que achicaron la base de activos sobre la que se mide el costo. La <strong>fantasma</strong> pasó
          de 0,26% a 0,30%. Sumando ambas, el sistema pasó de 0,73% (≈ promedio OCDE 0,76% en 2019) a{" "}
          <strong>{fantasma.oecd2022.chileTotal.toFixed(3)}% vs {fantasma.oecd2022.oecdPromedio.toFixed(3)}% de la OCDE</strong> en
          2022: ya no es "competitivo", quedó <strong>por sobre la media</strong> justo cuando tu pensión se hundía.
        </div>
        <div style={estilosNota}>
          <strong>Filtro crítico (no creas todo lo que lees):</strong> esto no significa que Chile sea "el sistema más
          caro del mundo". En costo <em>total</em> quedó apenas sobre el promedio OCDE. El detalle que importa: la
          comisión <em>directa</em> sobre cotizaciones ({fantasma.oecd2022.chileDirecta.toFixed(3)}% de activos) es la{" "}
          {fantasma.oecd2022.rankingDirecta}, pero la <em>fantasma</em> ({fantasma.oecd2022.chileIndirecta.toFixed(3)}%) está
          bajo el promedio OCDE de 0,37%. El problema chileno no es solo cuánto cobras por fuera: es que ninguna de
          las dos te la explican al afiliado. {fantasma.fuente}
        </div>
        <div style={estilosNota}>
          Fuente primaria: Supen (Q4-2025) y Observatorio Perspectivas (sep-2024) con datos de la propia Supen y OECD
          Pensions at a Glance 2023. Cifras en % de activos → comparables con OCDE.
        </div>
      </div>

      {/* Hallazgo 8-bis: El SIS sin riesgo */}
      <div className="table-panel" style={{ border: "1px solid #5b1b24" }}>
        <div className="panel-header">
          <div className="panel-title">Hallazgo 9 · El SIS: el seguro de todos que no fue seguro por 6 años</div>
        </div>
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span className="badge warn">Confesión de la industria</span>
            <span style={{ fontSize: 11, color: "#ff6568", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              Las AFP y los expertos lo admiten
            </span>
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 17, color: "#fff", fontWeight: 800, lineHeight: 1.35 }}>
            Entre 2020 y 2026 el SIS <span style={{ color: "#fb2c36" }}>no funcionó como seguro</span>: nadie
            asumía el riesgo con su patrimonio.
          </h3>
          <p style={{ margin: 0, fontSize: 13.5, color: "#c9d3e2", lineHeight: 1.65, maxWidth: 1000 }}>
            En <strong>abril de 2020</strong> la licitación del SIS (por US$1.900M anuales, el seguro colectivo más
            grande de Chile) fue <strong>declarada desierta</strong>; en mayo solo 2 compañías ofertaron el 20% de
            las fracciones. Ante el fracaso, las AFP <strong>cambiaron las bases</strong>: en vez de{" "}
            <strong>prima de riesgo</strong> (las aseguradoras tarifican y ponen su patrimonio en juego) pasaron a{" "}
            <strong>prima de administración</strong> — cobrar la siniestralidad real <em>más una comisión</em>. Así
            por <strong>{sisRiesgo.modeloAdmin.anios} años</strong> ({sisRiesgo.modeloAdmin.periodo}). El riesgo lo
            acababan asumiendo los <strong>empleadores</strong>, no las aseguradoras. Recién en{" "}
            <strong>junio de 2026</strong> las AFP reformularon las bases para <strong>volver a prima de riesgo</strong>{" "}
            en su última licitación, antes de que el SIS pase al Seguro Social (ago-2026).
          </p>
        </div>

        <div className="kpi-grid" style={{ padding: "12px 16px 0" }}>
          <div className="kpi">
            <div className="kpi-label">Años sin riesgo real</div>
            <div className="kpi-value" style={{ color: "#fb2c36" }}>{sisRiesgo.modeloAdmin.anios}</div>
            <div className="kpi-sub">2020-2026 por administración</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Primas en juego (SIS)</div>
            <div className="kpi-value" style={{ color: "#fac800" }}>US$ {sisRiesgo.licitacion2026.primaAnualUSD.toLocaleString("es-CL")} M</div>
            <div className="kpi-sub">por año · el contrato más grande del país</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Cotización SIS hoy</div>
            <div className="kpi-value" style={{ color: "#fe6e00" }}>{sisRiesgo.licitacion2026.tasaVigente}%</div>
            <div className="kpi-sub">de cargo del empleador · ha ido 1,3%→2,3%</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Afiliados cubiertos</div>
            <div className="kpi-value" style={{ color: "#00c758" }}>{sisRiesgo.licitacion2026.cobertura}</div>
            <div className="kpi-sub">≈ 6 millones de personas</div>
          </div>
        </div>

        {/* Licitación 2020 */}
        <div className="panel-header" style={{ borderTop: "1px solid #1d293d", borderBottom: "1px solid #1d293d" }}>
          <div className="panel-title">La cadena de la licitación fallida de 2020</div>
        </div>
        <div style={{ padding: "8px 16px", fontSize: 13, color: "#c9d3e2", lineHeight: 1.7 }}>
          {["intento1", "intento2", "intento3"].map((k, i) => (
            <div key={k} style={{ display: "flex", gap: 10, padding: "5px 0", borderBottom: "1px solid #16223a" }}>
              <span style={{ color: i === 2 ? "#fb2c36" : "#fac800", fontWeight: 700 }}>{i + 1}º</span>
              <span>{sisRiesgo.licitacion2020[k]}</span>
            </div>
          ))}
          <div style={{ paddingTop: 6, color: "#a9b7cc" }}>
            <strong>Causa de fondo:</strong> {sisRiesgo.licitacion2020.causa}.
          </div>
        </div>

        {/* Confesiones */}
        <div className="panel-header" style={{ borderTop: "1px solid #1d293d", borderBottom: "1px solid #1d293d" }}>
          <div className="panel-title">Quién admite que esto era irregular</div>
        </div>
        {sisRiesgo.declaraciones.map((d) => (
          <div key={d.autor} style={{ padding: "10px 16px", borderBottom: "1px solid #16223a" }}>
            <div style={{ fontSize: 13, color: "#e4eaf4", fontStyle: "italic", lineHeight: 1.55 }}>“{d.cita}”</div>
            <div style={{ marginTop: 6, fontSize: 11.5, color: "#9fb0c9", fontFamily: "var(--font-mono)" }}>
              — {d.autor} · {d.cargo} · {d.fecha} · {d.fuente}
            </div>
          </div>
        ))}

        <div style={estilosNota}>
          El modelo por administración se definió así: las aseguradoras <strong>cobran lo que cuesta el SIS según la
          siniestralidad + una comisión por administrarlo</strong>. Es decir, {sisRiesgo.modeloAdmin.definicion}. El
          riesgo en última instancia lo asumían los empleadores (Marshall, FAPP).
        </div>

        {/* Traspaso al FAPP ya consumado */}
        <div className="panel-header" style={{ borderTop: "1px solid #1d293d", borderBottom: "1px solid #1d293d" }}>
          <div className="panel-title">Eso ya cambió: el SIS se traspasó al sector público (ago-2026)</div>
        </div>
        <div style={{ padding: "10px 16px", fontSize: 13, color: "#c9d3e2", lineHeight: 1.7 }}>
          Con la <strong>Ley 21.735</strong> (reforma de pensiones), desde las remuneraciones de{" "}
          <strong>{sisRiesgo.traspasoFapp.fecha}</strong> la cotización del SIS sube a{" "}
          <strong>{sisRiesgo.traspasoFapp.cotizacionEmpleador}%</strong> de la renta imponible y la recauda{" "}
          <strong>{sisRiesgo.traspasoFapp.quienRecauda}</strong>, para financiamiento del{" "}
          <strong>{sisRiesgo.traspasoFapp.quienFinancia}</strong>.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 16px 6px" }}>
          <div style={{ padding: "8px 12px", background: "#0a101f", borderRadius: 6, fontSize: 12.5, color: "#a9b7cc", lineHeight: 1.5 }}>
            <strong style={{ color: "#00c758" }}>Quién financia:</strong> FAPP (sector público) asume el riesgo
            financiero de la siniestralidad. La cotización del 2,5% además financia la Compensación por Expectativa
            de Vida (CEV) de las mujeres.
          </div>
          <div style={{ padding: "8px 12px", background: "#0a101f", borderRadius: 6, fontSize: 12.5, color: "#a9b7cc", lineHeight: 1.5 }}>
            <strong style={{ color: "#fb2c36" }}>Quién administra:</strong> las AFP mantienen la gestión operativa del
            SIS (cobertura, cálculo y pago de beneficios, comisiones médicas junto al IPS). Quien paga no es quien
            autoriza.
          </div>
        </div>
        <div style={estilosNota}>
          <strong>El nudo que queda sin resolver (Horizontal, dic-2025):</strong> al separar a quien{" "}
          <strong>financia</strong> (FAPP) de quien <strong>administra/autoriza</strong> (AFP), se diluyen los
          incentivos para contener gastos — el mismo problema de Fonasa con las licencias médicas. Además, la
          Dirección de Presupuestos supuso una prima SIS de 1,5% cuando va en ~1,88%; bastaría un aumento permanente
          de 0,2 p.p. para reducir a la mitad los fondos del FAPP hacia fin de siglo. Fuente del traspaso: Hacienda ·
          Supen (articles-17028, w3-propertyvalue-10906) · IPS.
        </div>
        <div style={estilosNota}>
          Fuente de la saga SIS 2020-2026: La Tercera (Mariana Marusic, 3 jun-2026 y 11 jun-2026, "AFP preparan su
          última licitación del SIS…"), Checkprofesional y Pension Policy International. Es dato de prensa de alta
          calidad y cruzado; el traspaso al FAPP está corroborado por fuentes oficiales (Hacienda, Supen, IPS).
        </div>
      </div>

      {/* Hallazgo 10: la reforma (Ley 21.735) y sus cabos sueltos */}
      <div className="table-panel" style={{ border: "1px solid #3a2f0a" }}>
        <div className="panel-header">
          <div className="panel-title">Hallazgo 10 · La reforma actual (Ley 21.735) y sus 4 cabos sueltos</div>
        </div>
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span className="badge warn">En plena implementación</span>
            <span style={{ fontSize: 11, color: "#ff6568", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              Prometió "proteger tu plata" — cruza las letras chicas
            </span>
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 17, color: "#fff", fontWeight: 800, lineHeight: 1.35 }}>
            La reforma sube la cotización del empleador a{" "}
            <span style={{ color: "#00c758" }}>8,5%</span>, pero esconde{" "}
            <span style={{ color: "#fb2c36" }}>un préstamo, un reparto y un tope que no toca lo caro</span>.
          </h3>
          <p style={{ margin: 0, fontSize: 13.5, color: "#c9d3e2", lineHeight: 1.65, maxWidth: 1000 }}>
            La <strong>Ley 21.735</strong> ({reforma.ley.publicacion}) es la mayor reforma previsional desde 1981:
            reintroduce la cotización del empleador, sube la PGU a $250.000 y traspasa el SIS al sector público. Pero
            tras cruzarla con fuentes primarias aparecen <strong>4 cabos sueltos</strong> que el discurso oficial no
            cuenta:
          </p>
        </div>

        {/* Cabo 1: CRP préstamo */}
        <div className="panel-header" style={{ borderTop: "1px solid #1d293d" }}>
          <div className="panel-title">Cabo 1 · La "rentabilidad protegida" es un préstamo, no un aporte</div>
        </div>
        <div style={{ padding: "10px 16px", fontSize: 13, color: "#c9d3e2", lineHeight: 1.7 }}>
          La <strong>CRP</strong> (la Cotización con Rentabilidad Protegida, desde {reforma.crp.inicio}) con cargo al
          empleador se vende como protección; pero en la
          letra de la ley es un <strong>préstamo con garantía estatal</strong>: {reforma.crp.definicion}. El FAPP recauda
          (reconociéndolo con un Bono de Seguridad) y se fija en <strong>1,5%</strong> hasta jul-2046; desde{" "}
          <strong>ago-2046 baja 0,15% anual hasta 0% en 2055</strong>, traspasando lo que cae a tu cuenta individual.
          Es decir: el Estado te "garantiza la rentabilidad" de un monto que el empleador puso, pero parte de ese
          aporte <strong>se desvanece en lugar de capitalizar en tu cuenta</strong>.
        </div>

        {/* Cabo 2: Fondos Generacionales */}
        <div className="panel-header" style={{ borderTop: "1px solid #1d293d" }}>
          <div className="panel-title">Cabo 2 · Adiós a los multifondos: los Fondos Generacionales</div>
        </div>
        <div style={{ padding: "10px 16px", fontSize: 13, color: "#c9d3e2", lineHeight: 1.7 }}>
          Desde <strong>{reforma.fondosGeneracionales.inicio}</strong> (transición), los multifondos se reemplazan por{" "}
          <strong>Fondos Generacionales</strong>: {reforma.fondosGeneracionales.nota}. Pierdes la (ya limitada)
          capacidad de decidir cuánto riesgo tomas con tu propio ahorro: el perfil queda{" "}
          <strong>automatizado por fecha de nacimiento</strong>, no por tu decisión.
        </div>

        {/* Cabo 3: SIS pagador vs autorizante */}
        <div className="panel-header" style={{ borderTop: "1px solid #1d293d" }}>
          <div className="panel-title">Cabo 3 · El SIS: quien paga no es quien autoriza</div>
        </div>
        <div style={{ padding: "10px 16px", fontSize: 13, color: "#c9d3e2", lineHeight: 1.7 }}>
          {reforma.sisIncentivos.problema}. {reforma.sisIncentivos.analogia}. Y el dato más crudo:{" "}
          <strong>{reforma.sisIncentivos.datoFiscal}</strong>.
        </div>

        {/* Cabo 4: comisiones */}
        <div className="panel-header" style={{ borderTop: "1px solid #1d293d" }}>
          <div className="panel-title">Cabo 4 · Topan la comisión fantasma, no la que más recauda</div>
        </div>
        <div style={{ padding: "10px 16px", fontSize: 13, color: "#c9d3e2", lineHeight: 1.7 }}>
          La reforma pone un <strong>tope global a las comisiones indirectas (fantasma)</strong> ({reforma.comisiones.tope}).
          Pero {reforma.comisiones.critica}. Y con la ampliación a activos alternativos (donde el tope llega a 2,35%),
          el espacio para comisiones ocultas <strong>crece</strong>.
        </div>

        {/* KPIs */}
        <div className="kpi-grid" style={{ padding: "12px 16px 0" }}>
          <div className="kpi">
            <div className="kpi-label">Cotización empleador total</div>
            <div className="kpi-value" style={{ color: "#00c758" }}>{reforma.cotizacionEmpleador.totalFinal}%</div>
            <div className="kpi-sub">al 2033 · antes solo ~1,78% (SIS)</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Va a tu cuenta individual</div>
            <div className="kpi-value" style={{ color: "#fac800" }}>{reforma.cotizacionEmpleador.cuentaIndividual}%</div>
            <div className="kpi-sub">de los 8,5 · el resto a Seguro Social</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">PGU máxima</div>
            <div className="kpi-value" style={{ color: "#fe6e00" }}>$ {(reforma.pgu.monto2026Reajustado / 1000).toFixed(0)} mil</div>
            <div className="kpi-sub">gradual · 75+ desde sep-2026</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">CRP que "se desvanece"</div>
            <div className="kpi-value" style={{ color: "#fb2c36" }}>2046→2055</div>
            <div className="kpi-sub">baja 0,15%/año hasta 0%</div>
          </div>
        </div>

        {/* Tabla de cotización */}
        <div className="panel-header" style={{ borderTop: "1px solid #1d293d", borderBottom: "1px solid #1d293d" }}>
          <div className="panel-title">Cronograma de la nueva cotización del empleador (% de la renta imponible)</div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px 90px 90px 90px 90px",
            gap: 10,
            padding: "8px 16px",
            background: "#0f172b",
            borderBottom: "1px solid #1d293d",
            color: "#7d8faa",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: 0.7,
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>Desde</span>
          <span style={{ textAlign: "right" }}>Total</span>
          <span style={{ textAlign: "right" }}>Tu cuenta</span>
          <span style={{ textAlign: "right" }}>CRP</span>
          <span style={{ textAlign: "right" }}>SIS+CEV</span>
        </div>
        {reforma.cotizacionEmpleador.tabla.map((f) => (
          <div
            key={f.anio}
            style={{
              display: "grid",
              gridTemplateColumns: "120px 90px 90px 90px 90px",
              gap: 10,
              padding: "6px 16px",
              borderBottom: "1px solid #16223a",
              fontFamily: "var(--font-mono)",
              fontSize: 12.5,
              alignItems: "center",
              background: f.anio === "ago-2026" ? "rgba(250,200,0,0.06)" : "transparent",
            }}
          >
            <span style={{ color: f.anio === "ago-2026" ? "#fac800" : "#b9c4d4", fontWeight: 700 }}>{f.anio}</span>
            <span style={{ textAlign: "right", color: f.total > 5 ? "#fb2c36" : "#fff", fontWeight: 700 }}>{f.total.toFixed(2)}%</span>
            <span style={{ textAlign: "right", color: "#00c758" }}>{f.cuenta.toFixed(2)}%</span>
            <span style={{ textAlign: "right", color: "#fe6e00" }}>{f.crp.toFixed(2)}%</span>
            <span style={{ textAlign: "right", color: f.anio === "ago-2026" ? "#fb2c36" : "#b9c4d4" }}>
              {f.sis.toFixed(2)}%
            </span>
          </div>
        ))}

        <div style={estilosNota}>
          <strong>Filtro crítico (no te dejes llevar por el titular):</strong> la reforma <em>sí</em> aumenta la
          cotización del empleador y la PGU — un avance real. Pero no toca la comisión <em>directa</em> por cotizaciones
          (0,597% de activos, la 4ª más alta de la OCDE, del Hallazgo 7 y 8), y convierte parte del aporte en un
          préstamo con garantía estatal que se desvanece desde 2046. La edad de jubilación efectiva ya subió a 62,3
          años (mar-2026) por el incentivo del bono por años cotizados (La Tercera).
        </div>
        <div style={estilosNota}>
          Fuentes: Ley 21.735 (BCN) · Hacienda · Supen (w3-propertyvalue-10906, articles-17028) · IPS · ChileAtiende ·
          previsionsocial.gob.cl · Horizontal (Soledad Hormazábal, dic-2025) · La Tercera · páginas oficiales de AFP
          (Uno, Capital, Provida). Cruzadas: las cifras de cotización y PGU coinciden entre fuentes oficiales; la
          crítica sobre incentivos del SIS y el dato de Dipres son de Horizontal (análisis técnico, no primario).
        </div>
      </div>

      {/* Hallazgo 11: las AFP y los paraísos fiscales */}
      <div className="table-panel" style={{ border: "1px solid #5b1b24" }}>
        <div className="panel-header">
          <div className="panel-title">Hallazgo 11 · Las AFP y los paraísos fiscales</div>
        </div>
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span className="badge warn">Pandora Papers (ICIJ)</span>
            <span style={{ fontSize: 11, color: "#ff6568", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              El control de una AFP pasó por un paraíso fiscal — no la inversión de tu fondo
            </span>
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 17, color: "#fff", fontWeight: 800, lineHeight: 1.35 }}>
            Entre 2001 y 2016, AFP PlanVital estuvo controlada por{" "}
            <span style={{ color: "#fb2c36" }}>una sociedad tapón en las Islas Vírgenes Británicas</span>.
          </h3>
          <p style={{ margin: 0, fontSize: 13.5, color: "#c9d3e2", lineHeight: 1.65, maxWidth: 1000 }}>
            Los <strong>Pandora Papers</strong> (ICIJ, 2021) revelaron que <strong>Atacama Investments Ltd</strong>{" "}
            (Islas Vírgenes Británicas, creada el 23-ago-2001 por el bufete panameño Alcogal) fue la{" "}
            <strong>controladora indirecta de PlanVital</strong>: los beneficiarios finales estuvieron{" "}
            <strong>{paraisos.planVital.anosOculto} años ocultos</strong> ({paraisos.planVital.ocultoPeriodo}) y
            recién salieron a la luz en 2016, bajo presión de la Superintendencia. Los dividendos salieron por el
            offshore (un accionista operaba vía <strong>BSI Trust Corporation</strong>, en Bahamas). El SII llamó a
            este esquema{" "}
            <span style={{ color: "#fac800" }}>“agresivo de planificación tributaria que debiera observar de cerca”</span>.
          </p>
        </div>

        <div className="kpi-grid" style={{ padding: "12px 16px 0" }}>
          <div className="kpi">
            <div className="kpi-label">Años oculto el dueño</div>
            <div className="kpi-value" style={{ color: "#fb2c36" }}>{paraisos.planVital.anosOculto}</div>
            <div className="kpi-sub">{paraisos.planVital.ocultoPeriodo} · Pandora Papers</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Dividendos vía offshore</div>
            <div className="kpi-value" style={{ color: "#fac800" }}>US$ {paraisos.planVital.dividendosOffshoreUSD} M</div>
            <div className="kpi-sub">al menos · {paraisos.planVital.dividendosPeriodo}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Clientes bajo ese control</div>
            <div className="kpi-value" style={{ color: "#fe6e00" }}>{paraisos.planVital.clientesMillones.toLocaleString("es-CL")} M</div>
            <div className="kpi-sub">cartera de PlanVital en ese periodo</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Directivos con sociedades</div>
            <div className="kpi-value" style={{ color: "#00c758" }}>{paraisos.vacioLegal.directores}</div>
            <div className="kpi-sub">de AFP · CIPER (jun-2020)</div>
          </div>
        </div>

        {/* Ficha del caso PlanVital */}
        <div className="panel-header" style={{ borderTop: "1px solid #1d293d", borderBottom: "1px solid #1d293d" }}>
          <div className="panel-title">La ficha del caso PlanVital · Atacama Investments</div>
        </div>
        {[
          ["Controlador offshore", paraisos.planVital.offshore],
          ["Jurisdicción", paraisos.planVital.jurisdiccion],
          ["Constituida", `${paraisos.planVital.creada} · por ${paraisos.planVital.creadaPor}`],
          ["Origen del control", paraisos.planVital.origen],
          ["Papel", paraisos.planVital.papel],
          ["Revelación de dueños", paraisos.planVital.revelados],
          ["Dividendos", `al menos US$${paraisos.planVital.dividendosOffshoreUSD}M (${paraisos.planVital.dividendosPeriodo}); accionista vía ${paraisos.planVital.accionistaBahamas}`],
          ["Respuesta del grupo", paraisos.planVital.respuestaControlador],
          ["Control hoy", paraisos.planVital.controlHoy],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "grid",
              gridTemplateColumns: "130px 1fr",
              gap: 10,
              padding: "6px 16px",
              borderBottom: "1px solid #16223a",
              fontFamily: "var(--font-mono)",
              fontSize: 12.5,
              alignItems: "start",
            }}
          >
            <span style={{ color: "#7d8faa", textTransform: "uppercase", letterSpacing: 0.4, fontSize: 10, paddingTop: 2 }}>
              {k}
            </span>
            <span style={{ color: "#c9d3e2", lineHeight: 1.5 }}>{v}</span>
          </div>
        ))}

        {/* Vacío legal */}
        <div className="panel-header" style={{ borderTop: "1px solid #1d293d", borderBottom: "1px solid #1d293d" }}>
          <div className="panel-title">El vacío legal que reconoce el propio regulador</div>
        </div>
        <div style={{ padding: "10px 16px", fontSize: 13, color: "#c9d3e2", lineHeight: 1.7 }}>
          CIPER identificó al menos <strong>{paraisos.vacioLegal.directores} directores y gerentes de AFP</strong>{" "}
          vinculados a sociedades en paraísos fiscales (<strong>{paraisos.vacioLegal.jurisdicciones}</strong>).
          Hoy {paraisos.vacioLegal.norma}. {paraisos.vacioLegal.reconocimiento}. Y{" "}
          {paraisos.vacioLegal.limite}.
        </div>

        {/* Filtro crítico: lo que NO se sostiene */}
        <div className="panel-header" style={{ borderTop: "1px solid #1d293d", borderBottom: "1px solid #1d293d" }}>
          <div className="panel-title">Filtro crítico · lo que NO puedes afirmar con esto</div>
        </div>
        <div style={{ padding: "10px 16px", fontSize: 13, color: "#c9d3e2", lineHeight: 1.7 }}>
          <strong style={{ color: "#fb2c36" }}>Nada de esto prueba una “fuga” de tu fondo a un paraíso fiscal.</strong>{" "}
          {paraisos.separacion}. El dinero de los fondos invierte ~{paraisos.inversionFondos.pctExterior}% en el
          exterior (BlackRock, Vanguard, del Hallazgo 8), pero {paraisos.inversionFondos.noAtribuible}. El dato del
          Banco Central de <strong>US$ {paraisos.inversionFondos.inversionChileTotalParaisosUSD.toLocaleString("es-CL")} M</strong>{" "}
          de inversión chilena en paraísos fiscales (2018: Panamá US$
          {paraisos.inversionFondos.panamaUSD.toLocaleString("es-CL")}M, IVB US$
          {paraisos.inversionFondos.bviUSD.toLocaleString("es-CL")}M, Caimán US$
          {paraisos.inversionFondos.caimanUSD.toLocaleString("es-CL")}M) es de{" "}
          <strong>todas las empresas y personas de Chile</strong>, no de los fondos de pensiones. {paraisos.inversionFondos.matiz}.
        </div>
        <div style={estilosNota}>
          <strong>Lo que sí queda documentado:</strong> la <em>propiedad y el control</em> de una AFP canalizados por
          un paraíso fiscal durante 15 años, con dueños que el regulador no podía ver; y un vacío en la declaración de
          intereses que la propia Supen reconoce. Esa es la denuncia verificada. {paraisos.fuente}
        </div>
        <div style={estilosNota}>
          Fuentes: Pandora Papers (ICIJ, 2021) → CIPER “Los dividendos de los accionistas de AFP PlanVital en Islas
          Vírgenes y Bahamas” (7-oct-2021) · CIPER “Los directores y gerentes de AFP con sociedades en paraísos
          fiscales que nadie fiscaliza” (29-jun-2020) · Engloba Capacitación (30-may-2026) · Banco Central de Chile
          (inversión chilena total, 2018) · Supen/BCN (patrimonio separado). Respuesta del controlador (Grupo
          Generali) según CIPER: presencia en IVB sin ahorro impositivo por reglas CFC.
        </div>
      </div>

      {/* Hallazgo 12: el encaje, doble negocio */}
      <div className="table-panel" style={{ border: "1px solid #2c4a2a" }}>
        <div className="panel-header">
          <div className="panel-title">Hallazgo 12 · El encaje: la AFP gana por partida doble con tu plata</div>
        </div>
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span className="badge warn">EEFF 1S-2026</span>
            <span style={{ fontSize: 11, color: "#ff6568", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              Ninguna cartola te muestra esta mitad del negocio
            </span>
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 17, color: "#fff", fontWeight: 800, lineHeight: 1.35 }}>
            En el primer semestre de 2026, el{" "}
            <span style={{ color: "#fb2c36" }}>37% de las utilidades de las AFP</span> no vino de comisiones: vino del{" "}
            <span style={{ color: "#fac800" }}>encaje</span> — su capital apostado en tus mismos fondos.
          </h3>
          <p style={{ margin: 0, fontSize: 13.5, color: "#c9d3e2", lineHeight: 1.65, maxWidth: 1000 }}>
            La ley obliga a cada AFP a mantener ~1% de los fondos como <strong>capital propio</strong> (el{" "}
            <strong>encaje</strong>), invertido en los <strong>mismos multifondos que administra</strong>. Este 1S-2026
            quedó documentado en sus propios estados financieros: de los US$410M de utilidad consolidada,{" "}
            <strong>US$153M ({encaje.pctUtilidadesDesdeEncaje}%) vinieron de la rentabilidad del encaje</strong> — no de
            comisiones, sino de que su capital subió porque <em>tus</em> fondos A y B subieron. La AFP cobra comisión{" "}
            <em>y</em> gana apostando su propia plata en lo mismo. {encaje.patrimonioSeparado}
          </p>
        </div>

        <div className="kpi-grid" style={{ padding: "12px 16px 0" }}>
          <div className="kpi">
            <div className="kpi-label">Utilidades desde el encaje</div>
            <div className="kpi-value" style={{ color: "#fb2c36" }}>{encaje.pctUtilidadesDesdeEncaje}%</div>
            <div className="kpi-sub">1S-2026 · US$153M de US$410M</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Encaje gestionado</div>
            <div className="kpi-value" style={{ color: "#fac800" }}>US$ {encaje.encaje.montoUsd.toLocaleString("es-CL")} M</div>
            <div className="kpi-sub">+{encaje.encaje.yoyPct}% vs jun-2025 · capital propio</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Rentabilidad del encaje</div>
            <div className="kpi-value" style={{ color: "#fe6e00" }}>US$ {encaje.rentabilidadEncaje1S2026.usd} M</div>
            <div className="kpi-sub">+{encaje.rentabilidadEncaje1S2026.yoyPct}% a/a (1S-2026)</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Utilidades totales</div>
            <div className="kpi-value" style={{ color: "#00c758" }}>US$ {encaje.utilidades1S2026.usd.toLocaleString("es-CL")} M</div>
            <div className="kpi-sub">+{encaje.utilidades1S2026.yoyPct}% a/a · ene-jun 2026</div>
          </div>
        </div>

        {/* Rentabilidad por fondo */}
        <div className="panel-header" style={{ borderTop: "1px solid #1d293d", borderBottom: "1px solid #1d293d" }}>
          <div className="panel-title">Por qué subió el encaje: rentabilidad real de tus multifondos</div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "70px 1fr 90px 90px",
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
          <span>Fondo</span>
          <span>Rent. real 1S-2026</span>
          <span style={{ textAlign: "right" }}>1S-2026</span>
          <span style={{ textAlign: "right" }}>1S-2025</span>
        </div>
        {encaje.multifondos1S2026.map((f, i) => {
          const prev = encaje.multifondos1S2025[i];
          return (
            <div
              key={f.fondo}
              style={{
                display: "grid",
                gridTemplateColumns: "70px 1fr 90px 90px",
                gap: 10,
                padding: "6px 16px",
                borderBottom: "1px solid #16223a",
                fontFamily: "var(--font-mono)",
                fontSize: 12.5,
                alignItems: "center",
              }}
            >
              <span style={{ color: "#b9c4d4", fontWeight: 700 }}>Fondo {f.fondo}</span>
              <span style={{ height: 5, background: "#0f172b", borderRadius: 3, overflow: "hidden" }}>
                <span
                  style={{
                    width: `${Math.min(100, ((Math.max(0, f.real) + 3) / 12) * 100)}%`,
                    height: "100%",
                    display: "block",
                    background: f.fondo === "A" ? "#fb2c36" : f.fondo === "B" ? "#fe6e00" : f.fondo === "C" ? "#fac800" : "#54a2ff",
                  }}
                />
              </span>
              <span style={{ textAlign: "right", color: f.real >= 0 ? "#00c758" : "#fb2c36", fontWeight: 700 }}>
                {f.real > 0 ? "+" : ""}{f.real.toFixed(2)}%
              </span>
              <span style={{ textAlign: "right", color: "#62748e" }}>
                {prev.real > 0 ? "+" : ""}{prev.real.toFixed(2)}%
              </span>
            </div>
          );
        })}

        {/* Quién ganó por AFP */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, minWidth: 0 }}>
          <div>
            <div className="panel-header" style={{ borderTop: "1px solid #1d293d", borderBottom: "1px solid #1d293d" }}>
              <div className="panel-title">Utilidades por AFP · 1S-2026</div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 90px 70px",
                gap: 10,
                padding: "7px 12px",
                background: "#0f172b",
                color: "#7d8faa",
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: 0.7,
                fontFamily: "var(--font-mono)",
              }}
            >
              <span>AFP</span>
              <span style={{ textAlign: "right" }}>US$ M</span>
              <span style={{ textAlign: "right" }}>+% a/a</span>
            </div>
            {encaje.porAfp1S2026.map((f, i) => (
              <div
                key={f.afp}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 90px 70px",
                  gap: 10,
                  padding: "6px 12px",
                  borderBottom: "1px solid #16223a",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12.5,
                  alignItems: "center",
                  background: i === 0 ? "rgba(0,199,88,0.05)" : "transparent",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 7, color: "#e4eaf4", fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: colorDe(f.afp), display: "inline-block" }} />
                  {f.afp}
                </span>
                <span style={{ textAlign: "right", color: "#fff", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  {f.usd}
                </span>
                <span style={{ textAlign: "right", color: f.yoyPct < 0 ? "#fb2c36" : "#00c758" }}>
                  {f.yoyPct > 0 ? "+" : ""}{f.yoyPct.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>

          <div>
            <div className="panel-header" style={{ borderTop: "1px solid #1d293d", borderBottom: "1px solid #1d293d" }}>
              <div className="panel-title">La asimetría del negocio</div>
            </div>
            <div style={{ padding: "10px 12px", fontSize: 12.5, color: "#a9b7cc", lineHeight: 1.6 }}>
              {encaje.asimetria}
            </div>
            <div style={estilosNota}>
              <strong>Filtro crítico:</strong> el encaje es obligatorio y legal (garantía del fondo); el hallazgo no es
              que exista, sino que su retorno es <strong>otra línea de utilidad para la AFP</strong> alineada con los
              fondos de mayor volatilidad — 37% de la ganancia del sector en 6 meses. Ese dinero es de los accionistas,
              no de tu cuenta.
            </div>
            <div style={estilosNota}>
              Fuente: La Tercera (17-ago-2026, Mariana Marusic) · Diario de Santiago (US$410M) · análisis razonados de
              las AFP (EEFF 1S-2026). El 37% = rentabilidad del encaje ($141.533M) ÷ utilidades consolidadas ($378.085M).
              CLP→USD convertidos por las propias fuentes.
            </div>
          </div>
        </div>
      </div>

      {/* Hallazgo 13: multas récord que son un redondeo */}
      <div className="table-panel" style={{ border: "1px solid #4a1f2a" }}>
        <div className="panel-header">
          <div className="panel-title">Hallazgo 13 · El costo de desobedecer: multas récord que son un redondeo</div>
        </div>
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span className="badge warn">Dato oficial (Supen)</span>
            <span style={{ fontSize: 11, color: "#ff6568", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              El regulador castigó menos de lo que la industria gana en unos días
            </span>
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 17, color: "#fff", fontWeight: 800, lineHeight: 1.35 }}>
            2025 marcó <span style={{ color: "#fb2c36" }}>récord de multas</span> a las AFP: UF 20.131 — que equivalen al{" "}
            <span style={{ color: "#fac800" }}>0,12% de sus utilidades</span>.
          </h3>
          <p style={{ margin: 0, fontSize: 13.5, color: "#c9d3e2", lineHeight: 1.65, maxWidth: 1000 }}>
            La propia Superintendencia cursó <strong>{multas.nMultas} multas por {multas.montoUF.toLocaleString("es-CL")} UF</strong>{" "}
            en {multas.anio} (<strong>{multas.corte}</strong>) — el monto más alto de la década y casi el doble del
            promedio. Pero traducido: ≈<strong>$822,9 millones CLP</strong>. Las utilidades de 2025 fueron{" "}
            <strong>$691.498 millones</strong>. Es decir, todo el castigo del año vale{" "}
            <strong>{multas.pctUtilidades}%</strong> de lo que el sector ganó. ¿Cuánto desincentivo crees que genera?
          </p>
        </div>

        <div className="kpi-grid" style={{ padding: "12px 16px 0" }}>
          <div className="kpi">
            <div className="kpi-label">Multas 2025</div>
            <div className="kpi-value" style={{ color: "#fb2c36" }}>UF {multas.montoUF.toLocaleString("es-CL")}</div>
            <div className="kpi-sub">{multas.nMultas} sanciones · récord de la década</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">% de las utilidades 2025</div>
            <div className="kpi-value" style={{ color: "#fac800" }}>{multas.pctUtilidades}%</div>
            <div className="kpi-sub">≈$822,9M CLP vs $691.498M de utilidad</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Sanciones en 10 años</div>
            <div className="kpi-value" style={{ color: "#fe6e00" }}>{multas.decada.sanciones}</div>
            <div className="kpi-sub">UF {multas.decada.uf.toLocaleString("es-CL")} · {multas.decada.periodo}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">AFP multadas (invalidez)</div>
            <div className="kpi-value" style={{ color: "#00c758" }}>7 / 7</div>
            <div className="kpi-sub">sep-2025 · demoras en calificación</div>
          </div>
        </div>

        {/* Multas por AFP */}
        <div className="panel-header" style={{ borderTop: "1px solid #1d293d", borderBottom: "1px solid #1d293d" }}>
          <div className="panel-title">Las multas de 2025 por AFP (UF)</div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 90px 1fr",
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
          <span>AFP</span>
          <span style={{ textAlign: "right" }}>UF</span>
          <span style={{ textAlign: "right" }}>% del total</span>
        </div>
        {multas.porAfpUF.map((f, i) => {
          const maxUf = multas.porAfpUF[0].uf;
          return (
            <div
              key={f.afp}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 90px 1fr",
                gap: 10,
                padding: "6px 16px",
                borderBottom: "1px solid #16223a",
                fontFamily: "var(--font-mono)",
                fontSize: 12.5,
                alignItems: "center",
                background: i === 0 ? "rgba(251,44,54,0.06)" : "transparent",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 7, color: "#e4eaf4", fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: colorDe(f.afp), display: "inline-block" }} />
                {f.afp}
              </span>
              <span style={{ textAlign: "right", color: "#fff", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                {f.uf.toLocaleString("es-CL")}
              </span>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                <span style={{ textAlign: "right", color: "#62748e", fontSize: 11 }}>
                  {((f.uf / multas.montoUF) * 100).toFixed(1)}%
                </span>
                <span style={{ width: 70, height: 6, background: "#0f172b", borderRadius: 3, overflow: "hidden" }}>
                  <span
                    style={{ width: `${(f.uf / maxUf) * 100}%`, height: "100%", display: "block", background: "#fb2c36" }}
                  />
                </span>
              </span>
            </div>
          );
        })}

        <div style={estilosNota}>
          <strong>Lo que motivó el castigo:</strong> {multas.motivos}. {multas.las7Invalidez}. Y un detalle que pocos
          notan: <strong>{multas.ipsInvicto}</strong>.
        </div>
        <div style={estilosNota}>
          <strong>Filtro crítico (no creas todo lo que lees):</strong> son <em>multas administrativas</em> de un régimen
          legal, no cargos por robo, y 2024 fue un año inusualmente bajo (UF 850). El punto no es minimizar la sanción,
          es leer la asimetría estructural: la década completa (139 sanciones, UF 118.796 ≈ $4.856M CLP) equivale a una
          fracción de <em>una semana</em> de las utilidades de 2025. Con ese precio, cumplir la ley deja de ser negocio.
        </div>
        <div style={estilosNota}>
          Fuentes: Superintendencia de Pensiones · app “Sanciones Aplicadas” (spensiones.cl/apps/sanciones) · La Tercera
          Pulso (Mariana Marusic, 9-ene-2026) · w3-article-14154 · w3-article-16700. Conversión UF→CLP a UF=$40.875
          (sep-2026, Banco Central/SII); 0,12% = $822,9M ÷ $691.498M de utilidades 2025.
        </div>
      </div>

      {/* Hallazgo 14: los 7 dueños privados de las AFP */}
      <div className="table-panel" style={{ border: "1px solid #2b3647" }}>
        <div className="panel-header">
          <div className="panel-title">Hallazgo 14 · ¿Quién es el dueño de tu AFP?</div>
        </div>
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span className="badge warn">Propiedad verificada</span>
            <span style={{ fontSize: 11, color: "#ff6568", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              Detrás de las 7 AFP hay 7 grupos privados — 4 de ellos extranjeros
            </span>
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 17, color: "#fff", fontWeight: 800, lineHeight: 1.35 }}>
            Tu AFP no es tuya ni chilena en su mayoría: tu ahorro lo administra una{" "}
            <span style={{ color: "#fb2c36" }}>aseguradora global</span> que además aparece del otro lado
            cuando jubilas.
          </h3>
          <p style={{ margin: 0, fontSize: 13.5, color: "#c9d3e2", lineHeight: 1.65, maxWidth: 1000 }}>
            La Biblioteca del Congreso (2019-2020) y La Tercera (2020) lo documentan: el{" "}
            <strong>{duenios.datoClave.afiliadosExtranjeroPct}% de los afiliados</strong> y el{" "}
            <strong>{duenios.datoClave.fondosExtranjeroPct}% de los fondos</strong> están en manos de administradoras
            con controladores <strong>extranjeros</strong>. De las 7 AFP, tres son de aseguradoras de EE. UU.
            (MetLife→Provida, Principal→Cuprum, Prudential→Habitat), una es del colombiano Sura (cuyo mayor accionista
            es Grupo Argos, de la industria del cemento), Habitat es mixta (ILC de la CChC + Prudential), y solo{" "}
            <strong>{duenios.nAfpsChilenas} son de chilenos</strong>: Modelo (familia Navarro Haeussler) y Uno.
          </p>
        </div>

        <div className="kpi-grid" style={{ padding: "12px 16px 0" }}>
          <div className="kpi">
            <div className="kpi-label">Fondos en manos extranjeras</div>
            <div className="kpi-value" style={{ color: "#fb2c36" }}>{duenios.datoClave.fondosExtranjeroPct}%</div>
            <div className="kpi-sub">{duenios.datoClave.afiliadosExtranjeroPct}% de los afiliados</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Aseguradoras de EE. UU.</div>
            <div className="kpi-value" style={{ color: "#fac800" }}>3</div>
            <div className="kpi-sub">MetLife · Principal · Prudential</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">AFP de chilenos</div>
            <div className="kpi-value" style={{ color: "#fe6e00" }}>{duenios.nAfpsChilenas}</div>
            <div className="kpi-sub">Modelo (Navarro) · Uno (TANZA)</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Su utilidad 2025</div>
            <div className="kpi-value" style={{ color: "#00c758" }}>US$ 762 M</div>
            <div className="kpi-sub">para repartir entre 7 grupos (Hallazgo 7)</div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.9fr 1.9fr 0.8fr 0.9fr 1.7fr 0.7fr",
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
          <span>AFP</span>
          <span>Controlador</span>
          <span>País</span>
          <span>Part.</span>
          <span>Vínculo con tu jubilación</span>
          <span style={{ textAlign: "right" }}>Util. 2025 US$M</span>
        </div>
        {duenios.afps.map((f, i) => (
          <div
            key={f.afp}
            style={{
              display: "grid",
              gridTemplateColumns: "0.9fr 1.9fr 0.8fr 0.9fr 1.7fr 0.7fr",
              gap: 10,
              padding: "6px 16px",
              borderBottom: "1px solid #16223a",
              fontFamily: "var(--font-mono)",
              fontSize: 12.5,
              alignItems: "center",
              background: f.pais === "Chile" || f.pais.startsWith("Chile") ? "rgba(0,199,88,0.04)" : i === 0 ? "rgba(251,44,54,0.05)" : "transparent",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 7, color: "#e4eaf4", fontWeight: 700 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: colorDe(f.afp), display: "inline-block" }} />
              {f.afp}
            </span>
            <span style={{ color: "#c9d3e2", lineHeight: 1.4 }}>{f.controlador}</span>
            <span style={{ color: f.pais === "Chile" || f.pais.startsWith("Chile") ? "#00c758" : "#62748e", fontWeight: f.pais === "Chile" ? 700 : 400 }}>
              {f.pais}
            </span>
            <span style={{ color: "#b9c4d4", fontSize: 11.5 }}>{f.pct}</span>
            <span style={{ color: "#a9b7cc", fontSize: 11.5, lineHeight: 1.4 }}>{f.vinculo}</span>
            <span style={{ textAlign: "right", color: "#fff", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
              {f.utilidadUsd}
            </span>
          </div>
        ))}

        <div style={estilosNota}>
          <strong>El doble bolsillo del Hallazgo 5, con nombre y apellido:</strong> ILC (dueño de la mitad de
          Habitat) es el grupo de <strong>Confuturo</strong>, líder de rentas vitalicias; Principal (Cuprum) es dueño
          adicionalmente de <strong>Principal Seguros de Vida</strong>; y MetLife y Prudential son aseguradoras globales
          en el mismo mercado RV. Es decir: el grupo que te cobró comisión toda la vida puede ser el mismo que te
          compre tu saldo con renta vitalicia. {duenios.patrimonioSeparado}
        </div>
        <div style={estilosNota}>
          <strong>Para dimensionar el poder de estos dueños:</strong> en enero de 2025 las aseguradoras
          estadounidenses (MetLife, Principal, Prudential) enviaron una carta al gobierno acusando{" "}
          <em>expropiación</em> por la reforma previsional. {duenios.respuestaGobierno}
        </div>
        <div style={estilosNota}>
          <strong>Filtro crítico (no creas todo lo que lees):</strong> que los dueños sean extranjeros o aseguradoras
          no es en sí mismo ilegal — el sistema fue diseñado así (DL 3.500, 1980). El hallazgo es estructural: el
          dueño de tu AFP gana por comisión, por el encaje (Hallazgo 12) y posiblemente por tu renta vitalicia
          (Hallazgo 5). La propiedad de cada AFP es pública (BCN, CMF, spensiones.cl). {duenios.fuente}
        </div>
      </div>

      {/* Hallazgo 15: Fondo E y volatilidad */}
      <div className="table-panel" style={{ border: "1px solid #2b3647" }}>
        <div className="panel-header">
          <div className="panel-title">Hallazgo 15 · Fondo E: volatilidad histórica y pérdida de libertad de elección</div>
          <span className="badge accent">técnico</span>
        </div>
        <div style={{ padding: "12px 16px 0" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#c9d3e2", lineHeight: 1.65, maxWidth: 1050 }}>
            {h15.resumen}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
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
          <span>A (%)</span>
          <span>B (%)</span>
          <span>C (%)</span>
          <span>E (%)</span>
        </div>
        {h15.serieReal.map((r) => (
          <div
            key={r.anio}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
              gap: 10,
              padding: "6px 16px",
              borderBottom: "1px solid #16223a",
              fontFamily: "var(--font-mono)",
              fontSize: 12.5,
              alignItems: "center",
            }}
          >
            <span style={{ color: "#e4eaf4", fontWeight: 700 }}>{r.anio}</span>
            <span style={{ color: r.A === Math.max(r.A, r.B, r.C, r.D, r.E) ? "#fac800" : "#c9d3e2" }}>{r.A.toFixed(2)}</span>
            <span style={{ color: "#c9d3e2" }}>{r.B.toFixed(2)}</span>
            <span style={{ color: "#c9d3e2" }}>{r.C.toFixed(2)}</span>
            <span style={{ color: r.E === Math.max(r.A, r.B, r.C, r.D, r.E) ? "#00c758" : "#c9d3e2" }}>{r.D.toFixed(2)}</span>
            <span style={{ color: r.E === Math.max(r.A, r.B, r.C, r.D, r.E) ? "#00c758" : "#ff6568" }}>{r.E.toFixed(2)}</span>
          </div>
        ))}
        <div style={estilosNota16}>
          <strong>Máx. desviación A–E:</strong> 2024 +{h15.maxDesvioPuntos[2024]} pp (E vs A), 2025 +{h15.maxDesvioPuntos[2025]} pp (A vs E), 2026 +{h15.maxDesvioPuntos[2026]} pp (A vs E).<br />
          <strong>Cálculo didáctico sobre $1.000.000:</strong> 2024 E vs A ≈ +${h15.calculoDiferenciaUSD1M.diff2024_E_vs_A.toLocaleString("es-CL")}, 2025 A vs E ≈ +${h15.calculoDiferenciaUSD1M.diff2025_A_vs_E.toLocaleString("es-CL")}, 2026 A vs E ≈ +${h15.calculoDiferenciaUSD1M.diff2026_A_vs_E.toLocaleString("es-CL")}. {h15.calculoDiferenciaUSD1M.nota}
        </div>
        <div style={estilosNota16}>
          <strong>Lectura técnica:</strong> {h15.lecturaTecnica}
        </div>
        <div style={estilosNota16}>
          <strong>Filtro crítico:</strong> {h15.filtroCritico} · {h15.fuente}
        </div>
      </div>

      <div className="table-panel" style={{ border: "1px solid #2b3647" }}>
        <div className="panel-header">
          <div className="panel-title">Hallazgo 16 · Propuestas de retiro anticipado: lo verificable vs lo debatido</div>
          <span className="badge warn">técnico-actuarial</span>
        </div>
        <div style={{ padding: "12px 16px 0" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#c9d3e2", lineHeight: 1.65, maxWidth: 1050 }}>
            {h16.resumen}
          </p>
        </div>

        <div className="dash-grid-2">
          <div style={{ padding: "12px 16px 0" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#54a2ff", marginBottom: 6 }}>
              Marco legal verificable
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, color: "#c9d3e2", lineHeight: 1.7 }}>
              <li><strong>RP:</strong> {h16.marcoLegal.retiroProgramado}</li>
              <li><strong>RV:</strong> {h16.marcoLegal.rentaVitalicia}</li>
              <li><strong>FG (abr-2027):</strong> {h16.marcoLegal.fgTransicion}</li>
            </ul>
          </div>
          <div style={{ padding: "12px 16px 0" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#fac800", marginBottom: 6 }}>
              Restricciones objetivas
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, color: "#c9d3e2", lineHeight: 1.7 }}>
              {h16.restriccionesObjetivas.map((r) => (
                <li key={r.aspecto}><strong>{r.aspecto}:</strong> {r.desc}</li>
              ))}
            </ul>
          </div>
        </div>

        <div style={estilosNota16}>
          <strong>Cálculo técnico (conceptual):</strong> {h16.calculoTecnico.formulaConceptual}. {h16.calculoTecnico.impactoConceptual}. Ejemplo didáctico: base ${h16.calculoTecnico.ejemploDidactico.base.toLocaleString("es-CL")}, retirar extra ${h16.calculoTecnico.ejemploDidactico.retirarAhoraExtra.toLocaleString("es-CL")}; efecto: {h16.calculoTecnico.ejemploDidactico.efecto} {h16.calculoTecnico.ejemploDidactico.nota}
        </div>
        <div style={estilosNota16}>
          <strong>Lectura técnica:</strong> {h16.lecturaTecnica}
        </div>
        <div style={estilosNota16}>
          <strong>Filtro crítico:</strong> {h16.filtroCritico} · {h16.fuente}
        </div>
      </div>

      {/* Hallazgo 17: crisis del Fondo E */}
      <div className="table-panel" style={{ border: "1px solid #7f1d1d" }}>
        <div className="panel-header">
          <div className="panel-title">Hallazgo 17 · Crisis del Fondo E: la apuesta con derivados que hundió al fondo "más seguro"</div>
          <span className="badge warn">candente · oct-2026</span>
        </div>
        <div style={{ padding: "12px 16px 0" }}>
          <p style={{ margin: 0, fontSize: 13, color: "#c9d3e2", lineHeight: 1.65, maxWidth: 1080 }}>
            {h17.resumen}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1.2fr",
            gap: 10,
            padding: "8px 16px",
            marginTop: 10,
            background: "#0f172b",
            borderBottom: "1px solid #1d293d",
            color: "#7d8faa",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: 0.7,
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>Fondo</span>
          <span>Sep-2026 (%)</span>
          <span>Ene–sep 2026 (%)</span>
        </div>
        {h17.rentabilidad.map((r) => (
          <div
            key={r.fondo}
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 1fr 1.2fr",
              gap: 10,
              padding: "6px 16px",
              borderBottom: "1px solid #16223a",
              fontFamily: "var(--font-mono)",
              fontSize: 12.5,
              alignItems: "center",
              background: r.fondo.startsWith("E ") ? "rgba(251,44,54,0.07)" : "transparent",
            }}
          >
            <span style={{ color: r.fondo.startsWith("E ") ? "#ff8a8c" : "#c9d3e2", fontWeight: r.fondo.startsWith("E ") ? 700 : 500 }}>{r.fondo}</span>
            <span style={{ color: "#c9d3e2" }}>{r.mesSep.toFixed(2)}</span>
            <span style={{ color: r.acumEneSep < 0 ? "#ff6568" : "#00c758", fontWeight: 700 }}>{r.acumEneSep > 0 ? "+" : ""}{r.acumEneSep.toFixed(2)}</span>
          </div>
        ))}
        <div style={estilosNota16}>
          <strong>{h17.detallePorAFP.nota}</strong>{" "}
          {h17.detallePorAFP.datos.map((d) => `${d.afp} ${d.acumEneSep.toFixed(2)}%`).join(" · ")}.
        </div>

        <div className="dash-grid-2">
          <div style={{ padding: "12px 16px 0" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#fb2c36", marginBottom: 6 }}>
              La causa: apuesta con swaps de tasas
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, color: "#c9d3e2", lineHeight: 1.7 }}>
              <li>{h17.causa.swaps}</li>
              <li><strong>Medición (Señal DF):</strong> {h17.causa.medicion}</li>
              <li><strong>Valor de los derivados:</strong> {h17.causa.derivadosValor}</li>
              <li><strong>Forward de dólar:</strong> {h17.causa.forwards}</li>
            </ul>
          </div>
          <div style={{ padding: "12px 16px 0" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#fac800", marginBottom: 6 }}>
              El regulador entra a la cancha
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, color: "#c9d3e2", lineHeight: 1.7 }}>
              <li><strong>Norma:</strong> {h17.regulacion.norma}</li>
              <li><strong>Límite:</strong> {h17.regulacion.limite}</li>
              <li><strong>Plazo:</strong> {h17.regulacion.plazo}</li>
              <li><strong>Dilema:</strong> {h17.regulacion.dilema}</li>
            </ul>
          </div>
        </div>

        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#54a2ff", marginBottom: 8 }}>
            Números clave
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 8 }}>
            {h17.numerosClave.map((n) => (
              <div key={n.label} style={{ background: "#0a101f", border: "1px solid #1d293d", borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700, color: "#e4eaf4" }}>{n.valor}</div>
                <div style={{ fontSize: 10.5, color: "#9fb0c9", marginTop: 2 }}>{n.label}</div>
                <div style={{ fontSize: 9.5, color: "#64748b", marginTop: 2, fontFamily: "var(--font-mono)" }}>{n.fuente}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#fe6e00", marginBottom: 6 }}>
            A quiénes golpea (y a quiénes no)
          </div>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, color: "#c9d3e2", lineHeight: 1.7 }}>
            {h17.impactoQuienes.map((i) => (
              <li key={i.grupo}><strong>{i.grupo}:</strong> {i.efecto}</li>
            ))}
          </ul>
        </div>

        <div style={estilosNota16}>
          <strong>Cálculo técnico (aritmética sobre la caída oficial):</strong>{" "}
          {h17.calculoTecnico.ejemplos.map((e) => `${e.etiqueta} → ${e.perdidaEneSep.toLocaleString("es-CL")} ene-sep (${e.perdidaSep.toLocaleString("es-CL")} solo en septiembre)`).join(" · ")}.{" "}
          {h17.calculoTecnico.contraste} {h17.calculoTecnico.comision} {h17.calculoTecnico.nota}
        </div>
        <div style={estilosNota16}>
          <strong>Lectura técnica:</strong> {h17.lecturaTecnica}
        </div>
        <div style={estilosNota16}>
          <strong>Filtro crítico:</strong> {h17.filtroCritico} · {h17.fuente}
        </div>
      </div>

      {/* Aviso legal al pie */}
      <div
        style={{
          border: "1px solid #2b3647",
          borderRadius: 10,
          padding: "14px 18px",
          background: "#0a101f",
        }}
      >
        <div style={{ fontSize: 11, color: "#9fb0c9", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
          Aviso legal · periodismo de datos, no imputación
        </div>
        <p style={{ margin: 0, fontSize: 12.5, color: "#9fb0c9", lineHeight: 1.6 }}>
          Este dashboard es periodismo de datos sobre documentación pública (Supen, CMF, SII, BCN, Pandora
          Papers/ICIJ, EEFF de las AFP). Cada cifra indica su fuente, sus discrepancias y su filtro crítico, con la
          metodología <em>no creas todo lo que lees</em>. <strong>No imputa delitos ni conductas ilícitas a personas
          determinadas</strong>: los hechos referidos son públicos y verificables, o conductas ya sancionadas por
          organismos del Estado (multas administrativas, oficios). El lenguaje enfático y las figuras retóricas
          ("robo", "fantasma", "confesión") son valoraciones y opiniones sobre datos verificados — cubiertas por la
          defensa de veracidad (hechos determinados y verdaderos) — y no afirmaciones de antijuridicidad penal.
        </p>
      </div>
    </div>
  );
}
