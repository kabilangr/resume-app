import React from 'react';
import { profile } from '../data/portfolio';
import { DownloadIcon } from './icons';

export function ResumeButton({ variant = 'ghost', className = '' }) {
  return (
    <a
      className={`btn btn--${variant} ${className}`.trim()}
      href={`${process.env.PUBLIC_URL}${profile.resumePath}`}
      download
    >
      <DownloadIcon size={20} />
      Download résumé
    </a>
  );
}

export default ResumeButton;
