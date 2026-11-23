import React from 'react';
import { motion } from 'framer-motion';
import { featuredProject as fp } from '../data/portfolio';
import { ImageUtil } from '../utils/ImageUtil';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useCanHover } from '../hooks/useCanHover';
import { TiltCard } from '../components/motion/TiltCard';
import { categoryIcons, ExternalIcon, LockIcon, MoonIcon } from '../components/icons';

const fanOpen = [
  { rotate: -8, x: -6 },
  { rotate: 0, x: 0 },
  { rotate: 8, x: 6 },
];
const fanFlat = [
  { rotate: 0, x: 0 },
  { rotate: 0, x: 0 },
  { rotate: 0, x: 0 },
];
const fanRest = [
  { rotate: -4, x: 0 },
  { rotate: 0, x: 0 },
  { rotate: 4, x: 0 },
];

function MathiPanel() {
  const m = fp.mathi;
  return (
    <aside className="mathi" aria-labelledby="mathi-title">
      <span className="mathi__moon" aria-hidden="true"><MoonIcon size={120} /></span>
      <div className="mathi__head">
        <MoonIcon size={22} />
        <h4 id="mathi-title">{m.title}</h4>
      </div>
      <p>{m.text}</p>
      <ol className="mathi__pipeline" aria-label="Mathi agent components">
        {m.components.map((c, i) => (
          <li key={c}>
            <span className="mathi__num" aria-hidden="true">{i + 1}</span>
            {c}
          </li>
        ))}
      </ol>
    </aside>
  );
}

function MediaGallery({ reduced }) {
  const canHover = useCanHover();
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const rowRef = React.useRef(null);
  const count = fp.screenshots.length;
  const [desktop, setDesktop] = React.useState(
    () => typeof window.matchMedia === 'function' && window.matchMedia('(min-width: 1024px)').matches
  );
  React.useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const mql = window.matchMedia('(min-width: 1024px)');
    const update = () => setDesktop(!!mql.matches);
    update();
    if (mql.addEventListener) {
      mql.addEventListener('change', update);
      return () => mql.removeEventListener('change', update);
    }
    return undefined;
  }, []);
  // The fan only applies on desktop; below 1024px the phones sit straight in a scroll-snap row.
  // Dots and the live text follow the scroll position of the row (below 1024).
  React.useEffect(() => {
    const row = rowRef.current;
    if (!row) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const span = Math.max(1, row.scrollWidth - row.clientWidth);
      const next = Math.round((row.scrollLeft / span) * (count - 1));
      setIndex(Math.max(0, Math.min(count - 1, next)));
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    row.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      row.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [count]);
  const pos = !desktop ? fanFlat : open && !reduced ? fanOpen : fanRest;
  return (
    <div className="gallery-wrap">
      <div
        ref={rowRef}
        className="gallery"
        role="region"
        aria-label="Valam screenshots"
        tabIndex={0}
        onMouseEnter={canHover ? () => setOpen(true) : undefined}
        onMouseLeave={canHover ? () => setOpen(false) : undefined}
      >
        {fp.screenshots.map((s, i) => (
          <motion.figure
            key={s.id}
            className={`gallery__phone gallery__phone--${i}`}
            initial={false}
            animate={pos[i]}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            style={{ '--float-delay': `${i * 0.6}s` }}
          >
            <img
              src={ImageUtil.valamShots[s.id]}
              alt={s.alt}
              width="414"
              height="900"
              loading="lazy"
            />
          </motion.figure>
        ))}
      </div>
      <div className="gallery__dots" aria-hidden="true">
        {fp.screenshots.map((s, i) => (
          <span key={s.id} className={i === index ? 'is-active' : undefined} />
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Screenshot {index + 1} of {count}
      </p>
    </div>
  );
}

export function FeaturedProject() {
  const reduced = usePrefersReducedMotion();
  return (
    <article className="project-card featured" data-featured="true" aria-labelledby="valam-title">
      <TiltCard max={3} className="featured__card">
        <div className="featured__glow" aria-hidden="true" />
        <div className="featured__body">
            <div className="featured__header">
              <img
                className="featured__icon"
                src={ImageUtil.valamIcon}
                alt="Valam app icon"
                width="72"
                height="72"
                loading="lazy"
              />
              <div>
                <p className="eyebrow">Featured project</p>
                <h3 id="valam-title">{fp.title}</h3>
                <p className="featured__tamil">{fp.tamil}</p>
              </div>
            </div>
            <p className="lead featured__lead">{fp.tagline}</p>
            <MediaGallery reduced={reduced} />
            <ul className="featured__features">
              {fp.features.map((f) => {
                const Icon = categoryIcons[f.icon];
                return (
                  <li key={f.icon}>
                    <Icon size={20} />
                    <span>{f.text}</span>
                  </li>
                );
              })}
            </ul>
            <ul className="privacy-strip" aria-label="Privacy">
              {fp.privacy.map((p) => (
                <li key={p}>
                  <LockIcon size={14} /> {p}
                </li>
              ))}
            </ul>
            <MathiPanel />
            <ul className="tags">
              {fp.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <a className="btn btn--primary featured__btn" href={fp.url} target="_blank" rel="noopener noreferrer">
              Visit valam.io <ExternalIcon size={18} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
        </div>
      </TiltCard>
    </article>
  );
}

export default FeaturedProject;
