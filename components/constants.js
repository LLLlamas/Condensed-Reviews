export const CATEGORY_LABELS = {
  cushioning:   "Cushioning",
  traction:     "Traction",
  support:      "Support",
  fit:          "Fit",
  breathability:"Breathability",
  groundFeel:   "Ground Feel",
  durability:   "Durability",
  value:        "Value"
};

export const CONFIDENCE_LABELS = {
  high:   { marker: '',  title: 'High confidence — directly assessed by the reviewer' },
  medium: { marker: '~', title: 'Medium confidence — implied or indirectly mentioned' },
  low:    { marker: '?', title: 'Low confidence — not meaningfully discussed; best-guess only' }
};

export const TRAIT_KEYWORDS = {
  cushioning:   ['cushion', 'bouncy', 'bounce', 'plush', 'foam', 'soft', 'impact', 'responsive', 'midsole', 'energy return', 'landing', 'pillow'],
  traction:     ['traction', 'grip', 'outsole', 'herringbone', 'rubber', 'slip', 'sticky', 'dust', 'gripping', 'grabby', 'bite', 'court floor'],
  support:      ['support', 'ankle', 'stability', 'lateral', 'containment', 'lockdown', 'stable', 'pronation', 'arch', 'collapse', 'medial', 'heel counter'],
  fit:          ['fit', 'sizing', 'size', 'wide', 'narrow', 'toebox', 'toe box', 'heel slip', 'snug', 'roomy', 'tts', 'true to size', 'half size', 'length'],
  breathability:['breath', 'ventilat', 'hot', 'heat', 'air', 'mesh', 'cool', 'airflow', 'sweat'],
  groundFeel:   ['court feel', 'ground feel', 'road feel', 'feel of the court', 'feel of the road', 'low to the ground', 'low profile', 'feedback', 'connection to', 'proprioception'],
  durability:   ['durable', 'durability', 'lasting', 'held up', 'hold up', 'wear', 'worn', 'miles', 'breakdown', 'outsole wear', 'lasted'],
  value:        ['value', 'price', 'worth', 'dollar', 'cheap', 'expensive', 'budget', 'cost', 'money', 'affordable', 'retail'],
};

export const SPORT_FILTERS = [
  { key: 'all',        label: 'All Sports' },
  { key: 'basketball', label: '🏀 Basketball' },
  { key: 'running',    label: '🏃 Running' },
];

export function ratingColor(value) {
  return value >= 8.5 ? 'var(--color-elite)' : value >= 7.0 ? 'var(--color-solid)' : 'var(--color-mediocre)';
}

export function formatPrice(price, priceApprox) {
  if (!price && price !== 0) return null;
  const prefix = priceApprox ? '~' : '';
  if (typeof price === 'string' && price.includes('-')) {
    const [min, max] = price.split('-');
    return `${prefix}$${min}–$${max}`;
  }
  return `${prefix}$${price}`;
}

export function avgScore(shoe) {
  const vals = Object.values(shoe.avgRatings).filter(Boolean);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

// Top-3 reviewer highlights for a high-scoring (>= 8.8) trait, each reduced to
// the most on-topic sentence. Shared by ShoeModal, ShoeDetail, and SwipeView.
export function buildHighlights(shoe, key, val) {
  if (val < 8.8) return null;
  return shoe.reviews
    .filter(r => (r.ratings[key] || 0) > 0)
    .sort((a, b) => (b.ratings[key] || 0) - (a.ratings[key] || 0))
    .slice(0, 3)
    .map(r => ({ author: r.author, subreddit: r.subreddit, rating: r.ratings[key], summary: extractTraitSentence(r.summary, key) }))
    .filter(h => h.summary !== null);
}

export function extractTraitSentence(summary, traitKey) {
  if (!summary) return summary;
  const keywords = TRAIT_KEYWORDS[traitKey] || [];
  const sentences = summary.match(/[^.!?]+[.!?]?\s*/g) || [summary];
  const scored = sentences.map(s => {
    const sl = s.toLowerCase();
    const score = keywords.reduce((acc, kw) => acc + (sl.includes(kw) ? 1 : 0), 0);
    return { s: s.trim(), score };
  });
  const best = scored.filter(x => x.score > 0).sort((a, b) => b.score - a.score);
  return best.length > 0 ? best[0].s : null;
}
