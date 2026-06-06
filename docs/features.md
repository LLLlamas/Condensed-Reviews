# UI features

Components live in `components/` (one file per component). Two screens via the nav tabs: **Browse** and **Versus**.

## Nav + hero
- Wordmark "Court Report", tab switcher (Browse / Versus), live counts (shoes / reviews / brands), reactive to the sport filter.

## Filters (Browse)
- **Sport pills** — All / Basketball / Running. Switching resets brand, search, and max-price.
- **Search** — free-text on shoe name.
- **Brand pills** — All + each brand present in the current sport.
- **View toggle** — List / Grid / Swipe.
- **Max price slider** — 80–250, `250` means "250+" (no cap).
- **Sort** — Overall score, Most reviews (tie-break A–Z), Name A–Z, Price ↑, Price ↓, Most recent, or any of the 8 traits (`CATEGORY_LABELS`). Trait sort adds rank badges. `ⓘ` opens the scoring-info modal.

## Browse layouts
- **Grid** (`ShoeCard`) — shoe image or placeholder, brand/name, score + ELITE/SOLID/MEDIOCRE badge, review count + price, Amazon link, `vs ↔` compare button. Image tile is white, 16:10, `object-fit: contain`; images are pre-normalized (bottom-aligned on a 16:10 canvas) so every sole shares one baseline with no clipping (see `shoeImages` in data-schema.md).
- **List** (`ListRow`) — rank, shoe, score+badge, price, review count, compare.
- **Swipe** (`SwipeView`) — one shoe at a time, ←/→ keys or arrows + dots, shoe image (white tile, `contain`; click → opens the modal), trait bars, top-2 quote blurbs, read/compare actions.

## Reviews section (Browse)
- `ReviewCard` per review: author/subreddit/date, DETAILED vs SHORT badge (`wordCount >= 200`), playstyle/court/sizing tags, summary, verdict, View-on-Reddit, expandable full text with the 8 rating bars (active sort trait highlighted).

## Shoe modal (`ShoeModal`)
- Opened from any layout. Brand/name, aggregate score + badge + price, "Find on Amazon", shoe image banner (white bg, `contain`, normalized card image; click → fullscreen `.lightbox` showing the **original** full-size source photo — `imageOriginalUrl`, falling back to the local image if the source is unavailable; Esc/click closes the lightbox first then the modal), 8 aggregate rating bars, then every review. Esc closes; body scroll locked while open.
- Bars with `avg >= 8.8` show a highlight popup of the top-3 reviews' trait sentences (extracted via `extractTraitSentence` + `TRAIT_KEYWORDS`).

## Versus (`CompareScreen`)
- Two shoe pickers, head-to-head cards, trait-by-trait bars with the winning side highlighted. `vs ↔` anywhere routes here and pre-fills a slot.

## Scoring info modal (`ScoringInfoModal`)
- Explains the confidence-weighted overall, trait scoring, confidence markers, verdict tiers, and review sources.

## Rating colors + verdict tiers
- `ratingColor(v)`: ≥8.5 `--color-elite`, ≥7.0 `--color-solid`, else `--color-mediocre`.
- `ScoreBadge` / badge labels use the same thresholds: ELITE ≥8.5, SOLID ≥7.0, else MEDIOCRE.
- Confidence markers in `RatingBar`: high `''`, medium `~`, low `?`.

## Theme tokens (`src/index.css`, light theme)
| Token | Value | Use |
|---|---|---|
| `--bg` / `--surface` | `#fcf8f8` | Page + card base (body adds radial gradient glows) |
| `--surface-container*` | `#f0eded`→`#e5e2e2` | Layered container fills |
| `--on-surface` / `--on-surface-variant` | `#1c1b1c` / `#45474b` | Text |
| `--outline` / `--outline-variant` | `#75777b` / `#c5c6cb` | Borders, scrollbar |
| `--primary` / `--on-primary` | `#020407` / `#fff` | Primary |
| `--secondary` / `--secondary-container` | `#b02f00` / `#ff5722` | Links, selection |
| `--color-elite` / `-solid` / `-mediocre` | `#1e8a4a` / `#b02f00` / `#75777b` | Rating status |
| `--font-brand` / `--font-body` | Libre Caslon Text / Hanken Grotesk | Typography |
