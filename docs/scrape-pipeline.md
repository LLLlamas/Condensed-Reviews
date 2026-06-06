# Scrape pipeline

Pulls Reddit performance reviews, condenses them with Claude into our schema, writes to `scripts/output/reviews.json`. **Scaffolded; not auto-merged** — the site reads the hand-curated `src/data/reviews.js`, never this output. See `scripts/README.md` for the long-form setup.

## Files (`scripts/`)
| File | Role |
|---|---|
| `lib/reddit.js` | OAuth + paginated fetch (listing, search, comments). Falls back to `client_credentials` if no username/password. |
| `lib/filter.js` | Heuristics (title hints, flair, body length, trait-keyword hits) to decide what's a real review. Threshold `score >= 3`. |
| `lib/condense.js` | Anthropic SDK call. System prompt cached (`cache_control: ephemeral`). Default model `claude-haiku-4-5-20251001`. |
| `lib/store.js` | Read/write `output/reviews.json`, dedupe by Reddit post `id`. |
| `backfill.js` | Multi-query × time-range sweep to maximize coverage. Persists every 10 condensed reviews. `SUBREDDIT = 'BBallShoes'`. |
| `daily-update.js` | Fetches `/new`, keeps last 7 days (overlap for edits), dedupes, condenses only new. `SUBREDDIT = 'BBallShoes'`. |

## Run
```bash
npm run scrape:backfill   # one-time historical sweep
npm run scrape:daily      # delta; cheap, idempotent
```
Output: `scripts/output/reviews.json` (entries match the review schema + `redditId`). Re-runs skip existing post IDs.

## Env (`.env` at repo root; copy from `.env.example`, gitignored)
- `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`
- `REDDIT_USERNAME`, `REDDIT_PASSWORD` (optional — blank ⇒ read-only `client_credentials`)
- `REDDIT_USER_AGENT` (Reddit requires a descriptive UA)
- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL` (optional; defaults to Haiku 4.5)

## Known limitations / drift
- Reddit search/listing caps at ~1000 items per query; multi-query sweeping mitigates but can't guarantee full history. Pushshift archive import (`scripts/pushshift-import.js`) is a hook, not implemented.
- The `condense.js` prompt and `.env.example` are **basketball-only** (`SUBREDDIT = 'BBallShoes'`), and the prompt still emits the old `courtFeel` field — the live data layer uses `groundFeel`. Running coverage and the rename are not yet reflected in the pipeline.
- Merge into `src/data/reviews.js` is manual; eyeball quality before wiring in.
