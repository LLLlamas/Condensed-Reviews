# Court Report scrape pipeline

Pulls performance reviews from r/BBallShoes, runs them through Claude to extract our schema, and writes the result to `scripts/output/reviews.json`.

The website doesn't read this file yet — output goes to a separate location so you can eyeball quality before merging into the live data set.

## Setup (one time)

1. Wait for Reddit to approve your API registration (you should already have a "script" type app in https://www.reddit.com/prefs/apps).
2. Copy `.env.example` to `.env` at the repo root.
3. Fill in:
   - `REDDIT_CLIENT_ID` — under your app name on the prefs page
   - `REDDIT_CLIENT_SECRET` — the "secret" field
   - `REDDIT_USERNAME` / `REDDIT_PASSWORD` — your Reddit account
   - `REDDIT_USER_AGENT` — replace `YOUR_USERNAME` with your reddit handle
   - `ANTHROPIC_API_KEY` — from https://console.anthropic.com/settings/keys
4. From the repo root: `npm install` (picks up `@anthropic-ai/sdk` and `dotenv` that were added to package.json).

### Don't want to put your password in .env?

Leave `REDDIT_USERNAME` and `REDDIT_PASSWORD` blank. The auth helper will fall back to `client_credentials` grant — application-only, read-only access to public subreddit data. That's all this scraper needs.

## Run

```bash
# One-time historical sweep — runs the search endpoint across multiple
# queries and time ranges. Persists every 10 condensed reviews.
npm run scrape:backfill

# Daily delta — fetches /new, keeps the last 7 days, dedupes by post ID.
# Cheap (typically 0–5 LLM calls), safe to re-run.
npm run scrape:daily
```

Both write to `scripts/output/reviews.json`. Re-runs are idempotent (existing posts are skipped via Reddit post ID).

## What the dataset looks like

Each entry matches the schema the React app already uses, plus `redditId` (used for dedupe):

```json
{
  "shoe": "Nike LeBron 21",
  "brand": "Nike",
  "redditUrl": "https://www.reddit.com/r/BBallShoes/comments/.../",
  "redditId": "1sfd8j4",
  "author": "u/Bbakes_",
  "date": "2026-04-08",
  "summary": "...",
  "playstyle": "Quick Guard",
  "courtType": "Indoor",
  "sizingNote": "True to size",
  "verdict": "Solid",
  "wordCount": 439,
  "fullText": "...",
  "ratings": { "cushioning": 8.5, "traction": 7.5, ... }
}
```

## Going beyond ~1000 historical posts

Reddit's listing endpoints (and search) cap at ~1000 items via `before`/`after`. The backfill script papers over this by sweeping many queries × time ranges, but for guaranteed full historical coverage of r/BBallShoes (5+ years), the right move is **Pushshift archive dumps**:

- Monthly dumps are still distributed via academic / archival channels.
- Filter the dump locally to `subreddit=="BBallShoes"`, then feed each candidate into `lib/condense.js` directly.
- Out of scope for this scaffold — we'll add a `scripts/pushshift-import.js` if/when needed.

## Cost notes

- Default model is `claude-haiku-4-5-20251001` (fast + cheap, fine for extraction).
- The system prompt is cached (`cache_control: ephemeral`), so after the first call subsequent ones bill at the cache-read rate (10% of input cost).
- Rough estimate for 500 posts: a few dollars on Haiku, ~5x that on Sonnet.
- The backfill script logs total token usage at the end.

## Tuning

- **Filter too strict / too loose?** Edit `lib/filter.js` — it's pure heuristics on title, flair, body length, and trait keyword hits. Threshold is `score >= 3`.
- **Want a different schema?** `lib/condense.js` holds the system prompt; the rest of the pipeline doesn't care about field names.
- **Different subreddit?** Change `SUBREDDIT` at the top of `backfill.js` / `daily-update.js`.

## Wiring into the live site

The site currently reads `src/data/reviews.js` (hand-curated, 41 reviews). To start serving auto-condensed data:

1. Run `npm run scrape:backfill` and review `scripts/output/reviews.json` for quality.
2. Either: copy the JSON into `src/data/reviews.js` and rebuild, or: switch the site to `fetch('/reviews.json')` at runtime and copy the JSON into `public/`.

Recommend doing this *after* you've eyeballed at least a few dozen condensed entries against their original Reddit posts to confirm the LLM is producing reviews you'd ship.
