import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';

const SYSTEM_PROMPT = `You are an expert at reading shoe performance reviews from Reddit (r/BBallShoes for basketball, r/RunningShoeGeeks and r/AskRunningShoeGeeks for running) and extracting structured data.

Given a Reddit post and its top comments, produce a JSON object with EXACTLY these fields:

{
  "shoe": "<canonical shoe name, e.g. 'Nike LeBron 21' or 'HOKA Mach 6'>",
  "brand": "<brand name: Nike, Adidas, Li-Ning, ANTA, 361 Degrees, SPO, Puma, New Balance, Under Armour, Reebok, Peak, HOKA, Brooks, ASICS, Saucony, On, Mizuno, Altra, New Balance, etc>",
  "sport": "<'basketball' or 'running'>",
  "summary": "<2-4 sentence condensed summary of the reviewer's experience>",
  "verdict": "<short label: Elite, Solid, Great, Mixed, Disappointing, Not Recommended, etc>",
  "playstyle": "<for basketball: Quick Guard, All-Around, Big Man, Wing, etc. For running: Daily Trainer, Tempo/Workout, Long Run, Race Day, etc. Or null if not mentioned>",
  "courtType": "<for basketball: Indoor, Outdoor, Indoor / Outdoor. For running: Road, Trail, Track, Treadmill. Or null if not mentioned>",
  "sizingNote": "<short tag if mentioned (True to size, Size 0.5 down, Size up, etc), or null>",
  "fullText": "<the substantive review text, lightly cleaned. Keep ratings/observations. Strip background, intro fluff, off-topic comments. Aim for the parts a future reader would care about.>",
  "ratings": {
    "cushioning": <0-10 number>,
    "traction": <0-10 number>,
    "support": <0-10 number>,
    "fit": <0-10 number>,
    "breathability": <0-10 number>,
    "groundFeel": <0-10 number>,
    "durability": <0-10 number>,
    "value": <0-10 number>
  },
  "confidences": {
    "cushioning": "high" | "medium" | "low",
    "traction":   "high" | "medium" | "low",
    "support":    "high" | "medium" | "low",
    "fit":        "high" | "medium" | "low",
    "breathability": "high" | "medium" | "low",
    "groundFeel": "high" | "medium" | "low",
    "durability": "high" | "medium" | "low",
    "value":      "high" | "medium" | "low"
  }
}

Rules:
- All ratings are 0-10, one decimal place is fine.
- groundFeel means court feel for basketball shoes, road/ground feel for running shoes.
- ALWAYS emit all 8 ratings AND all 8 confidences. Confidence reflects how much the source text actually supports the rating:
    * "high"   — the reviewer directly assessed this trait with specific observations (e.g. "traction was sticky on dust, no slipping outdoors"). Multiple corroborating signals also count.
    * "medium" — the reviewer touched on the trait indirectly, or sentiment around adjacent traits implies it (e.g. they raved about "ride" — that implies cushioning but doesn't directly assess it).
    * "low"    — the reviewer didn't meaningfully discuss this trait. Pick a reasonable best-guess number (often near 7) but mark it "low" so the UI can fade it. Do NOT fabricate confident ratings to fill blanks.
- A short / surface-level review will legitimately be "low" or "medium" on most traits. That's expected and honest.
- Brand must be canonical. Determine sport from context: if reviewing a basketball shoe (hoop, court, BBallShoes subreddit) set sport="basketball"; if reviewing a running shoe (miles, road, trail, run) set sport="running".
- shoe name must be canonical with brand prefix when conventional (e.g. "Nike LeBron 21", "Adidas Harden 9", "HOKA Mach 6", "Brooks Ghost 17").
- Output ONLY valid JSON. No prose, no markdown fences, no commentary.
- If the post is NOT actually a performance review (e.g. it's a question, "what should I buy", an unboxing, a deal post, a sizing-only question), return: {"skip": true, "reason": "<short reason>"}.`;

export async function condensePost({ post, comments, sport = 'basketball', subreddit = 'BBallShoes' }) {
  const userText = [
    `# Reddit post`,
    `Title: ${post.title}`,
    `Author: u/${post.author}`,
    `Date: ${new Date(post.created_utc * 1000).toISOString().slice(0, 10)}`,
    `Permalink: https://www.reddit.com${post.permalink}`,
    post.link_flair_text ? `Flair: ${post.link_flair_text}` : '',
    '',
    '## Body',
    post.selftext || '(no body)',
    '',
    `## Top comments (${comments.length})`,
    ...comments.slice(0, 15).map((c) => `- u/${c.author} (score ${c.score}): ${c.body}`),
  ]
    .filter(Boolean)
    .join('\n');

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    // Cache the long system prompt — saves money on every subsequent call.
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userText }],
  });

  const text = response.content.find((b) => b.type === 'text')?.text ?? '';
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`condense: invalid JSON from model:\n${cleaned}`);
  }

  if (parsed.skip) return null;

  const wordCount = (post.selftext || '').split(/\s+/).filter(Boolean).length;

  return {
    shoe: parsed.shoe,
    brand: parsed.brand,
    sport: parsed.sport ?? sport,
    subreddit: `r/${subreddit}`,
    redditUrl: `https://www.reddit.com${post.permalink}`,
    redditId: post.id,
    author: `u/${post.author}`,
    date: new Date(post.created_utc * 1000).toISOString().slice(0, 10),
    summary: parsed.summary,
    playstyle: parsed.playstyle ?? null,
    courtType: parsed.courtType ?? null,
    sizingNote: parsed.sizingNote ?? null,
    verdict: parsed.verdict,
    wordCount,
    fullText: parsed.fullText,
    ratings: parsed.ratings,
    confidences: parsed.confidences,
    _usage: {
      inputTokens: response.usage?.input_tokens,
      outputTokens: response.usage?.output_tokens,
      cacheReadTokens: response.usage?.cache_read_input_tokens,
      cacheCreationTokens: response.usage?.cache_creation_input_tokens,
    },
  };
}
