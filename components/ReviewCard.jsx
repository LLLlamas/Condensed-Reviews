'use client';

import { useState } from 'react';
import RatingBar from './RatingBar';
import { CATEGORY_LABELS } from './constants';

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

export default function ReviewCard({ review, sortBy, showShoeHeader }) {
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
      )}
    </div>
  );
}
