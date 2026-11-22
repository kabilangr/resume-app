import React from 'react';

// Builds a stroke icon component from SVG children.
export function createIcon(displayName, children, { filled = false } = {}) {
  const Icon = ({ size = 24, title, ...props }) => (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
  Icon.displayName = displayName;
  return Icon;
}
