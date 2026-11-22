import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { experience } from '../data/portfolio';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { SectionHeading } from '../components/SectionHeading';
import './workExperience.css';

function TimelineItem({ job, index, reduced }) {
  const current = job.end === null;
  const side = index % 2 === 0 ? -40 : 40;
  const cardMotion = reduced
    ? {}
    : {
        className: 'timeline__card',
        initial: { opacity: 0, x: side },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        whileHover: { y: -3 },
      };
  const Card = reduced ? 'article' : motion.article;
  const nodeProps = reduced
    ? {}
    : {
        initial: { scale: 0.4 },
        whileInView: { scale: 1 },
        viewport: { once: true },
        transition: { type: 'spring', stiffness: 300, damping: 18, delay: 0.1 },
      };
  const Node = reduced ? 'span' : motion.span;

  return (
    <li className={`timeline__item ${index % 2 === 0 ? 'is-left' : 'is-right'}`} data-current={current ? 'true' : undefined}>
      <Node className="timeline__node" aria-hidden="true" {...nodeProps} />
      <p className="timeline__date-side" aria-hidden="true">
        {job.start} - {current ? '' : job.end}
      </p>
      <Card className="timeline__card" {...cardMotion}>
        <p className="timeline__date">
          {job.start} - {current ? <span className="badge">Present</span> : job.end}
        </p>
        <h3 className="timeline__role">{job.role}</h3>
        <p className="timeline__company">
          {job.company}
          {job.location ? <span className="timeline__loc">, {job.location}</span> : null}
        </p>
        <p className="timeline__desc">{job.description}</p>
      </Card>
    </li>
  );
}

export const WorkExperience = () => {
  const reduced = usePrefersReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="experience" className="experience" aria-labelledby="experience-title" tabIndex={-1}>
      <div className="container">
        <SectionHeading number="03" label="Experience" id="experience-title" title="Experience" />
        <div className="timeline" ref={ref}>
          <div className="timeline__rail" aria-hidden="true">
            <motion.div className="timeline__line" style={{ scaleY: reduced ? 1 : scaleY }} />
          </div>
          <ol className="timeline__list">
            {experience.map((job, i) => (
              <TimelineItem key={job.id} job={job} index={i} reduced={reduced} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default WorkExperience;
