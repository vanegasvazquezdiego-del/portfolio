import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base: works on GitHub Pages project URLs (/user/repo/),
  // user sites, custom domains and localhost without changes.
  base: './',
  server: { port: 5173, open: false },
  preview: { port: 4173 },
  build: { outDir: 'dist', sourcemap: false }
})
