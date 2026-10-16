import { useState } from "react";
import CuadroPosiciones from "./components/CuadroPosiciones";
import Descubrimiento from "./components/Descubrimiento";
import KPIs from "./components/KPIs";
import LiveData from "./components/LiveData";
import Auditoria from "./components/Auditoria";
import FondosGeneracionales from "./components/FondosGeneracionales";
import {
  Panel,
  RentabilidadFondosChart,
  ValorCuotaChart,
  AfiliadosChart,
  MontoCuentaChart,
  EdadJubilacionDonut,
} from "./components/Charts";

function App() {
  const [tab, setTab] = useState("vis");
  const now = new Date();
  const fecha = now.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
  });
  const hora = now.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const tabs = [
    { id: "vis", label: "Tablero" },
    { id: "desc", label: "Descubrimiento" },
    { id: "fg", label: "Fondos Generacionales" },
    { id: "afps", label: "AFPs" },
    { id: "verif", label: "Verificación" },
    { id: "fuentes", label: "Fuentes" },
  ];

  return (
    <>
      <header className="app-header">
        <div className="logo">
          <span className="logo-badge">P</span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
            <span>
              PENSIONES<span className="accent">CHILE</span>
            </span>
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: "var(--red-soft)" }}>
              EL ROBO DEL SIGLO
            </span>
          </span>
        </div>
        <nav className="header-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`header-tab ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="header-spacer" />
        <div className="header-live">
          <span className="live-dot" />
          <span>
            <strong>LIVE</strong> · {fecha} · {hora}
          </span>
        </div>
      </header>

      <main className="app-body">
        <div className="page-title">
          <h1>Pensiones Chile · El Robo del Siglo</h1>
          <p>
            Verificación crítica de datos oficiales: cuánto gana la industria de AFP por administrar
            tu ahorro y cuánto te queda a ti al jubilar. Nada de marketing: solo números auditados.
          </p>
        </div>

        {tab === "vis" && (
          <>
            <div className="section-label">Cuadro de posiciones · AFPs (timing board)</div>
            <div className="table-panel" style={{ padding: 14 }}>
              <CuadroPosiciones />
            </div>

            <div className="section-label">Resumen del sistema</div>
            <KPIs />

            <div className="section-label">Composición de rentabilidad</div>
            <div className="dash-grid-3">
              <Panel
                title="Rentabilidad por fondo"
                subtitle="% anual por fondo A-E"
                desc="Qué % rindió cada fondo de pensión (A=mayor riesgo, E=menor) en cada año. Compara el riesgo que asume tu plata contra lo que realmente te devuelve."
              >
                <RentabilidadFondosChart />
              </Panel>
              <Panel
                title="Evolución del valor cuota"
                subtitle="Cuota consolidada (CLP)"
                desc="Cuánto vale hoy una cuota de tu fondo. Si la cuota sube, tu ahorro crece; pero esta cifra NO descuenta la inflación ni las comisiones que paga la AFP."
              >
                <ValorCuotaChart />
              </Panel>
              <Panel
                title="Pensión estimada por edad"
                subtitle="Monto mensual al jubilar"
                desc="Pensión mensual estimada según la edad a la que te jubilas. Mientras más tarde, más te pagan; pero casi nadie alcanza una pensión digna con estos montos."
              >
                <EdadJubilacionDonut />
              </Panel>
            </div>

            <div className="dash-grid-2">
              <Panel
                title="Afiliados y cotizantes"
                subtitle="Evolución del sistema"
                desc="Total de personas afiliadas a las AFP vs. cuántas cotizan de verdad cada mes. La diferencia es gente que 'aportó' pero hoy no cotiza: la brecha que el sistema oculta."
              >
                <AfiliadosChart />
              </Panel>
              <Panel
                title="Saldo en tu cuenta"
                subtitle="Promedio y mediana (CLP)"
                desc="Cuánto tiene ahorrado el afiliado promedio vs. el afiliado 'típico' (mediana). Si la mediana es muy inferior al promedio, significa que las pensiones altas engordan la cifra y la mayoría tiene mucho menos."
              >
                <MontoCuentaChart />
              </Panel>
            </div>
          </>
        )}

        {tab === "desc" && (
          <>
            <div className="section-label">Descubrimientos · lo que la Supen no te muestra</div>
            <div className="table-panel" style={{ padding: 16 }}>
              <Descubrimiento />
            </div>
          </>
        )}

        {tab === "afps" && (
          <>
            <div className="section-label">Detalle por AFP · datos en vivo</div>
            <div className="table-panel">
              <LiveData />
            </div>
          </>
        )}

        {tab === "fg" && (
          <>
            <div className="section-label">Fondos Generacionales · en profundidad</div>
            <FondosGeneracionales />
          </>
        )}

        {tab === "verif" && (
          <>
            <div className="section-label">Verificación de datos · crítica</div>
            <div className="table-panel">
              <Auditoria />
            </div>
          </>
        )}

        {tab === "fuentes" && (
          <>
            <div className="section-label">Fuentes de datos</div>
            <div className="dash-grid-3">
              {[
                { n: "spensiones.cl", d: "Superintendencia de Pensiones", c: "#fac800" },
                { n: "aafp.cl", d: "Asociación AFP", c: "#54a2ff" },
                { n: "cotizate.cl", d: "Herramienta de comparación", c: "#00c758" },
              ].map((f) => (
                <a key={f.n} href={`https://${f.n}`} target="_blank" rel="noreferrer">
                  <Panel title={f.n} subtitle={f.d}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 60,
                        fontSize: 40,
                      }}
                    >
                      <span style={{ opacity: 0.5, color: f.c }}>◈</span>
                    </div>
                  </Panel>
                </a>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default App;
