'use client';

import Link from 'next/link';
import RatingBar from './RatingBar';
import ReviewCard from './ReviewCard';
import ScoreBadge from './ScoreBadge';
import { getAmazonUrl, isAmazonLink } from '../src/data/reviews';
import { CATEGORY_LABELS, avgScore, buildHighlights, ratingColor, formatPrice } from './constants';

export default function ShoeDetail({ shoe }) {
  const score = avgScore(shoe);
  const shoeUrl = getAmazonUrl(shoe.name, shoe.sport);
  const isAmazon = isAmazonLink(shoeUrl);

  return (
    <div className="app">
      <main className="main">
        <div className="shoe-detail">
          <Link href="/" className="shoe-detail__back">← All shoes</Link>
          <div className="modal__header">
            <div className="modal__title-area">
              <div className="shoe-card__brand">{shoe.brand}</div>
              <h1 className="modal__name">{shoe.name}</h1>
              <div className="modal__score-row">
                <span className="modal__score" style={{ color: ratingColor(score) }}>{score.toFixed(1)}</span>
                <ScoreBadge score={score} />
                {shoe.price && <span className="modal__price">{formatPrice(shoe.price, shoe.priceApprox)}</span>}
              </div>
            </div>
            <div className="modal__header-actions">
              <a href={shoeUrl} target="_blank" rel="noopener noreferrer" className="shoe-detail__amazon">
                {isAmazon ? 'Find on Amazon' : 'See Price'}
              </a>
            </div>
          </div>

          <div className="modal__ratings">
            <h2 className="modal__section-label">Aggregate Ratings · {shoe.reviews.length} reviews</h2>
            <div className="modal__bars">
              {Object.entries(shoe.avgRatings).map(([key, val]) => {
                const highlights = buildHighlights(shoe, key, val);
                return (
                  <RatingBar key={key} label={CATEGORY_LABELS[key]||key} value={val}
                    confidence={shoe.avgConfidences?.[key]||'high'}
                    highlights={highlights} />
                );
              })}
            </div>
          </div>

          <div className="modal__reviews">
            <h2 className="modal__section-label">All Reviews</h2>
            {shoe.reviews.map((review, i) => (
              <ReviewCard key={i} review={review} sortBy="overall" showShoeHeader={false} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
