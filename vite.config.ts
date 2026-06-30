import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    // Project-site base for GitHub Pages. Override with BASE_URL when needed.
    base: env.BASE_URL || process.env.BASE_URL || '/navigation-experimentation/',
  }
})
