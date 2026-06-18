import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    copyPublicDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://cinevip-pos-backend.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
