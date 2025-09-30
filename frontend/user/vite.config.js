import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    port: 3000,  // 프론트엔드 포트
    proxy: {
      '/api': {
        target: 'http://localhost:10022',  // 백엔드 서버 포트
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // 전역타입 정의
  define: {
    global: 'globalThis',
  },
})