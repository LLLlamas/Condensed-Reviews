// One-time (re-runnable) image normalizer for Court Report shoe cards.
//
// For every entry in `shoeImages`, this:
//   1. downloads the source image (browser headers to dodge hotlink 403s),
//   2. flattens onto white + trims the surrounding whitespace to the shoe bbox,
//   3. re-composites the shoe BOTTOM-ALIGNED, horizontally centered, on an identical
//      16:10 white canvas with a fixed bottom gap,
//   4. writes public/shoes/<slug>.png,
//   5. rewrites the `shoeImages` map in src/data/reviews.js to the local /shoes paths.
//
// Result: every card's sole lands on the same baseline (~10px above the tile edge),
// uniform sizing, zero clipping. Sources that fail to download keep their remote URL.
//
// Run: node scripts/normalize-images.mjs

import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { detectToe } from './standardize-directions.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'shoes');
const REVIEWS = join(ROOT, 'src', 'data', 'reviews.js');

// Canvas geometry (16:10). Bottom gap maps to ~10px in the rendered ~183px tile.
const CW = 1000, CH = 625;
const BOTTOM_GAP = 36;          // ≈ 10px once the 625px canvas is shown in a ~183px tile
const MAX_W = Math.round(CW * 0.88);   // 880
const MAX_H = CH - BOTTOM_GAP - 118;   // ≈ 471 — leaves balanced headroom on top
const TRIM_THRESHOLD = 18;      // trims near-white bg (and faint shadows) without eating shoe detail

const slug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Canonical direction: every card faces toe-LEFT. Orientation is auto-detected per image
// (see detectToe in standardize-directions.mjs) and flipped if needed — no hand-maintained
// list. The heuristic is good but not infallible, so after adding a shoe, glance at its
// PNG; to re-enforce across all images run `npm run normalize:directions`.

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  Accept: 'image/avif,image/webp,image/png,image/*,*/*;q=0.8',
};

async function download(url) {
  let ref;
  try { ref = new URL(url).origin + '/'; } catch { ref = undefined; }
  const res = await fetch(url, { headers: ref ? { ...HEADERS, Referer: ref } : HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function normalize(buf) {
  // Flatten any alpha onto white so trim + final canvas are consistently white.
  const flat = await sharp(buf).flatten({ background: '#ffffff' }).toBuffer();

  // Trim the white border down to the shoe's bounding box.
  let shoe;
  try {
    shoe = await sharp(flat)
      .trim({ background: '#ffffff', threshold: TRIM_THRESHOLD })
      .toBuffer();
  } catch {
    shoe = flat; // trim throws if it can't find a border (already tight) — use as-is
  }

  // Scale the shoe to fit inside the content box (no distortion).
  const resized = await sharp(shoe)
    .resize({ width: MAX_W, height: MAX_H, fit: 'inside', withoutEnlargement: false })
    .toBuffer();
  const meta = await sharp(resized).metadata();

  const left = Math.round((CW - meta.width) / 2);
  const top = CH - BOTTOM_GAP - meta.height; // bottom-align with the fixed gap

  let out = await sharp({ create: { width: CW, height: CH, channels: 3, background: '#ffffff' } })
    .composite([{ input: resized, left, top }])
    .png({ compressionLevel: 9 }).toBuffer();
  // Auto-orient to canonical toe-LEFT.
  const { toe } = await detectToe(out);
  if (toe === 'R') out = await sharp(out).flop().png({ compressionLevel: 9 }).toBuffer();
  return out;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const mod = await import('file://' + REVIEWS.replace(/\\/g, '/'));
  const { shoeImages, getShoes } = mod;
  const existingOrig = mod.shoeImagesOriginal || {};
  const sportOf = {};
  for (const s of getShoes('all')) sportOf[s.name] = s.sport;

  const results = {};   // name -> local /shoes path (or kept remote on failure)
  const origins = {};   // name -> original source URL (for the modal lightbox)
  for (const [name, url] of Object.entries(shoeImages)) {
    if (url.startsWith('/shoes/')) {
      results[name] = url;
      origins[name] = existingOrig[name] || url; // preserve known original
      console.log(`skip  ${name} (already local)`);
      continue;
    }
    try {
      const buf = await download(url);
      const png = await normalize(buf);
      const file = `${slug(name)}.png`;
      await writeFile(join(OUT_DIR, file), png);
      results[name] = `/shoes/${file}`;
      origins[name] = url; // the remote URL we just fetched IS the original
      console.log(`ok    ${name} -> ${file} (${(png.length / 1024).toFixed(0)}kb)`);
    } catch (e) {
      results[name] = url; // keep remote URL on failure
      origins[name] = existingOrig[name] || url;
      console.log(`FAIL  ${name}: ${e.message}  (kept remote)`);
    }
  }

  // Rebuild a `<varName>` object literal, preserving the two commented sections + order.
  const buildBlock = (varName, map) => {
    const bb = [], rr = [];
    const pad = Math.max(...Object.keys(map).map((k) => k.length));
    for (const [name, val] of Object.entries(map)) {
      const line = `  ${('"' + name + '":').padEnd(pad + 4)} ${JSON.stringify(val)},`;
      (sportOf[name] === 'running' ? rr : bb).push(line);
    }
    return `export const ${varName} = {\n  // === Basketball ===\n${bb.join('\n')}\n\n  // === Running ===\n${rr.join('\n')}\n};`;
  };

  let src = await readFile(REVIEWS, 'utf8');
  for (const [varName, map] of [['shoeImages', results], ['shoeImagesOriginal', origins]]) {
    const re = new RegExp(`export const ${varName} = \\{[\\s\\S]*?\\n\\};`);
    const next = src.replace(re, buildBlock(varName, map));
    if (next === src) console.log(`\n⚠ ${varName} block unchanged (or not found)`);
    src = next;
  }
  await writeFile(REVIEWS, src);
  console.log('\n✓ patched src/data/reviews.js');

  const fails = Object.entries(results).filter(([n, v]) => !v.startsWith('/shoes/'));
  console.log(`\nDone. ${Object.keys(results).length - fails.length} normalized, ${fails.length} kept remote.`);
  if (fails.length) console.log('Remote (download failed):', fails.map(([n]) => n).join(', '));
}

main().catch((e) => { console.error(e); process.exit(1); });
