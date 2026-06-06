# Roadmap

Not committed priorities — a menu to pick from.

## Gaps
- **No backend / DB** — reviews are a hand-edited JS file; no user submit/vote/comment.
- **No accounts / auth** — prerequisite for any user-generated content.
- **No routing** — single page; shoe detail isn't deep-linkable (`/shoe/lebron-21`).
- **No SEO** — one `index.html`, no per-shoe meta/OpenGraph, no sitemap, no SSR/SSG.
- **No analytics** — can't measure visits or affiliate clicks.
- **No live price data** — `shoePrices` is static; no in-stock/price signal.
- **No mobile QA pass** — uses `clamp`/flex but unverified across breakpoints.
- **No tests** — no unit or e2e coverage.
- **No deployment target** — Vercel/Netlify/Cloudflare Pages would all be one-click.
- **Pipeline not wired in** — scrape output is manual-merge; prompt still basketball-only + `courtFeel` (see scrape-pipeline.md).
- **Data freshness** — dataset is hand-maintained; staleness erodes trust.

## Next-step buckets
1. **Ship it** — deploy the prototype for a real URL to share + instrument.
2. **Analytics + affiliate-click tracking** — Plausible/PostHog/GA4.
3. **Per-shoe URLs + SEO** — React Router, or migrate to Next/Astro for SSG. Highest leverage for organic growth.
4. **Shoe images** — `imageUrl` is already supported per review/shoe; backfill real images (placeholder SVG renders otherwise).
5. **Move data out of the bundle** — JSON/Supabase/SQLite + tiny API; sets up user content.
6. **User submissions (lite)** — moderated form, no full auth.
7. **Accounts + voting/commenting** — community layer once there's traffic.
8. **Expand sport coverage** — running is in; room for training/other later.
9. **Finish the scrape pipeline** — align prompt to `groundFeel`, add running subreddits, auto-merge with review gate.
