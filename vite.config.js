import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // <-- 1. IMPORTA ESTO

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 2. AÑADE ESTE BLOQUE COMPLETO
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://service.estelar.andrescortes.dev',
        changeOrigin: true,
        secure: false
      }
    }
  }
})