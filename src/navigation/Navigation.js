import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { NAV_ITEMS, SECTION_IDS } from '../utils/Constants';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import './Navigation.css';

// While the menu is open the page behind it is inert. React 18.2 has no `inert` prop, so the
// attribute is written by hand. Both helpers are idempotent and are also called straight from the
// close handlers: `inert` must be gone before focus moves, or the focus call is ignored.
const INERT_TARGETS = ['.nav__bar', '#main', 'footer', '.skip-link'];
const setInert = (on) => {
  INERT_TARGETS.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      if (on) el.setAttribute('inert', '');
      else el.removeAttribute('inert');
    });
  });
};
const lockScroll = (on) => {
  const v = on ? 'hidden' : '';
  document.documentElement.style.overflow = v;
  document.body.style.overflow = v;
};
const releasePage = () => {
  setInert(false);
  lockScroll(false);
};

const focusTarget = (id) => {
  const el = document.getElementById(id);
  if (el) el.focus({ preventScroll: true });
};

const Navigation = () => {
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const burgerRef = useRef(null);

  // Close button, Esc, burger and resize: release the page first, then (optionally) focus the burger.
  const closeMenu = useCallback((returnFocus) => {
    releasePage();
    setOpen(false);
    if (returnFocus === true && burgerRef.current) burgerRef.current.focus();
  }, []);

  // Menu link: release the page, then move focus to the section, not the burger.
  const navigateFromMenu = useCallback((id) => {
    releasePage();
    setOpen(false);
    focusTarget(id);
  }, []);

  // sticky bar style
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // scroll spy
  useEffect(() => {
    if (typeof window.IntersectionObserver !== 'function') return undefined;
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Esc, resize past the desktop breakpoint, inert page and scroll lock
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeMenu(true);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) closeMenu(false);
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    setInert(true);
    lockScroll(true);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      releasePage();
    };
  }, [open, closeMenu]);

  return (
    <header className="nav" data-scrolled={scrolled ? 'true' : 'false'}>
      <div className="container nav__bar">
        <a className="nav__logo" href="#hero" aria-label="Kabilan GR, home" onClick={() => focusTarget('hero')}>
          <Logo />
        </a>
        <nav aria-label="Main" className="nav__main">
          <ul className="nav__links">
            {NAV_ITEMS.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className="nav__link"
                  aria-current={activeId === n.id ? 'true' : undefined}
                  onClick={() => focusTarget(n.id)}
                >
                  {activeId === n.id ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="nav__pill"
                      aria-hidden="true"
                      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <span className="nav__label">{n.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav__actions">
          <ThemeToggle />
          <button
            ref={burgerRef}
            type="button"
            className="nav__burger"
            data-open={open ? 'true' : 'false'}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => (open ? closeMenu(true) : setOpen(true))}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      <MobileMenu open={open} onClose={closeMenu} onNavigate={navigateFromMenu} activeId={activeId} />
    </header>
  );
};

export default Navigation;
