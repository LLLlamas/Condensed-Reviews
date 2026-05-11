import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const OUTPUT_PATH = path.resolve(__dirname, '..', 'output', 'reviews.json');

export async function loadReviews() {
  try {
    const text = await fs.readFile(OUTPUT_PATH, 'utf8');
    return JSON.parse(text);
  } catch (e) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
}

export async function saveReviews(reviews) {
  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(reviews, null, 2));
}

export function mergeByRedditId(existing, incoming) {
  const map = new Map(existing.map((r) => [r.redditId, r]));
  for (const r of incoming) {
    if (!r?.redditId) continue;
    map.set(r.redditId, r);
  }
  return [...map.values()].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}
