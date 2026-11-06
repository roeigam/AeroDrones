# Before delivery: TODO list

These items must be resolved with the client before the site is handed over.
The full list of every `TODO` marker in the code is generated in Phase 6. This file tracks the ones that matter most.

## MUST (blocking)
- [ ] **About stats are placeholders.** The numbers in `src/content/site.ts` → `about.stats` ("8+", "150+", "100%") are invented. They MUST come from the client, or be removed by setting `stats: []` in both `he` and `en`. An empty array hides the row; the layout is designed to work without it.
- [ ] **WhatsApp number.** `shared.whatsappNumber` in `site.ts` is a placeholder.
- [ ] **Social links.** `shared.social` URLs point to platform home pages. Replace them with the client's profiles, or remove the ones he doesn't use.
- [ ] **Photos.** The hero, About and build images are placeholders (see `CREDITS.md`). Replace them with the client's own photos.
- [ ] **Copy.** All Hebrew and English text in `site.ts` and the build descriptions is placeholder copy written by us. The client must approve or replace it.
- [ ] **Web3Forms key.** Set `PUBLIC_WEB3FORMS_KEY` in the hosting environment (Phase 5).
- [ ] **Production URL.** `site` in `astro.config.mjs` is a placeholder domain.

## SHOULD
- [ ] HUD decorative labels (coordinates `32.08°N 34.78°E`, `CAM-01`, camera settings) are decorative placeholders. Keep them or personalize them.
- [ ] Decide whether the site stays `noindex`, set by `shared.seo.noindex` in `site.ts`.
