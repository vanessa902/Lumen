import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match the GitHub repo name so assets resolve on GitHub Pages
// (served at https://<user>.github.io/lumen/). Use '/' for local/other hosts.
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/lumen/' : '/',
  plugins: [react()],
})
