import React from 'react';
import { motion } from 'framer-motion';
import { Reveal } from './motion/Reveal';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import './SectionHeading.css';

export function SectionHeading({ number, label, id, title, accent, lead }) {
  const reduced = usePrefersReducedMotion();
  const Bar = reduced ? 'span' : motion.span;
  const barProps = reduced
    ? {}
    : {
        initial: { scaleX: 0 },
        whileInView: { scaleX: 1 },
        viewport: { once: true },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      };
  return (
    <div className="section-heading">
      <p className="eyebrow">
        <Bar className="section-heading__bar" aria-hidden="true" {...barProps} />
        <span aria-hidden="true">{number} / </span>
        {label}
      </p>
      <Reveal as="div">
        <h2 id={id}>
          {title}
          {accent ? <> <span className="grad">{accent}</span></> : null}
        </h2>
      </Reveal>
      {lead ? (
        <Reveal delay={0.1}>
          <p className="lead">{lead}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

export default SectionHeading;
