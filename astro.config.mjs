import { defineConfig } from 'astro/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  integrations: [
    // react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: 'static',
  base: '/WEB-Sorteo/',
  site: 'https://fravelz.github.io/WEB-Sorteo/',

  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
});
