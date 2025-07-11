import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/backend': 'http://localhost:8000', // arahkan ke server PHP kamu
    },
  },
})
