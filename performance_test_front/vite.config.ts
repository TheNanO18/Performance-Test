// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 5173, // React 개발 서버 포트 설정 (기본값)
    host: true,
    
    // 💡 프록시 설정 (백엔드 서버로 요청 전달)
    proxy: {
      // 1. REST API 호출 (/api/test/start 등)
      '/api': {
        target: 'http://localhost:8080', // Spring Boot 백엔드 주소
        changeOrigin: true,            // 호스트 헤더를 백엔드 서버 주소로 변경
        secure: false,                 // HTTPS 사용 시 false
      },
      
      // 2. WebSocket 연결 요청 (/ws/status 등)
      '/ws': {
        target: 'ws://localhost:8080', // WebSocket은 'ws://'를 사용
        ws: true,                      // WebSocket 프록시 활성화
        changeOrigin: true,
      }
    }
  },

  // TypeScript 사용 시 설정 (tsconfig.json에 따라 조정될 수 있음)
  resolve: {
    // .js, .jsx, .ts, .tsx 등의 확장자 자동 처리
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  }
});