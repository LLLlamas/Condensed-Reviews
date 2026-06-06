'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScoringInfoModal({ onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
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
        aria-label="How scores work"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
      >
        <motion.div
          className="modal modal--info"
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        >
          <div className="modal__header">
            <div className="modal__title-area">
              <h2 className="modal__name" style={{ fontSize: '1.5rem', marginBottom: '0.15rem' }}>How Scores Work</h2>
              <p className="section-desc" style={{ marginTop: 0 }}>How we turn Reddit reviews into numbers.</p>
            </div>
            <div className="modal__header-actions">
              <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>
            </div>
          </div>
          <div className="score-info-body">
            <div className="score-info-section">
              <div className="score-info-section__title">Overall Score</div>
              <p className="score-info-section__body">
                The overall score is a <strong>confidence-weighted average</strong> of all trait ratings across every review for a shoe. Each rating's weight depends on how directly the reviewer addressed that trait — a detailed hands-on assessment counts more than a passing mention.
              </p>
            </div>

            <div className="score-info-section">
              <div className="score-info-section__title">Trait Scores (0–10)</div>
              <p className="score-info-section__body">
                Each trait (Cushioning, Traction, Support, Fit, Ground Feel, Breathability, Durability, Value) is rated 0–10 by reading the review for explicit and implied signal. Confidence markers indicate how clearly a trait was covered:
              </p>
              <div className="score-info-conf">
                <div className="score-info-conf__item">
                  <span className="score-info-conf__marker">—</span>
                  <span><strong>High</strong> — directly and explicitly assessed by the reviewer (full weight)</span>
                </div>
                <div className="score-info-conf__item">
                  <span className="score-info-conf__marker">~</span>
                  <span><strong>Medium</strong> — mentioned in passing or implied (0.5× weight)</span>
                </div>
                <div className="score-info-conf__item">
                  <span className="score-info-conf__marker">?</span>
                  <span><strong>Low</strong> — barely touched; treat as a rough estimate (0.2× weight)</span>
                </div>
              </div>
            </div>

            <div className="score-info-section">
              <div className="score-info-section__title">Verdict Tiers</div>
              <div className="score-info-tiers">
                <div className="score-info-tier">
                  <span className="shoe-card__badge badge--elite score-info-tier__badge">ELITE</span>
                  <span>8.5 and above — genuinely top-tier; excels in its category</span>
                </div>
                <div className="score-info-tier">
                  <span className="shoe-card__badge badge--solid score-info-tier__badge">SOLID</span>
                  <span>7.0 – 8.4 — reliably good; recommended for most players</span>
                </div>
                <div className="score-info-tier">
                  <span className="shoe-card__badge badge--mediocre score-info-tier__badge">MEDIOCRE</span>
                  <span>Below 7.0 — average or below; notable weaknesses</span>
                </div>
              </div>
            </div>

            <div className="score-info-section">
              <div className="score-info-section__title">Review Sources</div>
              <p className="score-info-section__body">
                All reviews are sourced from real Reddit posts on <strong>r/BBallShoes</strong> (basketball) and running communities including <strong>r/RunningShoeGeeks</strong> and <strong>r/AskRunningShoeGeeks</strong>. Long posts are condensed for readability; short posts are reproduced closely. Every review links back to the original Reddit thread.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
