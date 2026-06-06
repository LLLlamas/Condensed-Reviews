'use client';

import { motion } from 'framer-motion';

const TABS = [
  { key: 'browse', label: 'Browse' },
  { key: 'compare', label: 'Versus' },
];

export default function Nav({ screen, onScreenChange, shoeCount, reviewCount, brandCount }) {
  return (
    <nav className="nav">
      <div className="nav__inner">
        <div className="nav__brand">
          <span className="nav__wordmark">Court Report</span>
          <span className="nav__tag">Reddit Reviews</span>
        </div>
        <div className="nav__tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`nav__tab ${screen === tab.key ? 'nav__tab--active' : ''}`}
              onClick={() => onScreenChange(tab.key)}
            >
              {screen === tab.key && <motion.span layoutId="nav-tab-active" className="nav__tab-indicator" />}
              {tab.label}
            </button>
          ))}
        </div>
        <div className="nav__stats">
          <span>{shoeCount} shoes</span>
          <span className="nav__dot" aria-hidden="true">·</span>
          <span>{reviewCount} reviews</span>
          <span className="nav__dot" aria-hidden="true">·</span>
          <span>{brandCount} brands</span>
        </div>
      </div>
    </nav>
  );
}
