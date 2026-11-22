import React from 'react';

export function FilterChips({ options, value, onChange, ariaLabel, className = '' }) {
  return (
    <div className={`chips ${className}`.trim()} role="group" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className="chip"
          aria-pressed={value === opt.id}
          onClick={() => onChange(opt.id)}
          style={opt.hue ? { '--chip-hue': opt.hue } : undefined}
        >
          <span className="chip__dot" aria-hidden="true" />
          <span className="chip__label">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

export default FilterChips;
