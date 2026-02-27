import React from 'react';

const SKILL_COLORS = {
  beginner: '#2e7d32',
  intermediate: '#1565c0',
  advanced: '#6a1b9a',
  professional: '#b71c1c',
};

const ENV_ICON = {
  indoor: '🏠',
  outdoor: '☀️',
  both: '🌐',
};

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="star-rating" title={`${rating} out of 5`}>
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(5 - full - (half ? 1 : 0))}
      <span className="star-num">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function ProductCard({ table, onCompare, compareSelected, compareDisabled }) {
  const displayPrice = table.salePrice ?? table.price;
  const hasSale = table.salePrice && table.salePrice < table.price;

  return (
    <div className={`product-card ${compareSelected ? 'product-card--selected' : ''}`}>
      {table.badge && <div className="product-badge">{table.badge}</div>}

      <div className="product-image-wrap">
        <img
          src={table.imageUrl}
          alt={table.name}
          className="product-image"
          loading="lazy"
        />
        <div className="product-env-tag" title={`${table.environment} use`}>
          {ENV_ICON[table.environment]} {table.environment}
        </div>
      </div>

      <div className="product-body">
        <div className="product-brand">{table.brand}</div>
        <h3 className="product-name">{table.name}</h3>

        <div className="product-meta">
          <StarRating rating={table.rating} />
          <span className="product-reviews">({table.reviewCount.toLocaleString()})</span>
        </div>

        <div className="product-price-row">
          <span className="product-price">${displayPrice}</span>
          {hasSale && (
            <span className="product-price-original">${table.price}</span>
          )}
        </div>

        {/* Quick specs */}
        <div className="product-specs">
          <div className="spec-chip">
            <span className="spec-label">Surface</span>
            <span className="spec-value">{table.thicknessMm}mm</span>
          </div>
          <div className="spec-chip">
            <span className="spec-label">Size</span>
            <span className="spec-value capitalize">{table.size}</span>
          </div>
          <div
            className="spec-chip"
            style={{ borderColor: SKILL_COLORS[table.skillLevel] + '55', color: SKILL_COLORS[table.skillLevel] }}
          >
            <span className="spec-value capitalize">{table.skillLevel}</span>
          </div>
          {table.playbackMode && (
            <div className="spec-chip spec-chip--feature">Playback Mode</div>
          )}
          {table.paddlesIncluded > 0 && (
            <div className="spec-chip spec-chip--feature">
              {table.paddlesIncluded} Paddles
            </div>
          )}
        </div>

        <p className="product-summary">{table.summary}</p>

        {/* Pros / Cons */}
        <div className="product-pros-cons">
          <div className="pros">
            <div className="pros-cons-label pros-label">Pros</div>
            <ul>
              {table.pros.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
          <div className="cons">
            <div className="pros-cons-label cons-label">Cons</div>
            <ul>
              {table.cons.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="product-actions">
          <a
            href={table.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="btn btn-primary"
          >
            View on Amazon ↗
          </a>
          <button
            className={`btn ${compareSelected ? 'btn-compare-active' : 'btn-compare'}`}
            onClick={() => onCompare(table)}
            disabled={compareDisabled && !compareSelected}
            title={compareDisabled && !compareSelected ? 'Max 3 tables selected' : ''}
          >
            {compareSelected ? '✓ Added' : '+ Compare'}
          </button>
        </div>

        <div className="product-footnote">
          <span>{table.warranty} warranty</span>
          <span>·</span>
          <span>~{table.assemblyTimeMin} min setup</span>
        </div>
      </div>
    </div>
  );
}
