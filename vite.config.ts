import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',   // asegura rutas relativas en producción
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // solo se usa en desarrollo
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_RESOLVE') {
          return
        }
        warn(warning)
      }
    }
  }
})
