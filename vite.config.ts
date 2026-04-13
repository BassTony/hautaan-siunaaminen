import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base should match the GitHub Pages repo name for user basstony.
// Change '/hautaan-siunaaminen/' to '/' if deploying as the root site.
export default defineConfig({
  plugins: [react()],
  base: '/hautaan-siunaaminen/',
})
