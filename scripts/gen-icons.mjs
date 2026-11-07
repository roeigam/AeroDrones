/**
 * Generates PNG icons from the brand mark:
 * - public/apple-touch-icon.png (180×180, opaque dark background; iOS ignores SVG favicons)
 * - public/favicon-32.png (32×32 fallback for browsers without SVG favicon support)
 * Usage: node scripts/gen-icons.mjs
 */
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));

function iconSvg(size, { padding, radius }) {
  const inner = size - padding * 2;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="45%" r="60%">
      <stop offset="0" stop-color="#2de2ff" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#2de2ff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2de2ff"/><stop offset="1" stop-color="#7b6cff"/></linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" fill="#04070d"/>
  <rect width="${size}" height="${size}" rx="${radius}" fill="url(#glow)"/>
  <g transform="translate(${padding} ${padding}) scale(${inner / 32})" fill="none" stroke="url(#g)" stroke-width="1.6" stroke-linecap="round">
    <circle cx="7" cy="7" r="4.2"/><circle cx="25" cy="7" r="4.2"/><circle cx="7" cy="25" r="4.2"/><circle cx="25" cy="25" r="4.2"/>
    <path d="m10 10 3.2 3.2M22 10l-3.2 3.2M10 22l3.2-3.2M22 22l-3.2-3.2"/><path d="M16 11.5 20.5 16 16 20.5 11.5 16Z"/>
    <circle cx="16" cy="16" r="1.6" fill="#2de2ff" stroke="none"/>
  </g>
</svg>`);
}

// iOS applies its own rounded mask → square corners here, generous padding.
await sharp(iconSvg(180, { padding: 34, radius: 0 })).png().toFile(path.join(root, 'public/apple-touch-icon.png'));
await sharp(iconSvg(32, { padding: 3, radius: 7 })).png().toFile(path.join(root, 'public/favicon-32.png'));
console.log('✓ public/apple-touch-icon.png (180×180)\n✓ public/favicon-32.png (32×32)');
