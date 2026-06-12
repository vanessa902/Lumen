import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// On GitHub Pages the app is served from a project subpath
// (https://<user>.github.io/<Repo>/). A relative base makes assets resolve
// against the current path regardless of the repo-name casing. Use '/' locally.
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? './' : '/',
  plugins: [react()],
})
