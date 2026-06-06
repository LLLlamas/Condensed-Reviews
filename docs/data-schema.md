# Data schema

All data lives in `src/data/reviews.js` (hand-curated). No backend.

## Review object (`reviews[]`)

| Field | Notes |
|---|---|
| `shoe` | Canonical name with brand prefix (e.g. `"Nike LeBron 21"`). Join key into `amazonLinks` + `shoePrices`. |
| `brand` | Drives the brand pill (e.g. `Nike`, `Adidas`, `Li-Ning`, `ANTA`, `361`, `SPO`, `HOKA`, `Brooks`, `ASICS`, `Saucony`). |
| `sport` | `"basketball"` or `"running"`. Drives the sport filter. |
| `subreddit` | Display string, e.g. `r/BBallShoes`. |
| `redditUrl` | Links the "View on Reddit" CTA. |
| `author`, `date` | `date` is `YYYY-MM-DD`; used for "Most recent" sort. |
| `summary` | Condensed blurb on the card. Trait highlights pull sentences from this. |
| `playstyle`, `courtType`, `sizingNote` | Optional tags (any may be `null`). |
| `verdict` | Free-text label (e.g. `Elite`, `Solid`). Display only — not the badge source. |
| `wordCount` | `>= 200` renders the DETAILED badge, else SHORT. |
| `fullText` | Expanded body shown on "Read full". |
| `ratings` | 8 keys, 0–10, one decimal: `cushioning, traction, support, fit, breathability, groundFeel, durability, value`. |
| `confidences` | Optional. Per-trait `high`/`medium`/`low`. Missing key defaults to `high`. |

- Use `groundFeel` — `courtFeel` is the old name (still in the scrape prompt; see scrape-pipeline.md).

## `getShoes(sportFilter = 'all')`

- Groups `reviews` by `shoe` (filtered by `sport` unless `'all'`).
- Per trait, computes a **confidence-weighted average**: weight = `CONFIDENCE_WEIGHTS` (`high 1.0`, `medium 0.5`, `low 0.2`); missing rating skipped.
- Sets `avgRatings[cat]` (weighted mean, 1 decimal, `0` if no signal) and `avgConfidences[cat]` (bucketed from summed weight: ≥1.5 high, ≥0.7 medium, else low).
- Returns shoe objects `{ name, brand, sport, price, reviews[], avgRatings, avgConfidences }`, sorted by review count desc.
- Helpers: `confidenceFor(review, cat)`, `bucketAggregateConfidence(totalWeight)`, constant `CONFIDENCE_WEIGHTS`.

## `shoePrices` map

- `shoe name → USD number`. Read into `shoe.price` (or `null`). Powers price display, the max-price slider, and price sorts.

## `shoeImages` map

- `shoe name → image path`. Read into `shoe.imageUrl` (or `null` → SVG placeholder). Shown on cards + the modal image banner (click → fullscreen lightbox).
- Values are **self-hosted, normalized** `public/shoes/*.png` files. `scripts/normalize-images.mjs` (`npm run normalize:images`) downloads each source, flattens to white, trims to the shoe bbox, and re-composites it **bottom-aligned on an identical 16:10 white canvas** with a fixed bottom gap — so every card sole lands on one baseline (cards use `object-fit: contain`, no crop/clip). All shoes are normalized to face **toe-left** — `normalize-images.mjs` auto-detects each shoe's toe direction (a deterministic heel-height heuristic in `standardize-directions.mjs`) and flips if needed. To re-enforce direction across existing local images without re-downloading, run `npm run normalize:directions` (`--dry` to report only).
- **To add/replace an image:** set a clean **white/transparent-background, side-profile** source URL (any host) as the value, then run `npm run normalize:images`. It writes the local PNG and rewrites the value to `/shoes/<slug>.png`; entries already pointing at `/shoes/` are skipped (reset one to a remote URL to re-process). A colored/gray source bg won't trim away and will fill the tile — keep sources clean. Source/verify via the `shoe-image-fixer` agent (`.claude/agents/`).

## `shoeImagesOriginal` map

- `shoe name → raw source image URL` (the un-normalized original). `normalize-images.mjs` records it automatically when it fetches a source. `getShoes` exposes it as `shoe.imageOriginalUrl`; the modal lightbox shows this full-size when the card image is clicked (falls back to the local `/shoes` image if the remote source is unavailable). Cards/modal thumbnail still use the normalized `shoeImages` path.

## Affiliate links

- `amazonLinks`: `shoe name → tagged Amazon URL`. Every entry carries `tag=llamas02-20`.
- `getAmazonUrl(shoeName, sport = 'basketball')`: returns the mapped URL, else a generic Amazon search built from name + sport, also tagged `llamas02-20`.
- Always route new links through `getAmazonUrl()` — never hardcode — so attribution is never dropped.
- One placeholder entry has no review yet: `Nike Kobe AD NXT FF`.
