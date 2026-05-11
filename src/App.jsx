import { useState, useMemo, useRef, useEffect } from 'react';
import { reviews, getShoes, getAmazonUrl } from './data/reviews';
import './App.css';

const CATEGORY_LABELS = {
  cushioning: "Cushioning",
  traction: "Traction",
  support: "Support",
  fit: "Fit",
  breathability: "Breathability",
  groundFeel: "Ground Feel",
  durability: "Durability",
  value: "Value"
};

const CATEGORY_ICONS = {
  cushioning: "☁️",
  traction: "🧲",
  support: "🛡️",
  fit: "🧤",
  breathability: "💨",
  groundFeel: "👣",
  durability: "⚙️",
  value: "💰"
};

const CONFIDENCE_LABELS = {
  high:   { marker: '',  title: 'High confidence — directly assessed by the reviewer' },
  medium: { marker: '~', title: 'Medium confidence — implied or indirectly mentioned' },
  low:    { marker: '?', title: 'Low confidence — not meaningfully discussed; best-guess only' }
};

const SPORT_FILTERS = [
  { key: 'all',        label: 'All Sports' },
  { key: 'basketball', label: '🏀 Basketball' },
  { key: 'running',    label: '🏃 Running' },
];

function RatingBar({ label, value, max = 10, highlighted = false, confidence = 'high' }) {
  if (!value) return null;
  const pct = (value / max) * 100;
  const color = value >= 9 ? 'var(--accent-green)' : value >= 7.5 ? 'var(--accent-warm)' : value >= 6 ? 'var(--accent-primary)' : 'var(--accent-red)';
  const conf = CONFIDENCE_LABELS[confidence] || CONFIDENCE_LABELS.high;

  return (
    <div
      className={`rating-bar rating-bar--conf-${confidence} ${highlighted ? 'rating-bar--highlighted' : ''}`}
      title={conf.title}
    >
      <div className="rating-bar__label">
        <span>{label}</span>
        <span className="rating-bar__value" style={{ color }}>
          {conf.marker && <span className="rating-bar__conf-marker">{conf.marker}</span>}
          {value.toFixed(1)}
        </span>
      </div>
      <div className="rating-bar__track">
        <div className="rating-bar__fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function ShoeImagePlaceholder({ shoe, brand }) {
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

function ReviewCard({ review, traitFilter, showShoeHeader }) {
  const [expanded, setExpanded] = useState(false);
  const isDetailed = review.wordCount >= 200;

  return (
    <div className="review-card">
      {showShoeHeader && (
        <div className="review-card__shoe">
          {review.imageUrl
            ? <img className="shoe-image" src={review.imageUrl} alt={review.shoe} />
            : <ShoeImagePlaceholder shoe={review.shoe} brand={review.brand} />}
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
          {isDetailed ? 'DETAILED REVIEW' : 'SHORT REVIEW'}
        </span>
      </div>

      <div className="review-card__tags">
        {review.playstyle && <span className="tag">{review.playstyle}</span>}
        {review.courtType && <span className="tag">{review.courtType}</span>}
        {review.sizingNote && <span className="tag tag--sizing">{review.sizingNote}</span>}
      </div>

      <p className="review-card__summary">{review.summary}</p>

      <div className="review-card__verdict">
        Verdict: <span className="review-card__verdict-text">{review.verdict}</span>
      </div>

      <div className="review-card__actions">
        <a href={review.redditUrl} target="_blank" rel="noopener noreferrer" className="review-card__link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          View on Reddit
        </a>
      </div>

      <div className="review-card__ratings">
        {Object.entries(review.ratings).map(([key, val]) => (
          <RatingBar
            key={key}
            label={CATEGORY_LABELS[key] || key}
            value={val}
            highlighted={traitFilter === key}
            confidence={review.confidences?.[key] || 'high'}
          />
        ))}
      </div>

      <button className="review-card__expand" onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Hide full review' : 'Read full review'}
        <span className={`chevron ${expanded ? 'chevron--up' : ''}`}>&#9660;</span>
      </button>

      {expanded && <div className="review-card__full-text">{review.fullText}</div>}
    </div>
  );
}

function ShoeCard({ shoe, isActive, onClick, traitFilter, rank }) {
  const score = traitFilter ? (shoe.avgRatings[traitFilter] || 0) : Object.values(shoe.avgRatings).filter(Boolean).reduce((a, b) => a + b, 0) / Object.values(shoe.avgRatings).filter(Boolean).length;
  const scoreColor = score >= 9 ? 'var(--accent-green)' : score >= 7.5 ? 'var(--accent-warm)' : 'var(--accent-primary)';
  const amazonUrl = getAmazonUrl(shoe.name, shoe.sport);

  return (
    <div className={`shoe-card ${isActive ? 'shoe-card--active' : ''}`} onClick={onClick}>
      {rank && traitFilter && <div className="shoe-card__rank">#{rank}</div>}
      <div className="shoe-card__brand">{shoe.brand}</div>
      <div className="shoe-card__name">{shoe.name}</div>
      <div className="shoe-card__bottom">
        <div className="shoe-card__score-area">
          <span className="shoe-card__score" style={{ color: scoreColor }}>{score.toFixed(1)}</span>
          {traitFilter && <span className="shoe-card__trait-label">{CATEGORY_LABELS[traitFilter]}</span>}
        </div>
        <div className="shoe-card__meta-row">
          <span className="shoe-card__review-count">{shoe.reviews.length} review{shoe.reviews.length !== 1 ? 's' : ''}</span>
          <a href={amazonUrl} target="_blank" rel="noopener noreferrer" className="shoe-card__amazon" onClick={e => e.stopPropagation()} title="Find on Amazon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [sportFilter, setSportFilter] = useState('all');
  const shoes = useMemo(() => getShoes(sportFilter), [sportFilter]);
  const brands = useMemo(() => [...new Set(shoes.map(s => s.brand))].sort(), [shoes]);
  const stripRef = useRef(null);

  const [selectedShoe, setSelectedShoe] = useState(null);
  const [brandFilter, setBrandFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [traitFilter, setTraitFilter] = useState(null);

  // Reset dependent filters when sport changes
  useEffect(() => {
    setSelectedShoe(null);
    setBrandFilter('All');
    setSearchQuery('');
  }, [sportFilter]);

  const filteredShoes = useMemo(() => {
    let result = shoes.filter(s => {
      if (brandFilter !== 'All' && s.brand !== brandFilter) return false;
      if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
    if (traitFilter) {
      result = [...result].sort((a, b) => (b.avgRatings[traitFilter] || 0) - (a.avgRatings[traitFilter] || 0));
    }
    return result;
  }, [shoes, brandFilter, searchQuery, traitFilter]);

  const activeShoe = selectedShoe ? shoes.find(s => s.name === selectedShoe) : null;

  const filteredReviews = useMemo(() => {
    let r = activeShoe ? activeShoe.reviews : reviews.filter(rv => sportFilter === 'all' || rv.sport === sportFilter);
    if (!activeShoe) {
      r = r.filter(rv => {
        if (brandFilter !== 'All' && rv.brand !== brandFilter) return false;
        if (searchQuery && !rv.shoe.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      });
    }
    if (traitFilter) {
      r = [...r].sort((a, b) => (b.ratings[traitFilter] || 0) - (a.ratings[traitFilter] || 0));
    }
    return r;
  }, [activeShoe, brandFilter, searchQuery, traitFilter, sportFilter]);

  const totalReviews = sportFilter === 'all' ? reviews.length : reviews.filter(r => r.sport === sportFilter).length;

  // Scroll shoe strip to show selected shoe
  useEffect(() => {
    if (selectedShoe && stripRef.current) {
      const activeEl = stripRef.current.querySelector('.shoe-card--active');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedShoe]);

  return (
    <div className="app">
      <div className="ambient-glow ambient-glow--top" />
      <div className="ambient-glow ambient-glow--right" />

      <header className="header">
        <div className="header__inner">
          <div className="header__brand">
            <h1 className="header__title">Court Report</h1>
            <p className="header__subtitle">Real user reviews from Reddit, condensed and rated.</p>
          </div>
          <div className="header__stats">
            <div className="stat">
              <span className="stat__number">{shoes.length}</span>
              <span className="stat__label">Shoes</span>
            </div>
            <div className="stat">
              <span className="stat__number">{totalReviews}</span>
              <span className="stat__label">Reviews</span>
            </div>
            <div className="stat">
              <span className="stat__number">{brands.length}</span>
              <span className="stat__label">Brands</span>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        {/* Filters */}
        <section className="filters">
          {/* Sport filter */}
          <div className="filters__row">
            <span className="filters__label">Sport</span>
            <div className="filters__pills">
              {SPORT_FILTERS.map(sf => (
                <button
                  key={sf.key}
                  className={`pill pill--sport ${sportFilter === sf.key ? 'pill--active' : ''}`}
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
              onChange={e => { setSearchQuery(e.target.value); setSelectedShoe(null); }}
              className="filters__input"
            />
          </div>

          <div className="filters__row">
            <span className="filters__label">Brand</span>
            <div className="filters__pills">
              <button className={`pill ${brandFilter === 'All' ? 'pill--active' : ''}`} onClick={() => { setBrandFilter('All'); setSelectedShoe(null); }}>All</button>
              {brands.map(brand => (
                <button key={brand} className={`pill ${brandFilter === brand ? 'pill--active' : ''}`} onClick={() => { setBrandFilter(brand); setSelectedShoe(null); }}>{brand}</button>
              ))}
            </div>
          </div>

          <div className="filters__row">
            <span className="filters__label">Sort by trait</span>
            <div className="filters__pills">
              <button className={`pill pill--trait ${!traitFilter ? 'pill--active' : ''}`} onClick={() => setTraitFilter(null)}>Overall</button>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <button key={key} className={`pill pill--trait ${traitFilter === key ? 'pill--active' : ''}`} onClick={() => setTraitFilter(key)}>
                  <span className="pill__icon">{CATEGORY_ICONS[key]}</span> {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Horizontal shoe strip */}
        <section className="shoe-strip-wrapper">
          <div className="shoe-strip" ref={stripRef}>
            {filteredShoes.map((shoe, i) => (
              <ShoeCard
                key={shoe.name}
                shoe={shoe}
                isActive={selectedShoe === shoe.name}
                onClick={() => setSelectedShoe(selectedShoe === shoe.name ? null : shoe.name)}
                traitFilter={traitFilter}
                rank={traitFilter ? i + 1 : null}
              />
            ))}
            {filteredShoes.length === 0 && <p className="empty-state">No shoes match your filters.</p>}
          </div>
          <div className="shoe-strip__fade shoe-strip__fade--left" />
          <div className="shoe-strip__fade shoe-strip__fade--right" />
        </section>

        {/* Active shoe detail header */}
        {activeShoe && (
          <section className="shoe-detail">
            <div className="shoe-detail__top">
              <div>
                <span className="shoe-detail__brand">{activeShoe.brand}</span>
                <h2 className="shoe-detail__name">{activeShoe.name}</h2>
                <span className="shoe-detail__count">{activeShoe.reviews.length} review{activeShoe.reviews.length !== 1 ? 's' : ''}</span>
              </div>
              <a href={getAmazonUrl(activeShoe.name, activeShoe.sport)} target="_blank" rel="noopener noreferrer" className="shoe-detail__amazon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                Find on Amazon
              </a>
            </div>
            <div className="shoe-detail__ratings">
              {Object.entries(activeShoe.avgRatings).map(([key, val]) => (
                <RatingBar
                  key={key}
                  label={CATEGORY_LABELS[key] || key}
                  value={val}
                  highlighted={traitFilter === key}
                  confidence={activeShoe.avgConfidences?.[key] || 'high'}
                />
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <section className="reviews-section">
          {!activeShoe && (
            <div className="reviews-section__header">
              <h2 className="section-title">
                {traitFilter ? `Top shoes by ${CATEGORY_LABELS[traitFilter]}` : 'All Reviews'}
              </h2>
              <p className="section-desc">
                {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''} {brandFilter !== 'All' ? `from ${brandFilter}` : ''} {traitFilter ? `sorted by ${CATEGORY_LABELS[traitFilter]}` : ''}
              </p>
            </div>
          )}

          <div className="reviews-grid">
            {filteredReviews.map((review, i) => (
              <ReviewCard key={`${review.author}-${review.shoe}-${i}`} review={review} traitFilter={traitFilter} showShoeHeader={!activeShoe} />
            ))}
          </div>
        </section>
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
    </div>
  );
}
