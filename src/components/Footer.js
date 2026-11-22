import React from 'react';
import { profile } from '../data/portfolio';
import { ArrowUpIcon } from './icons';
import { SocialLinks } from './SocialLinks';
import { Reveal } from './motion/Reveal';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { Logo } from '../navigation/Logo';
import './Footer.css';

export function Footer() {
  const reduced = usePrefersReducedMotion();

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    const hero = document.getElementById('hero');
    if (hero) hero.focus({ preventScroll: true });
  };

  return (
    <footer className="footer">
      <Reveal className="container footer__row">
        <div className="footer__brand">
          <Logo />
          <p>
            Designed &amp; built by {profile.name} · <span>{new Date().getFullYear()}</span>
          </p>
        </div>
        <SocialLinks />
        <button type="button" className="to-top" aria-label="Back to top" onClick={toTop}>
          <ArrowUpIcon size={22} />
        </button>
      </Reveal>
    </footer>
  );
}

export default Footer;
