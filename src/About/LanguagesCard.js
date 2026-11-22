import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { languages } from '../data/portfolio';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { TiltCard } from '../components/motion/TiltCard';
import { LanguageIcon } from '../components/icons';
import './LanguagesCard.css';

const CYCLE_MS = 4000;
const EASE = [0.16, 1, 0.3, 1];
const DOTS = [0, 1, 2, 3, 4];

export function LanguagesCard() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacted, setInteracted] = useState(false);

  // Ambient auto-cycle: off for reduced motion, while hovered or focused, and for
  // good after the first click.
  useEffect(() => {
    if (reduced || paused || interacted) return undefined;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % languages.length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reduced, paused, interacted]);

  const choose = (i) => {
    setInteracted(true);
    setIndex(i);
  };

  const current = languages[index];
  const content = (
    <>
      <span className="langs__greeting grad" lang={current.lang}>{current.greeting}</span>
      {current.romanized ? <span className="langs__roman">({current.romanized})</span> : null}
      <p className="langs__note" lang={current.lang}>{current.note}</p>
      <span className="langs__tag">{current.code} · {current.level}</span>
    </>
  );

  return (
    <TiltCard max={4} className="langs">
      <div
        className="langs__body"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <span className="langs__title"><LanguageIcon size={20} /> Languages</span>
        <ul className="langs__list">
          {languages.map((l, i) => (
            <li key={l.code}>
              <button type="button" className="langs__btn" aria-pressed={i === index} onClick={() => choose(i)}>
                <span className="langs__name">{l.name}</span>
                <span className="langs__meter" aria-hidden="true">
                  {DOTS.map((d) => (
                    <span key={d} className="langs__dot" style={{ '--i': d }} />
                  ))}
                </span>
                <span className="sr-only">{l.level}, 5 of 5</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="langs__stage" aria-live={interacted ? 'polite' : 'off'} aria-atomic="true">
          {reduced ? (
            <div className="langs__slide" key={current.code}>{content}</div>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                className="langs__slide"
                key={current.code}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                {content}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </TiltCard>
  );
}

export default LanguagesCard;
