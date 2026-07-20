import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/f1-replay')
    }
  },
  server: {
    proxy: {
      '/api/openf1': {
        target: 'https://api.openf1.org/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openf1/, '')
      },
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true
      }
    }
  }
})
