import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  optimizeDeps: {
    exclude: ['@electric-sql/pglite'],
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png', 'icon-512-maskable.png'],
      workbox: {
        cacheId: 'sqlab-v7',
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globIgnores: ['**/*.wasm', '**/*.data'],
      },
      manifest: {
        name: 'Maestro Dev',
        short_name: 'Maestro Dev',
        description: 'Aprende programación desde básico hasta nivel senior',
        version: '0.3.0',
        id: '/',
        start_url: '/',
        scope: '/',
        theme_color: '#0d1117',
        background_color: '#0d1117',
        display: 'browser',
        orientation: 'portrait',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
