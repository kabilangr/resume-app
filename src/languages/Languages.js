import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { coreStack, skillCategories } from '../data/portfolio';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useCanHover } from '../hooks/useCanHover';
import { useInViewPause } from '../hooks/useInViewPause';
import { Reveal } from '../components/motion/Reveal';
import { TiltCard } from '../components/motion/TiltCard';
import { SectionHeading } from '../components/SectionHeading';
import { FilterChips } from '../components/FilterChips';
import { categoryIcons } from '../components/icons';
import { ringIcons } from '../components/icons/ringIcons';
import './Languages.css';

const EASE = [0.16, 1, 0.3, 1];

const initials = (label) =>
  label
    .split(/[\s/.]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

function RingIcon({ name, label }) {
  const Icon = ringIcons[name];
  if (!Icon) return <span className="ring__initials" aria-hidden="true">{initials(label)}</span>;
  return <Icon size={44} />;
}

function ProficiencyRing({ item, index, reduced }) {
  const target = item.level / 100;
  const motionProps = reduced
    ? { initial: false, animate: { pathLength: target } }
    : {
        initial: { pathLength: 0 },
        whileInView: { pathLength: target },
        viewport: { once: true, amount: 0.6 },
        transition: { duration: 1.2, ease: EASE, delay: index * 0.08 },
      };
  return (
    <li className="ring" role="img" aria-label={`${item.aria}, self-assessed ${item.level} percent`} style={{ '--card-hue': item.hue }}>
      <div className="ring__dial">
        <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <g transform="rotate(-90 50 50)">
            <circle className="ring__track" cx="50" cy="50" r="42" />
            <motion.circle className="ring__bar" cx="50" cy="50" r="42" {...motionProps} />
          </g>
        </svg>
        <span className="ring__icon" aria-hidden="true"><RingIcon name={item.icon} label={item.label} /></span>
      </div>
      <span className="ring__label">{item.label}</span>
    </li>
  );
}

function CornerArt({ id }) {
  if (id === 'agents') {
    return (
      <svg className="corner-art" viewBox="0 0 120 80" aria-hidden="true" focusable="false">
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <line className="corner-art__dash" x1="60" y1="40" x2="25" y2="15" />
          <line className="corner-art__dash" x1="60" y1="40" x2="95" y2="15" />
          <line className="corner-art__dash" x1="60" y1="40" x2="60" y2="70" />
        </g>
        <circle cx="60" cy="40" r="7" fill="currentColor" />
        <circle className="corner-art__node" cx="25" cy="15" r="4" fill="currentColor" />
        <circle className="corner-art__node" cx="95" cy="15" r="4" fill="currentColor" style={{ animationDelay: '0.4s' }} />
        <circle className="corner-art__node" cx="60" cy="70" r="4" fill="currentColor" style={{ animationDelay: '0.8s' }} />
      </svg>
    );
  }
  if (id === 'vibe') {
    return (
      <svg className="corner-art" viewBox="0 0 120 80" aria-hidden="true" focusable="false">
        <rect x="8" y="6" width="104" height="68" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect className="corner-art__line" x="20" y="20" width="60" height="6" rx="3" fill="currentColor" />
        <rect className="corner-art__line" x="20" y="34" width="44" height="6" rx="3" fill="currentColor" style={{ animationDelay: '0.25s' }} />
        <rect className="corner-art__line" x="20" y="48" width="70" height="6" rx="3" fill="currentColor" style={{ animationDelay: '0.5s' }} />
        <rect className="corner-art__caret" x="94" y="46" width="5" height="10" fill="currentColor" />
      </svg>
    );
  }
  if (id === 'iot') {
    return (
      <svg className="corner-art" viewBox="0 0 120 80" aria-hidden="true" focusable="false">
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
          <path className="corner-art__dash" d="M45 44H15M75 44H105M60 52V74M60 36V26H100" />
          <rect x="45" y="36" width="30" height="16" rx="3" />
        </g>
        <circle cx="15" cy="44" r="3" fill="currentColor" />
        <circle cx="105" cy="44" r="3" fill="currentColor" />
        <circle className="corner-art__led" cx="60" cy="74" r="3" fill="currentColor" />
        <path d="M50 16a14 14 0 0 1 20 0M54 21a8 8 0 0 1 12 0" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return null;
}

function SkillCategoryCard({ cat, reduced }) {
  const canHover = useCanHover();
  const Icon = categoryIcons[cat.icon];
  return (
    <TiltCard max={7} className={`skill-card ${cat.highlight ? 'skill-card--glow' : ''}`} style={{ '--card-hue': cat.hue }}>
      <div className="skill-card__inner">
        {cat.highlight ? <CornerArt id={cat.id} /> : null}
        <motion.span
          className="skill-card__icon"
          whileHover={reduced || !canHover ? undefined : { rotate: [0, -8, 6, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Icon size={28} />
        </motion.span>
        <h3>{cat.title}</h3>
        <Reveal stagger as="ul" className="tags">
          {cat.items.map((item) => (
            <Reveal.Item as="li" key={item}>{item}</Reveal.Item>
          ))}
        </Reveal>
      </div>
    </TiltCard>
  );
}

export const Skills = () => {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef(null);
  useInViewPause(sectionRef);
  const [filter, setFilter] = useState('all');
  const options = [
    { id: 'all', label: 'All' },
    ...skillCategories.map((c) => ({ id: c.id, label: c.short, hue: c.hue })),
  ];
  const visible = filter === 'all' ? skillCategories : skillCategories.filter((c) => c.id === filter);

  const itemMotion = reduced
    ? {}
    : {
        layout: true,
        initial: { opacity: 0, scale: 0.94 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.94, transition: { duration: 0.18 } },
        transition: { duration: 0.35, ease: EASE },
      };

  return (
    <section ref={sectionRef} id="skills" className="skills" aria-labelledby="skills-title" tabIndex={-1}>
      <div className="container">
        <SectionHeading number="02" label="Skills" id="skills-title" title="Skills" />
        <div className="rings-wrap">
          <ul className="rings">
            {coreStack.map((item, i) => (
              <ProficiencyRing key={item.label} item={item} index={i} reduced={reduced} />
            ))}
          </ul>
          <p className="rings__caption">Working proficiency (self-assessed)</p>
        </div>
        <FilterChips options={options} value={filter} onChange={setFilter} ariaLabel="Filter skills by category" />
        <p className="sr-only" role="status">
          Showing {visible.length} {visible.length === 1 ? 'category' : 'categories'}
        </p>
        <ul className="skills__grid">
          <AnimatePresence mode={reduced ? 'sync' : 'popLayout'}>
            {visible.map((cat) => (
              <motion.li key={cat.id} className="skills__item" {...itemMotion}>
                <SkillCategoryCard cat={cat} reduced={reduced} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  );
};

export default Skills;
