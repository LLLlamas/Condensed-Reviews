# Reviews-Master

Living reference doc for the **Court Report** project (working repo name: `Condensed-Reviews`). Update this as we expand the site and start onboarding users.

---

## 1. What this is

A single-page React site that surfaces **condensed, rated user reviews of basketball shoes**, sourced from r/BBallShoes. Each shoe gets aggregated category ratings; each review keeps a short summary plus the original full text on demand.

- Repo: `C:\Users\fines\Documents\2026 Repository\Condensed-Reviews`
- Live entry point: `index.html` → `src/main.jsx` → `src/App.jsx`
- Status: prototype is functional (commit `2d506b4 functional`, after `2a8d795 prototype 1`)

---

## 2. Stack

| Piece | Choice |
|---|---|
| Framework | React 19 (`react` / `react-dom` ^19.2.4) |
| Build | Vite 8 (`@vitejs/plugin-react`) |
| Lint | ESLint 9 + react-hooks + react-refresh |
| Styling | Hand-written CSS (`src/index.css` globals + `src/App.css` components), CSS variables for theming |
| Fonts | Google Fonts: Inter, Playfair Display, JetBrains Mono, Bebas Neue |
| State | Local component state (`useState` / `useMemo` / `useRef` / `useEffect`) — no store yet |
| Data | Static JS module (`src/data/reviews.js`) — no backend yet |

Scripts: `npm run dev` (Vite), `npm run build`, `npm run preview`, `npm run lint`.

---

## 3. Current data set (snapshot 2026-04-13)

- **41 reviews** across **27 unique shoes** from **6 brands**
- Sourced from r/BBallShoes, last 30 days
- Hand-condensed `summary` (short blurb) + verbatim/edited `fullText` + a `verdict` line per review

### Brands & shoe coverage
- **Nike** (10 shoes): LeBron 21, LeBron 20, KD 14, Sabrina 2, AE 1, Shai 001, GT Cut 3, GT Cut 4, Ja 3, Kobe 6 Protro
- **Nike / Jordan** (1): Air Jordan 40
- **361 Degrees** (4): Joker 1 GT, Joker 2, Joker 2 GT, Joker 2 Low
- **Li-Ning** (7): JB3, Way of Wade 12, Gamma 1, Gamma 2, Liren 6v2, Wade 808 3 Ultra v2, All City 14
- **ANTA** (1): Kai 3
- **Adidas** (3): Don Issue 7, Harden 9, Crazy Energy
- **SPO** (1): Game 1 High

`amazonLinks` map covers 28 shoes (one extra: Kobe AD NXT FF, no review yet — placeholder for future). Anything not in the map falls back to a generic Amazon search via `getAmazonUrl()`.

### Review schema (`src/data/reviews.js`)
```js
{
  shoe, brand,
  redditUrl, author, date,
  summary,        // condensed blurb shown on the card
  playstyle,      // tag: e.g. "Quick Guard", "All-Around"
  courtType,      // tag: e.g. "Indoor", "Indoor / Outdoor"
  sizingNote,     // tag: e.g. "True to size", "Size 0.5 down"
  verdict,        // short label: e.g. "Elite", "Solid", "Mixed"
  wordCount,      // ≥200 = "DETAILED REVIEW", else "SHORT REVIEW"
  fullText,       // expanded body, shown on "Read full review"
  ratings: { cushioning, traction, support, fit, breathability, courtFeel, durability, value }  // 0–10
}
```

`getShoes()` aggregates reviews by `shoe`, averages each of the 8 categories, and sorts shoes by review count (descending).

---

## 4. Features in the UI today

Defined in `src/App.jsx`:

- **Header** with title "Court Report", tagline, and live counts (shoes / reviews / brands).
- **Filters**:
  - Free-text shoe search.
  - Brand pills (All + every brand).
  - Trait sort pills — Overall, plus 8 traits each with an icon (cushioning, traction, support, fit, breathability, court feel, durability, value).
- **Horizontal shoe strip** — scrollable cards per shoe, showing brand, name, average score (or trait score when sorting by trait), review count, and an Amazon affiliate icon. Auto-scrolls the active shoe into view.
- **Shoe detail panel** (when a shoe is selected) — brand, name, review count, "Find on Amazon" CTA, and the 8 averaged rating bars.
- **Review cards**:
  - Author / subreddit / date header
  - "DETAILED" vs "SHORT" badge based on `wordCount`
  - Playstyle / court type / sizing tags
  - Summary + verdict
  - "View on Reddit" link
  - 8 rating bars (highlighted bar when filtering by that trait)
  - Expandable full review text
- **Color-coded ratings** — green ≥9, warm ≥7.5, primary ≥6, red below.
- **Ambient gradient glows** for visual polish.

### Theme tokens (`src/index.css`)
Dark theme: `--bg-primary #1A1B2E`, `--bg-card #222338`, accents `--accent-primary #E8764B` (warm orange), `--accent-warm #D4A54A`, `--accent-green #5CC9A7`, `--accent-red #E05555`, `--accent-blue #6BA3D6`.

---

## 5. Monetization hook (already wired)

Amazon affiliate tag **`llamas02-20`** is baked into every shoe link via `getAmazonUrl()`. Both the per-shoe card icon and the shoe-detail "Find on Amazon" button use it. Anything we add should keep funneling through this helper so we don't lose attribution.

---

## 6. What's NOT here yet (gaps to address as we expand)

These are the obvious holes for going from prototype → something users would land on and come back to:

- **No backend / no DB** — all reviews are a hand-edited JS file. No way for users to submit, vote, or comment.
- **No accounts / auth** — needed before any user-generated content.
- **No routing** — single page. Shoe detail isn't deep-linkable; can't share `/shoe/lebron-21`.
- **No SEO** — single `index.html`, no per-shoe meta tags, no sitemap, no SSR/SSG. Critical if we want organic traffic.
- **No analytics** — can't measure visits, affiliate clicks, or which shoes/traits matter to users.
- **No images** — shoe cards are text-only. Big visual gap vs. competing review sites.
- **No price data** — only an Amazon search link, no live pricing or in-stock signal.
- **No mobile QA pass documented** — layout uses `clamp` and flex/wrap but hasn't been verified across breakpoints in this doc.
- **No tests** — no unit or e2e coverage.
- **No deployment** — no hosting target chosen yet (Vercel / Netlify / Cloudflare Pages would all be one-click for a Vite SPA).
- **No content pipeline** — adding a review = hand-editing `reviews.js`. Won't scale past a couple dozen more shoes.
- **Data freshness** — dataset is frozen at 2026-04-13 ("last 30 days"). Stale data hurts trust.

---

## 7. Likely next-step buckets (for us to pick from / reorder)

Not a roadmap yet — just the menu. Pick what matters when we sit down to plan.

1. **Ship it somewhere.** Deploy current prototype (Vercel/Netlify) so we have a real URL to share and instrument.
2. **Add analytics + affiliate-click tracking.** Plausible/PostHog/GA4. Even basic pageview + outbound-click data tells us what shoes get attention.
3. **Per-shoe URLs + SEO basics.** React Router (or migrate to Next.js / Astro for SSG) so each shoe is a crawlable page with its own title/description/OpenGraph image. Probably the single highest-leverage move for organic growth.
4. **Shoe images.** Even just one hero image per shoe transforms the strip and detail view.
5. **Move data out of the JS bundle.** JSON file → Supabase / SQLite + a tiny API. Sets us up for user content later.
6. **User submissions (lite).** Form to submit a review (name, ratings, summary, link); we moderate before publishing. Doesn't need full auth.
7. **Accounts + voting/commenting.** Real community layer — only worth it once we have traffic.
8. **Compare view.** Pick 2–3 shoes side-by-side on the 8 traits. Natural fit for affiliate intent.
9. **Expand sport coverage.** README says "basketball focused" — we could leave room for running/training later but stay focused for now.
10. **Refresh pipeline.** Either a manual cadence ("update monthly from Reddit") or a small scraper + LLM-condense workflow.

---

## 8. Conventions / things to keep in mind when editing

- **Don't break the affiliate tag.** New shoe links must go through `getAmazonUrl()` or include `tag=llamas02-20`.
- **Rating scale is 0–10**, one decimal, across all 8 categories. Color thresholds in `RatingBar` (`App.jsx`) assume this scale.
- **`wordCount ≥ 200` = DETAILED badge.** Keep `wordCount` accurate when adding reviews.
- **Brand string is the source of truth for the brand pill.** If you misspell a brand it'll create a new pill.
- **Shoe `name` is the join key** between reviews and `amazonLinks`. Keep names consistent.

---

## 9. Scrape pipeline (scaffolded — awaiting Reddit API approval)

A backfill + daily-delta pipeline lives in `scripts/`. It is **scaffolded but not yet run**: requires Reddit Data API credentials (script app from reddit.com/prefs/apps) plus an Anthropic API key.

- `scripts/lib/reddit.js` — OAuth + paginated fetch (listing, search, comments). Falls back to `client_credentials` grant if no Reddit username/password set.
- `scripts/lib/filter.js` — heuristics (title hints, flair, trait keyword hits, body length) to decide what's a real performance review. Cheap, tunable.
- `scripts/lib/condense.js` — Anthropic SDK call. System prompt is cached (`cache_control: ephemeral`). Default model `claude-haiku-4-5-20251001` for cost.
- `scripts/lib/store.js` — read/write `scripts/output/reviews.json`, dedupe by Reddit post `id`.
- `scripts/backfill.js` — sweeps multiple search queries × time ranges to maximize unique post coverage (works around Reddit's 1000-item pagination cap). Persists every 10 condensed reviews.
- `scripts/daily-update.js` — fetches `/new`, keeps last 7 days (overlap to catch edits/late comments), dedupes, condenses only the new ones.
- `scripts/README.md` — full setup & run instructions.

Run via `npm run scrape:backfill` / `npm run scrape:daily`.

Output goes to `scripts/output/reviews.json` — separate from the live site's hand-curated `src/data/reviews.js`. Merge intentionally after eyeballing quality; don't auto-replace.

**Known limitation:** Reddit's search endpoint caps at ~1000 items per query, so even with multi-query sweeping we may not get a full 5y. For guaranteed historical depth, the scaffold has a hook for adding a Pushshift-archive importer (not implemented yet).

**Before running:** create `.env` from `.env.example` at the repo root and fill in:
- `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `REDDIT_USER_AGENT`
- Optionally `REDDIT_USERNAME` / `REDDIT_PASSWORD` (or leave blank for read-only client_credentials)
- `ANTHROPIC_API_KEY`

`.env` is gitignored. `.env.example` is committed as a template.

---

## 10. How to update this doc

This file is the persistent context for the project. When we make meaningful changes — new features, new data, new direction, decisions we want to remember — add a dated note under the relevant section (or append a short "Changelog" section at the bottom). Keep it terse; this is a reference, not a journal.
