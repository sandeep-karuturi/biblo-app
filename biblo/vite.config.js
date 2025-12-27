import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // Add this section below:
    allowedHosts: [
      'biblo.co.in',
      'www.biblo.co.in',
      '3.90.128.188'
    ]
  }
})