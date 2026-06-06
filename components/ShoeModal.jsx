'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RatingBar from './RatingBar';
import ReviewCard from './ReviewCard';
import ScoreBadge from './ScoreBadge';
import { getAmazonUrl, isAmazonLink } from '../src/data/reviews';
import { CATEGORY_LABELS, avgScore, buildHighlights, ratingColor } from './constants';

export default function ShoeModal({ shoe, sortBy, onClose }) {
  const score = avgScore(shoe);
  const shoeUrl = getAmazonUrl(shoe.name, shoe.sport);
  const isAmazon = isAmazonLink(shoeUrl);
  const [zoomed, setZoomed] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  useEffect(() => {
    const onKey = e => {
      if (e.key !== 'Escape') return;
      // Esc closes the zoom lightbox first, then the modal.
      setZoomed(z => { if (z) return false; onClose(); return z; });
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
      >
        <motion.div
          className="modal"
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        >
          <div className="modal__header">
            <div className="modal__title-area">
              <div className="shoe-card__brand">{shoe.brand}</div>
              <h2 className="modal__name">{shoe.name}</h2>
              <div className="modal__score-row">
                <span className="modal__score" style={{ color: ratingColor(score) }}>{score.toFixed(1)}</span>
                <ScoreBadge score={score} />
                {shoe.price && <span className="modal__price">{shoe.priceApprox ? '~' : ''}${shoe.price}</span>}
              </div>
            </div>
            <div className="modal__header-actions">
              <a href={shoeUrl} target="_blank" rel="noopener noreferrer" className="shoe-detail__amazon" onClick={e => e.stopPropagation()}>
                {isAmazon ? 'Find on Amazon' : 'See Price'}
              </a>
              <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>
            </div>
          </div>
          {shoe.imageUrl && (
            <button
              type="button"
              className="modal__image-banner"
              onClick={() => setZoomed(true)}
              title="Click to enlarge"
              aria-label={`Enlarge ${shoe.name} image`}
            >
              <img src={shoe.imageUrl} alt={shoe.name} className="modal__image" />
              <span className="modal__image-zoom" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </span>
            </button>
          )}
          <div className="modal__ratings">
            <h3 className="modal__section-label">Aggregate Ratings · {shoe.reviews.length} reviews</h3>
            <div className="modal__bars">
              {Object.entries(shoe.avgRatings).map(([key, val]) => {
                const highlights = buildHighlights(shoe, key, val);
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
            <button
              type="button"
              className="modal__reviews-toggle"
              onClick={() => setShowReviews(v => !v)}
              aria-expanded={showReviews}
            >
              <span className="modal__section-label">All Reviews ({shoe.reviews.length})</span>
              <span className="modal__reviews-chevron" aria-hidden="true">{showReviews ? '▾' : '▸'}</span>
            </button>
            {showReviews && shoe.reviews.map((review, i) => (
              <ReviewCard key={i} review={review} sortBy={sortBy} showShoeHeader={false} />
            ))}
          </div>
        </motion.div>

        {zoomed && shoe.imageUrl && (
          <motion.div
            className="lightbox"
            onClick={e => { e.stopPropagation(); setZoomed(false); }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.img
              className="lightbox__img"
              src={shoe.imageOriginalUrl || shoe.imageUrl}
              alt={shoe.name}
              onClick={e => e.stopPropagation()}
              onError={e => { if (e.currentTarget.src !== window.location.origin + shoe.imageUrl) e.currentTarget.src = shoe.imageUrl; }}
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            />
            <button className="lightbox__close" onClick={e => { e.stopPropagation(); setZoomed(false); }} aria-label="Close image">✕</button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
