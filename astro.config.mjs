// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Two delivery targets:
 * - `npm run build`          → dist/ for Netlify (unchanged, absolute paths).
 * - `npm run build:offline`  → AeroDrones-offline/ that opens from a local folder (file://).
 *   scripts/build-offline.mjs sets PUBLIC_OFFLINE_BUILD=1 and rewrites every link to a relative one.
 */
const offline = process.env.PUBLIC_OFFLINE_BUILD === '1';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Production origin for canonical, og:url and absolute og:image URLs (WhatsApp previews need these).
  // Netlify sets URL automatically (https://<name>.netlify.app); SITE_URL overrides it for a custom domain.
  // An empty SITE_URL falls through to the next option. The offline build doesn't use these tags.
  site: process.env.SITE_URL || process.env.URL || 'https://aerodrones.example.com',
  outDir: offline ? './AeroDrones-offline' : './dist',
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
    // It also keeps the offline copy simple (no stylesheet files to resolve).
    inlineStylesheets: 'always',
  },
});
