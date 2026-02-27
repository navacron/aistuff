import React, { useState, useMemo } from 'react';
import { tables } from './data/tables';
import FilterPanel from './components/FilterPanel';
import ProductCard from './components/ProductCard';
import CompareModal from './components/CompareModal';
import QuizWizard from './components/QuizWizard';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'thickness', label: 'Surface Thickness' },
];

function applyFilters(allTables, filters) {
  return allTables.filter((t) => {
    // Price
    if (filters.priceRanges && filters.priceRanges.length > 0) {
      const price = t.salePrice ?? t.price;
      const match = filters.priceRanges.some((range) => {
        const [min, max] = range.split('-').map(Number);
        return price >= min && price <= max;
      });
      if (!match) return false;
    }

    // Skill level
    if (filters.skillLevels && filters.skillLevels.length > 0) {
      if (!filters.skillLevels.includes(t.skillLevel)) return false;
    }

    // Environment
    if (filters.environments && filters.environments.length > 0) {
      if (!filters.environments.includes(t.environment) && t.environment !== 'both') return false;
    }

    // Size
    if (filters.sizes && filters.sizes.length > 0) {
      if (!filters.sizes.includes(t.size)) return false;
    }

    // Features
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
      // "featured" — badge items first
      return copy.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
  }
}

export default function App() {
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('featured');
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeSource = quizResults ?? tables;

  const filteredTables = useMemo(
    () => applySort(applyFilters(activeSource, filters), sortBy),
    [activeSource, filters, sortBy]
  );

  function toggleCompare(table) {
    setCompareList((prev) => {
      const exists = prev.find((t) => t.id === table.id);
      if (exists) return prev.filter((t) => t.id !== table.id);
      if (prev.length >= 3) return prev;
      return [...prev, table];
    });
  }

  function removeFromCompare(table) {
    setCompareList((prev) => prev.filter((t) => t.id !== table.id));
    if (compareList.length <= 1) setShowCompare(false);
  }

  function handleQuizResults(results) {
    setQuizResults(results);
    setShowQuiz(false);
    setFilters({});
    setSortBy('featured');
  }

  function clearQuiz() {
    setQuizResults(null);
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="site-header">
        <div className="header-inner">
          <a href="/" className="site-logo">
            <span className="logo-icon">🏓</span>
            <span className="logo-text">RecRoomPick</span>
          </a>
          <nav className="site-nav">
            <span className="nav-label">Table Tennis Buying Guide</span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <h1>Find the Best Table Tennis Table for Your Space</h1>
            <p>
              From beginner-friendly budget picks to tournament-grade slabs — we compare
              every spec so you don't have to.
            </p>
            <div className="hero-actions">
              <button className="btn btn-quiz" onClick={() => setShowQuiz(true)}>
                🧠 Take the Quiz — Find My Table
              </button>
              <a href="#tables" className="btn btn-ghost">
                Browse All Tables ↓
              </a>
            </div>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">{tables.length}</span>
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

      {/* Quiz result banner */}
      {quizResults && (
        <div className="quiz-result-banner">
          <div className="quiz-result-inner">
            <span>🎯 Showing your personalized recommendations ({quizResults.length} matches)</span>
            <button className="btn-text" onClick={clearQuiz}>
              Show all tables ✕
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="main-layout" id="tables">
        {/* Mobile filter toggle */}
        <button
          className="mobile-filter-toggle"
          onClick={() => setMobileFiltersOpen((o) => !o)}
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
          {/* Sort + count bar */}
          <div className="sort-bar">
            <span className="sort-count">
              {filteredTables.length} table{filteredTables.length !== 1 ? 's' : ''}
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
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredTables.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏓</div>
              <h3>No tables match your filters</h3>
              <p>Try removing a filter or two to see more options.</p>
              <button className="btn btn-primary" onClick={() => setFilters({})}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="product-grid">
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

      {/* Compare sticky bar */}
      {compareList.length > 0 && (
        <div className="compare-bar">
          <div className="compare-bar-inner">
            <div className="compare-bar-items">
              {compareList.map((t) => (
                <div key={t.id} className="compare-bar-item">
                  <img src={t.imageUrl} alt={t.name} />
                  <span>{t.brand} {t.model}</span>
                  <button onClick={() => removeFromCompare(t)}>✕</button>
                </div>
              ))}
              {compareList.length < 3 && (
                <div className="compare-bar-empty">
                  + Add {3 - compareList.length} more
                </div>
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

      {/* Modals */}
      {showCompare && (
        <CompareModal
          tables={compareList}
          onClose={() => setShowCompare(false)}
          onRemove={removeFromCompare}
        />
      )}

      {showQuiz && (
        <QuizWizard
          onResults={handleQuizResults}
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <p>
            <strong>RecRoomPick</strong> — Helping you build the perfect rec room.
          </p>
          <p className="footer-disclaimer">
            As an Amazon Associate we earn from qualifying purchases. Prices and availability
            subject to change. Last updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
          </p>
        </div>
      </footer>
    </div>
  );
}
