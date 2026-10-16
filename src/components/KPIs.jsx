import { useMemo } from "react";
import { getValorCuotaTabla, getRentabilidadFondos, getComisiones } from "../data/realData";
import { AFILIADOS_POR_AFP } from "../data/afiliados";

export default function KPIs() {
  const k = useMemo(() => {
    const totalAfiliados = Object.values(AFILIADOS_POR_AFP).reduce((s, v) => s + v, 0);

    // Patrimonio total del sistema: cada fondo×AFP aporta su patrimonio real.
    const patrimonioTotal = (getValorCuotaTabla() || []).reduce(
      (s, c) => s + (c.patrimonio || 0),
      0
    );

    // Mejor rentabilidad real a 12m, fondo C (perfil intermedio/clásico).
    const rentC = (getRentabilidadFondos() || []).filter(
      (r) => r.fondo === "C" && r.afp !== "SISTEMA"
    );
    const mejor = rentC.reduce((b, a) => (a.ultimos12m > (b?.ultimos12m ?? -Infinity) ? a : b), null);

    const comisiones = getComisiones() || [];
    const comisionProm = comisiones.length
      ? comisiones.reduce((s, c) => s + c.comision, 0) / comisiones.length
      : null;

    return { totalAfiliados, patrimonioTotal, mejor, comisionProm };
  }, []);

  const tiles = [
    {
      label: "Afiliados al sistema",
      value: `${(k.totalAfiliados / 1e6).toFixed(1)} M`,
      sub: "suma por AFP · Supen",
      color: "#54a2ff",
    },
    {
      label: "Patrimonio total fondos",
      value: `$${(k.patrimonioTotal / 1e12).toFixed(1)} B`,
      sub: "CLP · todas las AFP/fondos",
      color: "#00c758",
    },
    {
      label: "Mejor rent. 12m (Fondo C)",
      value: k.mejor ? `${(k.mejor.ultimos12m ?? 0).toFixed(2)}%` : "—",
      sub: k.mejor ? `${k.mejor.afp} · dato real` : "s/d",
      color: "#fac800",
    },
    {
      label: "Comisión promedio",
      value: k.comisionProm ? `${k.comisionProm.toFixed(2)}%` : "—",
      sub: "sobre renta · Supen",
      color: "#fe6e00",
    },
  ];

  return (
    <div className="kpi-grid">
      {tiles.map((t) => (
        <div className="kpi" key={t.label}>
          <div
            className="kpi-accent"
            style={{ background: `linear-gradient(90deg, ${t.color}, transparent)` }}
          />
          <div className="kpi-label">{t.label}</div>
          <div className="kpi-value">{t.value}</div>
          <div className="kpi-sub">{t.sub}</div>
        </div>
      ))}
    </div>
  );
}
