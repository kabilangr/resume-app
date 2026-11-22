import React from 'react';
import { profile, socials } from '../data/portfolio';
import { Reveal } from '../components/motion/Reveal';
import { ResumeButton } from '../components/ResumeButton';
import { SocialLinks } from '../components/SocialLinks';
import { LinkedInIcon, PinIcon } from '../components/icons';
import './Contact.css';

const linkedin = socials.find((s) => s.id === 'linkedin');

export const Contact = () => (
  <section id="contact" className="contact" aria-labelledby="contact-title" tabIndex={-1}>
    <div className="container">
      <Reveal direction="scale" className="contact__panel">
        <span className="contact__glyph" aria-hidden="true">&lt;/&gt;</span>
        <p className="eyebrow"><span aria-hidden="true">05 / </span>Contact</p>
        <h2 id="contact-title">
          Let's build something <span className="grad">together</span>
        </h2>
        <p className="lead">{profile.contactLead}</p>
        <div className="contact__actions">
          <a className="btn btn--primary" href={linkedin.href} target="_blank" rel="noopener noreferrer">
            <LinkedInIcon size={20} /> Message me on LinkedIn
          </a>
          <ResumeButton variant="ghost" />
        </div>
        <ul className="contact__meta">
          <li><PinIcon size={18} /> {profile.location}</li>
        </ul>
        <SocialLinks labelled />
      </Reveal>
    </div>
  </section>
);

export default Contact;
