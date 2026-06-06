'use client';

import { motion } from 'framer-motion';
import { getAmazonUrl, isAmazonLink } from '../src/data/reviews';
import { CATEGORY_LABELS, avgScore, ratingColor, formatPrice } from './constants';

export default function ShoeCard({ shoe, onOpen, onCompare, sortBy, rank }) {
  const score = CATEGORY_LABELS[sortBy] ? (shoe.avgRatings[sortBy] || 0) : avgScore(shoe);

  const scoreColor = ratingColor(score);
  const ratingLabel = score >= 8.5 ? 'ELITE' : score >= 7.0 ? 'SOLID' : 'MEDIOCRE';
  const ratingClass = score >= 8.5 ? 'badge--elite' : score >= 7.0 ? 'badge--solid' : 'badge--mediocre';
  const shoeUrl = getAmazonUrl(shoe.name, shoe.sport);
  const isAmazon = isAmazonLink(shoeUrl);

  return (
    <motion.div
      className="shoe-card"
      onClick={onOpen}
      whileHover={{ y: -4, boxShadow: '0px 12px 40px rgba(0,0,0,0.10)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="shoe-card__image-wrap">
        {shoe.imageUrl
          ? <img className="shoe-card__img" src={shoe.imageUrl} alt={shoe.name} />
          : (
            <svg className="shoe-card__img-placeholder" viewBox="0 0 64 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 24 C 3 22, 5 21, 8 21 L 24 21 C 28 21, 31 18, 35 14 L 42 7 C 44 5, 46 5, 48 6 L 50 8 C 50 10, 49 11, 48 12 L 46 14 C 50 14, 55 16, 58 18 C 61 20, 61 24, 58 25 L 8 25 C 5 25, 3 26, 3 24 Z"/>
              <path d="M14 21 L 14 25 M 20 21 L 20 25 M 26 20 L 28 24 M 33 16 L 35 20"/>
            </svg>
          )
        }
      </div>
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
          {shoe.price ? ` · ${formatPrice(shoe.price, shoe.priceApprox)}` : ''}
        </span>
        <div className="shoe-card__footer-actions">
          <a
            href={shoeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shoe-card__amazon"
            onClick={e => e.stopPropagation()}
            title={isAmazon ? 'Find on Amazon' : 'See price'}
          >
            {isAmazon ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                Amazon
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                See Price
              </>
            )}
          </a>
          <button
            className="shoe-card__vs"
            onClick={e => { e.stopPropagation(); onCompare(shoe.name); }}
          >vs ↔</button>
        </div>
      </div>
    </motion.div>
  );
}
