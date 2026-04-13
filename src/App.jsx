import { useState, useMemo } from 'react';
import { reviews, getShoes } from './data/reviews';
import './App.css';

const CATEGORY_LABELS = {
  cushioning: "Cushioning",
  traction: "Traction",
  support: "Support",
  fit: "Fit",
  breathability: "Breathability",
  courtFeel: "Court Feel",
  durability: "Durability",
  value: "Value"
};

function RatingBar({ label, value, max = 10 }) {
  const pct = (value / max) * 100;
  const color = value >= 9 ? 'var(--accent-green)' : value >= 7.5 ? 'var(--accent-amber)' : value >= 6 ? 'var(--accent-orange)' : 'var(--accent-red)';

  return (
    <div className="rating-bar">
      <div className="rating-bar__label">
        <span>{label}</span>
        <span className="rating-bar__value" style={{ color }}>{value.toFixed(1)}</span>
      </div>
      <div className="rating-bar__track">
        <div className="rating-bar__fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const isDetailed = review.wordCount >= 200;
  const sections = review.fullText.split(/\n\n+/).filter(s => s.trim());

  return (
    <div className="review-card">
      <div className="review-card__header">
        <div className="review-card__meta">
          <span className="review-card__author">{review.author}</span>
          <span className="review-card__sep">&middot;</span>
          <span className="review-card__sub">r/BBallShoes</span>
          <span className="review-card__sep">&middot;</span>
          <span className="review-card__date">{review.date}</span>
        </div>
        <span className={`review-card__badge ${isDetailed ? 'review-card__badge--detailed' : 'review-card__badge--short'}`}>
          {isDetailed ? 'DETAILED REVIEW' : 'SHORT REVIEW — LESS WEIGHT'}
        </span>
      </div>

      <div className="review-card__tags">
        {review.playstyle && <span className="tag">{review.playstyle}</span>}
        {review.courtType && <span className="tag">{review.courtType}</span>}
        {review.sizingNote && <span className="tag tag--sizing">Sizing: {review.sizingNote}</span>}
      </div>

      <p className="review-card__summary">{review.summary}</p>

      <div className="review-card__verdict">
        VERDICT: <span className="review-card__verdict-text">{review.verdict.toUpperCase()}</span>
      </div>

      <a
        href={review.redditUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="review-card__reddit-link"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        View original post on Reddit
      </a>

      <div className="review-card__ratings">
        {Object.entries(review.ratings).map(([key, val]) => (
          <RatingBar key={key} label={CATEGORY_LABELS[key] || key} value={val} />
        ))}
      </div>

      <button
        className="review-card__expand"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Hide full review' : `Read full review (${sections.length} section${sections.length !== 1 ? 's' : ''})`}
        <span className={`review-card__chevron ${expanded ? 'review-card__chevron--up' : ''}`}>&#9660;</span>
      </button>

      {expanded && (
        <div className="review-card__full-text">
          {review.fullText}
        </div>
      )}
    </div>
  );
}

function ShoeCard({ shoe, isActive, onClick }) {
  const overallAvg = Object.values(shoe.avgRatings).reduce((a, b) => a + b, 0) / Object.values(shoe.avgRatings).length;
  const scoreColor = overallAvg >= 8.5 ? 'var(--accent-green)' : overallAvg >= 7 ? 'var(--accent-amber)' : 'var(--accent-orange)';

  return (
    <button className={`shoe-card ${isActive ? 'shoe-card--active' : ''}`} onClick={onClick}>
      <div className="shoe-card__brand">{shoe.brand}</div>
      <div className="shoe-card__name">{shoe.name}</div>
      <div className="shoe-card__stats">
        <span className="shoe-card__score" style={{ color: scoreColor }}>{overallAvg.toFixed(1)}</span>
        <span className="shoe-card__review-count">{shoe.reviews.length} review{shoe.reviews.length !== 1 ? 's' : ''}</span>
      </div>
    </button>
  );
}

export default function App() {
  const shoes = useMemo(() => getShoes(), []);
  const brands = useMemo(() => [...new Set(shoes.map(s => s.brand))].sort(), [shoes]);

  const [selectedShoe, setSelectedShoe] = useState(null);
  const [brandFilter, setBrandFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShoes = useMemo(() => {
    return shoes.filter(s => {
      if (brandFilter !== 'All' && s.brand !== brandFilter) return false;
      if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [shoes, brandFilter, searchQuery]);

  const activeShoe = selectedShoe ? shoes.find(s => s.name === selectedShoe) : null;

  return (
    <div className="app">
      {/* Ambient glow */}
      <div className="ambient-glow ambient-glow--top" />
      <div className="ambient-glow ambient-glow--bottom" />

      <header className="header">
        <div className="header__inner">
          <div className="header__brand">
            <h1 className="header__title">COURT REPORT</h1>
            <p className="header__subtitle">Real reviews from r/BBallShoes, condensed.</p>
          </div>
          <div className="header__stats">
            <div className="stat">
              <span className="stat__number">{shoes.length}</span>
              <span className="stat__label">Shoes</span>
            </div>
            <div className="stat">
              <span className="stat__number">{reviews.length}</span>
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
          <div className="filters__search">
            <input
              type="text"
              placeholder="Search shoes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="filters__input"
            />
          </div>
          <div className="filters__brands">
            <button
              className={`brand-btn ${brandFilter === 'All' ? 'brand-btn--active' : ''}`}
              onClick={() => setBrandFilter('All')}
            >
              All
            </button>
            {brands.map(brand => (
              <button
                key={brand}
                className={`brand-btn ${brandFilter === brand ? 'brand-btn--active' : ''}`}
                onClick={() => setBrandFilter(brand)}
              >
                {brand}
              </button>
            ))}
          </div>
        </section>

        <div className="content-layout">
          {/* Shoe list sidebar */}
          <aside className="shoe-list">
            <h2 className="section-title">SHOES</h2>
            {filteredShoes.length === 0 && (
              <p className="empty-state">No shoes match your filters.</p>
            )}
            {filteredShoes.map(shoe => (
              <ShoeCard
                key={shoe.name}
                shoe={shoe}
                isActive={selectedShoe === shoe.name}
                onClick={() => setSelectedShoe(selectedShoe === shoe.name ? null : shoe.name)}
              />
            ))}
          </aside>

          {/* Reviews panel */}
          <section className="reviews-panel">
            {activeShoe ? (
              <>
                <div className="shoe-detail-header">
                  <div>
                    <span className="shoe-detail-header__brand">{activeShoe.brand}</span>
                    <h2 className="shoe-detail-header__name">{activeShoe.name}</h2>
                  </div>
                  <div className="shoe-detail-header__avg-ratings">
                    {Object.entries(activeShoe.avgRatings).map(([key, val]) => (
                      <RatingBar key={key} label={CATEGORY_LABELS[key] || key} value={val} />
                    ))}
                  </div>
                </div>
                <h3 className="section-title reviews-title">
                  {activeShoe.reviews.length} REVIEW{activeShoe.reviews.length !== 1 ? 'S' : ''}
                </h3>
                {activeShoe.reviews.map((review, i) => (
                  <ReviewCard key={`${review.author}-${i}`} review={review} />
                ))}
              </>
            ) : (
              <>
                <h2 className="section-title">ALL REVIEWS</h2>
                <p className="section-desc">Select a shoe to filter, or browse all {reviews.length} reviews below.</p>
                {(brandFilter !== 'All' || searchQuery ?
                  reviews.filter(r => {
                    if (brandFilter !== 'All' && r.brand !== brandFilter) return false;
                    if (searchQuery && !r.shoe.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                    return true;
                  }) : reviews
                ).map((review, i) => (
                  <ReviewCard key={`${review.author}-${review.shoe}-${i}`} review={review} />
                ))}
              </>
            )}
          </section>
        </div>
      </main>

      <footer className="footer">
        <p>COURT REPORT &middot; Data sourced from <a href="https://www.reddit.com/r/BBallShoes" target="_blank" rel="noopener noreferrer">r/BBallShoes</a> &middot; Last 14 days</p>
      </footer>
    </div>
  );
}
