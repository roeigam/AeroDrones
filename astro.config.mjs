// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // TODO: set the real production URL once the domain is known (used for canonical / og:url).
  site: 'https://aerodrones.example.com',
  output: 'static',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'he',
    locales: ['he', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
