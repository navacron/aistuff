import React, { useState, useMemo, useEffect, useCallback } from 'react';
import FilterPanel from './components/FilterPanel';
import ProductCard from './components/ProductCard';
import CompareModal from './components/CompareModal';
import QuizWizard from './components/QuizWizard';
import FAQSection from './components/FAQSection';
import { FAQ } from './data/config';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'thickness', label: 'Surface Thickness' },
];

function applyFilters(allTables, filters) {
  return allTables.filter((t) => {
    if (filters.priceRanges && filters.priceRanges.length > 0) {
      const price = t.salePrice ?? t.price;
      const match = filters.priceRanges.some((range) => {
        const [min, max] = range.split('-').map(Number);
        return price >= min && price <= max;
      });
      if (!match) return false;
    }
    if (filters.skillLevels && filters.skillLevels.length > 0) {
      if (!filters.skillLevels.includes(t.skillLevel)) return false;
    }
    if (filters.environments && filters.environments.length > 0) {
      if (!filters.environments.includes(t.environment) && t.environment !== 'both') return false;
    }
    if (filters.sizes && filters.sizes.length > 0) {
      if (!filters.sizes.includes(t.size)) return false;
    }
    if (filters.playbackMode && !t.playbackMode) return false;
    if (filters.paddlesIncluded && t.paddlesIncluded === 0) return false;
    if (filters.wheeledLegs && !t.wheeledLegs) return false;
    if (filters.foldable && !t.foldable) return false;
    return true;
  });
}

function applySort(list, sortBy) {
  const copy = [...list];
  switch (sortBy) {
    case 'price-asc':
      return copy.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    case 'price-desc':
      return copy.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case 'thickness':
      return copy.sort((a, b) => b.thicknessMm - a.thicknessMm);
    default:
      return copy.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
  }
}

function scoreTable(table, answers) {
  let score = 0;
  if (answers.environment) {
    if (table.environment === answers.environment || table.environment === 'both') score += 3;
    else return -1;
  }
  if (answers.space) {
    if (table.size === answers.space) score += 2;
    else if (answers.space === 'full' && table.size !== 'full') score += 0;
    else score += 1;
  }
  if (answers.skillLevel) {
    const levels = ['beginner', 'intermediate', 'advanced', 'professional'];
    const diff = Math.abs(levels.indexOf(answers.skillLevel) - levels.indexOf(table.skillLevel));
    score += Math.max(0, 2 - diff);
  }
  if (answers.budget) {
    const [min, max] = answers.budget.split('-').map(Number);
    const price = table.salePrice ?? table.price;
    if (price >= min && price <= max) score += 3;
    else if (price < min) score += 1;
  }
  return score;
}

function injectStructuredData(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export default function App() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('featured');
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetch('/api/tables', {
      headers: { 'X-Api-Key': import.meta.env.VITE_API_SECRET || '' },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`API ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setTables(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  // Inject JSON-LD structured data after tables load
  useEffect(() => {
    if (tables.length === 0) return;

    injectStructuredData('ld-itemlist', {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Best Table Tennis Tables 2026',
      description: 'Expert-reviewed table tennis tables ranked by value, performance, and use case.',
      numberOfItems: tables.length,
      itemListElement: tables.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: t.name,
          brand: { '@type': 'Brand', name: t.brand },
          description: t.summary,
          image: t.imageUrl,
          url: t.affiliateUrl,
          offers: {
            '@type': 'Offer',
            price: String(t.salePrice ?? t.price),
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: t.affiliateUrl,
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: String(t.rating),
            reviewCount: String(t.reviewCount),
            bestRating: '5',
            worstRating: '1',
          },
        },
      })),
    });

    injectStructuredData('ld-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }, [tables]);

  const activeSource = quizResults ?? tables;
  const filteredTables = useMemo(
    () => applySort(applyFilters(activeSource, filters), sortBy),
    [activeSource, filters, sortBy]
  );

  function toggleCompare(table) {
    setCompareList((prev) => {
      if (prev.find((t) => t.id === table.id)) return prev.filter((t) => t.id !== table.id);
      if (prev.length >= 3) return prev;
      return [...prev, table];
    });
  }

  function removeFromCompare(table) {
    setCompareList((prev) => {
      const next = prev.filter((t) => t.id !== table.id);
      if (next.length < 2) setShowCompare(false);
      return next;
    });
  }

  const handleQuizComplete = useCallback(
    (answers) => {
      const scored = tables
        .map((t) => ({ table: t, score: scoreTable(t, answers) }))
        .filter((r) => r.score >= 0)
        .sort((a, b) => b.score - a.score)
        .map((r) => r.table);
      setQuizResults(scored);
      setShowQuiz(false);
      setFilters({});
      setSortBy('featured');
    },
    [tables]
  );

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="site-header">
        <div className="header-inner">
          <a href="/" className="site-logo" aria-label="RecRoomPick home">
            <span className="logo-icon" aria-hidden="true">🏓</span>
            <span className="logo-text">RecRoomPick</span>
          </a>
          <nav className="site-nav" aria-label="Page navigation">
            <a href="#tables" className="nav-link">Tables</a>
            <a href="#buying-guide" className="nav-link">Buying Guide</a>
            <a href="#faq" className="nav-link">FAQ</a>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero" aria-label="Page introduction">
        <div className="hero-inner">
          <div className="hero-text">
            <h1>Best Table Tennis Tables of 2026</h1>
            <p>
              Expert-reviewed ping pong tables for every budget, skill level, and space —
              from beginner basement setups to Olympic-grade competition surfaces.
            </p>
            <div className="hero-actions">
              <button className="btn btn-quiz" onClick={() => setShowQuiz(true)}>
                🧠 Take the Quiz — Find My Table
              </button>
              <a href="#tables" className="btn btn-ghost">Browse All Tables ↓</a>
            </div>
          </div>
          <div className="hero-stats" aria-label="Guide statistics">
            <div className="hero-stat">
              <span className="hero-stat-num">{tables.length || 8}</span>
              <span className="hero-stat-label">Tables Reviewed</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">6</span>
              <span className="hero-stat-label">Top Brands</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">$179+</span>
              <span className="hero-stat-label">Price Range</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Buying Guide Intro (SEO body text) ── */}
      <section className="buying-guide" id="buying-guide" aria-labelledby="guide-heading">
        <div className="buying-guide-inner">
          <h2 id="guide-heading">How to Choose the Right Table Tennis Table</h2>
          <div className="guide-grid">
            <article className="guide-card">
              <div className="guide-icon" aria-hidden="true">📐</div>
              <h3>Surface Thickness</h3>
              <p>
                The single most important spec. <strong>16–19mm</strong> is ideal for home use —
                consistent bounce without the tournament price. Go <strong>25mm+</strong> only
                if you're competing seriously. Avoid anything under 15mm for adult play.
              </p>
            </article>
            <article className="guide-card">
              <div className="guide-icon" aria-hidden="true">🏠</div>
              <h3>Indoor vs. Outdoor</h3>
              <p>
                Indoor tables use wood surfaces for the most authentic feel. Outdoor tables
                use resin or aluminum that withstands rain and UV.{' '}
                <strong>Never leave an indoor table outside</strong> — it will warp. Even a
                covered patio requires an outdoor-rated table.
              </p>
            </article>
            <article className="guide-card">
              <div className="guide-icon" aria-hidden="true">📏</div>
              <h3>Space Requirements</h3>
              <p>
                A full-size table (9ft × 5ft) needs a room of at least{' '}
                <strong>19ft × 11ft</strong> to play comfortably. Short on space? Mid-size
                (7ft) tables are a great compromise. Most foldable tables store upright in
                under 5ft of floor space.
              </p>
            </article>
            <article className="guide-card">
              <div className="guide-icon" aria-hidden="true">🏆</div>
              <h3>Skill Level Match</h3>
              <p>
                Beginners and families should prioritize <strong>easy assembly and playback
                mode</strong>. Intermediate players need 18mm+ thickness. Advanced players
                should look for ITTF-approved dimensions and a 22–25mm surface for authentic
                tournament feel.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Quiz result banner ── */}
      {quizResults && (
        <div className="quiz-result-banner" role="status">
          <div className="quiz-result-inner">
            <span>
              🎯 Showing your personalized recommendations ({quizResults.length} match
              {quizResults.length !== 1 ? 'es' : ''})
            </span>
            <button className="btn-text" onClick={() => setQuizResults(null)}>
              Show all tables ✕
            </button>
          </div>
        </div>
      )}

      {/* ── Main product area ── */}
      <main className="main-layout" id="tables">
        <button
          className="mobile-filter-toggle"
          onClick={() => setMobileFiltersOpen((o) => !o)}
          aria-expanded={mobileFiltersOpen}
        >
          {mobileFiltersOpen ? '✕ Hide Filters' : '⚙ Filters & Sort'}
        </button>

        <div className={`sidebar-wrap ${mobileFiltersOpen ? 'sidebar-wrap--open' : ''}`}>
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            totalCount={tables.length}
            filteredCount={filteredTables.length}
          />
        </div>

        <div className="content-area">
          <div className="sort-bar">
            <span className="sort-count" aria-live="polite">
              {loading ? 'Loading…' : `${filteredTables.length} table${filteredTables.length !== 1 ? 's' : ''}`}
            </span>
            <div className="sort-select-wrap">
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {loading && (
            <div className="loading-state" aria-label="Loading products">
              {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton-card" aria-hidden="true" />)}
            </div>
          )}

          {error && (
            <div className="error-state" role="alert">
              <div className="empty-icon">⚠️</div>
              <h3>Couldn't load tables</h3>
              <p>Please refresh the page to try again.</p>
              <button className="btn btn-primary" onClick={() => window.location.reload()}>
                Refresh
              </button>
            </div>
          )}

          {!loading && !error && filteredTables.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">🏓</div>
              <h3>No tables match your filters</h3>
              <p>Try removing a filter or two to see more options.</p>
              <button className="btn btn-primary" onClick={() => setFilters({})}>Clear Filters</button>
            </div>
          )}

          {!loading && !error && filteredTables.length > 0 && (
            <div className="product-grid" role="list" aria-label="Table tennis tables">
              {filteredTables.map((table) => (
                <ProductCard
                  key={table.id}
                  table={table}
                  onCompare={toggleCompare}
                  compareSelected={compareList.some((t) => t.id === table.id)}
                  compareDisabled={compareList.length >= 3}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── FAQ Section ── */}
      <div id="faq">
        <FAQSection />
      </div>

      {/* ── Compare sticky bar ── */}
      {compareList.length > 0 && (
        <div className="compare-bar" role="region" aria-label="Comparison tray">
          <div className="compare-bar-inner">
            <div className="compare-bar-items">
              {compareList.map((t) => (
                <div key={t.id} className="compare-bar-item">
                  <img src={t.imageUrl} alt={t.name} width="40" height="30" />
                  <span>{t.brand} {t.model}</span>
                  <button onClick={() => removeFromCompare(t)} aria-label={`Remove ${t.name}`}>✕</button>
                </div>
              ))}
              {compareList.length < 3 && (
                <div className="compare-bar-empty">+ Add {3 - compareList.length} more</div>
              )}
            </div>
            <button
              className="btn btn-compare-go"
              onClick={() => setShowCompare(true)}
              disabled={compareList.length < 2}
            >
              Compare {compareList.length} Tables →
            </button>
          </div>
        </div>
      )}

      {showCompare && (
        <CompareModal
          tables={compareList}
          onClose={() => setShowCompare(false)}
          onRemove={removeFromCompare}
        />
      )}
      {showQuiz && (
        <QuizWizard
          onComplete={handleQuizComplete}
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="footer-inner">
          <p>
            <strong>RecRoomPick</strong> — Helping you build the perfect rec room, one pick at a time.
          </p>
          <nav className="footer-nav" aria-label="Footer links">
            <a href="#buying-guide">Buying Guide</a>
            <a href="#faq">FAQ</a>
            <a href="#tables">All Tables</a>
          </nav>
          <p className="footer-disclaimer">
            As an Amazon Associate we earn from qualifying purchases at no extra cost to you.
            Prices and availability subject to change. Last updated February 2026.
          </p>
        </div>
      </footer>
    </div>
  );
}
