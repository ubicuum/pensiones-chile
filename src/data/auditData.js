import aud from "./auditoria.json";

const AFPP_INFLACION = { 2020: 3.0, 2021: 7.2, 2022: 12.8, 2023: 3.9, 2024: 4.5, 2025: 3.5, 2026: 2.8 };

export function getBrechas(fondo = "A") {
  return aud.brechasAcumulado2026?.[fondo] || {};
}

// Serie para gráfico: [[afp, {nominal, realCalc, realOficial, inflacion}]]
export function getBarrasFondo(fondo = "A") {
  const b = getBrechas(fondo);
  return Object.entries(b).map(([afp, v]) => ({
    afp,
    nominal: v.rentNominal2026,
    real: v.rentRealCalculada,
    oficial: v.rentRealOficial,
    infraccion: v.desvio,
  }));
}

// Serie temporal de rentabilidad nominal anual (promedio sistema) por fondo
export function getSerieAnual(fondo = "A") {
  const nom = aud.rentabilidadNominalAnual?.[fondo] || {};
  const real = aud.rentabilidadRealCalculada?.[fondo] || {};
  const anyos = ["2020", "2021", "2022", "2023", "2024", "2025"];
  return anyos
    .map((a) => {
      const nomVals = Object.values(nom[a] || {}).filter((v) => v != null);
      const realVals = Object.values(real[a] || {}).filter((v) => v != null);
      return {
        anio: a,
        nominal: nomVals.length ? nomVals.reduce((s, v) => s + v, 0) / nomVals.length : null,
        real: realVals.length ? realVals.reduce((s, v) => s + v, 0) / realVals.length : null,
        inflacion: AFPP_INFLACION[a],
      };
    })
    .filter((d) => d.nominal != null);
}

export function getIPC() {
  return aud.IPC_ANUAL || {};
}

export function getNotasAuditoria() {
  return aud.notas || [];
}

export function getComisionesAuditoria() {
  return aud.comisiones || [];
}

export function getGeneradoAuditoria() {
  return aud.generadoEn || null;
}
