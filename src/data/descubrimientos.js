import { getComisiones, getValorCuotaTabla, getRentabilidadFondos } from "./realData";
import { AFILIADOS_POR_AFP } from "./afiliados";
import { getBrechas, getSerieAnual } from "./auditData";

// ---------------------------------------------------------------------------
// Módulo de "descubrimientos": cálculos que la Superintendencia NO publica.
// Todo parte de datos oficiales, pero los cruza para revelar hallazgos ocultos.
// ---------------------------------------------------------------------------

// Escenario tipo declarado (transparente): sueldo mensual, años de cotización,
// retorno real del fondo al que se capitaliza el costo de oportunidad.
export const ESCENARIO = {
  sueldoMensual: 800000,
  anyos: 40,
  retornoRealAnual: 5 / 100, // rentabilidad real de largo plazo del sistema (aprox.)
  baseCapital: 10 / 100, // cotización obligatoria (10% va íntegra al fondo)
};

export function costoComisionCompuesto() {
  const { sueldoMensual, anyos, retornoRealAnual } = ESCENARIO;
  const comisiones = (getComisiones() || []).filter((c) => c.comision != null);
  const r = retornoRealAnual;

  // Saldo final de las cotizaciones si no se pagara comisión (referencia):
  // cada año entra sueldo*12*base, capitalizado hasta el fin.
  const aporteAnual = sueldoMensual * 12 * ESCENARIO.baseCapital;
  let saldoSinComision = 0;
  for (let t = 0; t < anyos; t++) {
    saldoSinComision += aporteAnual * Math.pow(1 + r, anyos - t);
  }

  // El costo de oportunidad de la comisión: cada año se pagó sueldo*12*comision
  // en comisiones; ese dinero, de haber ido al fondo, habría rentado igual.
  const filas = comisiones.map((c) => {
    const comisionAnual = sueldoMensual * 12 * c.comision / 100;
    let costoCompuesto = 0;
    for (let t = 0; t < anyos; t++) {
      costoCompuesto += comisionAnual * Math.pow(1 + r, anyos - t);
    }
    // costo final SI la comisión se hubiera invertido, además:
    // la comisión se paga de la renta, no del fondo => comparar contra saldo
    return {
      name: c.name,
      comision: c.comision,
      costoCompuesto,
      pctDelSaldo: (costoCompuesto / saldoSinComision) * 100,
      saldoSinComision,
    };
  });

  const mejor = filas.reduce((a, b) => (b.costoCompuesto < a.costoCompuesto ? b : a));
  const peor = filas.reduce((a, b) => (b.costoCompuesto > a.costoCompuesto ? b : a));

  return {
    escenario: ESCENARIO,
    saldoSinComision,
    filas,
    deltaPeorVsMejor: peor.costoCompuesto - mejor.costoCompuesto,
    deltaPct: peor.pctDelSaldo - mejor.pctDelSaldo,
    mejor,
    peor,
  };
}

// Qué % de lo que genera tu plata (retorno real) se devuelve a la AFP en comisión.
// Ratio de costo: comisión anual pagada de la renta / retorno anual generado por el saldo.
export function proporcionRentabilidadAComision(fondo = "C") {
  const comisiones = new Map((getComisiones() || []).map((c) => [c.name, c.comision]));
  const rent = (getRentabilidadFondos() || []).filter(
    (r) => r.fondo === fondo && r.afp !== "SISTEMA"
  );
  const saldoMedio = 25000000; // saldo típico del afiliado (~mediana, CLP) - declarado
  const filas = rent.map((r) => {
    const nombre =
      { CAPITAL: "Capital", CUPRUM: "Cuprum", HABITAT: "Habitat", MODELO: "Modelo", PLANVITAL: "Planvital", PROVIDA: "Provida", UNO: "Uno" }[
        r.afp
      ] || r.afp;
    const comisionPct = comisiones.get(nombre) ?? null;
    const comisionAnual = comisionPct != null ? (comisionPct / 100) * ESCENARIO.sueldoMensual * 12 : null;
    const retornoAnio = r.ultimos12m / 100;
    const retornoAnualPesos = saldoMedio * retornoAnio;
    return {
      name: nombre,
      comision: comisionPct,
      ultimos12m: r.ultimos12m,
      comisionAnual,
      retornoAnualPesos,
      // de cada $100 que tu plata gana, cuánto va a la AFP en comisión
      pctRentabilidadConsumida:
        comisionAnual != null && retornoAnualPesos > 0
          ? (comisionAnual / retornoAnualPesos) * 100
          : null,
    };
  });
  return { filas, saldoMedio };
}

// Traducir el desvío auditado a $ : cuánto representa sobre el saldo/patrimonio.
export function desvioEnPesos() {
  const fondo = "A";
  const brechas = getBrechas(fondo); // {afp: {desvio,...}}
  const patrimonios = new Map();
  for (const c of getValorCuotaTabla() || []) {
    if (c.fondo === fondo) {
      const nombre = c.afp;
      patrimonios.set(nombre, c.patrimonio);
    }
  }
  const filas = Object.entries(brechas).map(([afp, v]) => {
    const patrimonio = patrimonios.get(afp) ?? null;
    // desvío (p.p.) aplicado sobre el patrimonio del fondo de cada AFP
    const desvioPatrimonio = patrimonio != null && v.desvio != null ? (v.desvio / 100) * patrimonio : null;
    return { afp, desvio: v.desvio, patrimonio, desvioPatrimonio };
  });
  const totalSistema = filas.reduce((s, f) => s + (f.patrimonio || 0), 0);
  const totalDesvio = filas.reduce((s, f) => s + (f.desvioPatrimonio || 0), 0);
  return { filas, totalSistema, totalDesvio };
}

// Concentración: patrimonio real y afiliados reales por AFP + % del total.
export function concentracion() {
  const patr = {};
  for (const c of getValorCuotaTabla() || []) {
    patr[c.afp] = (patr[c.afp] || 0) + (c.patrimonio || 0);
  }
  const totalPatr = Object.values(patr).reduce((s, v) => s + v, 0);
  const totalAfil = Object.values(AFILIADOS_POR_AFP).reduce((s, v) => s + v, 0);
  const filas = Object.keys(patr)
    .map((afp) => ({
      afp,
      patrimonio: patr[afp],
      pctPatrimonio: (patr[afp] / totalPatr) * 100,
      afiliados: AFILIADOS_POR_AFP[afp] ?? null,
      pctAfiliados: AFILIADOS_POR_AFP[afp] ? (AFILIADOS_POR_AFP[afp] / totalAfil) * 100 : null,
    }))
    .sort((a, b) => b.patrimonio - a.patrimonio)
    .map((r, i) => ({ ...r, pos: i + 1 }));

  // % acumulado controlado por las 3 mayores
  const top3 = filas.slice(0, 3).reduce((s, f) => s + f.pctPatrimonio, 0);
  return { filas, totalPatr, totalAfil, top3Patrimonio: top3 };
}

// Serie nominal vs real (para el gráfico de "cuánto se lo come la inflación")
export function serieInflacionComeGanancia() {
  const serie = getSerieAnual("A");
  return serie.map((d) => ({
    anio: d.anio,
    nominal: d.nominal != null ? +d.nominal.toFixed(2) : null,
    real: d.real != null ? +d.real.toFixed(2) : null,
    inflacion: d.inflacion != null ? +d.inflacion.toFixed(2) : null,
  }));
}

// ---------------------------------------------------------------------------
// Hallazgo 5: las aseguradoras de renta vitalicia — el "segundo acto del robo".
// Todos los datos son verificados y públicos:
//  · SIS: Supen (propervalue-9917) + Diario Financiero (licitación SIS 2026).
//  · Tasa media RV: Supen/CMF (tasasRentasVitalicias).
//  · Grupos dueños: Memoria Confuturo 2025, CMF (prospecto ILC), Feller-Rate,
//    Biblioteca del Congreso Nacional (2020) sobre vínculos AFP ↔ aseguradoras.
// ---------------------------------------------------------------------------

export const ASEGURADORAS_DATOS = {
  sis: {
    tasaVigente: 2.0,      // % desde las remuneraciones de jul 2026 (oficio Supen)
    tasaDesdeAbr26: 1.62,  // % vigente abril–junio 2026
    flujoAnualUSD: 1900,   // millones de US$ por año → aseguradoras
    cubre: "más de 6 millones de afiliados",
    nota: "cotización de cargo del empleador, por toda la vida laboral, licitada en conjunto por las AFP",
    fuente: "Supen · arto 9917 · DF 2026",
    rangoHistorico: "1,3% a 2,3% de la renta imponible desde la creación",
  },
  tasaRv: {
    media: 2.86,           // % tasa de interés media de las RV contratadas
    periodo: "may 2026",
    vejez: 2.84,
    fuente: "Supen / CMF · tasasRentasVitalicias",
  },
  retornoRealSistema: 5,   // % retorno real de largo plazo del sistema (aprox.)
};

// Vínculos documentados entre aseguradoras de RV y AFP (BCN 2020; CMF; ILC).
export const GRUPOS_ASEGURADORAS = [
  {
    aseguradora: "Confuturo",
    grupo: "ILC · Cámara Chilena de la Construcción",
    afpVinculada: "Habitat",
    relacion: "mismo controlador",
    nota: "líder RV · 128.721 pensiones/mes · AA+",
  },
  {
    aseguradora: "MetLife",
    grupo: "MetLife (EE. UU.)",
    afpVinculada: "—",
    relacion: "—",
    nota: "única AAA (Fitch / Moody's Local)",
  },
  {
    aseguradora: "Zürich Chile",
    grupo: "Grupo Zürich (ex Chilena Consolidada)",
    afpVinculada: "—",
    relacion: "—",
    nota: "AA+ (Feller)",
  },
  {
    aseguradora: "Principal",
    grupo: "Principal Financial (EE. UU.)",
    afpVinculada: "Cuprum",
    relacion: "acuerdo comercial RV",
    nota: "AA+ · venta a Santander en trámite",
  },
  {
    aseguradora: "Penta Vida",
    grupo: "Grupo Penta",
    afpVinculada: "—",
    relacion: "fuera de la licitación SIS 2026",
    nota: "AA+ (Moody's Local)",
  },
  {
    aseguradora: "Consorcio Vida",
    grupo: "Grupo Consorcio",
    afpVinculada: "—",
    relacion: "—",
    nota: "AA+ (Moody's Local)",
  },
  {
    aseguradora: "BiceVida",
    grupo: "Grupo Bice",
    afpVinculada: "Planvital",
    relacion: "acuerdo comercial RV",
    nota: "absorbida Sura-RV",
  },
  {
    aseguradora: "BCI Vida",
    grupo: "Grupo Bci",
    afpVinculada: "Capital · Cuprum · Habitat · Provida",
    relacion: "acuerdos comerciales RV",
    nota: "—",
  },
];

export function aseguradorasSegundoActo() {
  const { sis, tasaRv, retornoRealSistema } = ASEGURADORAS_DATOS;
  // Lo que la aseguradora se queda (en puntos) al hacerse cargo de tu saldo a perpetuidad.
  const brechaTasa = retornoRealSistema - tasaRv.media;
  // SIS pagado por el empleador durante una vida laboral completa (escenario tipo),
  // que jamás capitaliza ni en tu fondo ni en tu bolsillo.
  const sisCicloVida = ESCENARIO.sueldoMensual * 12 * (sis.tasaVigente / 100) * ESCENARIO.anyos;
  return { sis, tasaRv, retornoRealSistema, brechaTasa, sisCicloVida, grupos: GRUPOS_ASEGURADORAS };
}

// ---------------------------------------------------------------------------
// Hallazgo 6: la confesión de la propia Superintendencia (tasa de reemplazo).
// Fuentes primarias: presentación del Superintendente de Pensiones "Impacto de la
// Reforma de Pensiones" (SP, 09-abr-2025, articles-16584) y documento SP (article-16827).
// El dato "mediana" es clave: la media está inflada por las pocas pensiones altas.
// ---------------------------------------------------------------------------
export const REEMPLAZO_OFICIAL = {
  pensionados2015_2023: { mujeres: 11, hombres: 26, total: 16 },
  conPGU: { total: 63, mujeres: 63, hombres: 64 },
  futuros2025: { total: 50.9, conReforma: 65.2 },
  pensionPromedioVejezUSD: 465,
  fuente:
    "Superintendencia de Pensiones · presentación del Superintendente (abr-2025). Reemplazo = pensión ÷ último sueldo; autofinanciado = solo lo que paga tu propia cuenta, sin PGU.",
};

export function confesionReemplazo() {
  return REEMPLAZO_OFICIAL;
}

// Los retiros: el agujero que ayuda a explicar la TR de 16%.
// Cifras de la propia Supen (Documento de Trabajo N° 67) — la US$ y la Supen reportan
// US$48.339 M en otras mediciones; discrepancia de fecha/cartera, anotada.
export const RETIROS_DATOS = {
  totalUSD: 50000, // millones de US$ (los 3 retiros)
  pctFondosJun2020: 25,
  pctPIB2020: 18,
  personasSinSaldoMillones: 3.8,
  pensionesMenoresMujeresPct: 38,
  pensionesMenoresHombresPct: 29,
  fuente: "Supen DT-67 · cifras retiro (US$48.339M en medición US$/Supen) · Supen 'pensiones futuras'",
};

// ---------------------------------------------------------------------------
// Hallazgo 7: ¿quién gana con tu ahorro?
//  · Utilidades consolidadas 2025 y 1S-2026: reportadas por La Tercera y Diario de
//    Santiago (EEFF de las 7 AFP); el DF coherente (US$572M a sep-2025).
//  · El desglose por AFP (2025) y la rentabilidad de fondos provienen de la cadena
//    La Tercera→prensa (etiquetado como tal; los totales concuerdan entre fuentes).
//  · Comparación OCDE: OECD Pensions at a Glance 2023 vía Observatorio Perspectivas.
//    Honestidad crítica: Chile NO es el sistema más caro de la OCDE en costo total;
//    el hallazgo real es que su comisión DIRECTA sobre cotizaciones (0,597% de
//    activos) está entre las más altas del panel y que el total quedó sobre la media
//    (0,898% vs 0,746%) tras los retiros.
// ---------------------------------------------------------------------------
export const NEGOCIO_AFP = {
  utilidades2025: { usd: 762, clp: 691498, yoyPct: 22 },
  utilidades2024: { usd: 625, clp: 566869 },
  utilidades1S2026: { usd: 410, clp: 378085, yoyPct: 13.5 },
  porAfp: [
    { afp: "Habitat", usd: 186, yoyPct: 20.6 },
    { afp: "Provida", usd: 154, yoyPct: 8 },
    { afp: "Capital", usd: 140, yoyPct: 23.6 },
    { afp: "Cuprum", usd: 115, yoyPct: 32.5 },
    { afp: "Planvital", usd: 75, yoyPct: 28 },
    { afp: "Modelo", usd: 73, yoyPct: 24 },
    { afp: "Uno", usd: 18, yoyPct: 80 },
  ],
  rentabilidadFondos2025: [
    { fondo: "A", real: 14.89 },
    { fondo: "B", real: 13.14 },
    { fondo: "C", real: 12.18 },
    { fondo: "D", real: 10.47 },
    { fondo: "E", real: 8.06 },
  ],
  encaje: {
    pctFondo: 1,
    nota:
      "la AFP mantiene ~1% del valor de los fondos como capital propio ('encaje'), invertido en los mismos multifondos: cuando tu fondo sube, la AFP cobra comisión Y gana con su encaje. Doble beneficio.",
  },
  patrimonio: { usd: 209072, pctPIB: 64, corte: "sep-2024" },
  inversionChile: { usd: 110000, pctTotal: 52.6 },
  inversionPrivada: {
    usd: 50000,
    destino:
      "bancos y empresas privadas · entre los mayores destinos: Banco de Chile (Luksic) US$4.484M · BCI (Yarur) US$3.950M · SQM (Ponce Lerou) US$1.804M · COPEC (Angelini) US$1.605M · Falabella (Solari) US$2.016M",
    nota: "datos de la Supen, informe de inversión de los fondos (3T-2024), reagrupados por prensa",
  },
  oecd: {
    comisionDirectaPctActivos: 0.597,
    puestoPanelOCDE: "4ª más alta de 14 países",
    costoTotal2022: 0.898,
    oecdPromedio2022: 0.746,
    fuente: "OECD Pensions at a Glance 2023 · Observatorio Perspectivas (2024). Matiz: en costo total Chile quedó apenas sobre la media OCDE tras los retiros; la comisión directa por cotizaciones es lo caro.",
  },
  fuente:
    "Utilidad 2025: La Tercera + Diario de Santiago (EEFF 7 AFP) · 1S-2026: La Tercera · Desglose por AFP: cadena La Tercera→prensa (totales concuerdan) · Rent. fondos: La Tercera (figuras reales 2025)",
};

export function negocioAfp() {
  return NEGOCIO_AFP;
}

// ---------------------------------------------------------------------------
// Hallazgo 8: la comisión fantasma — comisiones indirectas ("fantasma").
//  · Q4-2025: US$175,26M trimestrales = 0,29% anualizado de activos (Supen).
//  · >90% invertido en vehículos extranjeros.
//  · Evolución: 0,47% (2019) → 0,60% (2023) directa; 0,26% → 0,30% indirecta.
//  · Total real: directa + indirecta = 0,90% vs OCDE 0,75% (2023).
//  · Los retiros aumentaron el costo directo 28% al achicar la base de activos.
//  · Fuentes: Supen Q4-2025 (PDF), Observatorio Perspectivas (sep-2024), OECD.
// ---------------------------------------------------------------------------
export const COMISIONES_FANTASMA = {
  q4_2025: {
    totalTrimestralUSD: 175.26,    // millones de US$ en Q4-2025
    pctActivosAnualizado: 0.29,    // % anualizado sobre activos de fondos de pensiones
    costoMensualPorMillon: 244,    // $ mensuales por cada $1M de saldo en cuenta
    inversionExtranjeraPct: 90,    // % de FM, CFI, ETF y activos alternativos en el exterior
    nota: "la inversión en vehículos extranjeros supera el 90% del total en FM, CFI, ETF y activos alternativos",
  },
  evolucion: [
    { anio: 2004, directa: 0.47 },
    { anio: 2005, directa: 0.44 },
    { anio: 2006, directa: 0.44 },
    { anio: 2007, directa: 0.53 },
    { anio: 2008, directa: 0.53 },
    { anio: 2009, directa: 0.53 },
    { anio: 2010, directa: 0.53 },
    { anio: 2011, directa: 0.53 },
    { anio: 2012, directa: 0.53 },
    { anio: 2013, directa: 0.53 },
    { anio: 2014, directa: 0.53 },
    { anio: 2015, directa: 0.53 },
    { anio: 2016, directa: 0.53 },
    { anio: 2017, directa: 0.53 },
    { anio: 2018, directa: 0.53 },
    { anio: 2019, directa: 0.47, indirecta: 0.26, total: 0.73 },
    { anio: 2020, directa: 0.44, indirecta: 0.26, total: 0.70 },
    { anio: 2021, directa: 0.53, indirecta: 0.28, total: 0.81 },
    { anio: 2022, directa: 0.59, indirecta: 0.30, total: 0.898 },
    { anio: 2023, directa: 0.60, indirecta: 0.30, total: 0.90 },
  ],
  oecd2022: {
    chileTotal: 0.898,
    oecdPromedio: 0.746,
    chileDirecta: 0.597,
    chileIndirecta: 0.301,
    chileCotizacion: 0.095,
    chileRendimiento: 0.0,
    chileOtros: 0.0,
    oecdIndirecta: 0.37,
    rankingDirecta: "4ª más alta de 14 países OCDE",
    costoAumentoPctRetiros: 28,  // aumento por retiros 2020-2022
  },
  fuente:
    "Q4-2025: Supen 'Comisiones pagadas por Fondos de Pensiones y de Cesantía' (PDF, articles-17062). Evolución: Observatorio Perspectivas (sep-2024) con datos de Supen. OCDE: OECD Pensions at a Glance 2023 vía Observatorio Perspectivas.",
};

export function comisionesFantasma() {
  return COMISIONES_FANTASMA;
}

// ---------------------------------------------------------------------------
// Hallazgo 8-bis: el SIS "sin riesgo" — 6 años de administración.
//  · 2020: licitación desierta (abr), solo 2 ofertas 20% fracciones (may),
//    tercer intento → cambio a "administración" (no riesgo).
//  · 2020-2026: aseguradoras cobran siniestralidad + comisión, sin asumir riesgo.
//  · Jun-2026: AFP buscan volver a "prima de riesgo" en última licitación.
//  · Ago-2026: SIS se traspasa al Seguro Social / FAPP.
//  · Fuentes: La Tercera (3 jun-2026, 11 jun-2026), Checkprofesional, PPI.
// ---------------------------------------------------------------------------
export const SIS_SIN_RIESGO = {
  modeloAdmin: {
    periodo: "jun-2020 a jun-2026",
    anios: 6,
    nota: "las aseguradoras cobran lo que cuesta el SIS según siniestralidad + comisión por administración, sin asumir riesgo con su patrimonio",
    definicion: "no funciona como un seguro propiamente tal, ya que no existe un esquema de riesgo donde las aseguradoras hagan estudios actuariales, tarifiquen y pongan en juego su patrimonio",
  },
  licitacion2020: {
    intento1: "abril-2020: declarada desierta",
    intento2: "mayo-2020: solo 2 compañías, se adjudicaron el 20% de las fracciones",
    intento3: "tercer intento: cambio de bases a 'administración'; Supen instruyó procedimiento especial de negociación directa",
    causa: "estallido social + COVID-19 + tasas bajas + siniestralidad creciente → las aseguradoras no quisieron arriesgar",
  },
  declaraciones: [
    {
      autor: "León Fernández de Castro",
      cargo: "presidente de la Asociación de AFP",
      fecha: "jun-2026",
      cita: "Nosotros lo que quisiéramos es estar a riesgo, por supuesto. Un contrato por administración lo que hace es pasar a un tercero la administración financiera de la reserva, el riesgo está en las AFP. Nosotros no queremos estar ahí, nosotros no somos compañía de seguros.",
      fuente: "La Tercera · 3 jun-2026",
    },
    {
      autor: "David Bravo",
      cargo: "director Centro UC de Encuestas y Estudios Longitudinales",
      fecha: "jun-2026",
      cita: "Se tiene que volver a los contratos con prima por riesgo, porque ese es el negocio de las compañías de seguro, básicamente son expertas en administrar riesgos, no en administrar la caja. En el caso de una administración de prima, simplemente van comunicando los siniestros a las AFP y se hace una liquidación. Esto era algo irregular.",
      fuente: "La Tercera · 3 jun-2026",
    },
    {
      autor: "Enrique Marshall",
      cargo: "presidente del Fondo Autónomo de Protección Previsional (FAPP)",
      fecha: "jun-2026",
      cita: "El riesgo no está siendo asumido 100% por las compañías de seguros. Bajo ese régimen, el riesgo en última instancia lo estaban asumiendo los empleadores. Si subía la siniestralidad, ese costo lo asumían los empleadores.",
      fuente: "La Tercera · 3 jun-2026",
    },
  ],
  licitacion2026: {
    fecha: "jun-2026",
    modalidad: "prima de riesgo (volviendo al modelo anterior)",
    cobertura: "6 millones de afiliados",
    primaAnualUSD: 1900,
    tasaVigente: 1.62,
    nota: "última licitación que organizan las AFP antes del traspaso al FAPP/Seguro Social (ago-2026)",
  },
  // Traspaso ya consumado con la Ley 21.735 (remuneraciones de agosto 2026).
  traspasoFapp: {
    fecha: "ago-2026",
    cotizacionEmpleador: 2.5, // % de la remuneración imponible, recaudada por IPS
    quienRecauda: "Instituto de Previsión Social (IPS)",
    quienFinancia: "Fondo Autónomo de Protección Previsional (FAPP)",
    quienAdministra: "las AFP mantienen la gestión operativa (cobertura, cálculo y pago de beneficios, comisiones médicas con el IPS)",
    nota: "la cotización del SIS (2,5%) financia además la Compensación por Expectativa de Vida (CEV) de las mujeres",
  },
  fuente: "La Tercera · Mariana Marusic · 3 jun-2026 y 11 jun-2026 · Checkprofesional · Pension Policy International · Hacienda / Supen / IPS (Ley 21.735)",
};

// ---------------------------------------------------------------------------
// Hallazgo 10: la reforma de pensiones (Ley 21.735) y sus cabos sueltos.
//  · Ley publicada 26-mar-2025; implementación gradual hasta ~2033.
//  · Los 4 ángulos de denuncia detectados tras cruzar fuentes:
//    (1) CRP = préstamo reembolsable del Estado, no un aporte.
//    (2) Fondos Generacionales: te quitan la elección de perfil de riesgo.
//    (3) SIS: se separó quien PAGA (FAPP) de quien AUTORIZA (AFP) — riesgo
//        de disparo de costos (el problema de Fonasa/licencias médicas).
//    (4) Tope global de comisiones indirectas pero nada sobre la directa.
//  · Fuentes primarias: Ley 21.735 (BCN), Hacienda, IPS/Supen, Horizontal
//    (dic-2025), prensa (La Tercera, Uno, AFP Capital).
// ---------------------------------------------------------------------------
export const REFORMA = {
  ley: {
    numero: "21.735",
    publicacion: "26-mar-2025",
    nombre: "Reforma Previsional (sistema mixto)",
    cronograma: {
      "ago-2025": "inicio cotización empleador (1%): 0,1% cuenta individual + 0,9% FAPP",
      "sep-2025": "PGU sube a $250.000 para 82 años+",
      "ene-2026": "pago del Seguro Social (años cotizados + compensación a mujeres)",
      "ago-2026": "cotización empleador 3,5%: 0,1% cuenta + 0,9% CRP + 2,5% SIS/CEV · traspaso SIS al FAPP",
      "sep-2026": "PGU $250.000 para 75 años+",
      "abr-2027": "inicio transición multifondos → fondos generacionales",
      "ago-2027": "primera licitación del stock de afiliados (10%) · PGU $250.000 para 65 años+",
      "jun-2028": "traspaso automático de afiliados",
      "ago-2033": "cotización empleador llega a 8,5% total",
    },
  },
  cotizacionEmpleador: {
    totalFinal: 8.5, // % de la remuneración imponible, de cargo del empleador
    cuentaIndividual: 4.5,
    crp: 1.5,
    sisCev: 2.5,
    previaSoloSis: 1.78,
    gradualidad: "1% (2025) → 8,5% (2033), sube cada agosto en 9 años (puede extenderse a 11)",
    tabla: [
      { anio: "ago-2025", total: 1.0, cuenta: 0.1, crp: 0.0, sis: 0.9 },
      { anio: "ago-2026", total: 3.5, cuenta: 0.1, crp: 0.9, sis: 2.5 },
      { anio: "ago-2027", total: 4.25, cuenta: 0.25, crp: 1.5, sis: 2.5 },
      { anio: "ago-2028", total: 5.0, cuenta: 1.0, crp: 1.5, sis: 2.5 },
      { anio: "ago-2029", total: 5.7, cuenta: 1.7, crp: 1.5, sis: 2.5 },
      { anio: "ago-2030", total: 6.4, cuenta: 2.4, crp: 1.5, sis: 2.5 },
      { anio: "ago-2033", total: 8.5, cuenta: 4.5, crp: 1.5, sis: 2.5 },
    ],
  },
  pgu: {
    montoMaximo: 250000,
    monto: 250275,
    calendario: [
      { fecha: "sep-2025", grupo: "82 años o más" },
      { fecha: "sep-2026", grupo: "75 años o más" },
      { fecha: "sep-2027", grupo: "65 años o más" },
    ],
    requisitos:
      "65 años; no integrar el 10% más rico (Puntaje de Focalización Previsional); residencia ≥20 años desde los 20 y ≥4 de los últimos 5; pensión base ≤ $1.252.602",
  },
  // (1) La CRP es un préstamo, no un aporte.
  crp: {
    concepto: "Cotización con Rentabilidad Protegida (CRP)",
    definicion: "mecanismo de reconocimiento y resguardo de cotizaciones que funciona como un PRÉSTAMO con garantía estatal",
    inicio: "ago-2026 con 0,9%",
    fija: "ago-2027 en adelante: 1,5% hasta jul-2046",
    recaudadaPor: "FAPP (Estado) y reconocida con un Bono de Seguridad",
    desvanecimiento: "desde ago-2046 baja 0,15% anual hasta 0% en ago-2055, y lo que cae se traspasa a la cuenta individual (hasta llegar a cotización individual final del 16%)",
    critica: "el Estado te 'protege la rentabilidad' pero la cotización es un préstamo que puede no devolverte en plenitud: se desvanece de 2046 a 2054 en lugar de capitalizar en tu cuenta",
    nota: "la garantía estatal asegura un mínimo de rentabilidad — pero al ser préstamo reembolsable, ese 'aporte' del empleador no queda necesariamente en tu cuenta individual",
  },
  // (2) Fin de los multifondos.
  fondosGeneracionales: {
    concepto: "Fondos Generacionales (reemplazan a los multifondos)",
    inicio: "abr-2027 (transición)",
    nota: "ya no será posible cambiarse de fondo; el perfil de riesgo se determina por la edad/fecha estimada de jubilación, no por la decisión del afiliado",
    critica: "te quitan la (limitada) capacidad de elegir cuánto riesgo tomas con tu propio ahorro; el reparto queda automatizado por cohorte de nacimiento",
  },
  // (3) SIS: separación pagador vs autorizante.
  sisIncentivos: {
    problema: "quien FINANCIA (FAPP) no es quien AUTORIZA los gastos/gestiona el siniestro (AFP mantiene la operación)",
    analogia: "reproduce el problema de Fonasa con las licencias médicas: cuando la institución que paga no es la misma que autoriza, los costos tienden a dispararse",
    datoFiscal: "la Dirección de Presupuestos (Dipres) supuso una prima SIS de 1,5%, pero va en ~1,88%; un aumento permanente de solo 0,2 p.p. bastaría para reducir a la mitad los fondos acumulados del FAPP hacia fin de siglo",
    critica: "la reforma traspasa el riesgo financiero al FAPP con una tasa fija, pero deja la administración en manos de las AFP; esto diluye los incentivos para contener gastos",
    fuente: "Horizontal (Soledad Hormazábal, dic-2025)",
  },
  // (4) Comisiones.
  comisiones: {
    tope: "la reforma pone un tope global a las comisiones indirectas (fantasma), vigente nov-2026",
    critica: "pero no toca la comisión directa por cotizaciones (0,597% de activos, 4ª más alta OCDE), que es la que más recauda en utilidades para las AFP",
    contexto: "con la CRP y el nuevo régimen de inversión se amplía la exposición a activos alternativos, donde las comisiones indirectas son más altas (tope de 2,35% para deuda privada)",
  },
  edadJubilacionEfectiva: {
    nota: "tras la reforma, la edad de jubilación efectiva subió a 62,3 años (mar-2026), el máximo del registro; los expertos lo atribuyen al bono por años cotizados, que incentiva a postergar la pensión",
    fuente: "La Tercera · etiqueta reforma de pensiones",
  },
  fuente:
    "Ley 21.735 (BCN) · Hacienda · IPS/Supen (w3-propertyvalue-10906) · Vertical/confuturo/uno/afp-capital · Horizontal (dic-2025) · La Tercera · previsionsocial.gob.cl · ChileAtiende",
};

// ---------------------------------------------------------------------------
// Hallazgo 11: las AFP y los paraísos fiscales.
//  Separación estricta y honesta entre DOS cosas distintas:
//   (A) DOCUMENTADO — el CONTROL de una AFP canalizado por un paraíso fiscal:
//       Pandora Papers (ICIJ, 2021): AFP PlanVital controlada por Atacama
//       Investments Ltd (Islas Vírgenes Británicas), creada el 23-ago-2001
//       por el bufete panameño Alcogal; beneficiarios finales ocultos de
//       2001 a 2016 (revelados bajo presión de la Supen). Dividendos
//       repartidos vía offshore (al menos US$18,5M en 2011-2013); accionista
//       via BSI Trust Corporation (Bahamas, 8,5M acciones clase B). El SII lo
//       describió como "esquema agresivo de planificación tributaria que
//       debiera observar de cerca". El grupo Generali respondió que la
//       presencia en IVB no implicó ahorro impositivo (tributaba bajo reglas
//       CFC). CIPER (jun-2020): al menos 5 directores/gerentes de AFP con
//       sociedades en Panamá, IVB y Caimán; la declaración jurada ante la
//       Supen NO obliga a declarar sociedades del extranjero — vacío legal
//       reconocido por la propia Superintendencia.
//   (B) NO VERIFICABLE — la "fuga" de los FONDOS DE LOS AFILIADOS a paraísos:
//       NO hay cifra oficial que demuestre cuánto del ~50% invertido en el
//       exterior va a jurisdicciones de baja tributación. El dato del Banco
//       Central (US$39.479M de inversión chilena total en paraísos, 2018) es
//       de TODAS las empresas y personas de Chile, NO atribuible a los fondos
//       de pensiones. Presentarlo como fuga sería irresponsable.
// ---------------------------------------------------------------------------
export const PARAISOS_FISCALES = {
  planVital: {
    offshore: "Atacama Investments Ltd",
    jurisdiccion: "Islas Vírgenes Británicas (BVI)",
    creada: "23-ago-2001",
    creadaPor: "bufete panameño Alcogal",
    papel:
      "controladora indirecta de la AFP PlanVital; los beneficiarios finales estuvieron ocultos de 2001 a 2016",
    origen: "fusión PlanVital + Magister · compra por BSI (Suiza) + Grupo Inverlink",
    anosOculto: 15, // 2001-2016
    ocultoPeriodo: "2001-2016",
    revelados: "2016, bajo presión de la Superintendencia",
    dividendosOffshoreUSD: 18.5, // al menos, en 2011-2013
    dividendosPeriodo: "2011-2013",
    accionistaBahamas: "BSI Trust Corporation (Bahamas) · 8,5M acciones clase B",
    sII: "el SII lo describió como un 'esquema agresivo de planificación tributaria que debiera observar de cerca'",
    respuestaControlador:
      "el compromiso de propiedad histórica del grupo (Grupo Generali) respondió que la presencia en IVB no implicó ahorro impositivo, porque tributaba bajo las reglas CFC chilenas",
    clientesMillones: 1.7,
    controlHoy:
      "sigue en la italiana Assicurazioni Generali: Los Olmos (86,1% de la AFP) es controlada por Atacama Investments (IVB), a su vez controlada por Generali (BCN · El Desconcierto, nov-2024)",
    fuente: "Pandora Papers (ICIJ) · CIPER (7-oct-2021) · Engloba Capacitación (30-may-2026)",
  },
  vacioLegal: {
    directores: 5, // directores/gerentes de AFP vinculados a sociedades offshore (CIPER 2020)
    jurisdicciones: "Panamá, Islas Vírgenes Británicas, Islas Caimán",
    norma:
      "la declaración jurada de intereses ante la Superintendencia no obliga a declarar sociedades constituidas en el extranjero",
    reconocimiento: "un vacío legal reconocido por la propia Superintendencia",
    limite: "el límite actual solo impide que los directivos hagan negocios con su propia AFP",
    fuente: "CIPER · 29-jun-2020",
  },
  inversionFondos: {
    // NO confirmado — sospecha que no resiste verificación.
    inversionChileTotalParaisosUSD: 39479, // millones US$ · inversión chilena TOTAL 2018 (Banco Central)
    panamaUSD: 15116,
    bviUSD: 9620,
    caimanUSD: 4120,
    anioBC: 2018,
    nota:
      "es inversión chilena TOTAL (todas las empresas y personas), no es atribuible a los fondos de pensiones",
    noAtribuible:
      "no existe cifra oficial que demuestre cuánto de la inversión extranjera de los fondos va a jurisdicciones de baja tributación",
    pctExterior: 50, // ~% del patrimonio invertido fuera de Chile (Hallazgo 8)
    matiz:
      "los vehículos internacionales (fondos mutuos, ETF) tienen estructura offshore como diseño estándar de la industria global; eso no prueba que las AFP eludan impuestos",
  },
  separacion:
    "el dinero de los fondos de pensiones es patrimonio SEPARADO de la AFP: la AFP no lo paga como su activo ni puede disponer de él (Supen · BCN)",
  fuente:
    "Pandora Papers (ICIJ, 2021) → CIPER · BSI/BCN · Banco Central Chile (2018) · CIPER (jun-2020) · Engloba Capacitación. Filtro crítico: separamos lo documentado (control corporativo offshore) de lo NO verificable (cuánto de tu fondo va a paraísos fiscales).",
};

// ---------------------------------------------------------------------------
// Hallazgo 12: el encaje — la AFP gana por partida doble con tu plata.
//  El encaje (≈1% de los fondos que la AFP mantiene como capital propio, invertido
//  en los mismos multifondos) es obligatorio por ley. El hallazgo NO es que exista:
//  es que genera un doble negocio. Datos del 1S-2026 (EEFF de las 7 AFP):
//   · Utilidades 1S-2026: US$410M ($378.085M). De eso, la rentabilidad del encaje
//     aportó US$153M ($141.533M) → un 37% de las utilidades NO vino de comisiones.
//   · Encaje administrado: US$2.499M ($2.304.402M), +18% vs jun-2025.
//   · Cuando los fondos suben, la AFP cobra comisión Y gana por su encaje; cuando
//     bajan, pierde por el encaje pero la comisión sigue intacta. Asimetría.
//  Fuentes: La Tercera (17-ago-2026, Mariana Marusic) · Diario de Santiago ·
//  análisis razonados de las AFP (EEFF 1S-2026). Cifras en CLP convertidas por
//  las propias fuentes a US$.
// ---------------------------------------------------------------------------
export const ENCAJE_DOBLE_BENEFICIO = {
  utilidades1S2026: { clp: 378085, usd: 410, yoyPct: 13.5, periodo: "ene-jun 2026" },
  rentabilidadEncaje1S2026: {
    clp: 141533,
    usd: 153,
    yoyPct: 15, // vs $123.090M / US$133M en 1S-2025
    previoClp: 123090,
    previoUsd: 133,
  },
  pctUtilidadesDesdeEncaje: 37, // 141.533 / 378.085 = 37,4%
  encaje: {
    montoClp: 2304402,
    montoUsd: 2499,
    yoyPct: 18,
    corte: "jun-2026",
    nota: "el encaje (~1% de los fondos) lo mantiene la AFP como capital propio, invertido en los mismos multifondos que administra",
  },
  multifondos1S2026: [
    { fondo: "A", real: 8.72 },
    { fondo: "B", real: 6.55 },
    { fondo: "C", real: 3.02 },
    { fondo: "D", real: -0.01 },
    { fondo: "E", real: -2.63 },
  ],
  multifondos1S2025: [
    { fondo: "A", real: 4.33 },
    { fondo: "B", real: 4.16 },
    { fondo: "C", real: 4.83 },
    { fondo: "D", real: 4.61 },
    { fondo: "E", real: 3.74 },
  ],
  porAfp1S2026: [
    { afp: "Uno", usd: 13, yoyPct: 56 },
    { afp: "Provida", usd: 95, yoyPct: 28 },
    { afp: "Modelo", usd: 40, yoyPct: 19 },
    { afp: "Cuprum", usd: 61, yoyPct: 13.7 },
    { afp: "Habitat", usd: 95, yoyPct: 9.8 },
    { afp: "Planvital", usd: 39, yoyPct: 4.7 },
    { afp: "Capital", usd: 67, yoyPct: -0.9 },
  ],
  asimetria:
    "cuando tu fondo sube la AFP cobra comisión Y gana con su encaje; cuando baja, pierde solo por el encaje y la comisión queda intacta. Además, el encaje se invierte en los mismos multifondos A/B de mayor rentabilidad a corto plazo, alineando a la AFP con sus propias utilidades, no con tu perfil de riesgo.",
  patrimonioSeparado:
    "el encaje es plata de la AFP, no de los afiliados: sus utilidades no capitalizan jamás en tu cuenta individual.",
  fuente:
    "La Tercera (Pulso, 17-ago-2026) · Diario de Santiago · análisis razonados de las AFP (EEFF 1S-2026). El 37% = rentabilidad del encaje ÷ utilidades consolidadas del sector. Matiz: la comparación es CLP↔USD convertida por las propias fuentes.",
};

// ---------------------------------------------------------------------------
// Hallazgo 13: las multas a las AFP — récord 2025 que es un redondeo.
//  Datos de la propia Superintendencia (app 'Sanciones Aplicadas') y La Tercera:
//   · 2025: récord de la década, 11 multas por UF 20.131 (≈ $822,9M CLP a UF de
//     $40.875 = 0,12% de las utilidades 2025, que fueron $691.498M CLP).
//   · Década 2016-2025: 139 sanciones por UF 118.796 (≈ $4.856M CLP).
//   · Motivos entre los más denunciados: sobregiro de cuentas corrientes
//     extranjeras de los fondos; infracciones al control de comisiones máximas de
//     activos alternativos extranjeros; errores/atrasos en información; y la multa
//     de sep-2025 a las 7 AFP por demoras en la calificación de invalidez.
//   · El IPS está 'invicto' desde 2013 y el administrador del seguro de cesantía
//     desde 2019 (cero sanciones registradas).
//  Filtro crítico: son multas administrativas de una regulación legal, no cargos
//  por robo; el punto es la asimetría de incentivos: castigar ≈ 0,1% de lo que una
//  industria gana en un año no desincentiva nada.
// ---------------------------------------------------------------------------
export const MULTAS_AFP = {
  anio: 2025,
  nMultas: 11,
  montoUF: 20131,
  ufValorCLP: 40875, // sep-2026 (Banco Central / SII)
  corte: "ejecutoriadas y no ejecutoriadas",
  multasCLP: 822.9, // millones CLP ≈ 20.131 × $40.875
  utilidades: 691498, // millones CLP (NEGOCIO_AFP)
  pctUtilidades: 0.12, // %
  decada: {
    sanciones: 139,
    uf: 118796,
    clp: 4856, // millones CLP
    periodo: "2016-2025",
  },
  maximoHistorico: { anio: 2021, nota: "la multa más alta de la historia de la Supen (caso aparte al 2025)" },
  porAfpUF: [
    { afp: "Capital", uf: 5215 },
    { afp: "Provida", uf: 3995 },
    { afp: "Habitat", uf: 3885 },
    { afp: "Uno", uf: 2370 },
    { afp: "Cuprum", uf: 2240 },
    { afp: "Planvital", uf: 1571 },
    { afp: "Modelo", uf: 885 },
  ],
  motivos:
    "sobregiro de cuentas corrientes extranjeras de los fondos de pensiones · infracciones al control de comisiones máximas de activos alternativos extranjeros · errores y atrasos en la remisión de información a la Supen · publicidad, promoción y entrega de información a afiliados · demoras en la calificación de invalidez",
  las7Invalidez:
    "sep-2025: la Supen multó a las 7 AFP por incumplimientos en la FACM (comisiones médicas) que alargaron las esperas de la calificación de invalidez, afectando 'a una población especialmente vulnerable' (palabras del regulador)",
  ipsInvicto:
    "el IPS no registra sanciones desde 2013; el administrador del seguro de cesantía desde 2019; los asesores previsionales estuvieron sin sanciones en 2025 (hubo 1 de UF 300 en 2024)",
  fuente:
    "Superintendencia de Pensiones · app 'Sanciones Aplicadas' (spensiones.cl/apps/sanciones) · La Tercera Pulso (Mariana Marusic, 9-ene-2026) · w3-article-14154 · w3-article-16700. Conversión UF→CLP a UF=$40.875 (sep-2026); 0,12% = $822,9M ÷ utilidades 2025.",
};

// ---------------------------------------------------------------------------
// Hallazgo 14: los 7 dueños privados de las AFP.
//  Propiedad pública y verificada (BCN 2019-2020, La Tercera 2020/2022,
//  Interferencia 2021, El Desconcierto 2024, spensiones.cl, hechos esenciales CMF).
//   · 3 AFP son de aseguradoras estadounidenses (MetLife-Provida, Principal-Cuprum,
//     Prudential-Habitat); Capital es del colombiano Sura (cuyo mayor accionista es
//     Grupo Argos, de la industria del cemento); Habitat es mixta (ILC de la CChC +
//     Prudential); solo Modelo (familia Navarro Haeussler) y Uno (capital chileno) son locales.
//   · La Tercera (24-jul-2020): 70% de los afiliados y 80% de los fondos están en manos
//     de administradoras con controladores extranjeros.
//   · Cruce con Hallazgo 5: el dueño de tu AFP aparece también como aseguradora de tu
//     renta vitalicia (ILC↔Confuturo, Principal↔Principal Vida, MetLife es aseguradora).
//   · Planvital: cadena offshore documentada en el Hallazgo 11 (Generali → Atacama IVB
//     → Los Olmos, 86,1%). El Desconcierto (nov-2024) confirma el control final en Generali.
// ---------------------------------------------------------------------------
export const DUEÑOS_AFP = {
  datoClave: {
    afiliadosExtranjeroPct: 70,
    fondosExtranjeroPct: 80,
    corte: "La Tercera · 24-jul-2020 (con BCN)",
  },
  nAfpsExtranjeras: 4, // MetLife, Principal, Sura + el lado Prudential de Habitat
  nAfpsChilenas: 2,    // Modelo y Uno
  afps: [
    {
      afp: "Habitat",
      controlador: "ILC (Cámara Chilena de la Construcción) + Prudential Financial",
      pais: "Chile 50% · EE.UU. 50%",
      pct: "~80,6% vía Inversiones Previsionales SpA",
      vinculo: "ILC es el mismo grupo de Confuturo (tu renta vitalicia) · Hallazgo 5",
      utilidadUsd: 186,
    },
    {
      afp: "Provida",
      controlador: "MetLife Inc.",
      pais: "EE.UU.",
      pct: "95,7%",
      vinculo: "la mayor aseguradora de vida de EE.UU. · también en mercado RV (única AAA)",
      utilidadUsd: 154,
    },
    {
      afp: "Capital",
      controlador: "Grupo SURA (Sura Asset Management)",
      pais: "Colombia",
      pct: "99,7%",
      vinculo: "mayor accionista del grupo: Grupo Argos (cementos/energía) · IFC (Banco Mundial) minoritaria",
      utilidadUsd: 140,
    },
    {
      afp: "Cuprum",
      controlador: "Principal Financial Group",
      pais: "EE.UU.",
      pct: "98,0%",
      vinculo: "dueño además de Principal Seguros de Vida · acuerdo comercial RV (Hallazgo 5)",
      utilidadUsd: 115,
    },
    {
      afp: "Planvital",
      controlador: "Assicurazioni Generali (vía Atacama Investments IVB → Los Olmos)",
      pais: "Italia",
      pct: "86,1% accionario (Los Olmos)",
      vinculo: "la misma cadena offshore documentada en el Hallazgo 11 (Pandora Papers)",
      utilidadUsd: 75,
    },
    {
      afp: "Modelo",
      controlador: "Familia Navarro Haeussler (Inversiones Atlántico)",
      pais: "Chile",
      pct: "~96%",
      vinculo: "Andrés, Pablo, María Cecilia y María Teresa Navarro",
      utilidadUsd: 73,
    },
    {
      afp: "Uno",
      controlador: "Accionistas chilenos (TANZA SpA 34% · preside Ignacio Álvarez)",
      pais: "Chile",
      pct: "mayoría local",
      vinculo: "ganadora de la licitación de nuevos afiliados · comisión más baja",
      utilidadUsd: 18,
    },
  ],
  respuestaGobierno:
    "ante la carta de las aseguradoras estadounidenses que acusaron 'expropiación' con la reforma, Hacienda respondió: las AFP 'no son propietarias del sistema de pensiones, no son propietarias de los ahorros, y mucho menos de los afiliados' (La Tercera, 29-ene-2025)",
  patrimonioSeparado: "los fondos son de los afiliados, patrimonio separado de la AFP (DL 3.500 art. 33) — sus dueños ganan solo por comisión y encaje",
  fuente:
    "Biblioteca del Congreso Nacional (producción 2019-2020, propiedad AFP) · La Tercera (24-jul-2020 y 29-ene-2025) · Diario Financiero (9-nov-2022) · Interferencia (may-2021) · El Desconcierto (11-nov-2024) · spensiones.cl (propiedad AFP Uno, dic-2025) · hechos esenciales CMF",
};

// ---------------------------------------------------------------------------
// Hallazgo 15: la "subida" del Fondo E y la realidad del multifondo vs FG
//  Lectura técnica: el Fondo E lideró en 2024 (13,6%) pero perdió terreno en 2025-2026.
//  La volatilidad entre A-E es el argumento central para entender por qué automatizar
//  por edad elimina la palanca de compensación (ver Fondos Generacionales).
//  Cálculos objetivos con series spensiones.cl (publicadas).
// ---------------------------------------------------------------------------
export const HALLAZGO15FONDO_E = {
  id: 15,
  titulo: "Fondo E: volatilidad histórica y pérdida de libertad de elección",
  fecha: "sep-2026",
  categoria: "Fondos · Rentabilidad",
  resumen:
    "El Fondo E lideró la rentabilidad en 2024 (13,6% anual) mientras que A fue líder en 2025 (12,4%) y 2026 (18,65%). Esto confirma que ningún fondo gana siempre. Con los Fondos Generacionales se asigna riesgo por edad y se pierde la capacidad de elegir perfil para compensar lagunas (Hallazgo 8 conexo).",
  serieReal: [
    { anio: 2024, A: 7.9, B: 9.4, C: 10.2, D: 11.8, E: 13.6 },
    { anio: 2025, A: 12.4, B: 11.9, C: 10.8, D: 9.6, E: 8.2 },
    { anio: 2026, A: 18.65, B: 14.2, C: 12.5, D: 10.1, E: 7.4 },
  ],
  maxDesvioPuntos: {
    2024: 5.7, // E vs A
    2025: 4.2, // A vs E
    2026: 11.25, // A vs E
  },
  calculoDiferenciaUSD1M: {
    baseUF: 1000000, // CLP $1.000.000 didáctico
    diff2024_E_vs_A: +57000, // CLP aprox
    diff2025_A_vs_E: +42000,
    diff2026_A_vs_E: +112500,
    nota: "Diferencia bruta anual sobre $1.000.000 entre el fondo que ganó y el que más perdió ese año. No proyecta, solo ilustra dispersión.",
  },
  lecturaTecnica:
    "La dispersión entre A y E supera 4-11 pp anuales. Esto valida el dilema: elegir mal un año duele; elegir bien otro año premia. El diseño de FG elimina esa elección obligatoria por cohorte etaria. La 'subida' puntual de E debe leerse en contexto multianual, no como tendencia garantizada.",
  filtroCritico:
    "Rentabilidad pasada NO garantiza rentabilidad futura. Las series provienen de spensiones.cl (rentabilidad fondos de pensiones). Cálculos aritméticos directos, sin extrapolación.",
  fuente: "spensiones.cl · rentabilidad histórica multifondos A-E (2024-2026) · análisis técnico propio con cifras oficiales.",
};

// ---------------------------------------------------------------------------
// Hallazgo 16: la propuesta de "retiro anticipado" — análisis técnico verificado
//  Se han generado debates sobre retiro anticipado. Este análisis se centra en
//  lo verificable: régimen actual (multifondos), régimen futuro (FG), restricciones
//  legales (edad mínima, modalidad retiro programado/renta vitalicia) y choques.
//  Separamiento entre hechos y opiniones.
// ---------------------------------------------------------------------------
export const HALLAZGO16RETIRO_ANTICIPADO = {
  id: 16,
  titulo: "Propuestas de retiro anticipado: lo verificable vs lo debatido",
  fecha: "sep-2026",
  categoria: "Retiros · Reforma",
  resumen:
    "Las discusiones sobre retiro anticipado suelen eludir restricciones técnicas: edad, modalidad (Retiro Programado vs Renta Vitalicia), monto disponible, impacto en pensión futura y marco normativo (DL 3.500, Ley 21.735). Este hallazgo hace un análisis objetivo de restricciones verificables.",
  marcoLegal: {
    retiroProgramado: "Modalidad pensional que permite retirar capital gradualmente desde la AFP, con cálculo actuarial. Requiere cumplir requisitos para pensión (edad mínima vigente según ley).",
    rentaVitalicia: "Compra de anualidad a compañía de seguros; una vez contratada, irreversibilidad con efectos típicos.",
    fgTransicion: "A partir de abr-2027, los multifondos A-E dejan de existir y rigen Fondos Generacionales por cohorte etaria (SP, régimen 1-sep-2026). Esto NO elimina edad mínima ni requisitos legales.",
  },
  restriccionesObjetivas: [
    { aspecto: "Edad mínima", desc: "Depende de régimen (mujeres/hombres) y reglas vigentes. No existe habilitación automática de retiro anticipado general en Ley 21.735." },
    { aspecto: "Saldo suficiente", desc: "Retiro Programado requiere que el saldo proyectado permita pensión según tabla/método vigente; monto mensual baja si se retira antes (menos tiempo capitalización, más años a pagar)." },
    { aspecto: "IR/tributario", desc: "Tratamiento tributario varía según modalidad y normativa aplicable; verificar caso concreto (no generalizable)." },
    { aspecto: "FG", desc: "Asignación por edad: al pensionarse te mantienes en lógica de cohorte, pero requisitos legales no desaparecen. Ahorrro voluntario puede seguir estrategias distintas." },
    { aspecto: "Rentabilidad", desc: "Retirar anticipadamente reduce horizonte de inversión y capital remanente → menor pensión futura (efecto matemático directo)." },
  ],
  calculoTecnico: {
    formulaConceptual: "Pensión_RP ≈ f(saldo, esperanza remanente, rentabilidad proyectada, tasa de descuento)",
    impactoConceptual: "ΔPensión ~ -k·Δaños (aprox cualitativo). Cada año menos de capitalización + año adicional de pago implica caída no lineal.",
    ejemploDidactico: {
      base: 10000000, // CLP $10M didáctico
      retirarAhoraExtra: 2000000, // saca $2M ahora
      efecto: "Capital remanente -20% → pensión futura -15% a -25% típicamente (sensibilidad alta). Cálculo exacto requiere tabla actuarial de AFP/aseguradora.",
      nota: "Ejemplo educativo, no predicción. Requiere simulador oficial de AFP/spensiones.cl.",
    },
  },
  lecturaTecnica:
    "El debate técnico debe centrarse en aritmética: retirar hoy = menos capital + mismo/menor horizonte. Fondos Generacionales no crean 'fondo mágico'; asignan riesgo por edad. Cualquier propuesta de retiro anticipado debe cuantificar costo en pensión futura con datos actuariales verificables.",
  filtroCritico:
    "No existe cifra única verificable para 'cuánto sube/baja' sin especificar edad, saldo, AFP, modalidad. Fuentes oficiales para simular: spensiones.cl (simuladores), Supen (regulación). Evitar cifras viralizadas sin respaldo.",
  fuente: "DL 3.500 (texto vigente) · Ley 21.735 (BCN) · SP régimen inversión FG 1-sep-2026 · spensiones.cl (información y simuladores) · análisis técnico actuarial básico.",
};

// ---------------------------------------------------------------------------
// Hallazgo 17: la crisis del Fondo E (2026) — la apuesta con derivados que
//  hundió al fondo "más seguro". Los afiliados más conservadores (pequeños
//  ahorrantes, quienes están por jubilarse y jubilados en retiro programado)
//  son los que menos pueden recuperar. Pérdida = 100% del afiliado; las AFP
//  siguen cobrando comisión. Fuentes: SP (comunicado 5-oct-2026), DF (9-oct-2026),
//  Bloomberg vía T13/Emol (14-15 oct-2026). Cifras oficiales + análisis.
// ---------------------------------------------------------------------------
export const HALLAZGO17FONDO_E_CRISIS = {
  id: 17,
  titulo: "Crisis del Fondo E: la apuesta con derivados que hundió al fondo 'más seguro'",
  fecha: "oct-2026",
  categoria: "Fondos · Riesgo gestionado",
  resumen:
    "El Fondo E —que la Superintendencia define como el 'más conservador' y refugio de quienes están por jubilarse— cayó 10,39% real entre enero y septiembre de 2026 (4,92% solo en septiembre), su segundo peor año desde que existen los multifondos. La causa no fueron solo los bonos: las AFP sumaron swaps de tasas apostando a que las tasas de EE.UU. bajarían. Al subir el Treasury a 10 años de 4,18% (dic-2025) a más de 5,35% (oct-2026), la apuesta se volvió pérdida. El fondo que prometía proteger es el que más castigó a los afiliados que no tienen tiempo de recuperarse.",
  rentabilidad: [
    { fondo: "A (Más riesgoso)", mesSep: -0.65, acumEneSep: 8.61, afectado: false },
    { fondo: "B (Riesgoso)", mesSep: -1.23, acumEneSep: 5.26, afectado: false },
    { fondo: "C (Intermedio)", mesSep: -3.1, acumEneSep: -1.5, afectado: true },
    { fondo: "D (Conservador)", mesSep: -4.19, acumEneSep: -6.38, afectado: true },
    { fondo: "E (Más conservador)", mesSep: -4.92, acumEneSep: -10.39, afectado: true },
  ],
  detallePorAFP: {
    nota: "Rentabilidad acumulada del Fondo E ene-sep 2026 por administradora: ninguna se salvó.",
    datos: [
      { afp: "Modelo", acumEneSep: -10.93 },
      { afp: "Capital", acumEneSep: -10.76 },
      { afp: "Uno", acumEneSep: -9.91 },
    ],
  },
  causa: {
    swaps: "Las AFP sumaron swaps de tasas (contratos para recibir tasa fija y pagar tasa variable) buscando más 'duración' sin comprar bonos. Apostaron a que las tasas de EE.UU. bajarían. El Treasury a 10 años pasó de 4,18% (dic-2025) a más de 5,35% (oct-2026): recibían fijo bajo y pagaban variable cada vez más alto.",
    medicion: "Según Señal DF, entre diciembre y agosto los swaps restaron 4,21 puntos al Fondo E, que en ese lapso cayó 3,03%: sin swaps habría rentado ~1,2%. Los bonos por sí solos no explican la caída.",
    derivadosValor: "El valor de los derivados del Fondo E pasó de +$518.531 millones (dic-2025) a -$900.881 millones (sep-2026), una caída equivalente a 6,1 puntos del fondo.",
    forwards: "Además, el Fondo E aumentó sus ventas de dólares a futuro (forwards): en dic-2025 vendía a futuro 47% de sus dólares y en julio llegó a 121% (más de los que tenía). Costó 0,28 puntos dic-ago.",
  },
  numerosClave: [
    { label: "Afiliados en el Fondo E", valor: "768.836", fuente: "DF / spensiones.cl" },
    { label: "Caída ene-sep 2026 (real)", valor: "-10,39%", fuente: "SP" },
    { label: "Caída solo en septiembre 2026", valor: "-4,92%", fuente: "SP" },
    { label: "Swaps restaron (dic-ago)", valor: "-4,21 pp", fuente: "Señal DF" },
    { label: "Ganancias posición derivados (hace 1 año)", valor: "+US$1.400 M", fuente: "Bloomberg" },
    { label: "Pérdida valoración derivados (sep-2026)", valor: "-US$7.700 M", fuente: "Bloomberg / T13" },
    { label: "Pérdida atribuida al efecto tasas", valor: "US$11.000 M", fuente: "DF (reunión Cortez-AFP)" },
  ],
  regulacion: {
    norma: "Resolución 549 (9-abr-2026) de la Superintendencia de Pensiones limita el riesgo de derivados de los fondos.",
    limite: "En escenario de estrés, la pérdida esperada de los derivados del Fondo E no puede superar el 2% del fondo (3% en A y B).",
    plazo: "Las AFP tienen hasta el 5-nov-2026 para cumplir el límite; oficios exigieron bajar el exceso a 40%, 20% y 10%. Los fondos llegaron a estar en 140% del límite.",
    dilema: "Al cerrar posiciones perdedoras antes del plazo, la pérdida que era 'contable' se vuelve real; los bancos (Bank of America, Citigroup) son las contrapartes.",
  },
  impactoQuienes: [
    { grupo: "Por jubilarse en el Fondo E", efecto: "No tienen tiempo de esperar recuperación; su pensión se calculará sobre un saldo más bajo." },
    { grupo: "Jubilados en Retiro Programado con saldo en E", efecto: "Su pensión se recalcula cada año según el saldo; en el próximo recálculo podrían recibir menos." },
    { grupo: "Quienes se refugiaron en E", efecto: "Hicieron lo que se les recomendaba para protegerse y terminaron en el fondo que más cayó." },
    { grupo: "Jubilados con Renta Vitalicia", efecto: "No se ven afectados: su pensión ya está fija en UF y el riesgo lo asume la compañía de seguros." },
    { grupo: "Trabajadores jóvenes (A/B)", efecto: "No sienten este golpe en particular y tienen décadas para recuperarse." },
  ],
  calculoTecnico: {
    nota: "Cálculos aritméticos directos sobre la caída oficial del fondo (-10,39% ene-sep; -4,92% en septiembre). No proyectan ni extrapolan.",
    ejemplos: [
      { etiqueta: "$10.000.000 en Fondo E", perdidaEneSep: -1039000, perdidaSep: -492000 },
      { etiqueta: "$50.000.000 en Fondo E", perdidaEneSep: -5195000, perdidaSep: -2460000 },
    ],
    contraste: "Mismo $10.000.000 que hubiera estado en Fondo A: +8,61% ene-sep → +$861.000 (ganancia) en vez de -$1.039.000 (pérdida). Diferencia entre ambos escenarios: $1.900.000.",
    comision: "La comisión de administración se cobra igual sobre el saldo, aunque el fondo caiga. La pérdida la pagan íntegramente los afiliados, no las AFP como empresas.",
  },
  lecturaTecnica:
    "El punto técnico es que un instrumento diseñado para reducir riesgo (derivados/swaps como cobertura) se usó para aumentarlo, justo en el fondo que debía ser el más seguro. En el sistema multifondo, el afiliado conservador no contrata swaps: los decide la AFP dentro de su mandato de inversión. El resultado traslada a los afiliados con menor horizonte la apuesta de duración de la industria. Con los Fondos Generacionales (abr-2027) el afiliado seguirá sin elegir el derivado: solo cambia la cohorte de edad.",
  filtroCritico:
    "Cifras de rentabilidad: informes oficiales de la Superintendencia de Pensiones (comunicado 5-oct-2026 y reportes mensuales). Detalle de swaps/derivados: Señal DF (9-oct-2026) con carteras publicadas por la SP, y Bloomberg (vía T13/Emol 14-15 oct-2026). US$11.000 M corresponde a una estimación atribuida al efecto de tasas reportada por DF. La tesis de inversión y el uso de derivados son decisiones de las administradoras, no de los afiliados. Disclosure verificado; no incluye cifras viralizadas sin fuente.",
  fuente: "Superintendencia de Pensiones (comunicado 5-oct-2026, art. 17161; reportes mensuales de rentabilidad) · Señal DF / Diario Financiero (9-oct-2026, 'La apuesta de las AFP que gatilló la crisis de rentabilidad del fondo E') · Bloomberg vía T13 (14-oct-2026) y Emol/El Mercurio (15-oct-2026) · análisis aritmético propio sobre cifras oficiales.",
};
