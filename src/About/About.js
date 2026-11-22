import React, { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import { profile, stats, education } from '../data/portfolio';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { Reveal } from '../components/motion/Reveal';
import { TiltCard } from '../components/motion/TiltCard';
import { SectionHeading } from '../components/SectionHeading';
import { AndroidIcon, AppleIcon, CapIcon, GlobeIcon, MonitorIcon, PinIcon } from '../components/icons';
import { LanguagesCard } from './LanguagesCard';
import './About.css';

function CountUp({ target, suffix = '', label }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    if (reduced) {
      setValue(target);
      return undefined;
    }
    if (!inView) return undefined;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, target]);

  return (
    <span ref={ref} className="stat__num grad">
      <span className="sr-only">{`${target}${suffix} ${label}`}</span>
      <span aria-hidden="true">{value}{suffix}</span>
    </span>
  );
}

const platformIcons = { Web: GlobeIcon, Android: AndroidIcon, iOS: AppleIcon, Desktop: MonitorIcon };

export const About = () => {
  const yearsNum = parseInt(stats.years, 10);
  return (
    <section id="about" className="about" aria-labelledby="about-title" tabIndex={-1}>
      <div className="container">
        <SectionHeading number="01" label="About" id="about-title" title="About" accent="me" />
        <div className="about__grid">
          <Reveal direction="left" className="about__text">
            <p className="lead">{profile.summary}</p>
            <p>{profile.summaryMore}</p>
            <p className="about__loc"><PinIcon size={18} /> {profile.location}</p>
          </Reveal>
          <Reveal stagger as="ul" className="about__stats">
            <Reveal.Item as="li" className="about__stat-item">
              <TiltCard max={5} className="stat">
                <CountUp target={yearsNum} suffix="+" label={stats.yearsLabel} />
                <span className="stat__label">{stats.yearsLabel}</span>
              </TiltCard>
            </Reveal.Item>
            <Reveal.Item as="li" className="about__stat-item">
              <TiltCard max={5} className="stat">
                <CountUp target={stats.companies} label={stats.companiesLabel} />
                <span className="stat__label">{stats.companiesLabel}</span>
              </TiltCard>
            </Reveal.Item>
            <Reveal.Item as="li" className="about__stat-item about__stat-item--wide">
              <TiltCard max={5} className="stat">
                <ul className="platforms" aria-label={stats.platformsLabel}>
                  {stats.platforms.map((p) => {
                    const Icon = platformIcons[p];
                    return (
                      <li key={p} className="platforms__pill">
                        <Icon size={18} />
                        {p}
                      </li>
                    );
                  })}
                </ul>
                <span className="stat__label">{stats.platformsLabel}</span>
              </TiltCard>
            </Reveal.Item>
          </Reveal>
          <Reveal className="about__edu">
            <TiltCard max={5} className="edu">
              <span className="edu__icon"><CapIcon size={22} /></span>
              <div>
                <h3 className="edu__degree">{education.degree}</h3>
                <p className="edu__inst">{education.institution}</p>
                <p className="edu__years">{education.years}</p>
              </div>
            </TiltCard>
          </Reveal>
          <Reveal className="about__langs" delay={0.1}>
            <LanguagesCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default About;
