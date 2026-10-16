import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Datos crudos descargados por collect.js (histórico diario de valor cuota por fondo/AFP)
const RAW = JSON.parse(readFileSync(join(__dirname, "..", "data", "pensiones_real.json"), "utf-8"));
// Datos oficiales recolectados (rentabilidad real publicada por la Supen)
const OFFICIAL = JSON.parse(readFileSync(join(__dirname, "..", "src", "data", "resumen_real.json"), "utf-8"));

// Inflación anual Chile (variación IPC dic-dic), fuente INE/Banco Central.
const IPC_ANUAL = { 2020: 3.0, 2021: 7.2, 2022: 12.8, 2023: 3.9, 2024: 4.5, 2025: 3.5, 2026: 2.8 };

const AFPS = ["CAPITAL", "CUPRUM", "HABITAT", "MODELO", "PLANVITAL", "PROVIDA", "UNO"];
const NOM = {
  CAPITAL: "Capital",
  CUPRUM: "Cuprum",
  HABITAT: "Habitat",
  MODELO: "Modelo",
  PLANVITAL: "Planvital",
  PROVIDA: "Provida",
  UNO: "Uno",
};

function cuotaSeries(fondoLetra) {
  const raw = RAW.valorCuota[`Fondo ${fondoLetra}`];
  if (!raw) return null;
  return raw;
}

// Rentabilidad nominal anual por AFP desde valor cuota (año calendario, dic-dic)
function rentNominalAnual(fondoLetra, anyo) {
  const series = cuotaSeries(fondoLetra);
  const out = {};
  for (const [afp, rows] of Object.entries(series)) {
    const day = `${anyo}-12-31`;
    let lastYoE = rows.find((r) => r.fecha === `${anyo}-01-01`);
    let lastYoF = rows.find((r) => r.fecha === day);
    // fallback: last row of year
    if (!lastYoF) {
      lastYoF = rows.filter((r) => r.fecha.startsWith(String(anyo))).pop();
    }
    if (!lastYoE || !lastYoF) {
      out[afp] = null;
      continue;
    }
    out[afp] = (lastYoF.cuota / lastYoE.cuota - 1) * 100;
  }
  return out;
}

function rentReal(nom, anyo) {
  const inf = IPC_ANUAL[anyo];
  if (inf == null || nom == null) return null;
  return ((1 + nom / 100) / (1 + inf / 100) - 1) * 100;
}

// Rentabilidad nominal acumulada 2026 (ene -> última fecha disponible)
function rentNominalAcumulado(fondoLetra) {
  const series = cuotaSeries(fondoLetra);
  const out = {};
  let lastFecha = null;
  for (const [afp, rows] of Object.entries(series)) {
    const ene = rows.find((r) => r.fecha === "2026-01-01");
    const last = rows.filter((r) => r.fecha.startsWith("2026")).pop();
    if (ene && last) {
      out[afp] = (last.cuota / ene.cuota - 1) * 100;
      lastFecha = last.fecha;
    } else out[afp] = null;
  }
  return { out, lastFecha };
}

function buildAudit() {
  const fondos = ["A", "B", "C", "D", "E"];
  const anyos = [2020, 2021, 2022, 2023, 2024, 2025];

  const rentabilidadNomAnual = {};
  const rentabilidadRealCambio = {}; // nuestro cálculo deflactado
  for (const f of fondos) {
    rentabilidadNomAnual[f] = {};
    rentabilidadRealCambio[f] = {};
    for (const a of anyos) {
      rentabilidadNomAnual[f][a] = rentNominalAnual(f, a);
      rentabilidadRealCambio[f][a] = {};
      for (const afp of AFPS) {
        const nom = rentabilidadNomAnual[f][a][afp];
        rentabilidadRealCambio[f][a][afp] = rentReal(nom, a);
      }
    }
  }

  // Rentabilidad real oficial publicada (Supen getRentabilidad - Fondo por AFP, últimos12m)
  const oficial = {};
  if (OFFICIAL.rentabilidadFondos && OFFICIAL.rentabilidadFondos.porFondo) {
    for (const [fondo, series] of Object.entries(OFFICIAL.rentabilidadFondos.porFondo)) {
      const letra = fondo.replace("Fondo ", "");
      oficial[letra] = {};
      for (const [afpKey, v] of Object.entries(series)) {
        const nombre = NOM[afpKey.toUpperCase()] || afpKey;
        oficial[letra][nombre] = {
          mes: v.mes,
          acumuladoAnio: v.acumuladoAnio,
          ultimos12m: v.ultimos12m,
          prom60m: v.prom60m,
        };
      }
    }
  }

  // Costo de comisión: flujo del cotizante pierde la comisión sobre cada aporte.
  // Modelo simple: % del patrimonio que se va en comisiones por año (comisión sobre flujo)
  const comisiones = OFFICIAL.comisiones || [];

  // Resumen ejecutivo de brechas por fondo (nominal vs real publicado)
  const brechas = {};
  for (const f of fondos) {
    brechas[f] = {};
    const ac = rentNominalAcumulado(f);
    for (const afp of AFPS) {
      const nombre = NOM[afp];
      const nom2026 = ac.out[afp];
      const realOficial = oficial[f]?.[nombre]?.acumuladoAnio ?? null;
      const infl2026 = IPC_ANUAL[2026];
      const realCalc = nom2026 == null ? null : rentReal(nom2026, 2026);
      brechas[f][nombre] = {
        rentNominal2026: nom2026,
        inflacion2026: infl2026,
        rentRealCalculada: realCalc,
        rentRealOficial: realOficial,
        // discrepancia entre lo que publica la Supen y lo que se deduce de la cuota
        desvio: realOficial != null && realCalc != null ? realOficial - realCalc : null,
      };
    }
  }

  return {
    generadoEn: new Date().toISOString(),
    fuente: "https://www.spensiones.cl (valor cuota diario 2020-2026) + resumen_real.json",
    IPC_ANUAL,
    rentabilidadNominalAnual: rentabilidadNomAnual,
    rentabilidadRealCalculada: rentabilidadRealCambio,
    rentabilidadOficialPublicada: oficial,
    brechasAcumulado2026: brechas,
    comisiones,
    notas: [
      "Rentabilidad nominal se calcula desde el valor cuota diario oficial (Superintendencia).",
      "Rentabilidad real calculada = deflactar nominal por IPC anual (INE).",
      "La Supen publica la rentabilidad REAL (deflactada) en su reporte getRentabilidad.",
      "El desvío señala qué tan lejos está lo publicado por la Supen vs lo deducible desde la cuota oficial.",
    ],
  };
}

const audit = buildAudit();
const OUT = join(__dirname, "..", "src", "data", "auditoria.json");
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(audit, null, 2), "utf-8");
console.log("Auditoría guardada en:", OUT);
