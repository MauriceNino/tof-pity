import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      includeAssets: [
        'favicon.ico',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'crystal_dust.webp',
        'apple-touch-icon.png',
        'android-chrome-96x96.png',
        'android-chrome-192x192.png',
        'android-chrome-512x512.png',
      ],
      manifest: {
        name: 'TOF Pity',
        short_name: 'TOF Pity',
        icons: [
          {
            src: '/android-chrome-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        theme_color: '#4b4b4b',
        background_color: '#4b4b4b',
        display: 'standalone',
      },
    }),
  ],
  build: {
    sourcemap: true,
  },
});
