import React from 'react';

const Frame = ({ children, id }) => (
  <svg
    viewBox="0 0 320 180"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
    className="cover-svg"
  >
    <defs>
      <linearGradient id={`cg-${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="var(--color-surface-2)" />
        <stop offset="1" stopColor="var(--card-hue)" stopOpacity="0.28" />
      </linearGradient>
      <pattern id={`cp-${id}`} width="12" height="12" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="0.8" fill="currentColor" opacity="0.12" />
      </pattern>
    </defs>
    <rect width="320" height="180" fill={`url(#cg-${id})`} />
    <rect width="320" height="180" fill={`url(#cp-${id})`} />
    <g stroke="var(--card-hue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {children}
    </g>
  </svg>
);

const soft = { fill: 'var(--card-hue)', fillOpacity: 0.22 };

export const WorkAllocationCover = () => (
  <Frame id="work">
    {[40, 118, 196].map((x, i) => (
      <g key={x}>
        <rect x={x} y="30" width="76" height="120" rx="8" />
        {Array.from({ length: 3 - (i % 2) }).map((_, j) => (
          <rect key={j} x={x + 8} y={42 + j * 34} width="60" height={24 + ((i + j) % 2) * 6} rx="5" {...soft} />
        ))}
      </g>
    ))}
    <path d="M104 60 C 150 20, 200 20, 232 60" strokeDasharray="4 5" />
    <polygon points="268 36 288 44 268 52 248 44" {...soft} />
    <path d="M258 49v7c0 3 20 3 20 0v-7" />
  </Frame>
);

export const QuoteCommerceCover = () => (
  <Frame id="quote">
    <rect x="44" y="30" width="96" height="120" rx="8" />
    <line x1="58" y1="54" x2="126" y2="54" />
    <line x1="58" y1="72" x2="112" y2="72" />
    <line x1="58" y1="90" x2="120" y2="90" />
    <rect x="58" y="118" width="68" height="14" rx="5" {...soft} />
    <line x1="152" y1="90" x2="188" y2="90" />
    <polyline points="180 82 188 90 180 98" />
    <path d="M204 66h72l-6 76h-60Z" {...soft} />
    <path d="M222 66v-8a14 14 0 0 1 36 0v8" />
  </Frame>
);

export const ChatBotCover = () => (
  <Frame id="chat">
    <rect x="40" y="28" width="240" height="124" rx="10" />
    <line x1="40" y1="50" x2="280" y2="50" />
    <rect x="56" y="64" width="110" height="30" rx="6" {...soft} />
    <line x1="56" y1="108" x2="140" y2="108" />
    <line x1="56" y1="124" x2="116" y2="124" />
    <rect x="186" y="70" width="84" height="26" rx="10" {...soft} />
    <rect x="200" y="104" width="70" height="30" rx="10" />
    {[214, 234, 254].map((x, i) => (
      <circle key={x} cx={x} cy="119" r="3" fill="var(--card-hue)" stroke="none" className="cover-dot" style={{ animationDelay: `${i * 0.2}s` }} />
    ))}
  </Frame>
);

export const ZohoAppsCover = () => (
  <Frame id="zoho">
    <rect x="40" y="38" width="64" height="112" rx="10" />
    <line x1="62" y1="48" x2="82" y2="48" />
    <rect x="52" y="62" width="40" height="30" rx="4" {...soft} />
    <rect x="120" y="44" width="150" height="96" rx="8" />
    <line x1="120" y1="60" x2="270" y2="60" />
    <rect x="132" y="72" width="60" height="56" rx="4" {...soft} />
    <path d="M222 86l18 -10 18 10v20l-18 10-18-10Z" />
    <polyline points="222 86 240 96 258 86" />
    <text x="240" y="132" fontFamily="Nunito, sans-serif" fontWeight="700" fontSize="9" textAnchor="middle" fill="var(--card-hue)" stroke="none">APK</text>
  </Frame>
);

export const WasfatCover = () => (
  <Frame id="wasfat">
    {[44, 128, 212].map((x, i) => (
      <g key={x}>
        <rect x={x} y="28" width="64" height="124" rx="10" />
        <rect x={x + 8} y="40" width="48" height="34" rx="5" {...soft} />
        <line x1={x + 8} y1="86" x2={x + 52} y2="86" />
        <line x1={x + 8} y1="100" x2={x + 40} y2="100" />
        <rect x={x + 8} y="114" width="48" height="26" rx="5" opacity={i === 1 ? 1 : 0.5} />
      </g>
    ))}
    <path d="M244 56c-4-6-14-3-12 5 2 6 12 10 12 10s10-4 12-10c2-8-8-11-12-5Z" />
  </Frame>
);

export const CrmCover = () => (
  <Frame id="crm">
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={44 + i * 10} y={34 + i * 28} width={140 - i * 20} height="20" rx="6" {...soft} />
    ))}
    <rect x="208" y="40" width="72" height="100" rx="10" />
    <circle cx="244" cy="70" r="14" />
    <line x1="222" y1="102" x2="266" y2="102" />
    <line x1="228" y1="118" x2="260" y2="118" />
  </Frame>
);

export const projectCovers = {
  'work-allocation': WorkAllocationCover,
  'quote-commerce': QuoteCommerceCover,
  'company-website': ChatBotCover,
  'zoho-apps': ZohoAppsCover,
  wasfat: WasfatCover,
  'sothebys-crm': CrmCover,
};
