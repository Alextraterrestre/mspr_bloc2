import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    proxy: {
      '/function':
      {
        target: 'http://gateway.openfaas:8080',
        changeOrigin: true
      }
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  plugins: [
    react(),
    tailwindcss(),]
})