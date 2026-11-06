# Before delivery: TODO list

Every placeholder in the code is marked `TODO`. To list them all, run `git grep -n TODO -- src scripts astro.config.mjs`.

## 1. Needed from the client

### MUST (blocking)
- [ ] **About stats.** `src/content/site.ts` → `about.stats` ("8+", "150+", "100%") are invented numbers.
  - Get the real values, or remove the row by setting `stats: []` in both `he` and `en`. An empty array hides it; the layout is designed to work without it.
- [ ] **WhatsApp number.** `shared.whatsappNumber` is a placeholder (`972500000000`). Use international format, digits only.
- [ ] **Social links.** `shared.social` URLs point to platform home pages. Replace them with his profiles, and remove any he doesn't use.
- [ ] **Hero photo.** `src/assets/hero/hero-drone.jpg` is an Unsplash placeholder.
  - Best is a drone shot on a dark or plain background, or a transparent PNG, because hero mode is `cutout`.
  - Then update `hero.imageAlt` in both languages and run `npm run gen:og`.
- [ ] **About photo.** `src/assets/about/about-builder.jpg` is a placeholder; ideally a photo of him or his workbench. Update `about.imageAlt` in both languages.
- [ ] **Build gallery.** All 6 builds in `src/content/builds/*.md` are invented (photos, names, specs and descriptions).
  - Replace them with his real builds. See README → "How to add a new build".
- [ ] **All copy.** Every Hebrew and English text in `site.ts` is placeholder copy written by us:
  - meta title and description
  - hero
  - about story
  - services
  - contact text
  - footer tagline

  The client must approve or replace it, in both languages.

### SHOULD
- [ ] **Contact facts.** `contact.facts` ("response within one business day", "nationwide · shipping or pickup") must be confirmed, or set `facts: []` to hide them.
- [ ] **WhatsApp greeting.** `contact.whatsapp.greeting` should be confirmed in both languages.
- [ ] **Indexing.** Decide whether the site should appear in Google. It is `noindex` by default (`shared.seo.noindex`).

## 2. Needed from you (keys, SITE_URL, hosting)
- [ ] **Web3Forms key.** Create one at web3forms.com with the client's email, then set `PUBLIC_WEB3FORMS_KEY` in the host's environment variables.
  - Without the key, the form shows its error state and points visitors to WhatsApp.
- [ ] **Hosting.** Connect `roeigam/AeroDrones` to Netlify or Cloudflare Pages. Build: `npm run build`, output: `dist`, Node 22.23 or newer (`.nvmrc` = 24). See `DEPLOY.md`.
- [ ] **Domain and `SITE_URL`.** Connect the domain and set `SITE_URL` (for example `https://aerodrones.co.il`).
  - Until then, canonical, `og:url` and `og:image` use the placeholder `aerodrones.example.com`, so WhatsApp link previews won't show the image.
  - On Netlify, the site URL is used automatically as a fallback.
- [ ] **Post-deploy checks** (`DEPLOY.md`):
  - Send a real form message in each language.
  - Tap the WhatsApp buttons on a phone.
  - Paste the URL into WhatsApp and check the preview card.
- [ ] **After real photos or copy arrive:**
  - Run `npm run gen:og`.
  - Open `public/og/og-he.jpg` and check the Hebrew reads right-to-left.
  - Commit and push.
- [ ] **If going public:**
  - Set `shared.seo.noindex = false`. The SEO score goes from 66 to about 100; the only failing audit is "not crawlable".
  - Consider adding `@astrojs/sitemap` and a `robots.txt`.

## 3. Optional improvements
- [ ] **Decorative HUD labels.** Coordinates `32.08°N 34.78°E`, `CAM-01` and `CAM-02`, and the camera settings in `shared.hero.frameLabels` and `shared.about.frameLabels` can be personalized, for example his real city, or kept as decoration.
- [ ] **Home-screen icon.** Add `apple-touch-icon.png` (180×180) and a PNG favicon. Today there is only `favicon.svg`, which iOS ignores for home-screen icons.
- [ ] **Custom 404 page** in the site's style (`src/pages/404.astro`).
- [ ] **DOM size.** About 1,050 elements; Lighthouse warns above 800.
  - Most of it is the lightbox, which renders every slide up front.
  - If the gallery grows past roughly 20 builds, render slides lazily from JSON.
- [ ] **Hebrew first paint.** 2.0 s on Lighthouse's simulated slow 4G, versus 1.7 s for English, because the Hebrew page needs both the Hebrew and Latin font subsets.
  - Could drop unused font weights after the final copy is in, or preload the Heebo body font.
- [ ] **Parallax in Firefox.** The hero parallax uses CSS scroll-driven animations (Chrome, Edge and Safari 26+). Firefox simply shows no parallax. A tiny JS fallback is possible if wanted.
- [ ] **Analytics.** If he wants visitor stats, add a privacy-friendly option such as Plausible or Cloudflare Web Analytics, which need no cookie banner.
- [ ] **Placeholder render script.** Once all real build photos are in, delete `scripts/gen-build-placeholders.mjs`.
