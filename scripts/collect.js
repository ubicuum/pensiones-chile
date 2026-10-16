import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "data", "pensiones_real.json");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "*/*" },
    signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}

const parseCLNum = (s) => {
  if (s == null) return null;
  let t = String(s).replace(/\s/g, "");
  t = t.replace(/\./g, "").replace(",", ".");
  t = t.replace(/[^0-9.-]/g, "");
  if (t === "" || t === "-") return null;
  const n = parseFloat(t);
  return Number.isFinite(n) ? n : null;
};

const FONDOS = ["A", "B", "C", "D", "E"];
const AFPS = ["CAPITAL", "CUPRUM", "HABITAT", "MODELO", "PLANVITAL", "PROVIDA", "UNO"];

async function scrapeValorCuota() {
  const data = {};
  for (const tf of FONDOS) {
    const url = `https://www.spensiones.cl/apps/valoresCuotaFondo/vcfAFPxls.php?aaaaini=2020&aaaafin=2026&tf=${tf}&fecconf=20260731`;
    const text = await fetchText(url);
    const rows = text.split(/\r?\n/).filter((r) => /^\d{4}-\d{2}-\d{2}/.test(r));
    const series = {};
    for (const afp of AFPS) series[afp] = [];
    for (const row of rows) {
      const cols = row.split(";");
      const fecha = cols[0];
      // columns: Fecha;CAPITAL cuota;CAPITAL patr;CUPRUM cuota;CUPRUM patr;...
      let idx = 1;
      for (const afp of AFPS) {
        const cuota = parseCLNum(cols[idx]);
        const patr = parseCLNum(cols[idx + 1]);
        series[afp].push({ fecha, cuota, patrimonio: patr });
        idx += 2;
      }
    }
    data[`Fondo ${tf}`] = series;
  }
  return data;
}

async function scrapeRentabilidadFondos() {
  // Rentabilidad Real de los Fondos de Pensiones: por fondo, filas por AFP
  let html;
  try {
    html = await fetchText("https://www.spensiones.cl/apps/rentabilidad/getRentabilidad.php?tiprent=FP");
  } catch (e) {
    return { error: String(e), html: null };
  }
  return { error: null, html };
}

function parseRentabilidadHtml(html) {
  // Each AFP row -> 4 number cells: mensual, acumulado año, 12 meses, prom 60 meses.
  // Blocks repeat per Fondo A..E (8 names each incl SISTEMA). Number cells continue across all blocks.
  const cells = [...html.matchAll(/<td\s*align=right>([^<]*)<\/td>/g)].map((m) =>
    m[1].trim()
  );
  const names = [...html.matchAll(/<td\s*>\s*([A-ZÁÉÍÓÚÑ\s]+)\s*<\/td>/g)].map((m) =>
    m[1].trim()
  );
  // names accumulate one block per fondo (may re-scan header names too); dedupe consecutive
  const perfond = 8; // 7 AFP + SISTEMA
  const PERIOCOS = ["mes", "acumuladoAnio", "ultimos12m", "prom60m"];
  const porFondo = {};
  for (let i = 0; i + perfond <= names.length; i += perfond) {
    const idx = i / perfond;
    const fondoTag = `Fondo ${"ABCDE"[idx] || idx + 1}`;
    if (idx > 4) break;
    const bloque = {};
    for (let j = 0; j < perfond; j++) {
      const afp = names[i + j];
      const base = i * 4 + j * 4;
      const vals = [];
      for (let k = 0; k < 4; k++) {
        vals.push(parseCLNum(cells[base + k]));
      }
      bloque[afp] = {
        [PERIOCOS[0]]: vals[0],
        [PERIOCOS[1]]: vals[1],
        [PERIOCOS[2]]: vals[2],
        [PERIOCOS[3]]: vals[3],
      };
    }
    porFondo[fondoTag] = bloque;
  }
  const periodo = (html.match(/RENTABILIDAD REAL DE LOS FONDOS DE PENSIONES<BR>\s*([^<]+)/i) ||
    [])[1];
  return { periodo: periodo ? periodo.trim() : null, porFondo };
}

// Comisiones reales vigentes por AFP, extraídas del sitio oficial de la Superintendencia
// (página "¿En qué consiste la comisión que cobra una AFP?"). Formato en el HTML:
//   "AFP Capital: 1,44%" ... "AFP Uno: 0,46%"
async function scrapeComisiones() {
  const text = await fetchText(
    "https://www.spensiones.cl/portal/institucional/594/w3-article-2810.html"
  );
  const entradas = text.match(/(?:AFP|afp)\s+(\w+)\s*:\s*([\d.,]+)\s*%/g) || [];
  const comisiones = [];
  for (const e of entradas) {
    const m = e.match(/(?:AFP|afp)\s+(\w+)\s*:\s*([\d.,]+\s*%)/);
    if (!m) continue;
    const nombre = m[1].replace(/^\w/, (c) => c.toUpperCase());
    // el valor viene en formato: 1,44 (coma decimal). NO usar parseCLNum (diseñado para punto=millares)
    const comision = parseFloat(m[2].replace("%", "").replace(",", ".").trim());
    comisiones.push({ name: nombre, comision, fuente: "spensiones.cl article-2810" });
  }
  return comisiones;
}

async function main() {
  const errors = [];
  const out = {
    generadoEn: new Date().toISOString(),
    fuentes: [
      "https://www.spensiones.cl",
      "https://data.magnet.cl",
      "https://www.aafp.cl",
      "https://fundacionsol.cl",
    ],
    valorCuota: null,
    rentabilidadFondos: null,
    comisiones: null,
  };

  try {
    out.valorCuota = await scrapeValorCuota();
    console.log("valorCuota OK");
  } catch (e) {
    errors.push(`valorCuota: ${e.message}`);
  }

  try {
    const r = await scrapeRentabilidadFondos();
    out.rentabilidadFondos = r.error ? { error: r.error } : parseRentabilidadHtml(r.html);
    console.log("rentabilidadFondos OK");
  } catch (e) {
    errors.push(`rentabilidadFondos: ${e.message}`);
  }

  try {
    out.comisiones = await scrapeComisiones();
    console.log("comisiones OK");
  } catch (e) {
    errors.push(`comisiones: ${e.message}`);
  }

  out.errors = errors;
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(out, null, 2), "utf-8");
  console.log("Guardado en:", OUT);
  console.log("Errores:", errors.length ? errors : "ninguno");

  // ==== Generar resumen liviano para la app ====
  const resumen = buildResumen(out);
  const OUT_SUM = join(__dirname, "..", "src", "data", "resumen_real.json");
  writeFileSync(OUT_SUM, JSON.stringify(resumen, null, 2), "utf-8");
  console.log("Resumen guardado en:", OUT_SUM);
}

function buildResumen(d) {
  const afpNombres = {
    CAPITAL: "Capital",
    CUPRUM: "Cuprum",
    HABITAT: "Habitat",
    MODELO: "Modelo",
    PLANVITAL: "Planvital",
    PROVIDA: "Provida",
    UNO: "Uno",
  };
  const res = {
    generadoEn: d.generadoEn,
    comisiones: null,
    valorCuota: {},
    rentabilidadFondos: null,
  };

  if (Array.isArray(d.comisiones) && d.comisiones[0]?.comision != null) {
    res.comisiones = d.comisiones.map((o) => ({ name: o.name, comision: o.comision }));
    res.comisionesFuente = d.comisiones[0]?.fuente || null;
  }

  if (d.valorCuota) {
    for (const [fondo, series] of Object.entries(d.valorCuota)) {
      res.valorCuota[fondo] = {};
      for (const [afp, arr] of Object.entries(series)) {
        const last = arr[arr.length - 1];
        const first = arr[0];
        res.valorCuota[fondo][afpNombres[afp] || afp] = {
          fecha: last.fecha,
          cuota: last.cuota,
          patrimonio: last.patrimonio,
          cuotaInicio: first.cuota,
        };
      }
    }
  }

  if (d.rentabilidadFondos && d.rentabilidadFondos.porFondo) {
    res.rentabilidadFondos = {
      periodo: d.rentabilidadFondos.periodo,
      porFondo: d.rentabilidadFondos.porFondo,
    };
  }
  return res;
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
