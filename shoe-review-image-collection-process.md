# Shoe Review + Image Collection Process — Court Report

A self-contained runbook for **growing the dataset** (`src/data/reviews.js`): collecting real, accurate Reddit shoe reviews, sourcing clean images, wiring prices/affiliate links, and shipping it. Hand this to a fresh agent and it can continue exactly where the last session left off. Pairs with `CLAUDE.md` (conventions) and the three agent specs in `.claude/agents/`.

> **One-line summary:** build exclusion lists → run partitioned `review-collector`s → merge with dedup → `review-auditor` → `shoe-image-fixer` → `npm run normalize:images` → verify → commit. Aggregate in periodic batches; never force one giant pull.

---

## 0. The hard environment constraint (read first)

- **`reddit.com`'s JSON API and direct `WebFetch` are BLOCKED here** (HTTP 403 / platform denial). Do not waste turns retrying them.
- Read posts via the **PullPush archive API** (`api.pullpush.io`, NOT blocked) + **`WebSearch`** to scout threads.
- The `scripts/` node pipeline (`scrape:backfill`/`scrape:daily`) needs Reddit API creds in `.env` (not configured) — so it's **not** the path used here.
- **Never fabricate** posts, IDs, authors, dates, quotes, or `redditUrl`s. Every entry must trace to a post actually read. Fabrication is worse than no entry — each row is a public "View on Reddit" link feeding affiliate cards.

### PullPush quick reference (via `WebFetch`)
- Search submissions: `https://api.pullpush.io/reddit/search/submission/?subreddit=BBallShoes&q=review&size=100&sort=desc`
  - vary `q=`: `review`, `performance`, `impressions`, `thoughts`, `hooping`, `verdict`, `rotation`, or a shoe name (`q=Sabrina+3`)
  - vary `subreddit=`: basketball → `BBallShoes`; running → `RunningShoeGeeks`, `AskRunningShoeGeeks`, `XXRunning`, `runninglifestyle`, `Marathon_Training`
  - window older posts with `&before=EPOCH&after=EPOCH` (epoch seconds)
  - fields: `id`, `title`, `selftext`, `author`, `created_utc`, `permalink`, `link_flair_text`, `score`, `num_comments`
- Single submission: `…/submission/?ids=POSTID`
- Comments on a post (when the review is a comment): `…/comment/?link_id=POSTID&size=100&sort_type=score&sort=desc` (fields: `id`, `body`, `author`, `created_utc`)
- Build `redditUrl` yourself: body review → `https://www.reddit.com/r/<sub>/comments/<postId>/<slug>/` (use `permalink` if present); comment review → append `<commentId>/`.
- `created_utc` (epoch) → `YYYY-MM-DD` in **US-local** time (the dataset convention). A post near UTC midnight may land on the previous US-local day — that's fine.
- PullPush rate-limits / 5xx intermittently: retry once, lower `size`, or fall back to a targeted `ids=` / `link_id=` fetch.

---

## 1. The three agents (`.claude/agents/`)

| Agent | Role | Writes files? |
|---|---|---|
| `review-collector` | Finds reviews **and** does price/Amazon-link research. Returns paste-ready `reviews[]` / `shoePrices` / `amazonLinks` blocks. | No — returns text |
| `review-auditor` | READ-ONLY accuracy check: re-fetches each new review's source via PullPush, verifies shoe/author/date/content fidelity, returns corrections. | No — returns text |
| `shoe-image-fixer` | Sources clean white/transparent side-profile images, writes URLs into the `shoeImages` map. | Yes — `shoeImages` |

There is **no separate price/research agent** — that's intentionally consolidated into `review-collector` to reduce redundancy.

> Note: agent files added mid-session aren't registered as `subagent_type` until the next session. If `review-collector`/`review-auditor` aren't selectable, run their playbook via a `general-purpose` agent (paste the relevant spec into the prompt). `shoe-image-fixer` is registered.

---

## 2. Step-by-step

### Step 1 — Build exclusion lists (so nothing repeats)
Run these and feed BOTH outputs to every collector:
```bash
# Shoes already in the dataset (the join key):
node -e "import('./src/data/reviews.js').then(m=>console.log([...new Set(m.reviews.map(r=>r.shoe))].sort().join(' | ')))"
# Used Reddit post-IDs (never re-emit a redditUrl containing these):
node -e "import('./src/data/reviews.js').then(m=>console.log([...new Set(m.reviews.map(r=>(r.redditUrl.match(/comments\/([a-z0-9]+)/)||[])[1]).filter(Boolean))].sort().join(', ')))"
```

### Step 2 — Run `review-collector`(s)
For a big sweep, run **partitioned** collectors in parallel so they don't overlap each other (they return text, so parallel is safe). Proven partition:
- (a) **Basketball, mainstream US brands** — r/BBallShoes; Nike/Jordan/Adidas/Puma/UA/New Balance/Reebok
- (b) **Running, all run subs** — RunningShoeGeeks/AskRunningShoeGeeks/XXRunning/Marathon_Training/runninglifestyle
- (c) **Non-English brands + rotation posts** — Li-Ning/ANTA/361/Xtep/Qiaodan/Peak/Rigorer, plus multi-shoe "rotation" posts (one post → many entries)

Give each: the full exclusion lists, its lane, the schema (below), and "only emit entries whose source text you actually read." Each yields ~20-30 before diminishing returns.

### Step 3 — Merge into `src/data/reviews.js` with dedup
- Insert review objects into the `reviews` array (basketball entries in a basketball section, running in a running section; `// --- Shoe Name ---` header per shoe).
- Add a `shoePrices` entry and an `amazonLinks` entry **per net-new shoe** (see §4).
- **Dedup key = `shoe` name + post-ID**, never `redditUrl` alone (rotation posts reuse one URL across shoes).
- **Cross-collector dedup:** a shoe may appear from two collectors, or a collector may return an *existing* shoe with a new post — keep it only as an **extra review** (don't re-add price/link/image). Example this happened with: Puma Fast-R Nitro Elite 3.
- **Canonical naming (critical):** never split one shoe across two names/brands.
  - "Giannis Freak 5" → merge into canonical **"Nike Zoom Freak 5"**.
  - Jordan-line shoes use brand **"Jordan"** (e.g. "Jordan Luka .77", "Air Jordan 38 Low", "Air Jordan 40"), not "Nike".
  - Curry → brand "Under Armour"; Kobe Crazy 8 → brand "Adidas" (his adidas-era retro).

### Step 4 — Audit with `review-auditor` (READ-ONLY)
Hand it the just-merged entries (shoe | author | date | postID [commentID]). It re-fetches each via PullPush and flags wrong-shoe / wrong-author / wrong-date / fabricated-content / indefensible-ratings, returning exact corrected field values. Apply any fixes. (Past catches: ANTA KT8 date; confirming rotation-post quotes map to the right shoe.)

### Step 5 — Images
1. Run `shoe-image-fixer` for the net-new shoes (give it the exact `shoe` keys). It writes verified remote source URLs into `shoeImages`.
2. Then normalize:
   ```bash
   npm run normalize:images
   ```
   Downloads each remote URL, trims to the shoe, bottom-aligns on a 16:10 white canvas, auto-orients **toe-left**, and repoints `shoeImages` → `/shoes/<slug>.png` (also fills `shoeImagesOriginal` for the lightbox).
   - **Gotcha — Windows file lock:** if it ends with `UNKNOWN: open reviews.js`, just re-run it (a watcher briefly locked the file).
   - **Gotcha — HEIF/AVIF source:** some CDNs serve HEIF that `sharp` can't decode (`Bitstream not supported`). Swap that shoe's `shoeImages` URL for a JPG/PNG (running retailer `cdn/shop/files`, `m.media-amazon.com` left-view, or `images.novelship.com/...?...bg=FFFFFF`) and re-run. If no clean source exists, **remove the entry → it falls back to the SVG placeholder** (don't leave a broken/404 URL). Currently on placeholder: HOKA Mach X 2, Qiaodan Sharp Fang 2 Pro SE.
   - Re-enforce orientation without re-downloading: `npm run normalize:directions` (`--dry` to report only).

### Step 6 — Verify
```bash
# Parses + counts + dedup + image gaps + stray remote URLs:
node -e "import('./src/data/reviews.js').then(m=>{const rv=m.reviews;const p=new Set(),d=[];for(const r of rv){const k=r.shoe+'|'+r.redditUrl;p.has(k)?d.push(k):p.add(k)}const ks=new Set(),dk=[];for(const r of rv){const k=r.shoe+'-'+r.author+'-'+(r.redditUrl||r.date);ks.has(k)?dk.push(k):ks.add(k)}const s=m.getShoes();const remote=Object.entries(m.shoeImages).filter(([k,v])=>v.startsWith('http'));const miss=s.filter(x=>!m.shoeImages[x.name]).map(x=>x.name);console.log('shoes',s.length,'reviews',rv.length,'brands',[...new Set(s.map(x=>x.brand))].length);console.log('dup(shoe+url)',d.length,d);console.log('react-key dup',dk.length,dk);console.log('remote-left',remote.length,remote.map(r=>r[0]));console.log('placeholder',miss.length,miss)})"
npm run lint
```
Expect: `dup(shoe+url) 0`, `react-key dup 0`, `remote-left 0`, lint clean.

### Step 7 — Commit + push
Branch is `main` (solo repo, owner commits directly). `node_modules` is gitignored. Commit message ends with the Co-Authored-By trailer. Then `git push origin main`.

---

## 3. Review object schema (match EXACTLY)
```js
{
  shoe: "Nike Sabrina 3",          // canonical, brand-prefixed. THE join key.
  brand: "Nike",                   // canonical brand only (drives the brand pill)
  sport: "basketball",             // "basketball" | "running" (drives the sport filter)
  subreddit: "r/BBallShoes",       // display string, with r/ prefix
  redditUrl: "https://www.reddit.com/r/BBallShoes/comments/<id>/<slug>/", // REAL, built from data
  author: "u/username",
  date: "2025-03-14",              // YYYY-MM-DD, US-local from created_utc
  summary: "2-4 sentence condensed highlights — liked/disliked, standout traits.",
  playstyle: "Quick Guard",        // bball: Quick Guard/All-Around/Big Man/Wing/Slasher; running: Daily Trainer/Tempo/Long Run/Race Day/Recovery; or null
  courtType: "Indoor",             // bball: Indoor / Outdoor / Indoor / Outdoor; running: Road / Trail / Track / Treadmill; or null
  sizingNote: "True to size",      // or "Half size down", etc; or null
  verdict: "Solid",                // Elite, Solid, Great, Mixed, Disappointing, Not Recommended, GOAT...
  wordCount: 312,                  // word count of the SOURCE text condensed (>=200 → DETAILED badge)
  fullText: "Substantive review text, lightly cleaned — strip intros/off-topic, keep observations.",
  ratings: { cushioning: 8.0, traction: 9.0, support: 7.5, fit: 8.5, breathability: 7.0, groundFeel: 8.5, durability: 7.0, value: 8.0 },
  // confidences: include the object ONLY when at least one trait is "low" or "medium"
  confidences: { cushioning: "high", traction: "high", support: "medium", fit: "high", breathability: "low", groundFeel: "medium", durability: "low", value: "medium" }
}
```
Rules:
- **All 8 ratings always present**, 0–10 one decimal, inferred honestly. Use **`groundFeel`** (NOT `courtFeel`) = court feel (bball) / road feel (running).
- **Confidence reflects support in the text.** Trait the reviewer didn't actually discuss → reasonable ~7.0 + `"low"`. Don't fabricate confident numbers. Omit the `confidences` object only when every trait is genuinely high.
- A short/surface review legitimately ends up low/medium on most traits — that's expected and honest.

### What qualifies / what to reject
- **Keep:** a post body OR a substantive comment assessing real performance (cushioning, traction, support, fit, breathability, court/ground feel, durability, value), prefer 150+ words. Multi-shoe **rotation** posts are gold.
- **Reject:** "what should I buy", sizing-only Qs, unboxings, deal/price-drop posts, pure hype with no performance detail, deleted/removed bodies.

---

## 4. Prices, affiliate links, and the "See Price" rule
- `shoePrices`: `"Shoe Name": 150` (number) or a `"130-160"` range string — approximate US retail.
- `amazonLinks`, routed through `getAmazonUrl(name, sport)` (affiliate tag **`llamas02-20`**):
  - Confirmed Amazon product → `https://www.amazon.com/dp/<ASIN>?tag=llamas02-20` (exact price displayed).
  - Unconfirmed but on Amazon US → `https://www.amazon.com/s?k=Shoe+Name+sport+shoe&tag=llamas02-20`. **`getShoes()` flags `/s?k=` links as `priceApprox`**, so the UI shows `~$X`.
  - **Not on Amazon US** (most Li-Ning / ANTA / 361 / Xtep / Qiaodan / Rigorer / SPO / boutique) → use the brand's official-store / retailer product URL (e.g. `anta.com`, `li-ning.com`, `rigorer.com`, `antosports.com`, `wowsole.com`, `shopnings.com`, `361sport.com`, `seriousplayeronly.com`, `klaythompson.com`). `isAmazonLink(url)` returns false → the card renders a **"See Price"** button (external-link icon) instead of the Amazon cart.
- **Escaping:** write plain `&` in URLs (`...&tag=...`). Collector output often HTML-escapes to `&amp;` — convert to `&` on merge or the affiliate tag breaks.
- Don't duplicate a key that already exists (e.g. a shoe that had an `amazonLinks` entry before its first review, like Li-Ning Wade 808 5 Ultra — add its `shoePrices`, but don't re-add the link).

---

## 5. Pitfalls learned (don't repeat)
- **`redditUrl` is NOT unique** — rotation posts reuse it across shoes. React keys must be `` `${shoe}-${author}-${redditUrl||date}` ``; dedup on `shoe+url`.
- **`courtFeel` → `groundFeel`** everywhere (data + scrape prompt).
- **Unify brands/lines** to avoid stray pills / split cards (Jordan line under "Jordan", "Giannis Freak 5" == "Nike Zoom Freak 5", etc.).
- **`&amp;`** in collector URLs → fix to `&`.
- **Dates are US-local**; siblings from one post share one date.
- Don't run a second `npm run dev` while one is already running — two dev servers corrupt the shared `.next` cache.

---

## 6. Current state & where the remaining seams are
Run the Step-6 command for live counts (last session: **101 shoes / 134 reviews / 20 brands**). Diminishing returns are real and rising — aggregate in periodic batches rather than one massive pull.

Richest remaining seams:
- **Multi-shoe rotation posts** (one post → many entries) — best yield per effort.
- **Older time windows** via `&before=` epochs into 2024 (flagship 2025 models often only have buy-advice/sizing threads, not played-in reviews).
- **Untapped run subs:** AskRunningShoeGeeks, XXRunning, Marathon_Training.
- **Prolific reviewers' back catalogs** (e.g. UncleSole, TakoOne post detailed reviews regularly).
- **Non-English brands** (Li-Ning/ANTA/361/Xtep/Qiaodan/Peak/Rigorer) — sparse English reviews but growing; note many lack clean English-retailer images (may stay on placeholder).

Sample net-new targets to verify (a review must actually exist): UA Curry Flow 10, Puma MB.04, Jordan Tatum 2 / Luka 3, Nike GT Cut 2 / Sabrina 1/3 / KD 18, Adidas AE 2 / Anthony Edwards 1; Nike Alphafly 3 / Structure 26 / Invincible 3, Saucony Endorphin Pro 4 / Ride 17 / Kinvara, ASICS Gel-Kayano 31 / Novablast 5 / Metaspeed Edge Paris, NB 1080 v14 / SC Elite v4, Brooks Hyperion Max 2, HOKA Skyward X / Cielo X1, On Cloudsurfer; Li-Ning Wade Fission / Yushuai, ANTA KT10 / Shock Wave 5, 361 BIG3, Xtep 160X, Peak Lou Williams.
