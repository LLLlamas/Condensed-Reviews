// Standardize shoe-image direction: every normalized card faces toe-LEFT.
//
// Deterministic detector — no eyeballing. A shoe's HEEL is a tall near-vertical wall at
// its end; the TOE tapers to a low tip. So we measure shoe height in the outer band on
// each side: the taller edge is the heel, and the toe points the other way. Any PNG whose
// toe points right is flipped horizontally (a flip preserves the baseline/centering).
//
// Run: node scripts/standardize-directions.mjs        (fix in place)
//      node scripts/standardize-directions.mjs --dry   (report only, no writes)
//
// This shares its heuristic with normalize-images.mjs (which auto-orients on import).
import sharp from 'sharp';
import { readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'shoes');
const DRY = process.argv.includes('--dry');

const NEAR_WHITE = 244, BAND = 0.10;
const isContent = (d, i) => d[i] < NEAR_WHITE || d[i + 1] < NEAR_WHITE || d[i + 2] < NEAR_WHITE;

// Returns 'L' or 'R' = the side the TOE points toward, plus the heel-height ratio.
export async function detectToe(buf) {
  const { data, info } = await sharp(buf).flatten({ background: '#fff' }).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  let minX = W, maxX = -1, minY = H, maxY = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (isContent(data, (y * W + x) * C)) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  }
  const bandW = Math.max(2, Math.round((maxX - minX) * BAND));
  const colExtent = (x0, x1) => {
    let best = 0;
    for (let x = x0; x <= x1; x++) {
      let top = -1, bot = -1;
      for (let y = minY; y <= maxY; y++) if (isContent(data, (y * W + x) * C)) { if (top < 0) top = y; bot = y; }
      if (top >= 0) best = Math.max(best, bot - top);
    }
    return best;
  };
  const leftH = colExtent(minX, minX + bandW), rightH = colExtent(maxX - bandW, maxX);
  return { toe: leftH > rightH ? 'R' : 'L', leftH, rightH };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const files = (await readdir(DIR)).filter(f => f.endsWith('.png')).sort();
  let flipped = 0;
  for (const f of files) {
    const path = join(DIR, f);
    const buf = await sharp(path).toBuffer();
    const { toe, leftH, rightH } = await detectToe(buf);
    if (toe === 'R') {
      flipped++;
      if (!DRY) await writeFile(path, await sharp(buf).flop().png({ compressionLevel: 9 }).toBuffer());
      console.log(`${DRY ? 'would flip' : 'flipped  '} ${f}  (heelH L:${leftH} R:${rightH})`);
    }
  }
  console.log(`\n${DRY ? 'Would flip' : 'Flipped'} ${flipped} / ${files.length} to toe-left.`);
}
