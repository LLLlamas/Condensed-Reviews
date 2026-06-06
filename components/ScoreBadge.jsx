'use client';

import { motion } from 'framer-motion';

export default function ScoreBadge({ score }) {
  const label = score >= 8.5 ? 'ELITE' : score >= 7.0 ? 'SOLID' : 'MEDIOCRE';
  const cls = score >= 8.5 ? 'badge--elite' : score >= 7.0 ? 'badge--solid' : 'badge--mediocre';
  return (
    <motion.span
      className={`shoe-card__badge ${cls}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.1 }}
    >
      {label}
    </motion.span>
  );
}
