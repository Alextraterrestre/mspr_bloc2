import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: { '/function': { target: 'http://172.26.124.53', changeOrigin: true } },
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  plugins: [
    react(),
    tailwindcss(),]
})