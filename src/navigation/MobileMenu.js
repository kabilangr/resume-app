import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV_ITEMS } from '../utils/Constants';
import { profile } from '../data/portfolio';
import { SocialLinks } from '../components/SocialLinks';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const overlay = {
  hidden: { opacity: 0, clipPath: 'circle(0% at calc(100% - 52px) 32px)' },
  visible: {
    opacity: 1,
    clipPath: 'circle(150% at calc(100% - 52px) 32px)',
    transition: { duration: 0.55, ease: [0.65, 0, 0.35, 1] },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};
const list = { hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } };
const item = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};
const plainOverlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.12 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};
const plain = { hidden: {}, visible: {} };

export function MobileMenu({ open, onClose, activeId }) {
  const reduced = usePrefersReducedMotion();
  return (
    <AnimatePresence>
      {open ? (
        <MenuPanel key="menu" reduced={reduced} onClose={onClose} activeId={activeId} />
      ) : null}
    </AnimatePresence>
  );
}

function MenuPanel({ reduced, onClose, activeId }) {
  const ref = useRef(null);

  useEffect(() => {
    const links = ref.current ? ref.current.querySelectorAll('a[href]') : [];
    if (links.length) links[0].focus();
  }, []);

  const onKeyDown = (e) => {
    if (e.key !== 'Tab' || !ref.current) return;
    const focusables = ref.current.querySelectorAll('a[href], button');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const o = reduced ? plainOverlay : overlay;
  const l = reduced ? plain : list;
  const i = reduced ? plain : item;

  return (
    <motion.div
      ref={ref}
      id="mobile-menu"
      className="menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      variants={o}
      initial="hidden"
      animate="visible"
      exit="exit"
      onKeyDown={onKeyDown}
    >
      <motion.ul variants={l} initial="hidden" animate="visible" className="menu__list">
        {NAV_ITEMS.map((n, idx) => (
          <motion.li key={n.id} variants={i}>
            <a
              href={`#${n.id}`}
              className="menu__link"
              aria-current={activeId === n.id ? 'true' : undefined}
              onClick={onClose}
            >
              <span className="menu__index" aria-hidden="true">{String(idx + 1).padStart(2, '0')}</span>
              {n.label}
            </a>
          </motion.li>
        ))}
      </motion.ul>
      <div className="menu__foot">
        <SocialLinks />
        <small>{profile.shortLocation}</small>
      </div>
    </motion.div>
  );
}

export default MobileMenu;
