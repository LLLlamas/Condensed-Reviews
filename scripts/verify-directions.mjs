// Verification GATE for shoe-image toe direction.
//
// WHY THIS EXISTS: every card must face toe-LEFT, but the deterministic auto-orient
// heuristic in normalize-images.mjs (and any single heuristic/agent pass) is UNRELIABLE
// on modern rocker / high-stack running shoes. Every pixel-based signal we tried
// (heel-height, collar position, outer-band mass) SYSTEMATICALLY inverts those shoes —
// their forefoot stack is taller/denser than the heel, so code concludes the toe is the
// heel and "corrects" a correct image into a wrong one. That false confidence is exactly
// what silently broke shoes before. So orientation is NOT decidable by code here; it needs
// a human eyeball. This gate makes that step explicit and unskippable:
//
//   1. Builds labeled contact sheets under .image-audit/ for a fast visual pass.
//   2. Calls out the high-risk set (running shoes) to scrutinize first.
//   3. BLOCKS (exit 1) until you pass --ack, which you give ONLY after visually confirming
//      every shoe in the sheets faces toe-left (flip offenders with `npm run flip:image`).
//
// It deliberately does NOT guess which shoes are toe-right — automated guesses here have
// been confidently wrong. Trust your eyes, not this script.
//
// Run:  node scripts/verify-directions.mjs          (build sheets + report; gate blocks)
//       node scripts/verify-directions.mjs --ack     (record that visual review passed)
import sharp from 'sharp';
import { readdir, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHOES = join(__dirname, '..', 'public', 'shoes');
const OUT = join(__dirname, '..', '.image-audit');
const ACK = process.argv.includes('--ack');

const mod = await import(pathToFileURL(join(__dirname, '..', 'src', 'data', 'reviews.js')).href);
const runningSlugs = new Set(mod.getShoes('running')
  .map((s) => (mod.shoeImages[s.name] || '').replace('/shoes/', ''))
  .filter(Boolean));

const files = (await readdir(SHOES)).filter((f) => f.endsWith('.png')).sort();

// Contact sheets: running shoes first (highest risk), then basketball. 3-up, labeled.
async function buildSheets(list, prefix) {
  const COLS = 3, PER = 18, CW = 400, CH = 272, TW = 400, TH = 250;
  let sheet = 0;
  for (let s = 0; s < list.length; s += PER) {
    const slice = list.slice(s, s + PER);
    const rows = Math.ceil(slice.length / COLS);
    const cells = [];
    for (let j = 0; j < slice.length; j++) {
      const buf = await sharp(join(SHOES, slice[j])).resize(TW, TH, { fit: 'contain', background: '#fff' }).png().toBuffer();
      const lbl = Buffer.from(`<svg width="${CW}" height="22"><rect width="${CW}" height="22" fill="#c00"/><text x="6" y="16" font-family="monospace" font-size="13" fill="#fff">${slice[j].replace('.png', '')}</text></svg>`);
      const c = j % COLS, r = Math.floor(j / COLS);
      cells.push({ input: buf, top: r * CH, left: c * CW }, { input: lbl, top: r * CH + TH, left: c * CW });
    }
    await sharp({ create: { width: COLS * CW, height: rows * CH, channels: 3, background: '#fff' } }).composite(cells).png().toFile(join(OUT, `${prefix}-${String(++sheet).padStart(2, '0')}.png`));
  }
  return sheet;
}

const running = files.filter((f) => runningSlugs.has(f));
const basketball = files.filter((f) => !runningSlugs.has(f));

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
const rSheets = await buildSheets(running, 'running');
const bSheets = await buildSheets(basketball, 'basketball');

console.log(`\nImage orientation gate — ${files.length} shoes`);
console.log(`  .image-audit/running-*.png   (${running.length} shoes, ${rSheets} sheet(s)) ← HIGH RISK, check first`);
console.log(`  .image-audit/basketball-*.png (${basketball.length} shoes, ${bSheets} sheet(s))`);
console.log('\nConvention: every shoe must face TOE-LEFT (toe points left, heel/ankle-collar on the right).');
console.log('Reference correct: hoka-mach-6 / hoka-bondi-9 (their HOKA logo reads mirrored *because* they were flipped left).');
console.log('Automated orientation detection is NOT used here — it has been confidently wrong on rocker runners. Use your eyes.');

if (ACK) {
  console.log('\n✓ --ack given: visual verification recorded as done. Gate PASSED.');
  process.exit(0);
}
console.log('\n──────────────────────────────────────────');
console.log('GATE: open .image-audit/*.png and confirm EVERY shoe faces toe-LEFT.');
console.log('Fix any offender:  npm run flip:image <slug>   (e.g. asics-superblast-2)');
console.log('When all face toe-left, re-run:  npm run verify:images -- --ack');
console.log('──────────────────────────────────────────');
process.exit(1);
