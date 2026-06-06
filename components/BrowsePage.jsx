'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reviews, getShoes } from '../src/data/reviews';
import { CATEGORY_LABELS, SPORT_FILTERS, avgScore } from './constants';
import Nav from './Nav';
import ShoeCard from './ShoeCard';
import ReviewCard from './ReviewCard';
import ShoeModal from './ShoeModal';
import ListRow from './ListRow';
import SwipeView from './SwipeView';
import CompareScreen from './CompareScreen';
import ScoringInfoModal from './ScoringInfoModal';

function PaginationBar({ safePage, pageCount, goToPage, total }) {
  const pages = useMemo(() => {
    if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
    const result = [];
    if (safePage <= 4) {
      for (let i = 1; i <= 5; i++) result.push(i);
      result.push('…r');
      result.push(pageCount);
    } else if (safePage >= pageCount - 3) {
      result.push(1);
      result.push('…l');
      for (let i = pageCount - 4; i <= pageCount; i++) result.push(i);
    } else {
      result.push(1);
      result.push('…l');
      result.push(safePage - 1);
      result.push(safePage);
      result.push(safePage + 1);
      result.push('…r');
      result.push(pageCount);
    }
    return result;
  }, [safePage, pageCount]);

  return (
    <div className="pagination">
      <motion.button
        className="pagination__nav"
        onClick={() => goToPage(safePage - 1)}
        disabled={safePage <= 1}
        whileTap={{ scale: 0.88 }}
        aria-label="Previous page"
      >‹</motion.button>

      {pages.map((p) =>
        typeof p === 'string' ? (
          <span key={p} className="pagination__ellipsis">…</span>
        ) : (
          <motion.button
            key={p}
            className={`pagination__page-btn${p === safePage ? ' pagination__page-btn--active' : ''}`}
            onClick={() => goToPage(p)}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >{p}</motion.button>
        )
      )}

      <motion.button
        className="pagination__nav"
        onClick={() => goToPage(safePage + 1)}
        disabled={safePage >= pageCount}
        whileTap={{ scale: 0.88 }}
        aria-label="Next page"
      >›</motion.button>

      <span className="pagination__count">{total} shoes</span>
    </div>
  );
}

export default function BrowsePage() {
  const [sportFilter, setSportFilter]   = useState('all');
  const shoes  = useMemo(() => getShoes(sportFilter), [sportFilter]);
  const brands = useMemo(() => [...new Set(shoes.map(s => s.brand))].sort(), [shoes]);

  const [brandFilter,  setBrandFilter]  = useState('All');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [layout, setLayout] = useState('grid');
  const [screen, setScreen] = useState('browse');
  const [modalShoeName, setModalShoeName] = useState(null);
  const [sortBy, setSortBy] = useState('overall');
  const [maxPrice, setMaxPrice] = useState(250);
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);
  const [showScoringInfo, setShowScoringInfo] = useState(false);
  const [page, setPage] = useState(1);
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [pageDir, setPageDir] = useState(1);
  const PER_PAGE = 12;

  // Reset dependent filters when the sport changes — done during render (not in an
  // effect) so there's no cascading re-render or flash of stale filter state.
  const [prevSport, setPrevSport] = useState(sportFilter);
  if (sportFilter !== prevSport) {
    setPrevSport(sportFilter);
    setBrandFilter('All');
    setSearchQuery('');
    setMaxPrice(250);
  }

  // Reset to page 1 whenever the filtered set changes (any filter/sort/sport tweak).
  const filterSig = `${sportFilter}|${brandFilter}|${searchQuery}|${sortBy}|${maxPrice}`;
  const [prevSig, setPrevSig] = useState(filterSig);
  if (filterSig !== prevSig) { setPrevSig(filterSig); setPage(1); setPageDir(0); }

  const filteredShoes = useMemo(() => {
    let result = shoes.filter(s => {
      if (brandFilter !== 'All' && s.brand !== brandFilter) return false;
      if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (s.price && maxPrice < 250 && s.price > maxPrice) return false;
      return true;
    });
    return [...result].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'reviews') return b.reviews.length - a.reviews.length || a.name.localeCompare(b.name);
      if (sortBy === 'price-low') return (a.price || 9999) - (b.price || 9999);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'recent') {
        const la = Math.max(...a.reviews.map(r => new Date(r.date)));
        const lb = Math.max(...b.reviews.map(r => new Date(r.date)));
        return lb - la;
      }
      if (CATEGORY_LABELS[sortBy]) return (b.avgRatings[sortBy] || 0) - (a.avgRatings[sortBy] || 0);
      return avgScore(b) - avgScore(a);
    });
  }, [shoes, brandFilter, searchQuery, sortBy, maxPrice]);

  const filteredReviews = useMemo(() => {
    let r = reviews.filter(rv => sportFilter === 'all' || rv.sport === sportFilter);
    r = r.filter(rv => {
      if (brandFilter !== 'All' && rv.brand !== brandFilter) return false;
      if (searchQuery && !rv.shoe.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (reviewSearch) {
        const q = reviewSearch.toLowerCase();
        const hit = rv.shoe.toLowerCase().includes(q)
          || rv.author.toLowerCase().includes(q)
          || rv.summary?.toLowerCase().includes(q)
          || rv.playstyle?.toLowerCase().includes(q)
          || rv.courtType?.toLowerCase().includes(q)
          || rv.verdict?.toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });
    if (CATEGORY_LABELS[sortBy]) r = [...r].sort((a, b) => (b.ratings[sortBy]||0) - (a.ratings[sortBy]||0));
    return r;
  }, [brandFilter, searchQuery, sortBy, sportFilter, reviewSearch]);

  // Pagination (grid + list views). Swipe shows the full set as a carousel.
  const pageCount = Math.max(1, Math.ceil(filteredShoes.length / PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const pageOffset = (safePage - 1) * PER_PAGE;
  const pagedShoes = filteredShoes.slice(pageOffset, pageOffset + PER_PAGE);

  function goToPage(p) {
    const clamped = Math.min(Math.max(1, p), pageCount);
    setPageDir(clamped > safePage ? 1 : -1);
    setPage(clamped);
    if (typeof window !== 'undefined') {
      const el = document.getElementById('shoes');
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    }
  }

  const modalShoe = modalShoeName ? shoes.find(s => s.name === modalShoeName) : null;

  const totalReviews = sportFilter === 'all'
    ? reviews.length
    : reviews.filter(r => r.sport === sportFilter).length;

  function handleCompare(shoeName) {
    if (!compareA || compareA === shoeName) {
      setCompareA(shoeName);
      setCompareB(prev => prev === shoeName ? null : prev);
    } else {
      setCompareB(shoeName);
    }
    setScreen('compare');
  }

  return (
    <div className="app">
      <Nav
        screen={screen}
        onScreenChange={setScreen}
        shoeCount={shoes.length}
        reviewCount={totalReviews}
        brandCount={brands.length}
      />

      <section className="hero">
        <div className="hero__inner">
          <p className="hero__sub">Real user reviews from Reddit, condensed and rated.</p>
        </div>
      </section>

      <main className="main">
        {screen === 'browse' ? (
          <>
            <section className="filters">
              <div className="filters__row">
                <span className="filters__label">Sport</span>
                <div className="filters__pills">
                  {SPORT_FILTERS.map(sf => (
                    <motion.button
                      key={sf.key}
                      className={`pill ${sportFilter === sf.key ? 'pill--active' : ''}`}
                      onClick={() => setSportFilter(sf.key)}
                      whileTap={{ scale: 0.93 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      {sf.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="filters__row">
                <input
                  type="text"
                  placeholder="Search shoes..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="filters__input"
                />
              </div>

              <div className="filters__row">
                <span className="filters__label">Brand</span>
                <div className="filters__pills">
                  <motion.button
                    className={`pill ${brandFilter === 'All' ? 'pill--active' : ''}`}
                    onClick={() => setBrandFilter('All')}
                    whileTap={{ scale: 0.93 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >All</motion.button>
                  {brands.map(brand => (
                    <motion.button
                      key={brand}
                      className={`pill ${brandFilter === brand ? 'pill--active' : ''}`}
                      onClick={() => setBrandFilter(brand)}
                      whileTap={{ scale: 0.93 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >{brand}</motion.button>
                  ))}
                </div>
              </div>

              <div className="filters__row">
                <span className="filters__label">View</span>
                <div className="layout-toggle">
                  <button className={`layout-btn ${layout === 'list' ? 'layout-btn--active' : ''}`} onClick={() => setLayout('list')}>≡ List</button>
                  <button className={`layout-btn ${layout === 'grid' ? 'layout-btn--active' : ''}`} onClick={() => setLayout('grid')}>▦ Grid</button>
                  <button className={`layout-btn ${layout === 'swipe' ? 'layout-btn--active' : ''}`} onClick={() => setLayout('swipe')}>↔ Swipe</button>
                </div>
              </div>

              <div className="filters__row">
                <span className="filters__label">Max price</span>
                <input type="range" min="80" max="250" step="10" value={maxPrice}
                  onChange={e => setMaxPrice(+e.target.value)} className="price-slider" />
                <span className="price-slider__val">${maxPrice}{maxPrice >= 250 ? '+' : ''}</span>
              </div>

              <div className="filters__row">
                <span className="filters__label">Sort by</span>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="filters__select">
                  <option value="overall">Overall score</option>
                  <option value="reviews">Most reviews</option>
                  <option value="name">Name A–Z</option>
                  <option value="price-low">Price ↑ low to high</option>
                  <option value="price-high">Price ↓ high to low</option>
                  <option value="recent">Most recent</option>
                  <optgroup label="By trait">
                    {Object.entries(CATEGORY_LABELS).map(([k,l]) => <option key={k} value={k}>{l}</option>)}
                  </optgroup>
                </select>
                <button
                  className="info-btn"
                  onClick={() => setShowScoringInfo(true)}
                  aria-label="How scores are calculated"
                  title="How scores are calculated"
                >ⓘ</button>
              </div>
            </section>

            <section className="shoe-layout-section" id="shoes">
              <div className="shoe-section-header">
                <span className="shoe-section-header__count">
                  {filteredShoes.length} shoe{filteredShoes.length !== 1 ? 's' : ''}
                </span>
                {layout !== 'swipe' && pageCount > 1 && (
                  <div className="pagination--mini">
                    <motion.button
                      className="pagination__nav"
                      onClick={() => goToPage(safePage - 1)}
                      disabled={safePage <= 1}
                      whileTap={{ scale: 0.88 }}
                      aria-label="Previous page"
                    >‹</motion.button>
                    <span className="pagination--mini__label">pg {safePage} / {pageCount}</span>
                    <motion.button
                      className="pagination__nav"
                      onClick={() => goToPage(safePage + 1)}
                      disabled={safePage >= pageCount}
                      whileTap={{ scale: 0.88 }}
                      aria-label="Next page"
                    >›</motion.button>
                  </div>
                )}
              </div>

              {layout === 'list' && (
                <motion.div
                  key={`list-p${safePage}`}
                  className="list-view"
                  initial={{ opacity: 0, y: pageDir * 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  <div className="list-header">
                    <span>#</span><span>Shoe</span><span>Score</span><span>Price</span><span>Reviews</span><span></span>
                  </div>
                  {pagedShoes.map((shoe, i) => (
                    <ListRow key={shoe.name} shoe={shoe} rank={pageOffset + i + 1} onOpen={shoeName => setModalShoeName(shoeName)} onCompare={handleCompare} sortBy={sortBy} />
                  ))}
                  {filteredShoes.length === 0 && <p className="empty-state">No shoes match your filters.</p>}
                </motion.div>
              )}
              {layout === 'grid' && (
                <motion.div
                  key={`grid-p${safePage}`}
                  className="shoe-grid"
                  initial={{ opacity: 0, y: pageDir * 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  {pagedShoes.map((shoe, index) => (
                    <motion.div
                      key={shoe.name}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.035, ease: 'easeOut' }}
                    >
                      <ShoeCard
                        shoe={shoe}
                        onOpen={() => setModalShoeName(shoe.name)}
                        onCompare={handleCompare}
                        sortBy={sortBy}
                        rank={CATEGORY_LABELS[sortBy] ? pageOffset + index + 1 : null}
                      />
                    </motion.div>
                  ))}
                  {filteredShoes.length === 0 && <p className="empty-state">No shoes match your filters.</p>}
                </motion.div>
              )}
              {layout === 'swipe' && (
                <SwipeView shoes={filteredShoes} onOpen={shoeName => setModalShoeName(shoeName)} onCompare={handleCompare} />
              )}

              {layout !== 'swipe' && pageCount > 1 && (
                <PaginationBar safePage={safePage} pageCount={pageCount} goToPage={goToPage} total={filteredShoes.length} />
              )}
            </section>

            <section className="reviews-section">
              <button
                className="reviews-section__toggle"
                onClick={() => setReviewsOpen(v => !v)}
                aria-expanded={reviewsOpen}
              >
                <span className="reviews-section__toggle-left">
                  <span className="section-title">
                    {CATEGORY_LABELS[sortBy] ? `Top by ${CATEGORY_LABELS[sortBy]}` : 'All Reviews'}
                  </span>
                  <span className="section-desc">
                    {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}
                    {brandFilter !== 'All' ? ` · ${brandFilter}` : ''}
                    {CATEGORY_LABELS[sortBy] ? ` · sorted by ${CATEGORY_LABELS[sortBy]}` : ''}
                    {reviewSearch ? ` · matching "${reviewSearch}"` : ''}
                  </span>
                </span>
                <motion.span
                  className="reviews-section__toggle-chevron"
                  animate={{ rotate: reviewsOpen ? 180 : 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  aria-hidden="true"
                >▾</motion.span>
              </button>
              <AnimatePresence>
                {reviewsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="reviews-section__inner">
                      <div className="reviews-section__search">
                        <input
                          type="text"
                          placeholder="Search reviews by shoe, author, or keyword…"
                          value={reviewSearch}
                          onChange={e => setReviewSearch(e.target.value)}
                          className="reviews-section__search-input"
                          aria-label="Search reviews"
                        />
                        {reviewSearch && (
                          <button
                            className="reviews-section__search-clear"
                            onClick={e => { e.stopPropagation(); setReviewSearch(''); }}
                            aria-label="Clear search"
                          >✕</button>
                        )}
                      </div>
                      <div className="reviews-grid">
                        {filteredReviews.map((review) => (
                          <ReviewCard
                            key={`${review.shoe}-${review.author}-${review.redditUrl || review.date}`}
                            review={review}
                            sortBy={sortBy}
                            showShoeHeader={true}
                          />
                        ))}
                        {filteredReviews.length === 0 && (
                          <p className="empty-state" style={{ gridColumn: '1 / -1' }}>No reviews match your search.</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </>
        ) : (
          <CompareScreen
            allShoes={shoes}
            compareA={compareA}
            compareB={compareB}
            onSetCompare={(slot, val) => slot === 'a' ? setCompareA(val) : setCompareB(val)}
            onOpen={shoeName => setModalShoeName(shoeName)}
          />
        )}
      </main>

      <footer className="footer">
        <p>
          Court Report &middot; Data from{' '}
          <a href="https://www.reddit.com/r/BBallShoes" target="_blank" rel="noopener noreferrer">r/BBallShoes</a>
          {' '}&amp;{' '}
          <a href="https://www.reddit.com/r/running_shoes" target="_blank" rel="noopener noreferrer">r/running_shoes</a>
          {' '}&middot; Community reviews, condensed
        </p>
      </footer>

      <AnimatePresence>
        {modalShoe && <ShoeModal shoe={modalShoe} sortBy={sortBy} onClose={() => setModalShoeName(null)} />}
        {showScoringInfo && <ScoringInfoModal onClose={() => setShowScoringInfo(false)} />}
      </AnimatePresence>
    </div>
  );
}
