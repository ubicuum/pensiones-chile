import { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { AgGridReact } from "ag-grid-react";
import { getBarrasFondo, getSerieAnual } from "../data/auditData";

const tooltipStyle = {
  backgroundColor: "#0f172b",
  border: "1px solid #1d293d",
  borderRadius: 8,
  fontSize: 12,
};

const gridTheme = {
  ["--ag-background-color"]: "#0a101f",
  ["--ag-header-background-color"]: "#0f172b",
  ["--ag-foreground-color"]: "#c9d3e2",
  ["--ag-border-color"]: "#1d293d",
  ["--ag-header-foreground-color"]: "#62748e",
  ["--ag-row-hover-color"]: "#141f36",
  ["--ag-font-size"]: "13px",
};

export default function Auditoria() {
  const [fondo, setFondo] = useState("A");
  const barras = getBarrasFondo(fondo);
  const serie = getSerieAnual(fondo);

  const cols = [
    {
      field: "afp",
      headerName: "AFP",
      width: 110,
      cellRenderer: (p) => <span style={{ fontWeight: 600 }}>{p.value}</span>,
    },
    {
      headerName: "Rent. cuota (nominal)",
      field: "nominal",
      width: 150,
      type: "rightAligned",
      cellRenderer: (p) => (
        <span style={{ color: p.value >= 0 ? "#00c758" : "#ff6568", fontWeight: 600 }}>
          {p.value >= 0 ? "+" : ""}
          {p.value.toFixed(2)}%
        </span>
      ),
    },
    {
      headerName: "Real calculada (IPC)",
      field: "real",
      width: 160,
      type: "rightAligned",
      cellRenderer: (p) => (
        <span style={{ color: p.value >= 0 ? "#00c758" : "#ff6568" }}>
          {p.value >= 0 ? "+" : ""}
          {p.value.toFixed(2)}%
        </span>
      ),
    },
    {
      headerName: "Real publicada (Supen)",
      field: "oficial",
      width: 170,
      type: "rightAligned",
      cellRenderer: (p) => (
        <span style={{ color: "#e2e8f0" }}>
          {p.value == null ? "—" : `${p.value >= 0 ? "+" : ""}${p.value.toFixed(2)}%`}
        </span>
      ),
    },
    {
      headerName: "Desvío (p.p.)",
      field: "infraccion",
      width: 130,
      type: "rightAligned",
      cellRenderer: (p) => (
        <span
          style={{
            color: p.value != null && Math.abs(p.value) > 2 ? "#f59e0b" : "#62748e",
            fontWeight: 700,
          }}
        >
          {p.value == null ? "—" : `${p.value >= 0 ? "+" : ""}${p.value.toFixed(2)}`}
        </span>
      ),
    },
  ];

  const nomColor = "#6ee7b7";
  const realColor = "#60a5fa";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.06))",
          border: "1px solid #3a2f0a",
          borderRadius: 12,
          padding: "16px 20px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 17, color: "#fac800", fontWeight: 800 }}>
          ¿Coinciden los números que publica la industria con los datos oficiales?
        </h2>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: "#d4d4d8", lineHeight: 1.6 }}>
          Aquí no repetimos lo que dicen las AFP. Recalculamos la rentabilidad
          directamente desde el <strong>valor cuota diario oficial</strong> (Superintendencia) y lo
          enfrentamos con lo que la propia Superintendencia publica. La distancia entre
          ambos, cuando existe, es el dato que la industria no destaca.
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {["A", "B", "C", "D", "E"].map((f) => (
          <button
            key={f}
            onClick={() => setFondo(f)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              border: `1px solid ${fondo === f ? "#fac800" : "#1d293d"}`,
              background: fondo === f ? "#fac800" : "#0f172b",
              color: fondo === f ? "#050507" : "#62748e",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {f}
          </button>
        ))}
        <span style={{ fontSize: 13, color: "#8fa1bd", marginLeft: 8 }}>
          Fondo {fondo} · acumulado 2026 (al corte de datos)
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, minWidth: 0 }}>
        <div
          style={{ background: "#0a101f", border: "1px solid #1d293d", borderRadius: 12, padding: 14 }}
        >
          <h3 style={{ margin: "0 0 10px", fontSize: 13, color: "#62748e", fontWeight: 700 }}>
            Tabla de verificación · Fondo {fondo} (acumulado 2026)
          </h3>
          <div className="ag-theme-quartz" style={{ height: "100%", width: "100%", ...gridTheme }}>
            <AgGridReact
              rowData={barras}
              columnDefs={cols}
              defaultColDef={{ flex: 1, resizable: true }}
              domLayout="autoHeight"
              suppressCellFocus
            />
          </div>
        </div>

        <div
          style={{ background: "#0a101f", border: "1px solid #1d293d", borderRadius: 12, padding: 14 }}
        >
          <h3 style={{ margin: "0 0 10px", fontSize: 13, color: "#62748e", fontWeight: 700 }}>
            Rentabilidad nominal vs real · Fondo {fondo}, 2020-2025 (promedio sistema)
          </h3>
          <div style={{ height: 220, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={serie} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1d293d" vertical={false} />
                <XAxis dataKey="anio" stroke="#62748e" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#62748e" fontSize={10} tickLine={false} axisLine={false} width={38} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v.toFixed(2)}%`, ""]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="nominal" name="Nominal cuota" stroke={nomColor} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="real" name="Real (IPC)" stroke={realColor} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="inflacion" name="Inflación" stroke="#ff6568" strokeWidth={2} dot={{ r: 2 }} strokeDasharray="4 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 12.5, color: "#8fa1bd", lineHeight: 1.6 }}>
            La línea verde es lo que sube tu cuota (antes de inflación). La azul, cuánto ganas de
            verdad en poder de compra. La roja es la inflación que se llevó la diferencia.
          </p>
        </div>
      </div>

      <div
        style={{ background: "#0a101f", border: "1px solid #1d293d", borderRadius: 12, padding: "16px 20px" }}
      >
        <h3 style={{ margin: "0 0 8px", fontSize: 13, color: "#fac800", fontWeight: 700 }}>
          Lectura crítica (metodológica y transparente)
        </h3>
        <ul style={{ margin: 0, paddingLeft: 18, color: "#cbd5e1", fontSize: 12, lineHeight: 1.8 }}>
          <li>
            La rentabilidad <strong>nominal de la cuota</strong> sube, en promedio, en torno a un{" "}
            <strong>{serie.length ? serie[serie.length - 1]?.nominal?.toFixed(0) : ""}%</strong> en
            años de mercado alcista (2021 y 2025), pero eso es antes de restar la inflación.
          </li>
          <li>
            Deflactando por IPC, la rentabilidad <strong>real</strong> del sistema en promedio
            ronda el{" "}
            <strong>4-6%</strong> anual en los mejores años, y en 2022 (inflación 12,8%) fue{" "}
            <strong>negativa</strong>: la cuota perdió poder de compra.
          </li>
          <li>
            El "promedio 60 meses" que publican las AFP es una cifra <strong>nominal</strong> que
            no muestra lo que el cotizante siente: tras inflación y comisiones, el retorno real
            en poder de compra es sustancialmente menor.
          </li>
          <li>
            En el acumulado 2026 existe un <strong>desvío de ~4 puntos porcentuales</strong> entre
            la rentabilidad real deducible desde la cuota oficial y la publicada por la Supen.
            Esto amerita explicación metodológica (IPC acumulado vs anual, valores provisorios).
            La industria no lo expone.
          </li>
        </ul>
        <p style={{ margin: "12px 0 0", fontSize: 12.5, color: "#8fa1bd", lineHeight: 1.7 }}>
          Método: rentabilidad nominal = (cuota_final/cuota_inicial − 1). Rentabilidad real =
          deflactar por IPC anual INE (2020: 3,0% · 2021: 7,2% · 2022: 12,8% · 2023: 3,9% · 2024:
          4,5% · 2025: 3,5%). Datos de valor cuota diario: Superintendencia de Pensiones
          (spensiones.cl).
        </p>
      </div>
    </div>
  );
}
