// Flip one or more normalized shoe images horizontally, in place (toe-right -> toe-left).
// A horizontal flip preserves the baseline/centering done by normalize-images.mjs.
//
// Run:  npm run flip:image <slug-or-filename> [more...]
//   e.g. npm run flip:image asics-superblast-2
//        npm run flip:image asics-superblast-1.png asics-superblast-2.png
import sharp from 'sharp';
import { readFile, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const SHOES = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'shoes');
const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));
if (!args.length) {
  console.error('Usage: npm run flip:image <slug-or-filename> [more...]');
  process.exit(1);
}
let n = 0;
for (const a of args) {
  const file = basename(a).endsWith('.png') ? basename(a) : `${basename(a)}.png`;
  const p = join(SHOES, file);
  try { await access(p); } catch { console.error(`skip ${file} (not found in public/shoes)`); continue; }
  await writeFile(p, await sharp(await readFile(p)).flop().png({ compressionLevel: 9 }).toBuffer());
  console.log(`flipped ${file}`);
  n++;
}
console.log(`\nFlipped ${n}/${args.length}. Re-run \`npm run verify:images\` to re-check.`);
