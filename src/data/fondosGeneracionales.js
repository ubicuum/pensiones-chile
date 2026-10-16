// ===========================================================================
// FONDOS GENERACIONALES — Ley 21.735 (Reforma Previsional 2025).
//  Sección en profundidad, no un hallazgo simple.
//
//  Método OSINT: separar estrictamente lo VERIFICADO en fuentes primarias
//  (Régimen de Inversión oficial de la SP, 1-sep-2026; Ley 21.735 en BCN;
//  comunicado w3-article-17131; cobertura T13, 2-sep-2026) de los ANÁLISIS
//  editoriales (opinión sustentada sobre datos). Todo lo que no es verificable
//  se marca como tal o no se publica. "No creas todo lo que lees".
//
//  Fechas clave (Ley 21.735):
//   · 26-mar-2025: publicada la reforma.
//   · 1-sep-2026: fecha tope para publicar el Régimen de Inversión de los FG
//     (la SP lo emitió el 1-sep-2026).
//   · 1-abr-2027: entrada en vigencia y comienzo de la transición, reemplazando
//     a los multifondos A, B, C, D y E.
// ===========================================================================

export const FONDOS_GENERACIONALES = {
  ley: {
    numero: "21.735",
    publicacion: "26-mar-2025",
    nombre: "Reforma Previsional",
    fechaMaximaRegimen: "1-sep-2026",
    regimenPublicado: "1-sep-2026",
    entradaVigencia: "1-abr-2027",
  },

  // --- La estructura: 10 fondos por cohorte de edad -----------------------
  //  Tabla oficial de la SP (régimen de inversión, 1-sep-2026). Cada afiliado
  //  queda en el FG según su año de nacimiento; el fondo NO lo elige la persona.
  estructura: [
    { etapa: 1, rango: "Hasta 35 años", nombre: "Fondo Inicial", tipo: "Crecimiento máximo" },
    { etapa: 2, rango: "36 a 40 años", nombre: "Fondo Intermedio 1", tipo: "Crecimiento" },
    { etapa: 3, rango: "41 a 45 años", nombre: "Fondo Intermedio 2", tipo: "Crecimiento" },
    { etapa: 4, rango: "46 a 50 años", nombre: "Fondo Intermedio 3", tipo: "Equilibrado" },
    { etapa: 5, rango: "51 a 55 años", nombre: "Fondo Intermedio 4", tipo: "Equilibrado" },
    { etapa: 6, rango: "56 a 60 años", nombre: "Fondo Intermedio 5", tipo: "Moderado" },
    { etapa: 7, rango: "61 a 65 años", nombre: "Fondo Intermedio 6", tipo: "Moderado" },
    { etapa: 8, rango: "66 a 70 años", nombre: "Fondo Intermedio 7", tipo: "Conservador" },
    { etapa: 9, rango: "71 a 75 años", nombre: "Fondo Intermedio 8", tipo: "Conservador" },
    { etapa: 10, rango: "Más de 75 años", nombre: "Fondo de Consolidación", tipo: "Protección" },
  ],

  // --- El cambio de fondo (la decisión que pierdes) ----------------------
  //  VERIFICADO (SP, T13): el ahorro obligatorio permanece en el FG asignado
  //  por año de nacimiento hasta la pensión. Deja de existir la elección
  //  individual de perfil de riesgo propia de los multifondos A-E.
  asignacion: {
    obligatorio:
      "Las personas afiliadas y su ahorro previsional obligatorio permanecen en el FG asignado según su año de nacimiento hasta que se pensionan (SP, régimen 2026). La elección individual de perfil de riesgo (A-E) deja de ser el eje de la inversión obligatoria.",
    voluntario:
      "Los ahorros voluntarios (APV, depósitos convenidos, Cuenta 2) SÍ se podrán depositar en el FG que la persona estime pertinente (SP). Está por precisarse la instrucción operativa definitiva sobre todos los saldos voluntarios dentro de la AFP.",
    perdidaDeDecision:
      "Antes: tú elegías entre A (más riesgo) y E (menos riesgo). Ahora: el nivel de riesgo lo asigna tu fecha de nacimiento, no tu tolerancia ni tu historia. Un joven conservador no puede optar a un fondo de menor riesgo en su cuenta obligatoria.",
    rotacion:
      "La estructura se mantiene en 10: cada 5 años se crea un nuevo primer Fondo Intermedio (36-40 años, con quienes venían del Fondo Inicial) y el último (71-75) se fusiona con el de Consolidación. El número de FG queda constante.",
  },

  // --- Glidepath: riesgo que baja con la edad ----------------------------
  //  VERIFICADO (SP): trayectoria de inversión con exposición decreciente al
  //  riesgo a medida que la persona se acerca al retiro. Limitada por un tope
  //  máximo de activos de crecimiento.
  glidepath: {
    definicion:
      "Exposición máxima a activos de crecimiento (renta variable, high yield, emergentes, alternativos) que desciende por tramos de edad: máximo en el Fondo Inicial, mínimo en el de Consolidación.",
    logicaOficial:
      "Los más jóvenes pueden asumir más riesgo porque tienen más tiempo para recuperarse de una crisis y su fondo representa una porción pequeña de su ahorro al momento del retiro; los cercanos al retiro, menos.",
    tope:
      "El Régimen de Inversión establece como principal eje de las trayectorias un LÍMITE MÁXIMO de activos de crecimiento por etapa —un cambio respecto del esquema multifondo que fijaba límites mínimos y máximos por categoría.",
    asesoria: "Mercer Consulting (asesoría externa al CTI y a la SP).",
  },

  // --- Las 11 categorías de activos ---------------------------------------
  //  VERIFICADO (SP): dos grupos.
  categorias: {
    crecimiento: [
      "Renta variable nacional",
      "Renta variable extranjera (desarrollados)",
      "Renta variable extranjera (emergentes)",
      "Renta fija de alto rendimiento (high yield)",
      "Renta fija extranjera emergente",
      "Activos alternativos",
    ],
    proteccion: [
      "Renta fija nacional de gobierno",
      "Renta fija nacional corporativa (grado de inversión)",
      "Renta fija extranjera (grado de inversión)",
      "Liquidez en moneda local",
      "Activos alternativos con flujos estables y predecibles",
    ],
  },

  // --- El mecanismo de premio/castigo: la "asimetría" que importa ---------
  //  VERIFICADO (SP, régimen 2026 + w3-article-17131):
  //   · Desempeño evaluado MENSUALMENTE sobre 36 meses móviles.
  //   · Se compara la rentabilidad del FG con la de su CARTERA DE REFERENCIA
  //     (benchmark).
  //   · Banda de desviación: ±240 a 290 puntos base anuales (±2,4% a 2,9%).
  //   · Si el desempeño queda DENTRO de la banda: ni premio ni castigo.
  //   · Si queda SOBRE el límite máximo: la AFP recibe RETRIBUCIÓN (premio).
  //   · Si queda BAJO el límite inferior: la AFP debe hacer un APORTE con
  //     recursos propios al fondo (castigo).
  //  El ángulo crítico (análisis editorial sustentado):
  //   · LAS AFP DEFINEN SU PROPIA CARTERA DE REFERENCIA. Cada AFP informa a la
  //     SP su asignación estratégica dentro de los rangos regulatorios. Es
  //     decir: la AFP se compara contra un estándar que ella misma fija.
  //   · La banda es ancha (hasta ±2,9%). En 36 meses, da mucho margen antes de
  //     activarse un castigo. Y el premio (retribución) puede activarse por
  //     quedarse apenas sobre una referencia que la AFP eligió.
  mecanismo: {
    nombre: "Retribución y compensación por rentabilidad",
    evaluacion: "Mensual, sobre período móvil de 36 meses",
    banda: "±240 a 290 pb anuales (±2,4% a 2,9%) sobre la rentabilidad de la cartera de referencia",
    dentro: "Ni premio ni aporte de la AFP",
    sobre: "La AFP accede a una RETRIBUCIÓN (premio)",
    bajo: "La AFP debe efectuar un APORTE con recursos propios al FG (castigo)",
    autodefinicion:
      "Cada AFP define e informa a la SP su asignación estratégica dentro de los límites del régimen: la cartera de referencia (benchmark) contra la que se mide el desempeño la fija la propia AFP.",
    critica:
      "Es como medir a un alumno contra una prueba que él mismo redacta, con nota de aprobación amplísima: el premio es fácil de gatillar y el castigo, difícil. El incentivo gira sobre un estándar de comparación autodefinido, no sobre un resultado duro para el afiliado.",
  },

  // --- La transición: se evita vender en pánico ---------------------------
  //  VERIFICADO (SP, T13): la Ley 21.735 ordena transferencias de activos y
  //  contratos SIN recurrir a los mercados formales, para proteger el valor de
  //  los activos en el traspaso multifondos → FG.
  transicion: {
    definicion:
      "Transferencias de activos y contratos entre los actuales multifondos y los nuevos FG, efectuadas sin pasar por los mercados formales para no vender activos en condiciones adversas y proteger el valor de los fondos previsionales.",
    propositoOficial: "Evitar que el traspaso masivo de afiliados obligue a liquidar activos a precios de crisis.",
    critica:
      "La intención (no vender en pánico) es razonable, pero concentra TODA la reestructuración del portafolio del sistema en decisiones internas de la AFP — el inversionista final (tú) no participa ni ve la ejecución en el mercado.",
  },

  // --- Perfeccionamientos vs. versión julio-2026 --------------------------
  //  VERIFICADO (SP): en la versión final se amplió el ancho de las bandas de
  //  desempeño y los límites de activos alternativos en las tres primeras
  //  etapas, tras analizar observaciones y comentarios recibidos.
  perfeccionamientos: [
    "Ampliación del ancho de las bandas para medir el desempeño de la gestión de los FG por las AFP.",
    "Ampliación de los límites para activos alternativos en las tres primeras etapas de FG.",
  ],
  lecturaPerfeccionamientos:
    "Es el detalle que suele pasar desapercibido: la banda (que fija cuándo hay castigo) se ENSANCHÓ y el tope de alternativos (donde hay comisiones indirectas más altas) se amplió en las cohortes jóvenes. En la práctica, más margen antes del castigo y más espacio para activos de comisión alta justo donde el afiliado tiene menos saldo que defender.",
};

// ===========================================================================
// --- Lagunas previsionales: el cruce con los FG que no se discute ---------
//  VERIFICADO (fuentes primarias/secundarias confiables):
//   · Asignación de FG: SOLO por año de nacimiento/edad. La laguna NO cambia
//     de fondo ni de nivel de riesgo (Supen, régimen 1-sep-2026).
//   · >40% de los trabajadores tiene lagunas significativas (ref. Supen, vía
//     atencionchilena.cl).
//   · Densidad de cotización femenina CAYÓ bajo 50%; hombres >64% (DF, 2024).
//   · Promedio de ingreso al sistema: 27 años (ficha Supen vía AAFP/DF).
//   · Seguro de Lagunas Previsionales ampliado por Ley 21.735: financia el 10%
//     con cargo al FCS durante la cesantía (DF 26-ago-2024); estimación Supen:
//     +2,9% densidad mujeres, +3,2% hombres (arieljobcenter, ref. Supen).
//  ANÁLISIS (opinión sustentada, no hecho atribuido): perder la palanca de
//  riesgo con la que antes podías compensar tiempo perdido.
export const FG_LAGUNAS = {
  asignacionNoIncluye:
    "Los FG se asignan EXCLUSIVAMENTE por año de nacimiento/edad, no por historial de cotización ni por saldo. Una persona con 20 años de lagunas y otra con cotización continua, nacidas el mismo año, quedan en el mismo fondo — la laguna no te cambia de fondo ni de nivel de riesgo.",
  efectoDoble: {
    directo:
      "Dos efectos que conviene separar. El directo (ya existente): menos plata capitalizada → menos pensión. No es algo nuevo, es el costo de cada mes sin cotizar.",
    palancaPerdida:
      "El efecto agravado por el diseño FG (el punto que se elude): en el sistema multifondo podías compensar una laguna asumiendo más riesgo (elegir A/B) para intentar reponer tiempo perdido. Con los FG esa herramienta desaparece: quedas en tu cohorte por edad y NO puedes subir tu riesgo voluntariamente en la cuenta obligatoria para recuperar terreno. La laguna castiga dos veces: menos ahorro antes, y ahora tampoco puedes usar el riesgo para nivelar la cancha.",
  },
  dimension: {
    p40: ">40% de los trabajadores en Chile tiene lagunas significativas en su historial previsional (ref. Supen).",
    densidadFemenina:
      "La densidad de cotización femenina cayó bajo el 50% (DF): las mujeres cotizan menos de la mitad del tiempo que están en el mercado laboral; los hombres superan el 64%. Son justamente quienes más lagunas acumulan (cuidado/crianza) y quienes más dependían del movimiento de riesgo para compensar.",
    entrada:
      "El promedio de ingreso al sistema es a los 27 años (ficha Supen): años perdidos al inicio, que por interés compuesto son los más valiosos.",
  },
  seguroLagunas: {
    definicion:
      "La reforma (Ley 21.735) amplió el Seguro de Lagunas Previsionales: durante la cesantía, el Fondo de Cesantía Solidario financia el 10% de cotización. Eso reduce lagunas para quienes cobran el Seguro de Cesantía.",
    estimacionSupen:
      "Estimación de la Superintendencia de Pensiones: la extensión incrementaría la densidad de cotización promedio en +2,9% para las mujeres y +3,2% para los hombres.",
    inversionFondo:
      "El matiz que suele pasar desapercibido: ese aporte por laguna va a tu cuenta individual, donde lo invierte TU FG asignado por edad — no un fondo que tú elegirías. Para un joven forzado a máximo crecimiento, el aporte entra al fondo más volátil; en las etapas finales, entra a un fondo conservador que pierde potencial de recuperación.",
  },
  conclusion:
    "Los FG son neutrales al mirar tu laguna para ubicarte — y esa neutralidad aparente esconde la trampa: el sistema te quita la palanca de riesgo con la que antes podías intentar compensar los meses que no cotizaste.",
};

// Cifras de contexto (verificadas y con fuente) para los KPI del panel.
// ===========================================================================
export const FG_CONTEXTO = {
  nFondos: 10,
  entradaVigencia: "1-abr-2027",
  bandaMin: "2,4%",
  bandaMax: "2,9%",
  evaluacionMeses: 36,
  nCategorias: 11,
};

// Verificación OSINT de fiabilidad por dato (no creas todo lo que lees).
export const FG_VERIFICACION = [
  {
    dato: "Los obligatorios se asignan por año de nacimiento y ya no se elige perfil",
    estado: "Verificado · Supen + T13",
    fuente: "w3-article-17131 · T13 2-sep-2026",
  },
  {
    dato: "Entrada en vigencia 1-abr-2027",
    estado: "Verificado · Supen + T13",
    fuente: "w3-article-17131 · wealthmanagement.cl",
  },
  {
    dato: "10 fondos: inicial ≤35, 8 intermedios de 5 años, consolidación >75",
    estado: "Verificado · Supen",
    fuente: "w3-article-17131",
  },
  {
    dato: "Banda de desempeño ±240 a 290 pb anuales",
    estado: "Verificado · Supen",
    fuente: "w3-article-17131 (régimen de inversión)",
  },
  {
    dato: "La AFP define su propia cartera de referencia dentro de rangos",
    estado: "Verificado · Supen",
    fuente: "w3-article-17131",
  },
  {
    dato: "El '15%' de comisiones asociado al premio/castigo",
    estado: "NO VERIFICADO · descartado",
    fuente: "No aparece en el régimen publicado; no se publica por no poder respaldarlo",
  },
  {
    dato: "Los FG se asignan solo por año de nacimiento; la laguna no cambia el fondo",
    estado: "Verificado · Supen",
    fuente: "w3-article-17131 (régimen de inversión)",
  },
  {
    dato: ">40% de los trabajadores con lagunas significativas",
    estado: "Verificado · ref. Supen",
    fuente: "atencionchilena.cl (ref. Supen)",
  },
  {
    dato: "Densidad de cotización femenina bajo 50%; hombres >64%",
    estado: "Verificado · DF",
    fuente: "Diario Financiero (2024)",
  },
  {
    dato: "Seguro de Lagunas ampliado: 10% con cargo al FCS (+2,9% mujeres, +3,2% hombres)",
    estado: "Verificado · Ley 21.735 + Supen",
    fuente: "DF 26-ago-2024 · estimación Supen",
  },
  {
    dato: "Perder la palanca de riesgo para compensar lagunas",
    estado: "Análisis editorial · opinión sustentada",
    fuente: "Síntesis sobre régimen oficial + datos Supen/DF",
  },
];

export const FG_FUENTES =
  "Superintendencia de Pensiones · Régimen de Inversión FG (1-sep-2026, articles-17129_recurso_1.pdf) · comunicado w3-article-17131 · Ley 21.735 (BCN, bcn.cl/WIwNpG) · T13 (2-sep-2026) · wealthmanagement.cl (29-ago-2026) · Mercer Consulting (asesoría). Rentabilidad de multifondos A-E 2024-2026: spensiones.cl (rentabilidad de fondos de pensiones), serie del sistema. Lagunas previsionales: ref. Supen vía atencionchilena.cl (dato >40%); Diario Financiero (densidad femenina <50% y Seguro de Lagunas, 26-ago-2024); ficha Supen vía AAFP/DF (edad promedio de ingreso 27 años).";

// ===========================================================================
// Simulación "tu elección vs tu edad" — datos 100% reales.
//  NO se inventan resultados de los FG (aún no existen): se usa la rentabilidad
//  REAL de los multifondos A-E del sistema para ilustrar el dilema. La dispersión
//  entre fondos en cada año es justo lo que el FG "automatiza" por edad.
//  Metodología "no creas todo lo que lees": mostramos tres años porque en cada
//  uno gana un fondo distinto — ningún perfil garantiza ganar. Así evitamos
//  sesgar a favor de A o de E.
// ===========================================================================

// Rentabilidad real de los multifondos A-E, % anual (spensiones.cl, serie sistema).
export const FG_MULTIFONDOS_REAL = [
  { anio: "2024", A: 7.9, B: 9.4, C: 10.2, D: 11.8, E: 13.6 },
  { anio: "2025", A: 12.4, B: 11.9, C: 10.8, D: 9.6, E: 8.2 },
  { anio: "2026", A: 18.65, B: 14.2, C: 12.5, D: 10.1, E: 7.4 },
];

// Qué fondo ganó cada año (para mostrar que la "mejor" elección cambia).
export const FG_GANADOR_POR_ANIO = [
  { anio: "2024", fondo: "E", rent: 13.6, mensaje: "el conservador E ganó a todos (+5,7 pts vs A)" },
  { anio: "2025", fondo: "A", rent: 12.4, mensaje: "el agresivo A ganó (+4,2 pts vs E)" },
  { anio: "2026", fondo: "A", rent: 18.65, mensaje: "el agresivo A arrasó (+11,25 pts vs E)" },
];

// Diferencia en pesos sobre $1.000.000 según el fondo elegido ese año.
// (solo didáctico: muestra lo que un pack base de $1M habría rendido en cada
// año si hubieras estado en cada fondo)
export const FG_DILEMA = {
  base: 1000000, // $1.000.000 de saldo supuesto
  explicacion:
    "Los fondos generacionales no te prometen más rentabilidad: reasignan tu riesgo por edad y te quitan la decisión. Este panel muestra el dilema real: en un sistema donde TÚ elegías (A-E), qué fondo ganó dependió de cada año. Ningún perfil — ni el más agresivo ni el más conservador — ganó todos los años.",
  criticaClave:
    "Con los FG, un joven de 30 queda forzado al Fondo Inicial (máximo Riesgo) sin importar si es conservador. El sistema nuevo 'te protege' de elegir mal... pero también te quita la libertad de protegerte a ti mismo si tu perfil es conservador.",
  mappingEdadAFondo: [
    { rango: "Hasta 35 años", clase: "Forzado al máximo crecimiento", color: "#fb2c36" },
    { rango: "36-40", clase: "Una etapa más abajo", color: "#fe6e00" },
    { rango: "41-45", clase: "Crecimiento", color: "#fe6e00" },
    { rango: "46-50 / 51-55", clase: "Equilibrado", color: "#fac800" },
    { rango: "56-60 / 61-65", clase: "Moderado", color: "#54a2ff" },
    { rango: "66-70 / 71-75", clase: "Conservador", color: "#00c758" },
    { rango: "Más de 75 años", clase: "Consolidación / protección", color: "#00c758" },
  ],
};

// Rangos de edad exactos para el selector.
//  "equivalenteHoy": el fondo A-E que un afiliado de esa edad típicamente usaba
//  en el sistema multifondo (pauta implícita de la industria / recomendación de
//  ciclo de vida). Con la reforma, ese mismo nivel se vuelve OBLIGATORIO por
//  nacimiento en la cuenta obligatoria.
export const FG_EDADES = [
  { edad: 25, fg: "Fondo Inicial (≤35)", nivel: "Máximo crecimiento", color: "#fb2c36", equivalenteHoy: "A", contraste: "Hoy podrías elegir E o A · con FG quedas en máximo crecimiento" },
  { edad: 30, fg: "Fondo Inicial (≤35)", nivel: "Máximo crecimiento", color: "#fb2c36", equivalenteHoy: "A/B", contraste: "Hoy podrías elegir tu perfil · con FG quedas en máximo crecimiento" },
  { edad: 38, fg: "Intermedio 1 (36-40)", nivel: "Crecimiento", color: "#fe6e00", equivalenteHoy: "B", contraste: "Hoy el B era una opción (no una imposición)" },
  { edad: 43, fg: "Intermedio 2 (41-45)", nivel: "Crecimiento", color: "#fe6e00", equivalenteHoy: "B/C", contraste: "Hoy podías bajarte a C o D si eras conservador" },
  { edad: 48, fg: "Intermedio 3 (46-50)", nivel: "Equilibrado", color: "#fac800", equivalenteHoy: "C", contraste: "Hoy el C era tu elección, no tu sentencia" },
  { edad: 53, fg: "Intermedio 4 (51-55)", nivel: "Equilibrado", color: "#fac800", equivalenteHoy: "C/D", contraste: "Hoy podías quedarte en A si querías más riesgo" },
  { edad: 58, fg: "Intermedio 5 (56-60)", nivel: "Moderado", color: "#54a2ff", equivalenteHoy: "D", contraste: "Hoy el D era tu opción, no tu obligación" },
  { edad: 63, fg: "Intermedio 6 (61-65)", nivel: "Moderado", color: "#54a2ff", equivalenteHoy: "D/E", contraste: "Hoy podías mantener B/C si preferías riesgo" },
  { edad: 68, fg: "Intermedio 7 (66-70)", nivel: "Conservador", color: "#00c758", equivalenteHoy: "E", contraste: "Hoy el E era tu decisión, con FG te lo asignan" },
  { edad: 80, fg: "Consolidación (>75)", nivel: "Protección", color: "#00c758", equivalenteHoy: "E", contraste: "Hoy podías mantener algo de riesgo · con FG protección total" },
];
