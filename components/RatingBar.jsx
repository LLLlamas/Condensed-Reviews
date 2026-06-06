'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CONFIDENCE_LABELS, ratingColor } from './constants';

export default function RatingBar({ label, value, max = 10, highlighted = false, confidence = 'high', highlights = null, fillDelay = 0 }) {
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
        <motion.div
          className="rating-bar__fill"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1], delay: 0.1 + fillDelay }}
        />
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
