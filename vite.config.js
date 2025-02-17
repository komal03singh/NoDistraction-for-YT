import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {crx} from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import path from 'path'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
    outDir: 'dist',
    rollupOptions: {
      input: resolve(__dirname, "index.html"), // Ensure index.html is processed
    },
  },
  plugins: [react(),tailwindcss(),crx({manifest})],
  
})
