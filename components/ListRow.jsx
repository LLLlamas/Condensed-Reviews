'use client';

import ScoreBadge from './ScoreBadge';
import { CATEGORY_LABELS, avgScore, ratingColor, formatPrice } from './constants';

export default function ListRow({ shoe, rank, onOpen, onCompare, sortBy }) {
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
      {shoe.price ? <span className="list-row__price">{formatPrice(shoe.price, shoe.priceApprox)}</span> : <span className="list-row__price">—</span>}
      <span className="list-row__reviews">{shoe.reviews.length}r</span>
      <button className="list-row__vs" onClick={e => { e.stopPropagation(); onCompare(shoe.name); }}>vs ↔</button>
    </div>
  );
}
