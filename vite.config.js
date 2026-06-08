import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:44334',
        changeOrigin: true,
        secure: false, // ضرورية جداً لأن السيرفر المحلي يستخدم HTTPS بشهادة غير معتمدة تلقائياً (Self-signed)
      }
    }
  }
})