import React from 'react';
import { socials } from '../data/portfolio';
import { GitHubIcon, LinkedInIcon } from './icons';
import './SocialLinks.css';

const icons = { github: GitHubIcon, linkedin: LinkedInIcon };

export function SocialLinks({ labelled = false, className = '' }) {
  return (
    <ul className={`socials ${labelled ? 'socials--labelled' : ''} ${className}`.trim()} aria-label="Social links">
      {socials.map((s) => {
        const Icon = icons[s.id];
        return (
          <li key={s.id}>
            <a
              className="socials__link"
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
            >
              <Icon size={20} />
              {labelled ? <span>{s.label}</span> : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default SocialLinks;
