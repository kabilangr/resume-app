import { useEffect } from 'react';

// Sets `data-paused` on the element while it is off-screen. src/index.css pauses every CSS
// animation inside a [data-paused] element, so decorative loops cost nothing out of view.
// The attribute is written straight to the DOM, so toggling it never re-renders the section.
export function useInViewPause(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') return undefined;
    const observer = new window.IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (!entry) return;
      if (entry.isIntersecting) el.removeAttribute('data-paused');
      else el.setAttribute('data-paused', '');
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      el.removeAttribute('data-paused');
    };
  }, [ref]);
}

export default useInViewPause;
