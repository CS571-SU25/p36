import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/p36/',  // Replace p36 with your actual group number/repo name
  build: {
    outDir: 'docs'
  }
})
