import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const read = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? !!window.matchMedia(QUERY).matches
    : false;

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(read);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const mql = window.matchMedia(QUERY);
    const onChange = () => setReduced(!!mql.matches);
    onChange();
    if (mql.addEventListener) {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }
    if (mql.addListener) {
      mql.addListener(onChange);
      return () => mql.removeListener(onChange);
    }
    return undefined;
  }, []);

  return reduced;
}

export default usePrefersReducedMotion;
