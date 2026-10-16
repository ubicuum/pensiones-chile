import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Transpila a una sintaxis compatible con navegadores modernos de ~5 años
    // (Chrome 85+, Edge 85+, Safari 14+, Firefox 80+). Se usa ES2020 porque
    // ag-grid incluye literales BigInt (0n) que NO son transpilables a ES2019;
    // a partir de ES2020 (BigInt nativo) se evitan errores en esos navegadores.
    target: 'es2020',
    cssTarget: 'chrome85',
    sourcemap: false,
  },
  // Servir de forma robusta desde cualquier ruta / subcarpeta (un servidor
  // estático, GitHub Pages, un CDN, etc.) sin rutas absolutas que rompan.
  base: './',
})
