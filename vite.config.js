import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fixReactVirtualized from 'esbuild-plugin-react-virtualized'
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  base: '/',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3006,
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [fixReactVirtualized],
    },
  },
  build: {
    outDir: './build',
    emptyOutDir: true, // also necessary
  },
})
