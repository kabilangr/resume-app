import React from 'react';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import { profile, stats } from '../data/portfolio';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { SocialLinks } from '../components/SocialLinks';
import { ResumeButton } from '../components/ResumeButton';
import { RevealPortrait } from './RevealPortrait';
import './Home.css';

const MARQUEE = 'build · ship · tinker · orchestrate · ';

const EASE = [0.16, 1, 0.3, 1];

const parent = { hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const child = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } };
const photo = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE, delay: 0.25 } },
};
const word = (delay) => ({
  hidden: { y: '110%' },
  visible: { y: 0, transition: { duration: 0.9, ease: EASE, delay } },
});

function RoleLine({ reduced }) {
  const staticText = profile.roles.join(' · ');
  if (reduced) {
    return (
      <div className="hero__roles">
        <span className="hero__roles-static">{staticText}</span>
      </div>
    );
  }
  return (
    <div className="hero__roles">
      <span className="sr-only">{staticText}</span>
      <span className="hero__typed" aria-hidden="true">
        <Typewriter
          options={{ strings: profile.roles, autoStart: true, loop: true, delay: 45, deleteSpeed: 25, pauseFor: 1800 }}
        />
      </span>
    </div>
  );
}

const Home = () => {
  const reduced = usePrefersReducedMotion();
  const initial = reduced ? false : 'hidden';
  const [first, last] = profile.name.split(' ');

  return (
    <section id="hero" className="hero" aria-labelledby="hero-title" tabIndex={-1}>
      <div className="hero__bg" aria-hidden="true">
        <span className="hero__blob hero__blob--a" />
        <span className="hero__blob hero__blob--b" />
        <span className="hero__blob hero__blob--c" />
        <span className="hero__grid-dots" />
        <span className="hero__fade" />
      </div>
      <div className="hero__scrim" aria-hidden="true" />
      <div className="marquee" aria-hidden="true">
        <div className="marquee__row">
          <span className="marquee__group">{MARQUEE}</span>
          <span className="marquee__group">{MARQUEE}</span>
        </div>
      </div>
      <div className="container hero__main">
        <motion.div className="hero__copy" variants={parent} initial={initial} animate="visible">
          <motion.p variants={child} className="eyebrow">Hi, I'm</motion.p>
          <h1 id="hero-title" className="hero__name">
            <span className="hero__mask">
              <motion.span className="hero__word grad" variants={word(0.05)} initial={initial} animate="visible">{first}</motion.span>
            </span>{' '}
            <span className="hero__mask">
              <motion.span className="hero__word grad" variants={word(0.15)} initial={initial} animate="visible">{last}</motion.span>
            </span>
          </h1>
          <motion.div variants={child}>
            <RoleLine reduced={reduced} />
          </motion.div>
          <motion.p variants={child} className="hero__current">
            <span className="hero__ping" aria-hidden="true" />
            Currently <strong>{profile.role}</strong> <span className="hero__company">@ {profile.company}</span>
          </motion.p>
          <motion.div variants={child} className="hero__stat">
            <span className="hero__stat-num grad">{stats.years}</span>
            <span className="hero__stat-label">{profile.heroStat}</span>
          </motion.div>
          <motion.div variants={child} className="hero__cta">
            <a className="btn btn--primary" href="#projects">View Projects</a>
            <a className="btn btn--ghost" href="#contact">Contact Me</a>
            <ResumeButton variant="ghost" />
          </motion.div>
          <motion.div variants={child} className="hero__social">
            <SocialLinks />
          </motion.div>
        </motion.div>
        <motion.div className="hero__stage" variants={photo} initial={initial} animate="visible">
        <div className="hero__portrait">
          <RevealPortrait />
          <div className="hero__bokeh" aria-hidden="true">
            <span /><span /><span /><span /><span /><span />
          </div>
        </div>
        </motion.div>
      </div>
      <a className="scroll-cue" href="#about" aria-label="Scroll to About section">
        <span className="scroll-cue__mouse" aria-hidden="true"><span className="scroll-cue__dot" /></span>
        <span className="scroll-cue__label" aria-hidden="true">Scroll</span>
      </a>
    </section>
  );
};

export default Home;
