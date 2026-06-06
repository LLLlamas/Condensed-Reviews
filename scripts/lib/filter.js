// Heuristics that decide whether a Reddit post is a performance review
// worth running through the LLM condense step. Cheap to run; tune as needed.

const TRAIT_KEYWORDS = [
  // Basketball
  'cushion', 'traction', 'lockdown', 'court feel', 'breathab', 'support', 'fit', 'durabil',
  'heel slip', 'midsole', 'outsole', 'upper', 'sizing', 'true to size', 'tts',
  'half size', 'grip', 'stability', 'impact protection', 'forefoot', 'heel-to-toe',
  // Running
  'energy return', 'stack height', 'road feel', 'ground feel', 'heel drop', 'heel-to-toe transition',
  'rocker', 'plate', 'carbon', 'foam', 'tempo', 'long run', 'daily trainer', 'race day',
  'miles', 'stride', 'turnover', 'plush', 'responsive', 'heel counter', 'toebox',
];

const REVIEW_TITLE_HINTS = [
  /\breview\b/i,
  /\bperformance\b/i,
  /\bthoughts?\b/i,
  /\bverdict\b/i,
  /\bimpressions?\b/i,
  /\bbreakdown\b/i,
  /\btake\b/i,
  /\bafter\s+\d+\s+(hours?|games?|sessions?|weeks?|months?|miles?|km|runs?)/i,
  /\bhooping in\b/i,
  /\brunning in\b/i,
  /\blong.?term\b/i,
  /\b\d+\s*miles?\s*(in|on)\b/i,
];

export function dropDeletedOrRemoved(post) {
  if (!post) return false;
  if (post.removed_by_category) return false;
  if (post.selftext === '[deleted]' || post.selftext === '[removed]') return false;
  if (post.author === '[deleted]') return false;
  return true;
}

export function isLikelyPerformanceReview(post) {
  const title = post.title || '';
  const body = post.selftext || '';
  const fullText = `${title}\n${body}`.toLowerCase();

  if (body.length < 200) return false;

  let score = 0;
  if (REVIEW_TITLE_HINTS.some((re) => re.test(title))) score += 3;
  if (/review|performance/i.test(post.link_flair_text || '')) score += 4;

  const traitHits = TRAIT_KEYWORDS.filter((kw) => fullText.includes(kw)).length;
  if (traitHits >= 4) score += 3;
  else if (traitHits >= 2) score += 1;

  if (body.length > 500) score += 1;
  if (body.length > 1500) score += 1;

  return score >= 3;
}
