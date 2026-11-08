/**
 * Generates the 1200×630 Open Graph images (link previews on WhatsApp, Telegram, Facebook…).
 * Usage: node scripts/gen-og.mjs        → public/og/og-he.jpg, public/og/og-en.jpg
 *
 * Text comes from src/content/site.ts (Node 24 strips TS types natively), rendered by Pango with the
 * bundled OFL fonts in scripts/fonts/ (Rubik, Heebo, JetBrains Mono). Pango does proper bidi, so
 * Hebrew renders right-to-left. ALWAYS open og-he.jpg after regenerating and check it reads correctly.
 * Set OG_TEXT=en to force English text on both images (fallback if Hebrew ever renders wrong).
 */
import sharp from 'sharp';
import path from 'node:path';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { content, shared } from '../src/content/site.ts';

const root = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const FONT = {
  rubik: path.join(root, 'scripts/fonts/Rubik.ttf'),
  heebo: path.join(root, 'scripts/fonts/Heebo.ttf'),
  mono: path.join(root, 'scripts/fonts/JetBrainsMono.ttf'),
};
const HERO = path.join(root, 'src/assets/hero/hero.jpg');
const OUT = path.join(root, 'public/og');
mkdirSync(OUT, { recursive: true });

const W = 1200;
const H = 630;
const M = 72; // outer margin
const C = { bg: '#04070d', text: '#eaf1fa', muted: '#93a3bc', faint: '#5d6e89', accent: '#2de2ff', secondary: '#7b6cff' };

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/**
 * Pango picks the paragraph direction from the first strong character. A Hebrew string that starts
 * with Latin (e.g. "// FPV בהתאמה…") would be laid out LTR and read scrambled, so every Hebrew
 * string gets a leading RIGHT-TO-LEFT MARK to force an RTL paragraph (like dir="rtl" in the browser).
 */
const RLM = String.fromCharCode(0x200f); // U+200F RIGHT-TO-LEFT MARK

/** Render Pango markup to a transparent PNG buffer + its size. */
async function text(markup, { font, file, width, align = 'left', spacing = 0 }) {
  const buf = await sharp({
    text: { text: markup, font, fontfile: file, rgba: true, dpi: 72, width, align, spacing, wrap: 'word' },
  }).png().toBuffer();
  const { width: w, height: h } = await sharp(buf).metadata();
  return { buf, w, h };
}

function backgroundSvg(rtl) {
  // drone side = inline end
  const gx = rtl ? 330 : W - 330;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="g1" cx="${gx}" cy="${H / 2}" r="360" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${C.accent}" stop-opacity="0.32"/>
      <stop offset="0.45" stop-color="${C.accent}" stop-opacity="0.08"/>
      <stop offset="1" stop-color="${C.accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="${gx + (rtl ? 120 : -120)}" cy="${H / 2 + 120}" r="420" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${C.secondary}" stop-opacity="0.25"/>
      <stop offset="1" stop-color="${C.secondary}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="minor" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="${C.accent}" stroke-opacity="0.04"/></pattern>
    <pattern id="major" width="120" height="120" patternUnits="userSpaceOnUse"><path d="M120 0H0V120" fill="none" stroke="${C.accent}" stroke-opacity="0.08"/></pattern>
    <radialGradient id="fade" cx="50%" cy="40%" r="75%"><stop offset="0.3" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
    <mask id="m"><rect width="100%" height="100%" fill="url(#fade)"/></mask>
  </defs>
  <rect width="100%" height="100%" fill="${C.bg}"/>
  <g mask="url(#m)"><rect width="100%" height="100%" fill="url(#minor)"/><rect width="100%" height="100%" fill="url(#major)"/></g>
  <rect width="100%" height="100%" fill="url(#g2)"/>
  <rect width="100%" height="100%" fill="url(#g1)"/>
</svg>`;
}

function hudSvg(rtl) {
  const cx = rtl ? 330 : W - 330;
  const cy = H / 2;
  const ticks = Array.from({ length: 72 }, (_, i) => {
    const big = i % 9 === 0;
    return `<line x1="${cx}" y1="${cy - 268}" x2="${cx}" y2="${cy - 268 + (big ? 14 : 7)}" stroke="${C.accent}" stroke-opacity="${big ? 0.6 : 0.25}" transform="rotate(${i * 5} ${cx} ${cy})"/>`;
  }).join('');
  const corner = (x, y, sx, sy) => `<path d="M${x} ${y + sy * 34}V${y}H${x + sx * 34}" fill="none" stroke="${C.accent}" stroke-width="2.5" stroke-opacity="0.9"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <circle cx="${cx}" cy="${cy}" r="268" fill="none" stroke="${C.accent}" stroke-opacity="0.18"/>
  ${ticks}
  <path d="M${cx} ${cy - 268} A268 268 0 0 1 ${cx + 190} ${cy - 190}" fill="none" stroke="${C.accent}" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="${cx}" cy="${cy}" r="214" fill="none" stroke="${C.secondary}" stroke-opacity="0.4" stroke-dasharray="2 7"/>
  ${corner(28, 28, 1, 1)}${corner(W - 28, 28, -1, 1)}${corner(28, H - 28, 1, -1)}${corner(W - 28, H - 28, -1, -1)}
</svg>`;
}

function markSvg(size) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.accent}"/><stop offset="1" stop-color="${C.secondary}"/></linearGradient></defs>
  <g fill="none" stroke="url(#g)" stroke-width="1.6" stroke-linecap="round">
    <circle cx="7" cy="7" r="4.2"/><circle cx="25" cy="7" r="4.2"/><circle cx="7" cy="25" r="4.2"/><circle cx="25" cy="25" r="4.2"/>
    <path d="m10 10 3.2 3.2M22 10l-3.2 3.2M10 22l3.2-3.2M22 22l-3.2-3.2"/><path d="M16 11.5 20.5 16 16 20.5 11.5 16Z"/>
  </g><circle cx="16" cy="16" r="1.6" fill="${C.accent}"/></svg>`);
}

async function drone(size) {
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <defs><radialGradient id="r" cx="50%" cy="54%" r="50%"><stop offset="0.5" stop-color="#fff"/><stop offset="0.72" stop-color="#fff" stop-opacity="0.55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <rect width="100%" height="100%" fill="url(#r)"/></svg>`);
  return sharp(HERO)
    .resize(size, size, { fit: 'cover' })
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function build(lang, textLang) {
  const rtl = textLang === 'he';
  const t = content[textLang];
  const isHe = textLang === 'he';
  const bodyFont = isHe ? FONT.heebo : FONT.rubik;
  const dirMark = isHe ? RLM : '';

  const brandParts = shared.brand.match(/^([A-Z][a-z]+)(.+)$/) ?? [shared.brand, shared.brand, ''];
  const brand = await text(
    `<span foreground="${C.text}" weight="700">${esc(brandParts[1])}</span><span foreground="${C.accent}" weight="700">${esc(brandParts[2])}</span>`,
    { font: 'Rubik 34', file: FONT.rubik },
  );
  const line1 = await text(`<span foreground="${C.text}" weight="800">${dirMark}${esc(t.hero.titleLead)}</span>`, { font: 'Rubik 84', file: FONT.rubik });
  const line2 = await text(`<span foreground="${C.accent}" weight="800">${dirMark}${esc(t.hero.titleAccent)}</span>`, { font: 'Rubik 84', file: FONT.rubik });
  const tagline = await text(`<span foreground="${C.muted}">${dirMark}${esc(t.meta.description)}</span>`, {
    font: `${isHe ? 'Heebo' : 'Rubik'} 27`, file: bodyFont, width: 560, align: rtl ? 'right' : 'left', spacing: 6,
  });
  const label = await text(`<span foreground="${C.accent}" letter_spacing="2400">${dirMark}${esc(t.hero.eyebrow.toUpperCase())}</span>`, {
    font: `${isHe ? 'Heebo' : 'JetBrains Mono'} 17`, file: isHe ? FONT.heebo : FONT.mono,
  });

  // Place text on the inline-start side (left in EN, right in HE)
  const x = (w) => (rtl ? W - M - w : M);
  const markSize = 44;
  const comps = [];
  let y = 70;
  const brandRowW = markSize + 14 + brand.w;
  const brandX = x(brandRowW);
  // Brand is always "mark + AeroDrones" left-to-right (a logo never mirrors)
  comps.push({ input: markSvg(markSize), left: brandX, top: y });
  comps.push({ input: brand.buf, left: brandX + markSize + 14, top: y + Math.round((markSize - brand.h) / 2) });
  y += markSize + 52;
  comps.push({ input: label.buf, left: x(label.w), top: y });
  y += label.h + 22;
  comps.push({ input: line1.buf, left: x(line1.w), top: y });
  y += line1.h - 6;
  comps.push({ input: line2.buf, left: x(line2.w), top: y });
  y += line2.h + 26;
  comps.push({ input: tagline.buf, left: x(tagline.w), top: y });

  // Drone + HUD on the inline-end side
  const dSize = 470;
  const dx = rtl ? 330 - dSize / 2 : W - 330 - dSize / 2;
  const droneBuf = await drone(dSize);

  const file = path.join(OUT, `og-${lang}.jpg`);
  await sharp(Buffer.from(backgroundSvg(rtl)))
    .composite([
      { input: droneBuf, left: Math.round(dx), top: Math.round(H / 2 - dSize / 2 + 10), blend: 'lighten' },
      { input: Buffer.from(hudSvg(rtl)), left: 0, top: 0 },
      ...comps,
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(file);
  console.log('✓', path.relative(root, file), `(${textLang} text)`);
}

const forceEnglish = process.env.OG_TEXT === 'en';
await build('he', forceEnglish ? 'en' : 'he');
await build('en', 'en');
