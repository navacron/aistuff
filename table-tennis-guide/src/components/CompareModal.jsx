import React from 'react';

const ROWS = [
  { label: 'Price', render: (t) => `$${t.salePrice ?? t.price}${t.salePrice ? ` (was $${t.price})` : ''}` },
  { label: 'Surface Thickness', render: (t) => `${t.thicknessMm}mm` },
  { label: 'Size', render: (t) => t.size.charAt(0).toUpperCase() + t.size.slice(1) },
  { label: 'Environment', render: (t) => t.environment },
  { label: 'Skill Level', render: (t) => t.skillLevel },
  { label: 'Dimensions (cm)', render: (t) => `${t.dimensions.lengthCm} × ${t.dimensions.widthCm} × ${t.dimensions.heightCm}` },
  { label: 'Weight', render: (t) => `${t.weightLbs} lbs` },
  { label: 'Foldable', render: (t) => (t.foldable ? '✓ Yes' : '✗ No') },
  { label: 'Playback Mode', render: (t) => (t.playbackMode ? '✓ Yes' : '✗ No') },
  { label: 'Wheeled Legs', render: (t) => (t.wheeledLegs ? '✓ Yes' : '✗ No') },
  { label: 'Net Included', render: (t) => (t.netIncluded ? '✓ Yes' : '✗ No') },
  { label: 'Paddles Included', render: (t) => t.paddlesIncluded || '—' },
  { label: 'Balls Included', render: (t) => t.ballsIncluded || '—' },
  { label: 'Assembly Time', render: (t) => `~${t.assemblyTimeMin} min` },
  { label: 'Assembly Difficulty', render: (t) => t.assemblyDifficulty },
  { label: 'Warranty', render: (t) => t.warranty },
  { label: 'Rating', render: (t) => `${'★'.repeat(Math.round(t.rating))} ${t.rating} (${t.reviewCount.toLocaleString()})` },
];

function highlight(tables, rowRender) {
  // Returns index of the "best" value cell (for numeric-comparable rows)
  const values = tables.map(rowRender);
  return null; // extend here to auto-highlight best values
}

export default function CompareModal({ tables, onClose, onRemove }) {
  if (!tables || tables.length === 0) return null;

  return (
    <div className="compare-overlay" onClick={onClose}>
      <div
        className="compare-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ '--col-count': tables.length }}
      >
        <div className="compare-modal-header">
          <h2>Side-by-Side Comparison</h2>
          <button className="compare-close" onClick={onClose}>✕ Close</button>
        </div>

        <div className="compare-scroll">
          <table className="compare-table">
            <thead>
              <tr>
                <th className="compare-label-col">Feature</th>
                {tables.map((t) => (
                  <th key={t.id} className="compare-product-col">
                    <div className="compare-product-header">
                      <img src={t.imageUrl} alt={t.name} className="compare-product-img" />
                      <div className="compare-product-name">{t.name}</div>
                      {t.badge && <div className="compare-product-badge">{t.badge}</div>}
                      <button
                        className="compare-remove"
                        onClick={() => onRemove(t)}
                        title="Remove from comparison"
                      >
                        ✕
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <td className="compare-row-label">{row.label}</td>
                  {tables.map((t) => (
                    <td key={t.id} className="compare-row-value">
                      {row.render(t)}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Pros row */}
              <tr className="compare-section-divider">
                <td colSpan={tables.length + 1}>Pros &amp; Cons</td>
              </tr>
              <tr>
                <td className="compare-row-label">Pros</td>
                {tables.map((t) => (
                  <td key={t.id} className="compare-row-value">
                    <ul className="compare-list compare-list--pros">
                      {t.pros.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="compare-row-label">Cons</td>
                {tables.map((t) => (
                  <td key={t.id} className="compare-row-value">
                    <ul className="compare-list compare-list--cons">
                      {t.cons.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* CTA row */}
              <tr>
                <td className="compare-row-label"></td>
                {tables.map((t) => (
                  <td key={t.id} className="compare-row-value compare-cta">
                    <a
                      href={t.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="btn btn-primary"
                    >
                      Buy on Amazon ↗
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
