
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://gabrielvilabracho.com',
  integrations: [react(), tailwind()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'pt', 'ru'],
    fallback: {
      es: 'en',
      pt: 'en',
      ru: 'en',
    },
    routing: {
      fallbackType: 'rewrite',
    },
  },
});