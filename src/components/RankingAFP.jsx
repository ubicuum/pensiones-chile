import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useMemo, useState } from "react";
import { AFPS } from "../data/afps";

const formatMillones = (v) => {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)} mil M`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)} M`;
  return `$${v.toLocaleString("es-CL")}`;
};

const formatAfiliados = (v) => v.toLocaleString("es-CL");

const Cambio = ({ value }) => (
  <span style={{ color: value >= 0 ? "#00c758" : "#ff6568", fontWeight: 600 }}>
    {value >= 0 ? "+" : ""}
    {value.toFixed(2)}%
  </span>
);

export default function RankingAFP() {
  const [rowData] = useState(
    [...AFPS]
      .sort((a, b) => b.rentabilidadAnio - a.rentabilidadAnio)
      .map((a, i) => ({ pos: i + 1, ...a }))
  );

  const [colDefs] = useState([
    {
      field: "pos",
      headerName: "#",
      width: 60,
      sortable: false,
      cellRenderer: (params) => (
        <span
          style={{
            color: params.value === 1 ? "#fac800" : "#62748e",
            fontWeight: 800,
            fontFamily: "var(--font-mono)",
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "nombre",
      headerName: "AFP",
      width: 150,
      cellRenderer: (params) => (
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: params.data.color,
              display: "inline-block",
            }}
          />
          <span>{params.value}</span>
        </span>
      ),
    },
    {
      field: "rentabilidadAnio",
      headerName: "Rent. 12m",
      width: 120,
      type: "rightAligned",
      cellClass: "numero",
      cellRenderer: (params) => <Cambio value={params.value} />,
    },
    {
      field: "rentabilidadMes",
      headerName: "Rent. mes",
      width: 110,
      type: "rightAligned",
      cellClass: "numero",
      cellRenderer: (params) => (
        <span style={{ color: "#dfe6f1" }}>{params.value.toFixed(2)}%</span>
      ),
    },
    {
      field: "cuota",
      headerName: "Valor Cuota",
      width: 140,
      type: "rightAligned",
      cellClass: "numero",
      valueFormatter: (p) => `$${(p.value * 1000000).toFixed(4)}`,
    },
    {
      field: "comision",
      headerName: "Comisión",
      width: 100,
      type: "rightAligned",
      cellClass: "numero",
      valueFormatter: (p) => `${p.value.toFixed(2)}%`,
    },
    {
      field: "afiliados",
      headerName: "Afiliados",
      width: 120,
      type: "rightAligned",
      cellClass: "numero",
      valueFormatter: (p) => formatAfiliados(p.value),
    },
    {
      field: "patrimonio",
      headerName: "Patrimonio",
      width: 150,
      type: "rightAligned",
      cellClass: "numero",
      valueFormatter: (p) => formatMillones(p.value),
    },
  ]);

  const defaultColDef = useMemo(
    () => ({ flex: 1, resizable: true }),
    []
  );

  const rowClassRules = useMemo(
    () => ({
      "ag-row-leader": (p) => p.data.pos === 1,
    }),
    []
  );

  return (
    <div
      className="ag-theme-quartz"
      style={{
        height: "100%",
        width: "100%",
        ["--ag-background-color"]: "#0a101f",
        ["--ag-header-background-color"]: "#0f172b",
        ["--ag-foreground-color"]: "#c9d3e2",
        ["--ag-border-color"]: "#1d293d",
        ["--ag-header-foreground-color"]: "#62748e",
        ["--ag-row-hover-color"]: "#141f36",
        ["--ag-font-size"]: "13px",
      }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        rowClassRules={rowClassRules}
        domLayout="autoHeight"
        suppressCellFocus
      />
    </div>
  );
}
