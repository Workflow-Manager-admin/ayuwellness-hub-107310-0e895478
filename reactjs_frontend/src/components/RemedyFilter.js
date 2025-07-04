import React from "react";

// PUBLIC_INTERFACE
function RemedyFilter({ categories, current, onChange }) {
  return (
    <div className="ayu-remedy-filter">
      {categories.map(cat => (
        <button
          key={cat}
          className={`ayu-btn ayu-btn-chip${current === cat ? ' active' : ''}`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default RemedyFilter;
