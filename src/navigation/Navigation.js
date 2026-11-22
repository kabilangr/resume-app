import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { NAV_ITEMS, SECTION_IDS } from '../utils/Constants';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import './Navigation.css';

const Navigation = () => {
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const burgerRef = useRef(null);

  const closeMenu = useCallback((returnFocus) => {
    setOpen(false);
    if (returnFocus === true && burgerRef.current) burgerRef.current.focus();
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

  // Esc, resize and scroll lock
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeMenu(true);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) closeMenu(false);
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      document.body.style.overflow = '';
    };
  }, [open, closeMenu]);

  const focusTarget = (id) => {
    const el = document.getElementById(id);
    if (el) el.focus({ preventScroll: true });
  };

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
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      <MobileMenu open={open} onClose={closeMenu} activeId={activeId} />
    </header>
  );
};

export default Navigation;
