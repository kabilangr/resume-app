import React from 'react';
import { createIcon } from './createIcon';
import { AgentsIcon, ChipIcon } from './index';

// Centre icons for the proficiency rings. Pure inline SVG using currentColor, so the
// ring sets the colour (always visible in both themes). Generic glyphs, not trademarks.
export const ReactAtomIcon = createIcon(
  'ReactAtomIcon',
  <>
    <ellipse cx="12" cy="12" rx="10" ry="4" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
  </>
);

export const NodeHexIcon = createIcon(
  'NodeHexIcon',
  <>
    <path d="M12 2.5l8.2 4.75v9.5L12 21.5l-8.2-4.75v-9.5L12 2.5Z" />
    <text x="12" y="15" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="Fraunces, Georgia, serif" fill="currentColor" stroke="none">JS</text>
  </>
);

export const TsIcon = createIcon(
  'TsIcon',
  <>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="Fraunces, Georgia, serif" fill="currentColor" stroke="none">TS</text>
  </>
);

// Three slanted bars, a generic chevron
export const FlutterIcon = createIcon(
  'FlutterIcon',
  <>
    <path d="M14 3l7 0-11 11-3.5-3.5L14 3Z" />
    <path d="M10 14l4 4 7 0-6-6" />
    <path d="M10.5 18.5L14 22" />
  </>
);

export const ringIcons = {
  react: ReactAtomIcon,
  node: NodeHexIcon,
  ts: TsIcon,
  flutter: FlutterIcon,
  agents: AgentsIcon,
  chip: ChipIcon,
};
