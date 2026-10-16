# Pensiones Chile · El Robo del Siglo

Verificación crítica de datos oficiales del sistema de pensiones chileno: cuánto gana la industria de AFP por administrar tu ahorro y cuánto te queda a ti al jubilar.

## Sitio web (en vivo)

**https://ubicuum.github.io/pensiones-chile/**

> Este repositorio es solo el código fuente. La página publicada está en el enlace de arriba.

## Contenido

El tablero se organiza en pestañas:

- **Tablero** — cuadro de posiciones, KPIs y composición de rentabilidad.
- **Descubrimiento** — hallazgos verificados (incluye la crisis del Fondo E).
- **Fondos Generacionales** — Ley 21.735, lagunas previsionales y simulación por edad.
- **AFPs** — detalle por administradora con datos en vivo.
- **Verificación** — auditoría crítica de las fuentes.
- **Fuentes** — origen de cada dato.

## Desarrollo

```bash
npm install
npm run dev      # servidor local con HMR
npm run build    # build de producción en dist/
npm run preview  # previsualizar el build
npx oxlint src    # lint
```

## Publicación

La web se sirve con GitHub Pages desde la rama `gh-pages` (contenido de `dist/`).
Para actualizarla: `npm run build`, copiar `dist/` a la rama `gh-pages` y hacer push.
