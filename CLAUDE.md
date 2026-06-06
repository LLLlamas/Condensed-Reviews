# Court Report (`Condensed-Reviews`)

React site surfacing condensed, confidence-weighted user reviews of basketball and running shoes, sourced from Reddit.

## Stack

| Piece | Choice |
|---|---|
| Framework | Next.js 15 App Router (migrated from Vite SPA, June 2026) |
| UI | React 19 (`react` / `react-dom` ^19.2.4) |
| Animations | Framer Motion 11 |
| Build | `next build` → `next dev` / `next start` |
| Lint | ESLint 9 + react-hooks |
| Styling | Hand-written CSS (`src/index.css` globals + `src/App.css` components), CSS variables for theming |
| Fonts | `next/font/google`: Libre Caslon Text (brand), Hanken Grotesk (body) |
| State | Local component state (`useState` / `useMemo` / `useEffect`) — no store |
| Data | Static JS module (`src/data/reviews.js`) — no backend |
| Scrape (offscreen) | Node scripts in `scripts/`, Anthropic SDK + Reddit Data API |

Scripts: `npm run dev` · `build` · `preview` (= `next start`) · `lint` · `scrape:backfill` · `scrape:daily` · `normalize:images` · `normalize:directions`.

## Key paths

| Path | Role |
|---|---|
| `app/layout.js` | Root layout — fonts, global CSS |
| `app/page.js` → `components/BrowsePage.jsx` | Main browse + compare page (client component) |
| `app/shoes/[brand]/[slug]/page.js` | Per-shoe SSG pages — title, JSON-LD AggregateRating |
| `components/` | All UI components (Nav, ShoeCard, ReviewCard, ShoeModal, CompareScreen, SwipeView, ListRow, RatingBar, ScoreBadge, ScoringInfoModal, ShoeDetail) |
| `components/constants.js` | Shared maps: CATEGORY_LABELS, CATEGORY_ICONS, TRAIT_KEYWORDS, ratingColor, avgScore |
| `lib/slugify.js` | `slugify`, `getBrandSlug`, `getShoeSlug` — used for /shoes/[brand]/[slug] routes |
| `src/data/reviews.js` | All review data + `getShoes()`, `getAmazonUrl()`, `amazonLinks`, `shoePrices`, `shoeImages` |
| `src/index.css` | Theme tokens (CSS vars), global resets |
| `src/App.css` | Component styles |
| `next.config.mjs` | Image CDN allowlist |
| `scripts/` | Reddit scrape + LLM-condense pipeline (output is NOT read by the site) |
| `scripts/normalize-images.mjs` | Trims + bottom-aligns each shoe onto a 16:10 white canvas, auto-orients toe-left → `public/shoes/`, repoints `shoeImages` to local paths (`npm run normalize:images`) |
| `scripts/standardize-directions.mjs` | Deterministic toe-direction detector + flipper; enforces toe-left on `public/shoes/*.png` (`npm run normalize:directions`; `--dry` to report only) |
| `public/shoes/` | Normalized, self-hosted shoe images (output of `normalize:images`) |
| `.claude/agents/shoe-image-fixer.md` | Subagent: sources + fixes clean, aligned shoe images in the `shoeImages` map |
| `.claude/agents/review-collector.md` | Subagent: collects new Reddit reviews via WebSearch + PullPush (reddit.com is blocked in-env), returns schema-correct `reviews[]` + `shoePrices`/`amazonLinks` entries to merge. Also does the price/affiliate-link research (no separate price agent) |
| `.claude/agents/review-auditor.md` | Subagent: READ-ONLY accuracy check — re-fetches each new review's source via PullPush and verifies shoe/author/date/content fidelity; returns corrections (never edits) |

## Conventions (must not break)

- **Affiliate tag `llamas02-20`** — all shoe links must route through `getAmazonUrl(name, sport)` so attribution survives. Don't hardcode Amazon URLs. Amazon entries carry the tag; shoes not sold on Amazon US (many Li-Ning / ANTA / 361 / SPO / boutique models) use the brand's official-store / retailer product URL instead. `isAmazonLink(url)` decides the CTA: Amazon links render a cart "Amazon"/"Find on Amazon" button; everything else renders **"See Price"** (cart icon swapped for an external-link icon) in `ShoeCard`/`ShoeModal`/`ShoeDetail`.
- **`priceApprox` flag** — `getShoes()` sets `shoe.priceApprox = true` when the shoe's `amazonLinks` entry is a search URL (`/s?k=`), meaning the price is an estimate. All four price-displaying components (`ShoeCard`, `ListRow`, `ShoeModal`, `SwipeView`) prefix the price with `~` when `priceApprox` is true (e.g. `~$150`). Direct `dp/` Amazon links and non-Amazon retailer URLs get an exact `$X` display.
- **Ratings are 0–10**, one decimal, across all 8 categories: `cushioning, traction, support, fit, breathability, groundFeel, durability, value`. Use `groundFeel` (not `courtFeel`).
- **Per-trait `confidences`** (`high`/`medium`/`low`) weight the aggregate. Color/verdict thresholds (`ratingColor`, `ScoreBadge`): ELITE ≥8.5, SOLID ≥7.0, else MEDIOCRE.
- **`wordCount >= 200` = DETAILED badge** — keep accurate when adding reviews.
- **`shoe` name is the join key** across `reviews` ⇄ `amazonLinks` ⇄ `shoePrices` ⇄ `shoeImages`. Keep names canonical and consistent.
- **Shoe images** (`shoeImages`) point to **self-hosted, normalized** files in `public/shoes/*.png` — each trimmed to the shoe and bottom-aligned on a 16:10 white canvas by `npm run normalize:images`, so cards (`object-fit: contain`) share one baseline with no clipping. All shoes face one way (**toe-left**) — orientation is **auto-detected and flipped** during `normalize:images` (a deterministic heel-height detector, not a hand-kept list); run `npm run normalize:directions` to re-enforce toe-left across all images (no network). To add/replace: set a clean **white/transparent-background, side-profile** source URL (via the `shoe-image-fixer` agent), then run `npm run normalize:images`. A non-white/colored source background won't trim and will fill the tile — keep sources clean. Don't hand-write `/shoes/` paths.
- **`brand` string drives the brand pill**; **`sport`** (`basketball`/`running`) drives the sport filter. Misspellings create stray pills.
- Status colors come from CSS vars (`--color-elite/-solid/-mediocre`), not literals.

## Growing the dataset (live workflow)

> **Full runbook:** [shoe-review-image-collection-process.md](shoe-review-image-collection-process.md) — self-contained handoff (schema, PullPush usage, dedup rules, image pipeline, pitfalls, current seams) so any agent can continue cold. The summary below mirrors it.

`reddit.com`'s JSON API and direct `WebFetch` are **blocked in this environment**, and the `scripts/` node pipeline (`scrape:backfill`/`scrape:daily`) needs Reddit API creds in `.env` (not configured). So growth happens through a **three-agent pipeline** that reads posts via the **PullPush archive API** (`api.pullpush.io`, not blocked) + `WebSearch`:

1. **Build exclusion lists** from the current data (so nothing repeats):
   - shoes: `node -e "import('./src/data/reviews.js').then(m=>console.log([...new Set(m.reviews.map(r=>r.shoe))].sort().join(' | ')))"`
   - used post-IDs: `node -e "import('./src/data/reviews.js').then(m=>console.log([...new Set(m.reviews.map(r=>(r.redditUrl.match(/comments\/([a-z0-9]+)/)||[])[1]).filter(Boolean))].sort().join(', ')))"`
2. **`review-collector`** (one or several in parallel) — pass it both exclusion lists. For a big sweep, run **partitioned** collectors so they don't overlap each other: e.g. (a) basketball mainstream US brands, (b) running across all run subs, (c) non-English brands (Li-Ning/ANTA/361/Xtep/Peak) + multi-shoe **rotation** posts. Each returns paste-ready `reviews[]` / `shoePrices` / `amazonLinks` blocks (it does NOT edit files), so parallel is safe.
3. **Merge + dedup** into `src/data/reviews.js`. Dedup key is **`shoe` name + post-ID**, never `redditUrl` alone (rotation posts legitimately reuse one URL across shoes). Never split one shoe across two names (e.g. "Giannis Freak 5" → canonical "Nike Zoom Freak 5"; keep Jordan-line under brand "Jordan"). Verify: `node -e "import('./src/data/reviews.js').then(m=>{const rv=m.reviews;const p=new Set(),d=[];for(const r of rv){const k=r.shoe+'|'+r.redditUrl;p.has(k)?d.push(k):p.add(k)}console.log(m.getShoes().length,'shoes',rv.length,'reviews; dup(shoe+url):',d.length)})"`
4. **`review-auditor`** (READ-ONLY) — re-fetches each new entry's source via PullPush, verifies shoe/author/date/content fidelity, returns corrections. Apply them.
5. **`shoe-image-fixer`** for net-new shoes → then `npm run normalize:images` (downloads, trims, baseline-aligns, orients toe-left, repoints `shoeImages` to `/shoes/*.png`). If the write fails with a Windows file-lock (`UNKNOWN: open reviews.js`), just re-run it.
6. **Lint + commit**: `npm run lint`, then commit. The site reads `src/data/reviews.js` directly.

Per collector yields ~25-30 quality reviews before diminishing returns; richest seams are multi-shoe **rotation posts** (one post → many entries) and non-English brands. Aggregate over multiple sessions — quality drops and shoe-overlap rises if you push one sweep too hard. The collector files (`.claude/agents/`) carry the full method, schema, and target lists.

## UI features (BrowsePage)

- **Shoe grid/list pagination** — 12 per page, numbered `PaginationBar` (‹ 1 2 … 7 ›). Page transitions are `motion.div` with `key=\`${layout}-p${safePage}\`` — no `AnimatePresence mode="wait"` (causes stale-DOM freeze with shared `pagedShoes` state; plain key-based remount + opacity fade is used instead). Clicking a page number calls `goToPage(p)` → `setPage(p)`; `safePage = Math.min(page, pageCount)` guards the clamp. **Do not re-add `mode="wait"`.**
- **Review search** — `reviewSearch` state + `.reviews-section__search-input` below the "All Reviews" heading. Filters `filteredReviews` across `shoe`, `author`, `summary`, `playstyle`, `courtType`, `verdict` fields. ReviewCard keys use `` `${shoe}-${author}-${redditUrl || date}` `` — **the `shoe` must be in the key**: rotation posts (one `redditUrl` → many shoes, ~9 of them) reuse a single URL across entries, so keying by `redditUrl` alone collides in the all-reviews list. X button clears the search.

## Docs

| File | Covers |
|---|---|
| [docs/data-schema.md](docs/data-schema.md) | Review schema, `getShoes()` confidence-weighted aggregation, `amazonLinks`/`shoePrices`, affiliate helper |
| [docs/features.md](docs/features.md) | UI breakdown (filters, layouts, modal, compare, rating bars), theme tokens, color thresholds |
| [docs/scrape-pipeline.md](docs/scrape-pipeline.md) | `scripts/` roles, env vars, run commands, output path, known limits |
| [docs/roadmap.md](docs/roadmap.md) | Gaps + next-step buckets |
