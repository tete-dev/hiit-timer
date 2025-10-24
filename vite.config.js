import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  base: '/hiit-timer/',
  plugins: [svelte()],
  server: {
    port: 5173,
    host: true
  }
})
