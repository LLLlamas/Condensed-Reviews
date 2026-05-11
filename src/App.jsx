import { useState, useMemo, useEffect } from 'react';
import { reviews, getShoes, getAmazonUrl, shoePrices } from './data/reviews';
import './App.css';

const CATEGORY_LABELS = {
  cushioning:   "Cushioning",
  traction:     "Traction",
  support:      "Support",
  fit:          "Fit",
  breathability:"Breathability",
  groundFeel:   "Ground Feel",
  durability:   "Durability",
  value:        "Value"
};

const CATEGORY_ICONS = {
  cushioning:   "☁️",
  traction:     "🧲",
  support:      "🛡️",
  fit:          "🧤",
  breathability:"💨",
  groundFeel:   "👣",
  durability:   "⚙️",
  value:        "💰"
};

const CONFIDENCE_LABELS = {
  high:   { marker: '',  title: 'High confidence — directly assessed by the reviewer' },
  medium: { marker: '~', title: 'Medium confidence — implied or indirectly mentioned' },
  low:    { marker: '?', title: 'Low confidence — not meaningfully discussed; best-guess only' }
};

const TRAIT_KEYWORDS = {
  cushioning:   ['cushion', 'bouncy', 'bounce', 'plush', 'foam', 'soft', 'impact', 'responsive', 'midsole', 'energy return', 'landing', 'pillow'],
  traction:     ['traction', 'grip', 'outsole', 'herringbone', 'rubber', 'slip', 'sticky', 'dust', 'gripping', 'grabby', 'bite', 'court floor'],
  support:      ['support', 'ankle', 'stability', 'lateral', 'containment', 'lockdown', 'stable', 'pronation', 'arch', 'collapse', 'medial', 'heel counter'],
  fit:          ['fit', 'sizing', 'size', 'wide', 'narrow', 'toebox', 'toe box', 'heel slip', 'snug', 'roomy', 'tts', 'true to size', 'half size', 'length'],
  breathability:['breath', 'ventilat', 'hot', 'heat', 'air', 'mesh', 'cool', 'airflow', 'sweat'],
  groundFeel:   ['court feel', 'ground feel', 'road feel', 'feel of the court', 'feel of the road', 'low to the ground', 'low profile', 'feedback', 'connection to', 'proprioception'],
  durability:   ['durable', 'durability', 'lasting', 'held up', 'hold up', 'wear', 'worn', 'miles', 'breakdown', 'outsole wear', 'lasted'],
  value:        ['value', 'price', 'worth', 'dollar', 'cheap', 'expensive', 'budget', 'cost', 'money', 'affordable', 'retail'],
};

function extractTraitSentence(summary, traitKey) {
  if (!summary) return summary;
  const keywords = TRAIT_KEYWORDS[traitKey] || [];
  const sentences = summary.match(/[^.!?]+[.!?]?\s*/g) || [summary];
  const scored = sentences.map(s => {
    const sl = s.toLowerCase();
    const score = keywords.reduce((acc, kw) => acc + (sl.includes(kw) ? 1 : 0), 0);
    return { s: s.trim(), score };
  });
  const best = scored.filter(x => x.score > 0).sort((a, b) => b.score - a.score);
  return best.length > 0 ? best[0].s : null;
}

const SPORT_FILTERS = [
  { key: 'all',        label: 'All Sports' },
  { key: 'basketball', label: '🏀 Basketball' },
  { key: 'running',    label: '🏃 Running' },
];

function ratingColor(value) {
  return value >= 8.5 ? 'var(--color-elite)' : value >= 7.0 ? 'var(--color-solid)' : 'var(--color-mediocre)';
}

function RatingBar({ label, value, max = 10, highlighted = false, confidence = 'high', highlights = null }) {
  const [showHighlight, setShowHighlight] = useState(false);
  if (!value) return null;
  const pct = (value / max) * 100;
  const color = ratingColor(value);
  const conf = CONFIDENCE_LABELS[confidence] || CONFIDENCE_LABELS.high;
  const hasHighlight = value >= 8.8 && highlights && highlights.length > 0;

  return (
    <div
      className={`rating-bar rating-bar--conf-${confidence} ${highlighted ? 'rating-bar--highlighted' : ''}`}
      title={conf.title}
    >
      <div className="rating-bar__label">
        <span>{label}</span>
        <span className="rating-bar__value-group">
          {hasHighlight && (
            <button
              className={`rating-bar__highlight-btn${showHighlight ? ' rating-bar__highlight-btn--active' : ''}`}
              onClick={() => setShowHighlight(x => !x)}
              aria-label="View review highlights"
              title="See what reviewers said"
            >
              <svg width="15" height="8" viewBox="0 0 64 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 24 C 3 22, 5 21, 8 21 L 24 21 C 28 21, 31 18, 35 14 L 42 7 C 44 5, 46 5, 48 6 L 50 8 C 50 10, 49 11, 48 12 L 46 14 C 50 14, 55 16, 58 18 C 61 20, 61 24, 58 25 L 8 25 C 5 25, 3 26, 3 24 Z"/>
                <path d="M14 21 L 14 25 M 20 21 L 20 25 M 26 20 L 28 24 M 33 16 L 35 20"/>
              </svg>
            </button>
          )}
          <span className="rating-bar__value" style={{ color }}>
            {conf.marker && <span className="rating-bar__conf-marker">{conf.marker}</span>}
            {value.toFixed(1)}
          </span>
        </span>
      </div>
      <div className="rating-bar__track">
        <div className="rating-bar__fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      {showHighlight && hasHighlight && (
        <div className="rating-bar__highlight-popup">
          {highlights.map((h, i) => (
            <div key={i} className="highlight-item">
              <div className="highlight-item__meta">
                <span className="highlight-item__author">{h.author}</span>
                <span className="highlight-item__sep">&middot;</span>
                <span className="highlight-item__sub">{h.subreddit}</span>
                <span className="highlight-item__rating" style={{ color: ratingColor(h.rating) }}>{h.rating.toFixed(1)}</span>
              </div>
              <p className="highlight-item__text">{h.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ShoeImagePlaceholder({ shoe }) {
  const initials = shoe
    .replace(/^(Nike|Adidas|Li-Ning|361|ANTA|SPO|Air Jordan|HOKA|Brooks|ASICS|Saucony|New Balance|Mizuno|On)\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase() || shoe.slice(0, 2).toUpperCase();

  return (
    <div className="shoe-image shoe-image--placeholder" aria-label={`${shoe} image placeholder`}>
      <svg className="shoe-image__icon" viewBox="0 0 64 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 24 C 3 22, 5 21, 8 21 L 24 21 C 28 21, 31 18, 35 14 L 42 7 C 44 5, 46 5, 48 6 L 50 8 C 50 10, 49 11, 48 12 L 46 14 C 50 14, 55 16, 58 18 C 61 20, 61 24, 58 25 L 8 25 C 5 25, 3 26, 3 24 Z"/>
        <path d="M14 21 L 14 25 M 20 21 L 20 25 M 26 20 L 28 24 M 33 16 L 35 20"/>
      </svg>
      <span className="shoe-image__initials">{initials}</span>
    </div>
  );
}

function ReviewCard({ review, sortBy, showShoeHeader }) {
  const [expanded, setExpanded] = useState(false);
  const isDetailed = review.wordCount >= 200;

  return (
    <div className="review-card">
      {showShoeHeader && (
        <div className="review-card__shoe">
          {review.imageUrl
            ? <img className="shoe-image" src={review.imageUrl} alt={review.shoe} />
            : <ShoeImagePlaceholder shoe={review.shoe} />}
          <div className="review-card__shoe-text">
            <span className="review-card__shoe-brand">{review.brand}</span>
            <h3 className="review-card__shoe-name">{review.shoe}</h3>
          </div>
        </div>
      )}

      <div className="review-card__header">
        <div className="review-card__meta">
          <span className="review-card__author">{review.author}</span>
          <span className="review-card__sep">&middot;</span>
          <span className="review-card__sub">{review.subreddit}</span>
          <span className="review-card__sep">&middot;</span>
          <span className="review-card__date">{review.date}</span>
        </div>
        <span className={`review-card__badge ${isDetailed ? 'review-card__badge--detailed' : 'review-card__badge--short'}`}>
          {isDetailed ? 'DETAILED' : 'SHORT'}
        </span>
      </div>

      <div className="review-card__tags">
        {review.playstyle  && <span className="tag">{review.playstyle}</span>}
        {review.courtType  && <span className="tag">{review.courtType}</span>}
        {review.sizingNote && <span className="tag tag--sizing">{review.sizingNote}</span>}
      </div>

      <p className="review-card__summary">{review.summary}</p>

      <div className="review-card__verdict">
        Verdict: <span className="review-card__verdict-text">{review.verdict}</span>
      </div>

      <div className="review-card__footer">
        <a href={review.redditUrl} target="_blank" rel="noopener noreferrer" className="review-card__link">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          View on Reddit
        </a>
        <button className="review-card__expand" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Hide' : 'Read full'}
          <span className={`chevron ${expanded ? 'chevron--up' : ''}`}>&#9660;</span>
        </button>
      </div>

      {expanded && (
        <>
          <div className="review-card__body">
            <div className="review-card__ratings">
              {Object.entries(review.ratings).map(([key, val]) => (
                <RatingBar
                  key={key}
                  label={CATEGORY_LABELS[key] || key}
                  value={val}
                  highlighted={Boolean(CATEGORY_LABELS[sortBy]) && sortBy === key}
                  confidence={review.confidences?.[key] || 'high'}
                />
              ))}
            </div>
          </div>
          <div className="review-card__full-text">{review.fullText}</div>
        </>
      )}
    </div>
  );
}

function ShoeCard({ shoe, onOpen, onCompare, sortBy, rank }) {
  const vals = Object.values(shoe.avgRatings).filter(Boolean);
  const score = CATEGORY_LABELS[sortBy]
    ? (shoe.avgRatings[sortBy] || 0)
    : vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;

  const scoreColor = ratingColor(score);
  const ratingLabel = score >= 8.5 ? 'ELITE' : score >= 7.0 ? 'SOLID' : 'MEDIOCRE';
  const ratingClass = score >= 8.5 ? 'badge--elite' : score >= 7.0 ? 'badge--solid' : 'badge--mediocre';
  const amazonUrl = getAmazonUrl(shoe.name, shoe.sport);

  return (
    <div className="shoe-card" onClick={onOpen}>
      <div className="shoe-card__header">
        <div>
          <div className="shoe-card__brand">{shoe.brand}</div>
          <div className="shoe-card__name">{shoe.name}</div>
        </div>
        {rank && CATEGORY_LABELS[sortBy] && <div className="shoe-card__rank">#{rank}</div>}
      </div>

      <div className="shoe-card__score-row">
        <span className="shoe-card__score" style={{ color: scoreColor }}>{score.toFixed(1)}</span>
        <span className={`shoe-card__badge ${ratingClass}`}>{ratingLabel}</span>
      </div>

      {CATEGORY_LABELS[sortBy] && (
        <div className="shoe-card__trait-label">{CATEGORY_LABELS[sortBy]}</div>
      )}

      <div className="shoe-card__footer">
        <span className="shoe-card__review-count">
          {shoe.reviews.length} review{shoe.reviews.length !== 1 ? 's' : ''}
          {shoe.price ? ` · $${shoe.price}` : ''}
        </span>
        <div className="shoe-card__footer-actions">
          <a
            href={amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shoe-card__amazon"
            onClick={e => e.stopPropagation()}
            title="Find on Amazon"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Amazon
          </a>
          <button
            className="shoe-card__vs"
            onClick={e => { e.stopPropagation(); onCompare(shoe.name); }}
          >vs ↔</button>
        </div>
      </div>
    </div>
  );
}

function avgScore(shoe) {
  const vals = Object.values(shoe.avgRatings).filter(Boolean);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

function ScoreBadge({ score }) {
  const label = score >= 8.5 ? 'ELITE' : score >= 7.0 ? 'SOLID' : 'MEDIOCRE';
  const cls = score >= 8.5 ? 'badge--elite' : score >= 7.0 ? 'badge--solid' : 'badge--mediocre';
  return <span className={`shoe-card__badge ${cls}`}>{label}</span>;
}

function ShoeModal({ shoe, sortBy, onClose }) {
  const score = avgScore(shoe);
  const amazonUrl = getAmazonUrl(shoe.name, shoe.sport);
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <div className="modal__title-area">
            <div className="shoe-card__brand">{shoe.brand}</div>
            <h2 className="modal__name">{shoe.name}</h2>
            <div className="modal__score-row">
              <span className="modal__score" style={{ color: ratingColor(score) }}>{score.toFixed(1)}</span>
              <ScoreBadge score={score} />
              {shoe.price && <span className="modal__price">${shoe.price}</span>}
            </div>
          </div>
          <div className="modal__header-actions">
            <a href={amazonUrl} target="_blank" rel="noopener noreferrer" className="shoe-detail__amazon" onClick={e => e.stopPropagation()}>
              Find on Amazon
            </a>
            <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>
        <div className="modal__ratings">
          <h3 className="modal__section-label">Aggregate Ratings · {shoe.reviews.length} reviews</h3>
          <div className="modal__bars">
            {Object.entries(shoe.avgRatings).map(([key, val]) => {
              const highlights = val >= 8.8
                ? shoe.reviews
                    .filter(r => (r.ratings[key] || 0) > 0)
                    .sort((a, b) => (b.ratings[key] || 0) - (a.ratings[key] || 0))
                    .slice(0, 3)
                    .map(r => ({ author: r.author, subreddit: r.subreddit, rating: r.ratings[key], summary: extractTraitSentence(r.summary, key) }))
                    .filter(h => h.summary !== null)
                : null;
              return (
                <RatingBar key={key} label={CATEGORY_LABELS[key]||key} value={val}
                  highlighted={Boolean(CATEGORY_LABELS[sortBy]) && sortBy === key}
                  confidence={shoe.avgConfidences?.[key]||'high'}
                  highlights={highlights} />
              );
            })}
          </div>
        </div>
        <div className="modal__reviews">
          <h3 className="modal__section-label">All Reviews</h3>
          {shoe.reviews.map((review, i) => (
            <ReviewCard key={i} review={review} sortBy={sortBy} showShoeHeader={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ListRow({ shoe, rank, onOpen, onCompare, sortBy }) {
  const score = CATEGORY_LABELS[sortBy] ? (shoe.avgRatings[sortBy] || 0) : avgScore(shoe);
  return (
    <div className="list-row" onClick={() => onOpen(shoe.name)}>
      <span className="list-row__rank">#{rank}</span>
      <div className="list-row__shoe">
        <span className="shoe-card__brand" style={{display:'block'}}>{shoe.brand}</span>
        <span className="list-row__name">{shoe.name}</span>
      </div>
      <div className="list-row__score-area">
        <span className="list-row__score" style={{ color: ratingColor(score) }}>{score.toFixed(1)}</span>
        <ScoreBadge score={score} />
      </div>
      {shoe.price ? <span className="list-row__price">${shoe.price}</span> : <span className="list-row__price">—</span>}
      <span className="list-row__reviews">{shoe.reviews.length}r</span>
      <button className="list-row__vs" onClick={e => { e.stopPropagation(); onCompare(shoe.name); }}>vs ↔</button>
    </div>
  );
}

function SwipeView({ shoes, onOpen, onCompare }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowLeft') setIdx(x => Math.max(0, x - 1));
      if (e.key === 'ArrowRight') setIdx(x => Math.min(shoes.length - 1, x + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shoes.length]);
  if (!shoes.length) return <p className="empty-state">No shoes match your filters.</p>;
  const i = Math.min(idx, shoes.length - 1);
  const shoe = shoes[i];
  const score = avgScore(shoe);
  return (
    <div className="swipe-view">
      <button className="swipe-nav swipe-nav--prev" onClick={() => setIdx(x => Math.max(0, x - 1))} disabled={i === 0} aria-label="Previous">‹</button>
      <div className="swipe-card">
        <div className="swipe-card__counter">{i + 1} / {shoes.length} · ← → keys or buttons</div>
        <div className="shoe-card__brand">{shoe.brand}</div>
        <h2 className="swipe-card__name">{shoe.name}</h2>
        <div className="swipe-card__score-row">
          <span className="swipe-card__score" style={{ color: ratingColor(score) }}>{score.toFixed(1)}</span>
          <ScoreBadge score={score} />
          {shoe.price && <span className="swipe-card__price">${shoe.price}</span>}
        </div>
        <div className="swipe-card__bars">
          {Object.entries(shoe.avgRatings).map(([key, val]) => {
            const highlights = val >= 8.8
              ? shoe.reviews
                  .filter(r => (r.ratings[key] || 0) > 0)
                  .sort((a, b) => (b.ratings[key] || 0) - (a.ratings[key] || 0))
                  .slice(0, 3)
                  .map(r => ({ author: r.author, subreddit: r.subreddit, rating: r.ratings[key], summary: extractTraitSentence(r.summary, key) }))
              : null;
            return <RatingBar key={key} label={CATEGORY_LABELS[key]||key} value={val} highlights={highlights} />;
          })}
        </div>
        <div className="swipe-card__meta">{shoe.reviews.length} review{shoe.reviews.length !== 1 ? 's' : ''}</div>
        <div className="swipe-card__quotes">
          {shoe.reviews.slice(0, 2).map((r, qi) => (
            <blockquote key={qi} className="swipe-card__quote">
              <p>{r.summary?.slice(0, 140)}{r.summary?.length > 140 ? '…' : ''}</p>
              <cite>{r.author} · {r.subreddit}</cite>
            </blockquote>
          ))}
        </div>
        <div className="swipe-card__actions">
          <button className="swipe-card__btn-primary" onClick={() => onOpen(shoe.name)}>Read {shoe.reviews.length} reviews →</button>
          <button className="swipe-card__btn-ghost" onClick={() => onCompare(shoe.name)}>Compare ↔</button>
        </div>
      </div>
      <button className="swipe-nav swipe-nav--next" onClick={() => setIdx(x => Math.min(shoes.length - 1, x + 1))} disabled={i === shoes.length - 1} aria-label="Next">›</button>
      <div className="swipe-dots">
        {shoes.slice(0, 20).map((_, k) => (
          <button key={k} className={`swipe-dot ${k === i ? 'swipe-dot--active' : ''}`} onClick={() => setIdx(k)} aria-label={`Shoe ${k+1}`} />
        ))}
        {shoes.length > 20 && <span className="swipe-dots__more">+{shoes.length - 20}</span>}
      </div>
    </div>
  );
}

function CompareScreen({ allShoes, compareA, compareB, onSetCompare, onOpen }) {
  const shoeA = allShoes.find(s => s.name === compareA);
  const shoeB = allShoes.find(s => s.name === compareB);
  return (
    <div className="compare-screen">
      <div className="compare-screen__intro">
        <h2 className="section-title" style={{ fontFamily: 'var(--font-brand)', fontSize: '2rem' }}>Head to Head</h2>
        <p className="section-desc">Pick two shoes — trait winners are highlighted.</p>
      </div>
      <div className="compare-pickers">
        <div className="compare-picker">
          <label className="filters__label">Shoe A</label>
          <select className="filters__select" value={compareA || ''} onChange={e => onSetCompare('a', e.target.value || null)}>
            <option value="">— pick a shoe —</option>
            {allShoes.map(s => <option key={s.name} value={s.name}>{s.brand} · {s.name}{s.price ? ` · $${s.price}` : ''}</option>)}
          </select>
        </div>
        <div className="compare-vs-label">vs</div>
        <div className="compare-picker">
          <label className="filters__label">Shoe B</label>
          <select className="filters__select" value={compareB || ''} onChange={e => onSetCompare('b', e.target.value || null)}>
            <option value="">— pick a shoe —</option>
            {allShoes.map(s => <option key={s.name} value={s.name}>{s.brand} · {s.name}{s.price ? ` · $${s.price}` : ''}</option>)}
          </select>
        </div>
      </div>
      {shoeA && shoeB ? (
        <>
          <div className="compare-heads">
            {[shoeA, shoeB].map((shoe, si) => {
              const score = avgScore(shoe);
              return (
                <div key={shoe.name} className={`compare-head compare-head--${si === 0 ? 'a' : 'b'}`}>
                  <div className="shoe-card__brand">{shoe.brand}</div>
                  <h3 className="compare-head__name">{shoe.name}</h3>
                  <div className="compare-head__score-row">
                    <span className="compare-head__score" style={{ color: ratingColor(score) }}>{score.toFixed(1)}</span>
                    <ScoreBadge score={score} />
                  </div>
                  <div className="compare-head__meta">
                    {shoe.price ? `$${shoe.price} · ` : ''}{shoe.reviews.length} reviews
                  </div>
                  <button className="compare-head__open" onClick={() => onOpen(shoe.name)}>All reviews →</button>
                </div>
              );
            })}
          </div>
          <div className="compare-traits">
            <h3 className="section-title" style={{ marginBottom: '1rem' }}>Trait by Trait</h3>
            {Object.keys(CATEGORY_LABELS).map(key => {
              const va = shoeA.avgRatings[key] || 0;
              const vb = shoeB.avgRatings[key] || 0;
              if (!va && !vb) return null;
              const aWins = va > vb, bWins = vb > va;
              return (
                <div key={key} className="compare-row">
                  <div className={`compare-bar compare-bar--left ${aWins ? 'compare-bar--win' : ''}`}>
                    <span className="compare-bar__val">{va ? va.toFixed(1) : '—'}</span>
                    <div className="compare-bar__track"><div className="compare-bar__fill" style={{ width: `${va*10}%`, background: ratingColor(va) }}/></div>
                  </div>
                  <div className="compare-trait-label">{CATEGORY_LABELS[key]}</div>
                  <div className={`compare-bar compare-bar--right ${bWins ? 'compare-bar--win' : ''}`}>
                    <div className="compare-bar__track"><div className="compare-bar__fill" style={{ width: `${vb*10}%`, background: ratingColor(vb) }}/></div>
                    <span className="compare-bar__val">{vb ? vb.toFixed(1) : '—'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="empty-state" style={{ padding: '3rem' }}>Pick two shoes above to compare them side by side.</div>
      )}
    </div>
  );
}

function ScoringInfoModal({ onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="How scores work">
      <div className="modal modal--info" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <div className="modal__title-area">
            <h2 className="modal__name" style={{ fontSize: '1.5rem', marginBottom: '0.15rem' }}>How Scores Work</h2>
            <p className="section-desc" style={{ marginTop: 0 }}>How we turn Reddit reviews into numbers.</p>
          </div>
          <div className="modal__header-actions">
            <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>
        <div className="score-info-body">
          <div className="score-info-section">
            <div className="score-info-section__title">Overall Score</div>
            <p className="score-info-section__body">
              The overall score is a <strong>confidence-weighted average</strong> of all trait ratings across every review for a shoe. Each rating's weight depends on how directly the reviewer addressed that trait — a detailed hands-on assessment counts more than a passing mention.
            </p>
          </div>

          <div className="score-info-section">
            <div className="score-info-section__title">Trait Scores (0–10)</div>
            <p className="score-info-section__body">
              Each trait (Cushioning, Traction, Support, Fit, Ground Feel, Breathability, Durability, Value) is rated 0–10 by reading the review for explicit and implied signal. Confidence markers indicate how clearly a trait was covered:
            </p>
            <div className="score-info-conf">
              <div className="score-info-conf__item">
                <span className="score-info-conf__marker">—</span>
                <span><strong>High</strong> — directly and explicitly assessed by the reviewer (full weight)</span>
              </div>
              <div className="score-info-conf__item">
                <span className="score-info-conf__marker">~</span>
                <span><strong>Medium</strong> — mentioned in passing or implied (0.5× weight)</span>
              </div>
              <div className="score-info-conf__item">
                <span className="score-info-conf__marker">?</span>
                <span><strong>Low</strong> — barely touched; treat as a rough estimate (0.2× weight)</span>
              </div>
            </div>
          </div>

          <div className="score-info-section">
            <div className="score-info-section__title">Verdict Tiers</div>
            <div className="score-info-tiers">
              <div className="score-info-tier">
                <span className="shoe-card__badge badge--elite score-info-tier__badge">ELITE</span>
                <span>8.5 and above — genuinely top-tier; excels in its category</span>
              </div>
              <div className="score-info-tier">
                <span className="shoe-card__badge badge--solid score-info-tier__badge">SOLID</span>
                <span>7.0 – 8.4 — reliably good; recommended for most players</span>
              </div>
              <div className="score-info-tier">
                <span className="shoe-card__badge badge--mediocre score-info-tier__badge">MEDIOCRE</span>
                <span>Below 7.0 — average or below; notable weaknesses</span>
              </div>
            </div>
          </div>

          <div className="score-info-section">
            <div className="score-info-section__title">Review Sources</div>
            <p className="score-info-section__body">
              All reviews are sourced from real Reddit posts on <strong>r/BBallShoes</strong> (basketball) and running communities including <strong>r/RunningShoeGeeks</strong> and <strong>r/AskRunningShoeGeeks</strong>. Long posts are condensed for readability; short posts are reproduced closely. Every review links back to the original Reddit thread.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [sportFilter, setSportFilter]   = useState('all');
  const shoes  = useMemo(() => getShoes(sportFilter), [sportFilter]);
  const brands = useMemo(() => [...new Set(shoes.map(s => s.brand))].sort(), [shoes]);

  const [brandFilter,  setBrandFilter]  = useState('All');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [layout, setLayout] = useState('grid');
  const [screen, setScreen] = useState('browse');
  const [modalShoeName, setModalShoeName] = useState(null);
  const [sortBy, setSortBy] = useState('overall');
  const [maxPrice, setMaxPrice] = useState(250);
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);
  const [showScoringInfo, setShowScoringInfo] = useState(false);

  useEffect(() => {
    setBrandFilter('All');
    setSearchQuery('');
    setMaxPrice(250);
  }, [sportFilter]);

  const filteredShoes = useMemo(() => {
    let result = shoes.filter(s => {
      if (brandFilter !== 'All' && s.brand !== brandFilter) return false;
      if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (s.price && maxPrice < 250 && s.price > maxPrice) return false;
      return true;
    });
    return [...result].sort((a, b) => {
      if (sortBy === 'price-low') return (a.price || 9999) - (b.price || 9999);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'recent') {
        const la = Math.max(...a.reviews.map(r => new Date(r.date)));
        const lb = Math.max(...b.reviews.map(r => new Date(r.date)));
        return lb - la;
      }
      if (CATEGORY_LABELS[sortBy]) return (b.avgRatings[sortBy] || 0) - (a.avgRatings[sortBy] || 0);
      const va = Object.values(a.avgRatings).filter(Boolean);
      const vb = Object.values(b.avgRatings).filter(Boolean);
      const sa = va.length ? va.reduce((x,y)=>x+y,0)/va.length : 0;
      const sb = vb.length ? vb.reduce((x,y)=>x+y,0)/vb.length : 0;
      return sb - sa;
    });
  }, [shoes, brandFilter, searchQuery, sortBy, maxPrice]);

  const filteredReviews = useMemo(() => {
    let r = reviews.filter(rv => sportFilter === 'all' || rv.sport === sportFilter);
    r = r.filter(rv => {
      if (brandFilter !== 'All' && rv.brand !== brandFilter) return false;
      if (searchQuery && !rv.shoe.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
    if (CATEGORY_LABELS[sortBy]) r = [...r].sort((a, b) => (b.ratings[sortBy]||0) - (a.ratings[sortBy]||0));
    return r;
  }, [brandFilter, searchQuery, sortBy, sportFilter]);

  const modalShoe = modalShoeName ? shoes.find(s => s.name === modalShoeName) : null;

  const totalReviews = sportFilter === 'all'
    ? reviews.length
    : reviews.filter(r => r.sport === sportFilter).length;

  function handleCompare(shoeName) {
    if (!compareA || compareA === shoeName) {
      setCompareA(shoeName);
      setCompareB(prev => prev === shoeName ? null : prev);
    } else {
      setCompareB(shoeName);
    }
    setScreen('compare');
  }

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav__inner">
          <div className="nav__brand">
            <span className="nav__wordmark">Court Report</span>
            <span className="nav__tag">Reddit Reviews</span>
          </div>
          <div className="nav__tabs">
            <button className={`nav__tab ${screen === 'browse' ? 'nav__tab--active' : ''}`} onClick={() => setScreen('browse')}>Browse</button>
            <button className={`nav__tab ${screen === 'compare' ? 'nav__tab--active' : ''}`} onClick={() => setScreen('compare')}>Versus</button>
          </div>
          <div className="nav__stats">
            <span>{shoes.length} shoes</span>
            <span className="nav__dot" aria-hidden="true">·</span>
            <span>{totalReviews} reviews</span>
            <span className="nav__dot" aria-hidden="true">·</span>
            <span>{brands.length} brands</span>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero__inner">
          <p className="hero__sub">Real user reviews from Reddit, condensed and rated.</p>
        </div>
      </section>

      <main className="main">
        {screen === 'browse' ? (
          <>
            <section className="filters">
              <div className="filters__row">
                <span className="filters__label">Sport</span>
                <div className="filters__pills">
                  {SPORT_FILTERS.map(sf => (
                    <button
                      key={sf.key}
                      className={`pill ${sportFilter === sf.key ? 'pill--active' : ''}`}
                      onClick={() => setSportFilter(sf.key)}
                    >
                      {sf.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filters__row">
                <input
                  type="text"
                  placeholder="Search shoes..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="filters__input"
                />
              </div>

              <div className="filters__row">
                <span className="filters__label">Brand</span>
                <div className="filters__pills">
                  <button
                    className={`pill ${brandFilter === 'All' ? 'pill--active' : ''}`}
                    onClick={() => setBrandFilter('All')}
                  >All</button>
                  {brands.map(brand => (
                    <button
                      key={brand}
                      className={`pill ${brandFilter === brand ? 'pill--active' : ''}`}
                      onClick={() => setBrandFilter(brand)}
                    >{brand}</button>
                  ))}
                </div>
              </div>

              <div className="filters__row">
                <span className="filters__label">View</span>
                <div className="layout-toggle">
                  <button className={`layout-btn ${layout === 'list' ? 'layout-btn--active' : ''}`} onClick={() => setLayout('list')}>≡ List</button>
                  <button className={`layout-btn ${layout === 'grid' ? 'layout-btn--active' : ''}`} onClick={() => setLayout('grid')}>▦ Grid</button>
                  <button className={`layout-btn ${layout === 'swipe' ? 'layout-btn--active' : ''}`} onClick={() => setLayout('swipe')}>↔ Swipe</button>
                </div>
              </div>

              <div className="filters__row">
                <span className="filters__label">Max price</span>
                <input type="range" min="80" max="250" step="10" value={maxPrice}
                  onChange={e => setMaxPrice(+e.target.value)} className="price-slider" />
                <span className="price-slider__val">${maxPrice}{maxPrice >= 250 ? '+' : ''}</span>
              </div>

              <div className="filters__row">
                <span className="filters__label">Sort by</span>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="filters__select">
                  <option value="overall">Overall score</option>
                  <option value="price-low">Price ↑ low to high</option>
                  <option value="price-high">Price ↓ high to low</option>
                  <option value="recent">Most recent</option>
                  <optgroup label="By trait">
                    {Object.entries(CATEGORY_LABELS).map(([k,l]) => <option key={k} value={k}>{l}</option>)}
                  </optgroup>
                </select>
                <button
                  className="info-btn"
                  onClick={() => setShowScoringInfo(true)}
                  aria-label="How scores are calculated"
                  title="How scores are calculated"
                >ⓘ</button>
              </div>
            </section>

            <section className="shoe-layout-section">
              {layout === 'list' && (
                <div className="list-view">
                  <div className="list-header">
                    <span>#</span><span>Shoe</span><span>Score</span><span>Price</span><span>Reviews</span><span></span>
                  </div>
                  {filteredShoes.map((shoe, i) => (
                    <ListRow key={shoe.name} shoe={shoe} rank={i+1} onOpen={shoeName => setModalShoeName(shoeName)} onCompare={handleCompare} sortBy={sortBy} />
                  ))}
                  {filteredShoes.length === 0 && <p className="empty-state">No shoes match your filters.</p>}
                </div>
              )}
              {layout === 'grid' && (
                <div className="shoe-grid">
                  {filteredShoes.map((shoe, i) => (
                    <ShoeCard
                      key={shoe.name}
                      shoe={shoe}
                      onOpen={() => setModalShoeName(shoe.name)}
                      onCompare={handleCompare}
                      sortBy={sortBy}
                      rank={CATEGORY_LABELS[sortBy] ? i + 1 : null}
                    />
                  ))}
                  {filteredShoes.length === 0 && <p className="empty-state">No shoes match your filters.</p>}
                </div>
              )}
              {layout === 'swipe' && (
                <SwipeView shoes={filteredShoes} onOpen={shoeName => setModalShoeName(shoeName)} onCompare={handleCompare} />
              )}
            </section>

            <section className="reviews-section">
              <div className="reviews-section__header">
                <h2 className="section-title">
                  {CATEGORY_LABELS[sortBy] ? `Top by ${CATEGORY_LABELS[sortBy]}` : 'All Reviews'}
                </h2>
                <p className="section-desc">
                  {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}
                  {brandFilter !== 'All' ? ` · ${brandFilter}` : ''}
                  {CATEGORY_LABELS[sortBy] ? ` · sorted by ${CATEGORY_LABELS[sortBy]}` : ''}
                </p>
              </div>
              <div className="reviews-grid">
                {filteredReviews.map((review, i) => (
                  <ReviewCard
                    key={`${review.author}-${review.shoe}-${i}`}
                    review={review}
                    sortBy={sortBy}
                    showShoeHeader={true}
                  />
                ))}
              </div>
            </section>
          </>
        ) : (
          <CompareScreen
            allShoes={shoes}
            compareA={compareA}
            compareB={compareB}
            onSetCompare={(slot, val) => slot === 'a' ? setCompareA(val) : setCompareB(val)}
            onOpen={shoeName => setModalShoeName(shoeName)}
          />
        )}
      </main>

      <footer className="footer">
        <p>
          Court Report &middot; Data from{' '}
          <a href="https://www.reddit.com/r/BBallShoes" target="_blank" rel="noopener noreferrer">r/BBallShoes</a>
          {' '}&amp;{' '}
          <a href="https://www.reddit.com/r/running_shoes" target="_blank" rel="noopener noreferrer">r/running_shoes</a>
          {' '}&middot; Community reviews, condensed
        </p>
      </footer>

      {modalShoe && <ShoeModal shoe={modalShoe} sortBy={sortBy} onClose={() => setModalShoeName(null)} />}
      {showScoringInfo && <ScoringInfoModal onClose={() => setShowScoringInfo(false)} />}
    </div>
  );
}
