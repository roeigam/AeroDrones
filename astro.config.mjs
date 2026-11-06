// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Production origin for canonical, og:url and absolute og:image URLs (WhatsApp previews need these).
  // Set SITE_URL in the host's environment. Netlify's URL is used automatically as a fallback.
  // TODO: set SITE_URL to the real domain before delivery.
  site: process.env.SITE_URL || process.env.URL || 'https://aerodrones.example.com',
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
    // One page: inlining the CSS removes the only render-blocking request (Lighthouse).
    inlineStylesheets: 'always',
  },
});
