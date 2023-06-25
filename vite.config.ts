import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/sticky-portfolio/",
  plugins: [react()],
  optimizeDeps: {
    exclude: ['scrollreveal'], // To get packages from local server in dev mode
  },
})
