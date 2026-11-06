# AeroDrones — project guide for Claude

One-page showcase site for a client who designs, builds, repairs and sells custom drones.
It is a personal project, not a public business site: **no payments, no cart, no accounts, no login.**
Hebrew is the main language at `/` (RTL). English lives at `/en/` (LTR).

## Golden rules
1. **Design is the deliverable.** The site should feel like a premium drone product launch page, never like a template. Every section is deliberate, polished and cohesive. Concept: **"Flight HUD meets engineering blueprint."**
2. **Use CSS logical properties only:** `margin-inline`, `padding-inline-start`, `inset-inline-end`, `text-align: start` and so on. Never use `left`/`right` properties, `margin-left` and the like, or `text-align: left/right`. The whole design must mirror between RTL and LTR from ONE stylesheet.
3. **ALL design tokens** (colors, gradients, shadows, glows, spacing, radii, fonts, timings) live in `src/styles/tokens.css`. Components use tokens only and never hard-code raw colors.
4. **The accent color is one variable (`--accent`).** Tints, glows and borders derive from it with `color-mix()`.
5. **No hardcoded text in components.** All copy lives in `src/content/site.ts`, as `he` and `en` objects with identical keys plus shared fields.
6. **Animate only `transform` and `opacity`.** Respect `prefers-reduced-motion: reduce` by turning effects off and showing content directly.
7. **No UI frameworks.** Use only small vanilla TS modules for the mobile nav, lightbox, scroll reveals, language toggle and form submit.
8. **Brand "AeroDrones":**
   - It is stored once in `site.ts` as a shared value.
   - It is NEVER translated or transliterated.
   - On Hebrew pages it is always wrapped in `<bdi>`, in the logo, title, header, footer, meta and og image.
9. **Bidi:**
   - In Hebrew, Latin and number tokens in specs (`4S 1500mAh`, `F405`) are wrapped in `<bdi>` using the `splitBidi()` helper.
   - Phone and email input values are always `dir="ltr"`, while their labels follow the page direction.
10. **Mirroring.** Directional icons (arrows, chevrons, prev/next) mirror per direction. Logos and photos NEVER mirror.
11. **Eye candy must not cost speed:**
    - No `filter: blur()` on large layers. Use radial gradients for glows.
    - Use `backdrop-filter` sparingly and give it a fallback.
    - The hero image is eager with high fetch priority. Everything else is lazy.

## Gotchas (learned)
- **RTL selectors in Astro scoped styles.** Astro sometimes scopes an ancestor `[dir='rtl']` selector to the component, so it never matches `<html>`. Inside a component `<style>`, ALWAYS write `:global([dir='rtl']) .thing`.
- **SVG colors.** Don't put `var()` in SVG presentation attributes (`stroke="var(--x)"`). Use `style="stroke: var(--x)"` or CSS classes.
- **Images.** `picture { display: contents }` is set globally so `astro:assets` `<Picture>` images size against their real container.
- **Physical gradient angles** (`90deg`) don't mirror on their own. Give RTL its own angle rather than flipping the element with `scaleX(-1)` when it has positioned children.

## Stack
- Astro (latest), static output, TypeScript.
- Plain CSS with custom properties.
- Images use `astro:assets` (`<Picture>` with AVIF/WebP), with correct width and height. Images below the fold are lazy.
- Fonts are self-hosted via `@fontsource`, using the Hebrew and Latin subsets only, with `font-display: swap`:
  - Rubik for headings.
  - Heebo for body text.
  - JetBrains Mono (Latin only) for specs and technical labels. Its font stack falls back to Heebo for Hebrew.
- Scripts:

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Build the static site |
| `npm run preview` | Preview the built site |
| `npm run check` | Run `astro check` |

- Deploy target: Netlify or Cloudflare Pages (see `DEPLOY.md`).

## Content model
- **`src/content/site.ts`**
  - `shared`: `brand`, `whatsappNumber`, `social[]`, `seo.noindex`, `hero.mode` (`'cutout' | 'framed'`).
  - `he` and `en`: all copy, with identical keys. This covers nav, hero, about, services, builds labels, contact labels, form validation and status messages, the WhatsApp greeting, footer and meta.
- **`src/content/builds/<slug>.md`** is an Astro content collection.
  - `name`: `{ he, en }`.
  - `image`: path in `src/assets/builds/`.
  - `specs`: `string[]`, shared by both languages.
  - `description?`: `{ he, en }`.
  - `order`: `number`. Builds are sorted by `order`.
- `<meta name="robots" content="noindex">` is controlled by ONE setting: `site.ts → shared.seo.noindex`.

## i18n
- Astro built-in i18n: `defaultLocale: 'he'`, `locales: ['he','en']`, `prefixDefaultLocale: false`. Both pages are generated statically.
- Hebrew pages use `lang="he" dir="rtl"`. English pages use `lang="en" dir="ltr"`.
- Section ids are identical in both languages: `top`, `about`, `services`, `builds`, `contact`.
- **The language toggle** is a minimal flag switch: two round inline-SVG flags (IL / US, never emoji), 26px. The active flag is full color with an accent ring and glow (aria-current). The inactive flag is dimmed and desaturated, brightens on hover, and is a real <a> to the other locale. Each flag has an aria-label and a CSS tooltip. JS appends the current section hash (/#builds → /en/#builds).
- **Storing the choice.** The toggle saves the choice to localStorage, wrapped in try/catch.
- **Redirects: NEVER**, including returning visitors. Hebrew at `/` always stays Hebrew. The stored choice only adds a subtle highlight (.is-preferred) to that flag.

## Contact
- **Form submission.** The form posts with `fetch` to `https://api.web3forms.com/submit`.
  - The key comes from `PUBLIC_WEB3FORMS_KEY`, documented in `.env.example`.
  - The subject says which language the message came from.
  - A `botcheck` honeypot field guards against spam.
- **WhatsApp.** Links use `https://wa.me/<digits>?text=<greeting per language>`. One sits in the contact section and one is a floating button.

## Phases (STOP after each one for review)
- [x] **Phase 0:** this file, the folder structure and the visual design proposal.
- [x] **Phase 1:** style tile at `/style` (built, awaiting review). It is temporary, noindex, and removed in Phase 6.
- [x] **Phase 2:** i18n routing, language toggle, base layout, header, footer and the full hero.
- [ ] **Phase 3:** About and Services, with scroll reveals.
- [ ] **Phase 4:** builds collection, gallery and the `<dialog>` lightbox.
- [ ] **Phase 5:** contact form (Web3Forms), WhatsApp buttons, meta and OG tags. After generating og-he.jpg, OPEN it and verify the Hebrew renders right-to-left. If it is reversed or broken, make the og image text English-only for both languages.
- [ ] **Phase 6:** polish pass, performance check and the list of remaining TODO placeholders.

## Testing checklist (every phase)
- `npm run check` and `npm run build` are clean.
- Widths 360, 768 and 1280, in BOTH languages and directions.
- No console errors.
- No horizontal overflow.
- Reduced-motion check: effects are off and content is visible.
- Visible focus styles, alt text, and `aria-label` on icon-only buttons.

## Git
- Commit at the end of every phase ("Phase N: ...").

## Placeholder policy
- Every placeholder (text, image, number, coordinates) is marked with `// TODO` or `<!-- TODO -->`.
- Stock photos (Unsplash or Pexels) are recorded in `CREDITS.md` with source URL, photographer and license.
- The build gallery uses generated HUD-style placeholder images (`scripts/gen-build-placeholders.mjs`) until real photos arrive.
