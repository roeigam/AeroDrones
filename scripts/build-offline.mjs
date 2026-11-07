/**
 * Offline build for the client: a folder that opens by double-clicking index.html (file://, no server).
 * Usage: npm run build:offline   → ./AeroDrones-offline/
 *
 * 1. Builds with PUBLIC_OFFLINE_BUILD=1 (astro.config.mjs switches outDir; BaseLayout drops
 *    canonical/hreflang/OG tags, which need a real URL; the contact form explains it can't send).
 * 2. Rewrites every root-relative URL ("/_astro/x.woff2", "/en/", "/") in every HTML file to a path
 *    relative to that file ("../_astro/x.woff2", "index.html", "../index.html"), including srcset
 *    and CSS url(...). Folder URLs get an explicit index.html, because file:// has no directory index.
 * 3. Removes host-only files (_headers, _redirects, og/).
 * 4. Fails loudly if any absolute path or external module script is left (those break on file://).
 */
import { build } from 'astro';
import { readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const OUT = path.join(root, 'AeroDrones-offline');

process.env.PUBLIC_OFFLINE_BUILD = '1';
// An empty or missing SITE_URL is fine here: the offline pages contain no absolute site URLs.

await rm(OUT, { recursive: true, force: true });
await build({ root });

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

/** "/en/#builds" → "../en/index.html#builds" (prefix = path from this page's folder to the root). */
function toRelative(url, prefix) {
  if (!url.startsWith('/') || url.startsWith('//')) return url;
  const m = url.match(/^([^?#]*)([?#].*)?$/);
  let p = m[1];
  const rest = m[2] ?? '';
  if (p.endsWith('/')) p += 'index.html';
  return prefix + p.slice(1) + rest;
}

function rewrite(html, prefix) {
  // Font preloads are CORS requests (crossorigin); from file:// (origin "null") the browser blocks them.
  // The fonts still load through @font-face, and preloading gains nothing from a local disk: drop them.
  html = html.replace(/<link\b[^>]*\brel=["']preload["'][^>]*\bas=["']font["'][^>]*>/g, '');
  html = html.replace(/<link\b[^>]*\bas=["']font["'][^>]*\brel=["']preload["'][^>]*>/g, '');
  // Plain URL attributes
  html = html.replace(/\b(href|src|poster|action|data-src)=(["'])(\/(?!\/)[^"']*)\2/g, (_, attr, q, url) => `${attr}=${q}${toRelative(url, prefix)}${q}`);
  // srcset / imagesrcset: "url 400w, url 800w"
  html = html.replace(/\b(srcset|imagesrcset)=(["'])([^"']*)\2/g, (_, attr, q, list) => {
    const rewritten = list
      .split(',')
      .map((part) => {
        const [url, ...desc] = part.trim().split(/\s+/);
        return [toRelative(url, prefix), ...desc].join(' ');
      })
      .join(', ');
    return `${attr}=${q}${rewritten}${q}`;
  });
  // CSS url(/...) in inline <style> blocks and style="" attributes
  html = html.replace(/url\((["']?)(\/(?!\/)[^)"']+)\1\)/g, (_, q, url) => `url(${q}${toRelative(url, prefix)}${q})`);
  return html;
}

/**
 * Browsers refuse to load module scripts over file:// (origin "null" → CORS). Astro emits shared
 * scripts as external modules (e.g. Header → import "./lang.js"). Flatten each one, with its
 * side-effect imports, into a single INLINE <script type="module"> (inline modules need no fetch and
 * keep the deferred, strict-mode behavior). Each module is wrapped in its own function scope.
 */
const IMPORT_RE = /import\s*["']([^"']+)["'];?/g;
async function flattenModule(file, seen) {
  if (seen.has(file)) return '';
  seen.add(file);
  let code = await readFile(file, 'utf8');
  let deps = '';
  for (const m of code.matchAll(IMPORT_RE)) deps += await flattenModule(path.resolve(path.dirname(file), m[1]), seen);
  code = code.replace(IMPORT_RE, '');
  if (/(^|[;}\n])\s*(import\s*[\w{*(]|export\s)/.test(code)) {
    throw new Error(`${path.relative(OUT, file)} has imports/exports beyond side effects; can't inline it for file://`);
  }
  return `${deps}(() => {\n${code}\n})();\n`;
}
async function inlineModules(html, file) {
  const seen = new Set();
  const tags = [...html.matchAll(/<script([^>]*)\stype=["']module["']([^>]*)\ssrc=["']([^"']+)["']([^>]*)><\/script>/g)];
  for (const [tag, , , src] of tags) {
    const js = (await flattenModule(path.resolve(path.dirname(file), src), seen)).replace(/<\/script/gi, '<\\/script');
    html = html.replace(tag, () => `<script type="module">${js}</script>`);
  }
  return html;
}

/**
 * Web fonts are origin-checked. Chromium allows them from file://, but Firefox only allows fonts from
 * the page's own folder (or below), so en/index.html → ../_astro/*.woff2 would fall back to system
 * fonts there. Embedding the woff2 files as data: URIs works in every browser (~220 KB per page).
 */
const fontCache = new Map();
async function embedFonts(html, file) {
  const refs = [...new Set([...html.matchAll(/url\((["']?)([^)"']+\.woff2)\1\)/g)].map((m) => m[2]))];
  for (const ref of refs) {
    if (ref.startsWith('data:')) continue;
    const abs = path.resolve(path.dirname(file), ref);
    if (!fontCache.has(abs)) fontCache.set(abs, `data:font/woff2;base64,${(await readFile(abs)).toString('base64')}`);
    html = html.split(ref).join(fontCache.get(abs));
  }
  return html;
}

const files = await htmlFiles(OUT);
const problems = [];
for (const file of files) {
  const rel = path.relative(OUT, path.dirname(file));
  const depth = rel ? rel.split(path.sep).length : 0;
  const prefix = depth ? '../'.repeat(depth) : './';
  const html = await embedFonts(await inlineModules(rewrite(await readFile(file, 'utf8'), prefix), file), file);
  await writeFile(file, html);

  // Verify: nothing root-relative left, no external module scripts (file:// blocks module loading)
  const leftovers = [
    ...html.matchAll(/\b(?:href|src|poster|action)=["']\/(?!\/)[^"']*/g),
    ...html.matchAll(/url\(["']?\/(?!\/)[^)]*/g),
    ...html.matchAll(/srcset=["'][^"']*(?:^|[\s,])\/(?!\/)_astro/g),
  ].map((m) => m[0]);
  const externalModules = [...html.matchAll(/<script[^>]*type=["']module["'][^>]*\ssrc=/g)].map((m) => m[0]);
  for (const l of [...leftovers, ...externalModules]) problems.push(`${path.relative(OUT, file)}: ${l.slice(0, 90)}`);

  // Verify: every local link/asset target exists on disk
  for (const m of html.matchAll(/\b(?:href|src)=["']((?:\.\.?\/)[^"'#?]*)/g)) {
    const target = path.resolve(path.dirname(file), m[1]);
    if (!existsSync(target)) problems.push(`${path.relative(OUT, file)}: missing target ${m[1]}`);
  }
}

// Host-only files have no meaning in a local folder
for (const p of ['_headers', '_redirects', 'og']) await rm(path.join(OUT, p), { recursive: true, force: true });
// JS chunks and fonts are now embedded in the pages; drop the unused files
for (const f of await readdir(path.join(OUT, '_astro'))) {
  if (f.endsWith('.js') || f.endsWith('.woff2')) await rm(path.join(OUT, '_astro', f));
}

if (problems.length) {
  console.error(`\n✗ Offline build has ${problems.length} problem(s):\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`\n✓ Offline build ready: ${path.relative(root, OUT)}${path.sep}index.html (${files.length} pages, all links relative)`);
