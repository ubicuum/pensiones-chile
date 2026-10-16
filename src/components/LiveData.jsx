import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  getRentabilidadFondos,
  getValorCuotaTabla,
  PERIODO_DATOS,
  GENERADO_EN,
  FONDO_COLORS,
} from "../data/realData";

const fmtMoney = (v) =>
  v >= 1e12
    ? `$${(v / 1e12).toFixed(2)} bill`
    : v >= 1e9
      ? `$${(v / 1e9).toFixed(1)} mil M`
      : `$${Math.round(v).toLocaleString("es-CL")}`;

const fmtCuota = (v) => `$${v.toLocaleString("es-CL", { minimumFractionDigits: 2 })}`;

const CambioCell = ({ value }) => {
  if (value == null) {
    return <span style={{ color: "#64748b" }}>—</span>;
  }
  return (
    <span style={{ color: value >= 0 ? "#00c758" : "#ff6568", fontWeight: 600 }}>
      {value >= 0 ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
};

export default function LiveData() {
  const [fondo, setFondo] = useState("A");
  const valorCuota = getValorCuotaTabla();
  const rentabilidad = getRentabilidadFondos();

  const cuotaFondo = valorCuota.filter((v) => v.fondo === fondo);

  const cuotaCols = [
    {
      field: "afp",
      headerName: "AFP",
      width: 130,
      cellRenderer: (p) => (
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: p.data.color,
              display: "inline-block",
            }}
          />
          <span style={{ fontWeight: 600 }}>{p.value}</span>
        </span>
      ),
    },
    {
      field: "cuota",
      headerName: "Valor Cuota",
      width: 150,
      type: "rightAligned",
      valueFormatter: (p) => fmtCuota(p.value),
    },
    {
      field: "patrimonio",
      headerName: "Patrimonio",
      width: 160,
      type: "rightAligned",
      valueFormatter: (p) => fmtMoney(p.value),
    },
    {
      headerName: "Var. desde 2020",
      width: 150,
      type: "rightAligned",
      valueGetter: (p) =>
        p.data.cuotaInicio
          ? ((p.data.cuota - p.data.cuotaInicio) / p.data.cuotaInicio) * 100
          : null,
      cellRenderer: CambioCell,
    },
  ];

  const renFondo = rentabilidad.filter((r) => r.fondo === fondo);

  const renCols = [
    {
      field: "afp",
      headerName: "AFP",
      width: 120,
      cellRenderer: (p) => (
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: p.data.color,
              display: "inline-block",
            }}
          />
          <span style={{ fontWeight: 600 }}>{p.value}</span>
        </span>
      ),
    },
    {
      field: "mes",
      headerName: "Mes",
      width: 100,
      type: "rightAligned",
      cellRenderer: CambioCell,
    },
    {
      field: "acumuladoAnio",
      headerName: "Acum. año",
      width: 110,
      type: "rightAligned",
      cellRenderer: CambioCell,
    },
    {
      field: "ultimos12m",
      headerName: "Últ. 12m",
      width: 110,
      type: "rightAligned",
      cellRenderer: CambioCell,
    },
    {
      field: "prom60m",
      headerName: "Prom. 60m",
      width: 110,
      type: "rightAligned",
      cellRenderer: (p) => (
        <span style={{ color: p.value == null ? "#64748b" : "#e2e8f0" }}>
          {p.value == null ? "—" : `${p.value.toFixed(2)}%`}
        </span>
      ),
    },
  ];

  const gridTheme = {
    ["--ag-background-color"]: "#0a101f",
    ["--ag-header-background-color"]: "#0f172b",
    ["--ag-foreground-color"]: "#c9d3e2",
    ["--ag-border-color"]: "#1d293d",
    ["--ag-header-foreground-color"]: "#62748e",
    ["--ag-row-hover-color"]: "#141f36",
    ["--ag-font-size"]: "13px",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {["A", "B", "C", "D", "E"].map((f) => (
            <button
              key={f}
              onClick={() => setFondo(f)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: `1px solid ${fondo === f ? FONDO_COLORS[f] : "#1d293d"}`,
                background: fondo === f ? FONDO_COLORS[f] : "#0f172b",
                color: fondo === f ? "#050507" : "#62748e",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
          <span style={{ fontSize: 13, color: "#8fa1bd" }}>
            Sistema de Multifondos · Fondo {fondo}
          </span>
          <span className="mono" style={{ fontSize: 13, color: "#9fb0c9" }}>
            {PERIODO_DATOS || "—"}
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, minWidth: 0 }}>
        <div style={{ background: "#0a101f", border: "1px solid #1d293d", borderRadius: 12, padding: 14 }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 13, color: "#62748e", fontWeight: 700 }}>
            Valor Cuota y Patrimonio (Supen)
          </h3>
          <div className="ag-theme-quartz" style={{ height: "100%", width: "100%", ...gridTheme }}>
            <AgGridReact
              rowData={cuotaFondo}
              columnDefs={cuotaCols}
              defaultColDef={{ flex: 1, resizable: true }}
              domLayout="autoHeight"
              suppressCellFocus
            />
          </div>
        </div>
        <div style={{ background: "#0a101f", border: "1px solid #1d293d", borderRadius: 12, padding: 14 }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 13, color: "#62748e", fontWeight: 700 }}>
            Rentabilidad Real Fondos (±{PERIODO_DATOS || ""})
          </h3>
          <div className="ag-theme-quartz" style={{ height: "100%", width: "100%", ...gridTheme }}>
            <AgGridReact
              rowData={renFondo}
              columnDefs={renCols}
              defaultColDef={{ flex: 1, resizable: true }}
              domLayout="autoHeight"
              suppressCellFocus
            />
          </div>
        </div>
      </div>

      <p style={{ margin: 0, fontSize: 13, color: "#8fa1bd", lineHeight: 1.6 }}>
        Fuente: Superintendencia de Pensiones (spensiones.cl) y Asociación de AFP (aafp.cl). Datos congelados
        al {GENERADO_EN ? new Date(GENERADO_EN).toLocaleString("es-CL") : "—"}. El valor cuota está en pesos por
        cuota; el cambio desde 2020 se calcula respecto a la cuota de inicio del año vigente.
      </p>
    </div>
  );
}
