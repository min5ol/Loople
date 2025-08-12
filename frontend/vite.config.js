import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Unocss from 'unocss/vite'

export default defineConfig({
  plugins: [react(), Unocss()],
  define: { global: 'window' },
  server: {
    proxy: {
      // /api/* → http://localhost:8080/api/*
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // rewrite 불필요 (경로 그대로 보냄)
      },
    },
  },
})
