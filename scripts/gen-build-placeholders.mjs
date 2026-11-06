/**
 * Generates HUD-style PLACEHOLDER images for the build gallery (TODO: replace with real photos).
 * Usage: node scripts/gen-build-placeholders.mjs
 * Output: src/assets/builds/<slug>.jpg (1600×1200)
 *
 * Each placeholder is a blueprint-style render of a different frame type so the gallery
 * looks varied while clearly reading as "placeholder".
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const outDir = path.join(root, 'src/assets/builds');
mkdirSync(outDir, { recursive: true });

const W = 1600;
const H = 1200;

/** Frame geometries (top view), centered at 0,0 */
function frame(type) {
  const motors = (pts, r) => pts.map(([x, y]) => ({ x, y, r }));
  switch (type) {
    case 'x5':
      return { motors: motors([[-260, -260], [260, -260], [-260, 260], [260, 260]], 46), prop: 190, body: [150, 230], arm: 22 };
    case 'stretch7':
      return { motors: motors([[-250, -330], [250, -330], [-250, 330], [250, 330]], 54), prop: 250, body: [150, 300], arm: 24 };
    case 'whoop3':
      return { motors: motors([[-215, -215], [215, -215], [-215, 215], [215, 215]], 34), prop: 150, body: [170, 200], arm: 18, ducts: true };
    case 'race5':
      return { motors: motors([[-300, -230], [300, -230], [-300, 230], [300, 230]], 42), prop: 180, body: [120, 260], arm: 20 };
    case 'octo8':
      return {
        motors: motors([0, 45, 90, 135, 180, 225, 270, 315].map((d) => {
          const a = (d * Math.PI) / 180;
          return [Math.round(Math.cos(a) * 360), Math.round(Math.sin(a) * 360)];
        }), 44),
        prop: 140, body: [230, 230], arm: 20, round: true,
      };
    case 'tooth2':
      return { motors: motors([[-200, -200], [200, -200], [-200, 200], [200, 200]], 28), prop: 120, body: [110, 150], arm: 10 };
    default:
      throw new Error(`unknown frame ${type}`);
  }
}

function svg({ idx, name, kind, frameType, hue, rot, spec }) {
  const f = frame(frameType);
  const accent = `hsl(${hue} 100% 62%)`;
  const accentSoft = `hsl(${hue} 100% 62% / 0.35)`;
  const accentFaint = `hsl(${hue} 100% 62% / 0.12)`;
  const cx = W * 0.5;
  const cy = H * 0.52;

  const arms = f.motors
    .map((m) => `<line x1="0" y1="0" x2="${m.x}" y2="${m.y}" stroke="${accentSoft}" stroke-width="${f.arm}" stroke-linecap="round"/>`)
    .join('');
  const props = f.motors
    .map((m) => `<circle cx="${m.x}" cy="${m.y}" r="${f.prop}" fill="none" stroke="${accentFaint}" stroke-width="2" stroke-dasharray="6 10"/>`)
    .join('');
  const ducts = f.ducts
    ? f.motors.map((m) => `<circle cx="${m.x}" cy="${m.y}" r="${f.prop + 10}" fill="none" stroke="${accentSoft}" stroke-width="10"/>`).join('')
    : '';
  const motorEls = f.motors
    .map((m, i) => `
      <circle cx="${m.x}" cy="${m.y}" r="${m.r}" fill="#0b1322" stroke="${accent}" stroke-width="3"/>
      <circle cx="${m.x}" cy="${m.y}" r="${m.r * 0.35}" fill="none" stroke="${accent}" stroke-width="2"/>
      <text x="${m.x}" y="${m.y + m.r + 34}" text-anchor="middle" class="mono s">M${i + 1}</text>`)
    .join('');
  const [bw, bh] = f.body;
  const body = f.round
    ? `<circle r="${bw / 2}" fill="#0b1322" stroke="${accent}" stroke-width="3"/><circle r="${bw / 4}" fill="none" stroke="${accentSoft}" stroke-width="2"/>`
    : `<rect x="${-bw / 2}" y="${-bh / 2}" width="${bw}" height="${bh}" rx="22" fill="#0b1322" stroke="${accent}" stroke-width="3"/>
       <rect x="${-bw / 4}" y="${-bw / 4}" width="${bw / 2}" height="${bw / 2}" rx="8" fill="none" stroke="${accentSoft}" stroke-width="2"/>
       <rect x="${-bw / 5}" y="${-bh / 2 - 30}" width="${(bw * 2) / 5}" height="34" rx="8" fill="#0b1322" stroke="${accent}" stroke-width="2.5"/>`;

  const corner = (x, y, sx, sy) =>
    `<path d="M${x} ${y + sy * 70}V${y}H${x + sx * 70}" fill="none" stroke="${accent}" stroke-width="4"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="75%">
      <stop offset="0" stop-color="hsl(${hue} 70% 14%)"/>
      <stop offset="0.55" stop-color="#070c17"/>
      <stop offset="1" stop-color="#03050a"/>
    </radialGradient>
    <pattern id="minor" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0H0V32" fill="none" stroke="hsl(${hue} 100% 62% / 0.05)" stroke-width="1"/>
    </pattern>
    <pattern id="major" width="160" height="160" patternUnits="userSpaceOnUse">
      <path d="M160 0H0V160" fill="none" stroke="hsl(${hue} 100% 62% / 0.11)" stroke-width="1.5"/>
    </pattern>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="10" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <style>
      .mono { font-family: Consolas, 'DejaVu Sans Mono', 'Courier New', monospace; fill: ${accent}; letter-spacing: 3px; }
      .s { font-size: 22px; fill: hsl(${hue} 100% 75% / 0.7); }
      .m { font-size: 28px; }
      .name { font-family: 'Segoe UI', 'Arial Black', Arial, sans-serif; font-weight: 800; font-size: 92px; fill: #eaf1fa; letter-spacing: -2px; }
      .ph { font-family: Consolas, 'Courier New', monospace; font-size: 24px; fill: #ff6b7a; letter-spacing: 4px; }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#minor)"/>
  <rect width="100%" height="100%" fill="url(#major)"/>
  <circle cx="${cx}" cy="${cy}" r="470" fill="none" stroke="hsl(${hue} 100% 62% / 0.08)" stroke-width="2" stroke-dasharray="2 12"/>
  <path d="M${cx} 120V${H - 120}M200 ${cy}H${W - 200}" stroke="hsl(${hue} 100% 62% / 0.08)" stroke-width="1.5" stroke-dasharray="4 14"/>

  <g transform="translate(${cx} ${cy}) rotate(${rot}) scale(0.92)" filter="url(#glow)">
    ${props}${ducts}${arms}${body}${motorEls}
  </g>

  ${corner(60, 60, 1, 1)}${corner(W - 60, 60, -1, 1)}${corner(60, H - 60, 1, -1)}${corner(W - 60, H - 60, -1, -1)}

  <text x="110" y="130" class="mono m">BUILD/${String(idx).padStart(2, '0')}  ·  ${kind}</text>
  <text x="${W - 110}" y="130" text-anchor="end" class="ph">PLACEHOLDER · TODO</text>
  <text x="110" y="${H - 170}" class="name">${name}</text>
  <text x="110" y="${H - 110}" class="mono m" style="fill: hsl(${hue} 100% 80% / 0.85)">${spec}</text>
  <text x="${W - 110}" y="${H - 110}" text-anchor="end" class="mono s">REPLACE WITH REAL PHOTO</text>
</svg>`;
}

// TODO: these placeholders are replaced by the client's real build photos.
const builds = [
  { slug: 'falcon-5', idx: 1, name: 'FALCON 5', kind: '5" FREESTYLE', frameType: 'x5', hue: 188, rot: 8, spec: '2207 1950KV · 6S · O3' },
  { slug: 'carbon-ghost-7', idx: 2, name: 'CARBON GHOST 7', kind: '7" LONG RANGE', frameType: 'stretch7', hue: 205, rot: -6, spec: '2807 1300KV · 6S LI-ION · GPS' },
  { slug: 'neon-whoop-3', idx: 3, name: 'NEON WHOOP', kind: '3" CINEWHOOP', frameType: 'whoop3', hue: 172, rot: 0, spec: '1404 4600KV · 4S · DUCTED' },
  { slug: 'viper-race', idx: 4, name: 'VIPER X', kind: '5" RACE', frameType: 'race5', hue: 250, rot: 4, spec: '2306 2600KV · 4S · ANALOG' },
  { slug: 'atlas-cine-8', idx: 5, name: 'ATLAS CINE 8', kind: 'X8 CINELIFTER', frameType: 'octo8', hue: 196, rot: 22.5, spec: '3115 900KV · 6S · 2.1KG' },
  { slug: 'micro-scout', idx: 6, name: 'MICRO SCOUT', kind: '2.5" TOOTHPICK', frameType: 'tooth2', hue: 180, rot: -10, spec: '1103 11000KV · 2S · 62G' },
];

for (const b of builds) {
  const file = path.join(outDir, `${b.slug}.jpg`);
  await sharp(Buffer.from(svg(b))).jpeg({ quality: 84, mozjpeg: true }).toFile(file);
  console.log('✓', path.relative(root, file));
}
