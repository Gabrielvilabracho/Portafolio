
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://gabrielvilabracho.com',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
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