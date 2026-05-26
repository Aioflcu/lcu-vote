
import { defineConfig } from 'vite'
import { tanstackStartVite } from '@tanstack/start-vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite' // if using v4

export default defineConfig({
  plugins: [
    tanstackStartVite(),
    tailwindcss(),
    cloudflare()
  ],
  // This section forces Vite and Rollup to bypass node: builtins for SSR
  ssr: {
    external: ['node:async_hooks']
  },
  build: {
    rollupOptions: {
      external: ['node:async_hooks']
    }
  }
})