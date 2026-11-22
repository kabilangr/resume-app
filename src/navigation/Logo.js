import React from 'react';

// Inline "Bot visor K" monogram (same geometry as public/logo.svg) plus the "kabilan.me"
// wordmark. The shell stroke and the ear pods follow the --logo-* tokens so the head stays
// readable in both themes; every other colour is constant. Decorative: the parent link
// carries the accessible name.
const KPATH = 'M26 24V42M26 34L37 24M30 30.4L38 42';

function BoldVisorK() {
  return (
    <>
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="20"
        fill="#f6ecdd"
        strokeWidth="3"
        style={{ stroke: 'var(--logo-keyline, #2b1912)' }}
      />
      <rect x="10" y="15" width="44" height="34" rx="13" fill="#1a1220" />
      <path
        d="M25 23V41M25 32.5L38 23M30 28.9L39.5 41"
        fill="none"
        stroke="#6fdcff"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

function FullLogo() {
  const ear = { fill: 'var(--logo-ear, #2b1912)', stroke: 'var(--logo-ear-stroke, #2b1912)' };
  return (
    <>
      <circle cx="8" cy="34" r="6" strokeWidth="1.5" style={ear} />
      <circle cx="56" cy="34" r="6" strokeWidth="1.5" style={ear} />
      <circle cx="8" cy="34" r="3" fill="none" stroke="#6fdcff" strokeWidth="1.8" />
      <circle cx="56" cy="34" r="3" fill="none" stroke="#6fdcff" strokeWidth="1.8" />
      <rect
        x="9"
        y="10"
        width="46"
        height="46"
        rx="17"
        fill="#f6ecdd"
        strokeWidth="2.5"
        style={{ stroke: 'var(--logo-keyline, #2b1912)' }}
      />
      <path d="M22 51.5H42" fill="none" stroke="#e3d2b8" strokeWidth="2" strokeLinecap="round" />
      <rect x="15" y="19" width="34" height="28" rx="11" fill="#1a1220" />
      <path
        d="M20.5 25.5C22 22.7 24.7 21.5 28 21.5"
        fill="none"
        stroke="#fffaf3"
        strokeOpacity="0.22"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d={KPATH} fill="none" stroke="#6fdcff" strokeOpacity="0.22" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={KPATH} fill="none" stroke="#6fdcff" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="43" cy="15" r="1.9" fill="#ffcf7a" />
    </>
  );
}

export function Logo({ className = '', size = 40 }) {
  return (
    <span className={`logo ${className}`.trim()} aria-hidden="true">
      <svg className="logo__mark" viewBox="0 0 64 64" width={size} height={size} focusable="false">
        {size < 36 ? <BoldVisorK /> : <FullLogo />}
      </svg>
      <span className="logo__word">
        kabilan<span className="logo__tld">.me</span>
      </span>
    </span>
  );
}

export default Logo;
