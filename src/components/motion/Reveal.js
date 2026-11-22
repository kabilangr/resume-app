import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const EASE = [0.16, 1, 0.3, 1];

const offsets = {
  up: { y: 28 },
  left: { x: -32 },
  right: { x: 32 },
  scale: { scale: 0.94 },
};

const makeVariants = (direction) => ({
  hidden: { opacity: 0, ...(offsets[direction] || offsets.up) },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE, delay },
  }),
});

const staggerParent = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const viewport = { once: true, amount: 0.2, margin: '0px 0px -8% 0px' };

export function Reveal({ children, delay = 0, direction = 'up', as = 'div', stagger = false, className, ...rest }) {
  const reduced = usePrefersReducedMotion();
  const Tag = motion[as] || motion.div;
  const PlainTag = as;

  if (reduced) {
    return (
      <PlainTag className={className} {...rest}>
        {children}
      </PlainTag>
    );
  }

  if (stagger) {
    return (
      <Tag className={className} variants={staggerParent} initial="hidden" whileInView="visible" viewport={viewport} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      variants={makeVariants(direction)}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({ children, as = 'div', className, ...rest }) {
  const reduced = usePrefersReducedMotion();
  const Tag = motion[as] || motion.div;
  const PlainTag = as;
  if (reduced) {
    return (
      <PlainTag className={className} {...rest}>
        {children}
      </PlainTag>
    );
  }
  return (
    <Tag className={className} variants={itemVariants} {...rest}>
      {children}
    </Tag>
  );
}

Reveal.Item = RevealItem;

export default Reveal;
