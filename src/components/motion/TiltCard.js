import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useCanHover } from '../../hooks/useCanHover';
import './TiltCard.css';

const SPRING = { stiffness: 200, damping: 20, mass: 0.5 };

export function TiltCard({ children, max = 7, className = '', style, as = 'div', ...rest }) {
  const reduced = usePrefersReducedMotion();
  const canHover = useCanHover();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), SPRING);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), SPRING);
  const Tag = motion[as] || motion.div;
  const PlainTag = as;
  const cls = `tilt-card ${className}`.trim();

  if (reduced) {
    return (
      <PlainTag className={cls} style={style} {...rest}>
        <span className="tilt-card__spot" aria-hidden="true" />
        <div className="tilt-card__content">{children}</div>
      </PlainTag>
    );
  }

  const handleMove = (e) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px - 0.5);
    y.set(py - 0.5);
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Tag
      ref={ref}
      className={cls}
      style={{ ...style, rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      whileHover={canHover ? { y: -4 } : undefined}
      transition={{ duration: 0.2 }}
      {...rest}
    >
      <span className="tilt-card__spot" aria-hidden="true" />
      <div className="tilt-card__content">{children}</div>
    </Tag>
  );
}

export default TiltCard;
