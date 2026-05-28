import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api/usuarios': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        rewrite: (path) => path
      },
      '/api/pagos': {
        target: 'http://localhost:8086',
        changeOrigin: true,
        rewrite: (path) => path
      },
      '/api/locations': {
        target: 'http://localhost:8087',
        changeOrigin: true,
        rewrite: (path) => path
      },
      '/api/reservas': {
        target: 'http://localhost:8083',
        changeOrigin: true,
        rewrite: (path) => path
      },
      '/api/notificaciones': {
        target: 'http://localhost:8083',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  },
})
