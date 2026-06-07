'use client';

import { motion } from 'framer-motion';
import ScoreBadge from './ScoreBadge';
import { CATEGORY_LABELS, avgScore, ratingColor, formatPrice, formatWeight } from './constants';

export default function CompareScreen({ allShoes, compareA, compareB, onSetCompare, onOpen }) {
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
            {allShoes.map(s => <option key={s.name} value={s.name}>{s.brand} - {s.name}{s.price ? ` - ${formatPrice(s.price, s.priceApprox)}` : ''}{s.weight ? ` - ${formatWeight(s.weight)}` : ''}</option>)}
          </select>
        </div>
        <div className="compare-vs-label">vs</div>
        <div className="compare-picker">
          <label className="filters__label">Shoe B</label>
          <select className="filters__select" value={compareB || ''} onChange={e => onSetCompare('b', e.target.value || null)}>
            <option value="">— pick a shoe —</option>
            {allShoes.map(s => <option key={s.name} value={s.name}>{s.brand} - {s.name}{s.price ? ` - ${formatPrice(s.price, s.priceApprox)}` : ''}{s.weight ? ` - ${formatWeight(s.weight)}` : ''}</option>)}
          </select>
        </div>
      </div>
      {shoeA && shoeB ? (
        <>
          <div className="compare-heads">
            {[shoeA, shoeB].map((shoe, si) => {
              const score = avgScore(shoe);
              const compareMeta = [
                shoe.price ? formatPrice(shoe.price, shoe.priceApprox) : null,
                shoe.weight ? formatWeight(shoe.weight) : null,
                `${shoe.reviews.length} reviews`,
              ].filter(Boolean).join(' / ');
              return (
                <div key={shoe.name} className={`compare-head compare-head--${si === 0 ? 'a' : 'b'}`}>
                  <div className="shoe-card__brand">{shoe.brand}</div>
                  <h3 className="compare-head__name">{shoe.name}</h3>
                  <div className="compare-head__score-row">
                    <span className="compare-head__score" style={{ color: ratingColor(score) }}>{score.toFixed(1)}</span>
                    <ScoreBadge score={score} />
                  </div>
                  <div className="compare-head__meta">
                    {compareMeta}
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
                    <div className="compare-bar__track">
                      <motion.div className="compare-bar__fill" style={{ background: ratingColor(va) }}
                        initial={{ width: 0 }} animate={{ width: `${va*10}%` }}
                        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1], delay: 0.1 }} />
                    </div>
                  </div>
                  <div className="compare-trait-label">{CATEGORY_LABELS[key]}</div>
                  <div className={`compare-bar compare-bar--right ${bWins ? 'compare-bar--win' : ''}`}>
                    <div className="compare-bar__track">
                      <motion.div className="compare-bar__fill" style={{ background: ratingColor(vb) }}
                        initial={{ width: 0 }} animate={{ width: `${vb*10}%` }}
                        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1], delay: 0.1 }} />
                    </div>
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
