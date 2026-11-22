import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { MoonIcon, SunIcon } from '../components/icons';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const light = theme === 'light';
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Toggle theme"
      aria-pressed={light}
      onClick={toggleTheme}
    >
      <span className={`theme-toggle__icon theme-toggle__sun ${light ? 'is-active' : ''}`}>
        <SunIcon size={22} />
      </span>
      <span className={`theme-toggle__icon theme-toggle__moon ${light ? '' : 'is-active'}`}>
        <MoonIcon size={22} />
      </span>
    </button>
  );
}

export default ThemeToggle;
