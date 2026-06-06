'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RatingBar from './RatingBar';
import ScoreBadge from './ScoreBadge';
import { CATEGORY_LABELS, avgScore, buildHighlights, ratingColor, formatPrice } from './constants';

export default function SwipeView({ shoes, onOpen, onCompare }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(0);
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowLeft') { setDir(-1); setIdx(x => Math.max(0, x - 1)); }
      if (e.key === 'ArrowRight') { setDir(1); setIdx(x => Math.min(shoes.length - 1, x + 1)); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shoes.length]);
  if (!shoes.length) return <p className="empty-state">No shoes match your filters.</p>;
  const i = Math.min(idx, shoes.length - 1);
  const shoe = shoes[i];
  const score = avgScore(shoe);
  const goPrev = () => { setDir(-1); setIdx(x => Math.max(0, x - 1)); };
  const goNext = () => { setDir(1); setIdx(x => Math.min(shoes.length - 1, x + 1)); };
  return (
    <div className="swipe-view">
      <button className="swipe-nav swipe-nav--prev" onClick={goPrev} disabled={i === 0} aria-label="Previous">‹</button>
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={shoe.name}
          className="swipe-card"
          custom={dir}
          initial={{ opacity: 0, x: dir >= 0 ? 60 : -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir >= 0 ? -60 : 60 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="swipe-card__counter">{i + 1} / {shoes.length} · ← → keys or buttons</div>
          {shoe.imageUrl && (
            <button
              type="button"
              className="swipe-card__image-wrap"
              onClick={() => onOpen(shoe.name)}
              title="View details"
              aria-label={`View ${shoe.name} details`}
            >
              <img src={shoe.imageUrl} alt={shoe.name} className="swipe-card__img" />
            </button>
          )}
          <div className="shoe-card__brand">{shoe.brand}</div>
          <h2 className="swipe-card__name">{shoe.name}</h2>
          <div className="swipe-card__score-row">
            <span className="swipe-card__score" style={{ color: ratingColor(score) }}>{score.toFixed(1)}</span>
            <ScoreBadge score={score} />
            {shoe.price && <span className="swipe-card__price">{formatPrice(shoe.price, shoe.priceApprox)}</span>}
          </div>
          <div className="swipe-card__bars">
            {Object.entries(shoe.avgRatings).map(([key, val]) => {
              const highlights = buildHighlights(shoe, key, val);
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
        </motion.div>
      </AnimatePresence>
      <button className="swipe-nav swipe-nav--next" onClick={goNext} disabled={i === shoes.length - 1} aria-label="Next">›</button>
      <div className="swipe-dots">
        {shoes.slice(0, 20).map((_, k) => (
          <button key={k} className={`swipe-dot ${k === i ? 'swipe-dot--active' : ''}`} onClick={() => { setDir(k > i ? 1 : -1); setIdx(k); }} aria-label={`Shoe ${k+1}`} />
        ))}
        {shoes.length > 20 && <span className="swipe-dots__more">+{shoes.length - 20}</span>}
      </div>
    </div>
  );
}
