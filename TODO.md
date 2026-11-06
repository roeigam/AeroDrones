# Before delivery: TODO list

These items must be resolved with the client before the site is handed over.
The full list of every `TODO` marker in the code is generated in Phase 6. This file tracks the ones that matter most.

## MUST (blocking)
- [ ] **About stats are placeholders.** The numbers in `src/content/site.ts` → `about.stats` ("8+", "150+", "100%") are invented. They MUST come from the client, or be removed by setting `stats: []` in both `he` and `en`. An empty array hides the row; the layout is designed to work without it.
- [ ] **WhatsApp number.** `shared.whatsappNumber` in `site.ts` is a placeholder.
- [ ] **Social links.** `shared.social` URLs point to platform home pages. Replace them with the client's profiles, or remove the ones he doesn't use.
- [ ] **Photos.** The hero, About and build images are placeholders (see `CREDITS.md`). Replace them with the client's own photos.
- [ ] **Copy.** All Hebrew and English text in `site.ts` and the build descriptions is placeholder copy written by us. The client must approve or replace it.
- [ ] **Web3Forms key.** Create one at web3forms.com with the client's email, then set `PUBLIC_WEB3FORMS_KEY` in the host's environment (see `DEPLOY.md`). Without it the form shows its error state and tells visitors to use WhatsApp.
- [ ] **Production URL.** Set `SITE_URL` in the host's environment, otherwise canonical and `og:image` URLs use a placeholder domain and WhatsApp link previews break. After changing the hero photo or the copy, run `npm run gen:og` and re-check `og-he.jpg`.

## SHOULD
- [ ] Contact "facts" (response time, service area) in `site.ts` → `contact.facts` are placeholders. Confirm them or set `facts: []` to hide them.
- [ ] Test a real form submission in both languages after deploy.
- [ ] HUD decorative labels (coordinates `32.08°N 34.78°E`, `CAM-01`, camera settings) are decorative placeholders. Keep them or personalize them.
- [ ] Decide whether the site stays `noindex`, set by `shared.seo.noindex` in `site.ts`.
