import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss()
  ],
  server: {
    port: 5173,
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/lists': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/cards': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/boards': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
