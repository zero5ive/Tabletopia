import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
   server: {
    port: 3000,  // 프론트엔드 포트
    proxy: {
      '/api': {
        target: 'http://localhost:8001',  // 백엔드 서버 포트
        changeOrigin: true,
        secure: false,
      }
    }
  }
})