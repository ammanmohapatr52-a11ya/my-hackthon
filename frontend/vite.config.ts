import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // Item 17: Prevent leaking source maps in production
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/katex')) {
            return 'vendor-katex';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          if (id.includes('node_modules/dexie')) {
            return 'vendor-storage';
          }
          if (id.includes('indiaStatesData')) {
            return 'data-india-map';
          }
          if (id.includes('archiveGkFacts') || id.includes('gkDeck')) {
            return 'data-gk-facts';
          }
          if (id.includes('AdminPage') || id.includes('datasetMatrixService')) {
            return 'page-admin';
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://my-hackthon-api.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
