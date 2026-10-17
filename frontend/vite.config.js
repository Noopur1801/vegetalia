import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
 plugins: [react()],
  server: {
    hmr: {
      protocol: 'ws',
      host: 'import.meta.env.VITE_API_URL + ''
    }
  }
})