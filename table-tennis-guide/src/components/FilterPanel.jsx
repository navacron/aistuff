import React from 'react';
import { filterConfig } from '../data/config';

export default function FilterPanel({ filters, onChange, totalCount, filteredCount }) {
  function toggle(key, value) {
    const current = filters[key] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  }

  function toggleFeature(key) {
    onChange({ ...filters, [key]: !filters[key] });
  }

  function clearAll() {
    onChange({});
  }

  const hasFilters = Object.values(filters).some((v) =>
    Array.isArray(v) ? v.length > 0 : !!v
  );

  return (
    <aside className="filter-panel">
      <div className="filter-panel-header">
        <span className="filter-panel-title">Filters</span>
        {hasFilters && (
          <button className="filter-clear-btn" onClick={clearAll}>
            Clear all
          </button>
        )}
      </div>

      <div className="filter-count">
        Showing {filteredCount} of {totalCount} tables
      </div>

      {/* Price */}
      <div className="filter-section">
        <div className="filter-section-title">Price</div>
        {filterConfig.priceRanges.map((range) => {
          const val = `${range.min}-${range.max}`;
          const active = (filters.priceRanges || []).includes(val);
          return (
            <label key={val} className="filter-checkbox">
              <input
                type="checkbox"
                checked={active}
                onChange={() => toggle('priceRanges', val)}
              />
              <span>{range.label}</span>
            </label>
          );
        })}
      </div>

      {/* Skill Level */}
      <div className="filter-section">
        <div className="filter-section-title">Skill Level</div>
        {filterConfig.skillLevels.map((level) => {
          const active = (filters.skillLevels || []).includes(level.value);
          return (
            <label key={level.value} className="filter-checkbox">
              <input
                type="checkbox"
                checked={active}
                onChange={() => toggle('skillLevels', level.value)}
              />
              <span>
                <strong>{level.label}</strong>
                <span className="filter-hint"> — {level.description}</span>
              </span>
            </label>
          );
        })}
      </div>

      {/* Environment */}
      <div className="filter-section">
        <div className="filter-section-title">Environment</div>
        {filterConfig.environments.map((env) => {
          const active = (filters.environments || []).includes(env.value);
          return (
            <label key={env.value} className="filter-checkbox">
              <input
                type="checkbox"
                checked={active}
                onChange={() => toggle('environments', env.value)}
              />
              <span>{env.label}</span>
            </label>
          );
        })}
      </div>

      {/* Table Size */}
      <div className="filter-section">
        <div className="filter-section-title">Table Size</div>
        {filterConfig.sizes.map((sz) => {
          const active = (filters.sizes || []).includes(sz.value);
          return (
            <label key={sz.value} className="filter-checkbox">
              <input
                type="checkbox"
                checked={active}
                onChange={() => toggle('sizes', sz.value)}
              />
              <span>
                <strong>{sz.label}</strong>
                <span className="filter-hint"> — {sz.description}</span>
              </span>
            </label>
          );
        })}
      </div>

      {/* Features */}
      <div className="filter-section">
        <div className="filter-section-title">Features</div>
        {filterConfig.features.map((feat) => (
          <label key={feat.key} className="filter-checkbox">
            <input
              type="checkbox"
              checked={!!filters[feat.key]}
              onChange={() => toggleFeature(feat.key)}
            />
            <span>{feat.label}</span>
          </label>
        ))}
      </div>
    </aside>
  );
}
