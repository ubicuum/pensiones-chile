import resumenReal from "./resumen_real.json";

const FONDO_COLORS = {
  A: "#f87171",
  B: "#fb923c",
  C: "#fbbf24",
  D: "#60a5fa",
  E: "#34d399",
};

const AFP_COLORS = {
  Capital: "#fbbf24",
  Cuprum: "#f87171",
  Habitat: "#6ee7b7",
  Modelo: "#60a5fa",
  Planvital: "#34d399",
  Provida: "#c084fc",
  Uno: "#a3e635",
};

// Desnormaliza valorCuota {Fondo X: {afp: {cuota, patrimonio, fecha}}}
// -> array [{fondo, afp, cuota, patrimonio}]
export function getValorCuotaTabla() {
  const out = [];
  const vc = resumenReal.valorCuota || {};
  for (const [fondo, series] of Object.entries(vc)) {
    const letra = fondo.replace("Fondo ", "");
    for (const [afp, data] of Object.entries(series)) {
      out.push({
        fondo: letra,
        afp,
        color: AFP_COLORS[afp],
        fondoColor: FONDO_COLORS[letra],
        cuota: data.cuota,
        patrimonio: data.patrimonio,
        cuotaInicio: data.cuotaInicio,
        fecha: data.fecha,
      });
    }
  }
  return out;
}

// Valor cuota por fondo: [{fondo:'A'..'E', cuota promedio del sistema}]
export function getValorCuotaPorFondo() {
  const agg = {};
  const vc = resumenReal.valorCuota || {};
  for (const [fondo, series] of Object.entries(vc)) {
    const letra = fondo.replace("Fondo ", "");
    // promedio ponderado por patrimonio
    let sumaP = 0;
    let sumaW = 0;
    for (const data of Object.values(series)) {
      sumaP += data.cuota * data.patrimonio;
      sumaW += data.patrimonio;
    }
    agg[letra] = {
      fondo: letra,
      color: FONDO_COLORS[letra],
      cuota: sumaW ? sumaP / sumaW : 0,
      mes: resumenReal.generadoEn,
    };
  }
  return Object.values(agg);
}

// Rentabilidad real por fondo y AFP: [{fondo, afp, mes, acumuladoAnio, ultimos12m, prom60m}]
export function getRentabilidadFondos() {
  const out = [];
  const r = resumenReal.rentabilidadFondos;
  if (!r || !r.porFondo) return out;
  for (const [fondo, series] of Object.entries(r.porFondo)) {
    const letra = fondo.replace("Fondo ", "");
    for (const [afp, v] of Object.entries(series)) {
      if (afp === "SISTEMA") continue;
      out.push({
        fondo: letra,
        afp,
        color: AFP_COLORS[afp],
        fondoColor: FONDO_COLORS[letra],
        mes: v.mes,
        acumuladoAnio: v.acumuladoAnio,
        ultimos12m: v.ultimos12m,
        prom60m: v.prom60m,
      });
    }
  }
  return out;
}

// Comisiones reales (valor comparativo, campo fee de data.magnet.cl)
export function getComisiones() {
  return resumenReal.comisiones || [];
}

export const PERIODO_DATOS = resumenReal.rentabilidadFondos?.periodo || null;
export const GENERADO_EN = resumenReal.generadoEn || null;

export { FONDO_COLORS, AFP_COLORS };
