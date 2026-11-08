# Deploy

There are two delivery targets from the same code:

| Target | Command | Output | Who it's for |
|---|---|---|---|
| **A. Netlify** (online, free `*.netlify.app` address) | `npm run build` | `dist/` | Your portfolio link |
| **B. Offline copy** (opens from a folder, no server) | `npm run build:offline` | `AeroDrones-offline/` | The client |

---

## A. Netlify

The repo includes `netlify.toml`, so Netlify needs no build settings: build command `npm run build`, publish directory `dist`, Node 24.

### First deploy
1. Go to https://app.netlify.com → **Add new site → Import an existing project → GitHub**, and pick `roeigam/AeroDrones`.
2. Netlify reads `netlify.toml`. Leave the defaults and click **Deploy**.
3. Optional: **Site configuration → Change site name** gives a nicer address, for example `aerodrones-roei.netlify.app`.
4. **Contact form:** go to **Site configuration → Environment variables** and add `PUBLIC_WEB3FORMS_KEY` (get the key at https://web3forms.com with the email that should receive messages). Then click **Deploys → Trigger deploy**.

Every push to `main` redeploys automatically.

### Things that work automatically
- **Link previews.** Netlify sets `URL=https://<name>.netlify.app` during the build. The site uses it for canonical, `og:url` and the absolute `og:image`, so WhatsApp previews work on the `.netlify.app` address.
  - `SITE_URL` is only needed if a custom domain is added later.
- **404 pages.** Unknown paths show the styled Hebrew `404.html`. Unknown `/en/...` paths show the English one, via `public/_redirects`.
- **Caching and security headers** come from `public/_headers`.

### Checks after deploying
- [ ] `/` is Hebrew and `/en/` is English. The flags switch between them and keep the current section.
- [ ] Send a test message from the form in each language and confirm the email arrives. The subject says the language.
- [ ] Tap the WhatsApp buttons on a phone. The chat should open with the greeting pre-filled.
- [ ] Paste the URL into a WhatsApp chat and confirm the preview shows the image, title and description.
  - WhatsApp caches previews. To re-test after a change, add `?v=2` to the URL.
- [ ] Open `/nothing-here` and `/en/nothing-here` to check the 404 pages.
- [ ] The site is `noindex`. To let Google list it, set `shared.seo.noindex = false` in `src/content/site.ts` and push.

---

## B. Offline copy for the client

A folder that opens by **double-clicking `index.html`**, with no server and no internet needed to browse.

### Build it
```bash
npm run build:offline
```
This creates `AeroDrones-offline/`, which is git-ignored and rebuilt from scratch each time. The script:
- **Rewrites links.** Every link and asset path becomes relative: `en/index.html` ↔ `../index.html`, the CSS, images, the language flags and the 404 pages.
- **Embeds scripts and fonts** into the pages, because browsers block module scripts and some font loads from `file://`.
- **Drops web-only parts:**
  - OG images, canonical and OG tags;
  - host files (`_headers`, `_redirects`).
- **Fails with a clear message** if any absolute path is left.

`SITE_URL` can be empty or missing; the offline pages don't use it. If `PUBLIC_WEB3FORMS_KEY` is set when building, it is still embedded, but see the contact form note below.

### Hand it over
1. Zip the `AeroDrones-offline` folder and send the zip.
2. The client unzips it anywhere and **double-clicks `index.html`**.
   - Hebrew opens first. The flags switch to English (`en/index.html`) and back.
   - Everything works offline: images, fonts, the gallery lightbox, the mobile menu and the language switch.

### What needs internet in the offline copy
- **WhatsApp and social links** open the web or app as usual, so they need internet.
- **The contact form cannot send from `file://`.** Web3Forms rejects requests from a local file: the browser sends origin `null`, and the CORS preflight is refused with 403.
  - Instead of failing, the form shows a short note that it only works on the online site.
  - When the visitor submits, a **"Send this on WhatsApp"** button appears, pre-filled with their message, name and phone.

### Rebuild after changes
Change the content (`src/content/site.ts`, builds, photos), then run `npm run build:offline` again and send the new zip.

---

## Regenerating images
- **OG images** (link previews) are in `public/og/`. After changing the hero photo or the copy, run `npm run gen:og`, then open `public/og/og-he.jpg` and check the Hebrew reads right-to-left.
- **Icons** (`apple-touch-icon.png`, `favicon-32.png`): `npm run gen:icons`.

## Cloudflare Pages (alternative)
Use the Astro preset (`npm run build`, output `dist`) with `NODE_VERSION=24` and the same env variables. Cloudflare serves the nearest `404.html` by itself. The English 404 lives at `en/404/index.html`, so unknown `/en/` paths there fall back to the Hebrew 404.
