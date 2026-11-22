import { useEffect, useState } from 'react';

// True only on devices with a real hovering pointer (mouse, trackpad). Touch browsers emulate
// mouseenter on tap, so every framer hover prop and mouse-enter handler is gated on this.
const QUERY = '(hover: hover) and (pointer: fine)';

const read = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? !!window.matchMedia(QUERY).matches
    : false;

export function useCanHover() {
  const [canHover, setCanHover] = useState(read);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const mql = window.matchMedia(QUERY);
    const onChange = () => setCanHover(!!mql.matches);
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

  return canHover;
}

export default useCanHover;
