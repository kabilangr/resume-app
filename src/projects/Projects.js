import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { featuredProject, projectFilters, projects } from '../data/portfolio';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useInViewPause } from '../hooks/useInViewPause';
import { TiltCard } from '../components/motion/TiltCard';
import { Reveal } from '../components/motion/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import { FilterChips } from '../components/FilterChips';
import { projectCovers } from '../components/illustrations/ProjectCovers';
import { FeaturedProject } from './FeaturedProject';
import './Projects.css';

const EASE = [0.16, 1, 0.3, 1];

function ProjectCard({ project }) {
  const Cover = projectCovers[project.id];
  return (
    <TiltCard className="project-card" style={{ '--card-hue': project.hue }}>
      <div className="project-card__cover" aria-hidden="true">
        <Cover />
      </div>
      <div className="project-card__body">
        <p className="project-card__cat">{project.categories.join(' · ')}</p>
        <h3>{project.title}</h3>
        <p className="project-card__desc">{project.description}</p>
        <ul className="tags">
          {project.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </TiltCard>
  );
}

export const Projects = () => {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef(null);
  useInViewPause(sectionRef);
  const [filter, setFilter] = useState('All');
  const options = projectFilters.map((f) => ({ id: f, label: f }));
  const shown = projects.filter((p) => filter === 'All' || p.categories.includes(filter));
  const showFeatured = filter === 'All' || featuredProject.categories.includes(filter);
  const total = shown.length + (showFeatured ? 1 : 0);

  const itemMotion = reduced
    ? {}
    : {
        layout: true,
        initial: { opacity: 0, y: 20, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
        transition: { duration: 0.4, ease: EASE },
      };

  return (
    <section ref={sectionRef} id="projects" className="projects" aria-labelledby="projects-title" tabIndex={-1}>
      <div className="projects__wash" aria-hidden="true" />
      <div className="container">
        <SectionHeading number="04" label="Projects" id="projects-title" title="Projects" />
        <AnimatePresence initial={false}>
          {showFeatured ? (
            <motion.div
              key="featured"
              className="projects__featured"
              {...(reduced
                ? {}
                : {
                    layout: true,
                    initial: { opacity: 0, height: 0 },
                    animate: { opacity: 1, height: 'auto' },
                    exit: { opacity: 0, height: 0, transition: { duration: 0.4 } },
                    transition: { duration: 0.4, ease: EASE },
                  })}
            >
              <Reveal direction="scale">
                <FeaturedProject />
              </Reveal>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <FilterChips options={options} value={filter} onChange={setFilter} ariaLabel="Filter projects" className="projects__chips" />
        <p className="sr-only" role="status">
          Showing {total} {total === 1 ? 'project' : 'projects'}
        </p>
        <ul className="projects__grid">
          <AnimatePresence mode={reduced ? 'sync' : 'popLayout'} initial={false}>
            {shown.map((p) => (
              <motion.li key={p.id} className="projects__item" {...itemMotion}>
                <ProjectCard project={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  );
};

export default Projects;
