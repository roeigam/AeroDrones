# Deploy

The site is fully static (`npm run build` produces `dist/`), so it runs on any static host.
Netlify and Cloudflare Pages are both free for a site like this.

## Before the first deploy
1. **Web3Forms key** (contact form):
   - Go to https://web3forms.com, enter the client's email address, and copy the access key.
   - Messages arrive at that email. The subject says which language the visitor wrote from.
2. **Domain:** decide the production URL, for example `https://aerodrones.co.il`.

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output / publish directory | `dist` |
| Node version | 22.23+ (24 recommended; `.nvmrc` says 24) |
| Env `PUBLIC_WEB3FORMS_KEY` | the Web3Forms access key |
| Env `SITE_URL` | the production origin, no trailing slash |

> `SITE_URL` matters for link previews. WhatsApp needs an absolute `og:image` URL on the real domain.
> On Netlify, the site URL is used automatically if `SITE_URL` is missing. Still set it once a custom domain is connected.

## Netlify
1. **Add new site → Import an existing project →** pick the GitHub repo `roeigam/AeroDrones`.
2. Build command `npm run build`, publish directory `dist`.
3. **Site configuration → Environment variables:** add `PUBLIC_WEB3FORMS_KEY` and `SITE_URL`.
4. Deploy. Every push to `main` redeploys automatically.
5. **Domain management:** connect the custom domain. HTTPS is automatic.

## Cloudflare Pages
1. **Workers & Pages → Create → Pages → Connect to Git →** pick `roeigam/AeroDrones`.
2. Framework preset **Astro**, which gives build command `npm run build` and output `dist`.
3. **Settings → Environment variables (Production):** add `PUBLIC_WEB3FORMS_KEY`, `SITE_URL`, and `NODE_VERSION=24`.
4. Save and deploy. Every push to `main` redeploys automatically.
5. **Custom domains:** add the domain.

Both hosts read `public/_headers`, which sets long caching for hashed assets plus basic security headers.

## After deploying: checks
- [ ] `/` shows the Hebrew site and `/en/` shows the English one.
- [ ] Send a test message from the contact form in each language and confirm the emails arrive.
- [ ] Tap the WhatsApp buttons on a phone. The chat should open with the greeting pre-filled.
- [ ] Paste the URL into a WhatsApp chat (or https://www.opengraph.xyz) and confirm the preview card shows the image, title and description.
  - WhatsApp caches previews. To re-test after a change, add `?v=2` to the URL.
- [ ] Search visibility: the site ships with `noindex`. To let Google index it, set `shared.seo.noindex = false` in `src/content/site.ts`, then push.

## Regenerating images
- **OG images** (link previews) are in `public/og/`. After changing the hero photo or the copy, run `npm run gen:og`, then open `public/og/og-he.jpg` and check the Hebrew reads right-to-left.
- **Build placeholders:** `npm run gen:placeholders`. Only needed until the real build photos replace them.
