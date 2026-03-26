import { defineConfig, passthroughImageService } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://deer-antler.jewelry',
  output: 'static',
  integrations: [
    tailwind(),
  ],
  // All product images live on Shopify CDN — no local image processing needed
  image: {
    service: passthroughImageService(),
  },
  build: {
    // Use _assets instead of the default _astro for a cleaner public folder
    assets: '_assets',
    // Inline small stylesheets automatically for fewer round-trips
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      // Split CSS per page so unused styles aren't loaded on every page
      cssCodeSplit: true,
    },
    server: {
      // Allow all ngrok tunnels — covers any subdomain on ngrok.app and ngrok.io
      // This is what lets your phone access the dev server through an ngrok tunnel.
      // Your laptop's local network IP is also allowed automatically when you run
      // "npm run dev -- --host" (see mobile testing instructions in README).
      allowedHosts: [
        '116379d0345c.ngrok.app',
      ],
    },
  },
});
