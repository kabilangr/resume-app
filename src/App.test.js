import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { NAV_ITEMS } from './utils/Constants';

const REDUCED = '(prefers-reduced-motion: reduce)';

// Strings that must never appear are built at runtime so this file stays clean.
const TEL = 'te' + 'l:';
const MAILTO = 'mail' + 'to:';
const GMAIL = '@gmail' + '.com';
const FB = 'face' + 'book';
const IG = 'insta' + 'gram';

// The full App is heavy to render on slow disks; keep headroom for animation-driven tests.
jest.setTimeout(20000);

beforeEach(() => {
  window.history.pushState({}, '', '/');
});

const renderApp = () => render(<App />);

// user-event uses a different DOM-testing-library copy, so wrap clicks in act.
const click = (el) => {
  act(() => {
    userEvent.click(el);
  });
};

describe('structure and content', () => {
  test('has exactly one h1 named Kabilan GR, with 6+ and Xpulsar in the hero', () => {
    renderApp();
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'Kabilan GR' })).toBeInTheDocument();
    const hero = document.getElementById('hero');
    expect(hero).toHaveTextContent('6+');
    expect(hero).toHaveTextContent('Xpulsar');
  });

  test('renders the six sections in order', () => {
    renderApp();
    const ids = ['hero', 'about', 'skills', 'experience', 'projects', 'contact'];
    const els = ids.map((id) => document.getElementById(id));
    els.forEach((el) => expect(el).toBeInTheDocument());
    for (let i = 0; i < els.length - 1; i += 1) {
      // eslint-disable-next-line no-bitwise
      expect(els[i].compareDocumentPosition(els[i + 1]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
  });

  test('landmarks and skip link', () => {
    renderApp();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main');
  });

  test('every img has alt, and empty alt only when aria-hidden', () => {
    renderApp();
    document.querySelectorAll('img').forEach((img) => {
      expect(img).toHaveAttribute('alt');
      if (img.getAttribute('alt') === '') {
        expect(img).toHaveAttribute('aria-hidden', 'true');
      }
    });
  });
});

describe('languages card', () => {
  test('clicking Tamil sets aria-pressed and shows the Tamil greeting', () => {
    global.__setMatchMedia({ [REDUCED]: true }); // instant swap, no exit animation to await
    renderApp();
    const about = document.getElementById('about');
    const tamil = within(about).getByRole('button', { name: /Tamil/ });
    expect(within(about).getByRole('button', { name: /English/ })).toHaveAttribute('aria-pressed', 'true');
    click(tamil);
    expect(tamil).toHaveAttribute('aria-pressed', 'true');
    expect(within(about).getByRole('button', { name: /English/ })).toHaveAttribute('aria-pressed', 'false');
    expect(within(about).getByText('வணக்கம்')).toHaveAttribute('lang', 'ta');
  });

  test('does not auto-cycle under reduced motion', () => {
    jest.useFakeTimers();
    try {
      global.__setMatchMedia({ [REDUCED]: true });
      renderApp();
      const about = document.getElementById('about');
      act(() => {
        jest.advanceTimersByTime(12000);
      });
      expect(within(about).getByRole('button', { name: /English/ })).toHaveAttribute('aria-pressed', 'true');
      expect(within(about).getByText('Hello')).toBeInTheDocument();
    } finally {
      jest.useRealTimers();
    }
  });
});

describe('skill rings', () => {
  test('each of the 6 rings renders an svg icon or initials, hidden from AT', () => {
    renderApp();
    const rings = document.querySelectorAll('#skills .ring');
    expect(rings).toHaveLength(6);
    rings.forEach((ring) => {
      const icon = ring.querySelector('.ring__icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(icon.querySelector('svg') || icon.querySelector('.ring__initials')).not.toBeNull();
      expect(icon.querySelector('img')).toBeNull();
    });
  });
});

describe('hero marquee', () => {
  test('marquee text is aria-hidden and the real heading stays in the DOM', () => {
    renderApp();
    const marquee = document.querySelector('.marquee');
    expect(marquee).toHaveAttribute('aria-hidden', 'true');
    expect(marquee.textContent).toMatch(/build · ship · architect · orchestrate ·/);
    expect(screen.getByRole('heading', { level: 1, name: /Kabilan GR/ })).toBeInTheDocument();
  });
});

describe('hero ambience', () => {
  test('bokeh layer is aria-hidden with exactly 6 dots', () => {
    renderApp();
    const bokeh = document.querySelector('#hero .hero__bokeh');
    expect(bokeh).toHaveAttribute('aria-hidden', 'true');
    expect(bokeh.children).toHaveLength(6);
    Array.from(bokeh.children).forEach((c) => expect(c.tagName).toBe('SPAN'));
  });
});

describe('structured data and share card', () => {
  const fs = require('fs');
  const path = require('path');
  const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
  const { socials } = require('./data/portfolio');

  const keysDeep = (o) =>
    o && typeof o === 'object' ? Object.keys(o).concat(...Object.values(o).map(keysDeep)) : [];

  test('JSON-LD is a ProfilePage with a Person and only public URLs', () => {
    const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    expect(m).not.toBeNull();
    const data = JSON.parse(m[1]);
    expect(data['@type']).toBe('ProfilePage');
    expect(data.dateModified).toBeTruthy();
    expect(data.mainEntity.name).toBe('Kabilan GR');
    expect(data.mainEntity.jobTitle).toBe('Lead Full-Stack Developer');
    expect(data.mainEntity.image.endsWith('og-kabilan-gr-cafe.jpg')).toBe(true);
    expect([...data.mainEntity.sameAs].sort()).toEqual(socials.map((s) => s.href).sort());
    expect(data.mainEntity.sameAs).toHaveLength(2);
    const keys = keysDeep(data);
    ['email', 'telephone', 'address'].forEach((k) => expect(keys).not.toContain(k));
    const flat = JSON.stringify({ ...data, dateModified: 'x' });
    expect(flat).not.toMatch(new RegExp('[\\w.]+' + '@' + '[\\w-]+\\.[a-z]{2,}', 'i'));
    expect(flat).not.toMatch(new RegExp('\\+\\d[\\d\\s-]{8,}\\d|\\b\\d{10}\\b'));
  });

  test('head has the share card, canonical link and a single theme-color', () => {
    expect(html).toContain('og-kabilan-gr-cafe.jpg');
    expect(html).toContain('og:image:width" content="1200"');
    expect(html).toContain('og:image:height" content="630"');
    expect(html).toContain('og:image:alt');
    expect(html).toContain('summary_large_image');
    expect(html).toContain('rel="canonical" href="https://www.kabilan.me/"');
    expect(fs.existsSync(path.join(__dirname, '..', 'public', 'og-kabilan-gr-cafe.jpg'))).toBe(true);
  });
});

describe('logo and favicon', () => {
  test('nav and footer render the inline SVG logo, link keeps its name', () => {
    renderApp();
    const home = screen.getByRole('link', { name: 'Kabilan GR, home' });
    expect(home).toHaveAttribute('href', '#hero');
    expect(home.querySelector('svg.logo__mark')).toBeInTheDocument();
    expect(document.querySelectorAll('.logo__word')).toHaveLength(2);
    expect(document.querySelector('footer svg.logo__mark')).toBeInTheDocument();
    expect(document.querySelector('img[src*="KR"]')).toBeNull();
  });

  test('index.html uses favicon.svg and the file exists', () => {
    const fs = require('fs');
    const path = require('path');
    const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
    expect(html).toMatch(/href="%PUBLIC_URL%\/favicon\.svg(\?v=\d+)?"/);
    ['favicon.ico', 'favicon-32.png', 'favicon-16.png', 'apple-touch-icon.png'].forEach((f) => {
      expect(fs.existsSync(path.join(__dirname, '..', 'public', f))).toBe(true);
      expect(html).toMatch(new RegExp('%PUBLIC_URL%/' + f.replace('.', '\\.') + '\\?v=\\d+'));
    });
    expect(html).not.toMatch(/KR-(black|light|static)/);
    expect(fs.existsSync(path.join(__dirname, '..', 'public', 'favicon.svg'))).toBe(true);
  });
});

describe('navigation', () => {
  test('main nav has six anchor links', () => {
    renderApp();
    const nav = screen.getByRole('navigation', { name: 'Main' });
    const links = within(nav).getAllByRole('link');
    expect(links).toHaveLength(6);
    links.forEach((link, i) => {
      expect(link).toHaveTextContent(NAV_ITEMS[i].label);
      expect(link.getAttribute('href').endsWith(`#${NAV_ITEMS[i].id}`)).toBe(true);
    });
  });

  test('hamburger toggles aria-expanded and Esc closes it', async () => {
    renderApp();
    const burger = screen.getByRole('button', { name: 'Open menu' });
    expect(burger).toHaveAttribute('aria-expanded', 'false');
    click(burger);
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog', { name: 'Site menu' })).toBeInTheDocument();
    fireEvent.keyDown(document.body, { key: 'Escape' });
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false')
    );
  });
});

describe('modal mobile menu', () => {
  const INERT = ['.nav__bar', '#main', 'footer', '.skip-link'];
  const openMenu = () => {
    renderApp();
    click(screen.getByRole('button', { name: 'Open menu' }));
    return screen.getByRole('dialog', { name: 'Site menu' });
  };

  test('has a visible Close button and a theme toggle, and inerts the page', () => {
    const dialog = openMenu();
    expect(within(dialog).getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument();
    INERT.forEach((sel) => expect(document.querySelector(sel)).toHaveAttribute('inert'));
  });

  test('Close removes inert, unlocks scroll and returns focus to the burger', async () => {
    const dialog = openMenu();
    expect(document.documentElement.style.overflow).toBe('hidden');
    expect(document.body.style.overflow).toBe('hidden');
    click(within(dialog).getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    INERT.forEach((sel) => expect(document.querySelector(sel)).not.toHaveAttribute('inert'));
    expect(document.documentElement.style.overflow).toBe('');
    expect(document.body.style.overflow).toBe('');
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus();
  });

  test('Esc returns focus to the burger', async () => {
    openMenu();
    fireEvent.keyDown(document.body, { key: 'Escape' });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus());
    INERT.forEach((sel) => expect(document.querySelector(sel)).not.toHaveAttribute('inert'));
  });

  test('focus starts on Close and Tab wraps through the whole panel', () => {
    const dialog = openMenu();
    const close = within(dialog).getByRole('button', { name: 'Close' });
    const toggle = within(dialog).getByRole('button', { name: 'Toggle theme' });
    expect(close).toHaveFocus();
    toggle.focus();
    fireEvent.keyDown(toggle, { key: 'Tab' });
    expect(close).toHaveFocus();
    fireEvent.keyDown(close, { key: 'Tab', shiftKey: true });
    expect(toggle).toHaveFocus();
  });

  test('a menu link closes the menu and focuses the section', async () => {
    const dialog = openMenu();
    click(within(dialog).getByRole('link', { name: /Projects/ }));
    await waitFor(() => expect(document.activeElement).toBe(document.getElementById('projects')));
    INERT.forEach((sel) => expect(document.querySelector(sel)).not.toHaveAttribute('inert'));
  });

  test('the nav switches at 1024 and the menu CSS holds the literal values', () => {
    const fs = require('fs');
    const path = require('path');
    const css = fs.readFileSync(path.join(__dirname, 'navigation', 'Navigation.css'), 'utf8');
    const js = fs.readFileSync(path.join(__dirname, 'navigation', 'Navigation.js'), 'utf8');
    expect(css).toContain('min-width: 1024px');
    expect(css).not.toContain('min-width: 768px');
    expect(css).toContain('overscroll-behavior: contain');
    expect(css).toContain('clamp(2rem, 1.25rem + 4vw, 3rem)');
    expect(css).toContain('env(safe-area-inset-bottom, 0px)');
    expect(js).toContain('1024');
  });
});

describe('gallery and hover gating', () => {
  test('gallery dots are aria-hidden and a live region reports the screenshot', () => {
    renderApp();
    const wrap = document.querySelector('.gallery-wrap');
    expect(wrap.querySelector('.gallery')).toHaveAttribute('role', 'region');
    const dots = wrap.querySelector('.gallery__dots');
    expect(dots).toHaveAttribute('aria-hidden', 'true');
    expect(dots.children).toHaveLength(3);
    expect(wrap.querySelector('[aria-live="polite"]')).toHaveTextContent('Screenshot 1 of 3');
  });

  test('every whileHover is gated by canHover and the hook exists', () => {
    const fs = require('fs');
    const path = require('path');
    const { execSync } = require('child_process');
    expect(fs.existsSync(path.join(__dirname, 'hooks', 'useCanHover.js'))).toBe(true);
    const out = execSync('grep -rn "whileHover" src || true', { cwd: path.join(__dirname, '..') }).toString();
    out
      .split('\n')
      .filter((l) => l && !l.includes('.test.js') && !l.includes('useCanHover.js'))
      .forEach((l) => expect(l).toMatch(/canHover/));
  });

  test('buttons wrap instead of clipping, chips are 44px, 100svh and clip are set', () => {
    const fs = require('fs');
    const path = require('path');
    const app = fs.readFileSync(path.join(__dirname, 'App.css'), 'utf8');
    const idx = fs.readFileSync(path.join(__dirname, 'index.css'), 'utf8');
    expect(app).toMatch(/min-height: 52px/);
    expect(app).not.toMatch(/(^|[^-])height: 52px/m);
    expect(app).toMatch(/\.chip \{[^}]*height: 44px/);
    expect(app).toContain('min-height: 100svh');
    expect(idx).toContain('overflow-x: clip');
    expect(idx).not.toContain('overflow-x: hidden');
    expect(idx).toContain('[data-paused] * { animation-play-state: paused; }');
  });
});

describe('theme', () => {
  test('first visit is light even when the OS prefers dark', () => {
    global.__setMatchMedia({ '(prefers-color-scheme: dark)': true });
    renderApp();
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });

  test('toggles to dark and persists the choice', () => {
    renderApp();
    click(screen.getByRole('button', { name: 'Toggle theme' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(window.localStorage.getItem('theme')).toBe('dark');
  });

  test('a stored dark theme wins on load', () => {
    window.localStorage.setItem('theme', 'dark');
    renderApp();
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  test('theme-color meta follows the theme', () => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    meta.setAttribute('content', '#fbf3e7');
    document.head.appendChild(meta);
    renderApp();
    expect(meta).toHaveAttribute('content', '#fbf3e7');
    click(screen.getByRole('button', { name: 'Toggle theme' }));
    expect(meta).toHaveAttribute('content', '#2b1912');
    document.head.removeChild(meta);
  });

  test('useTheme and index.html no longer read prefers-color-scheme; html defaults to light', () => {
    const fs = require('fs');
    const path = require('path');
    const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
    const hook = fs.readFileSync(path.join(__dirname, 'hooks', 'useTheme.js'), 'utf8');
    expect(html).not.toContain('prefers-color-scheme');
    expect(hook).not.toContain('prefers-color-scheme');
    expect(html).toContain('<html lang="en" data-theme="light">');
    expect((html.match(/name="theme-color"/g) || []).length).toBe(1);
    expect(html).toContain('name="theme-color" content="#fbf3e7"');
  });
});

describe('skills', () => {
  test('shows 8 category headings and key items', () => {
    renderApp();
    const skills = document.getElementById('skills');
    const headings = within(skills).getAllByRole('heading', { level: 3 });
    expect(headings).toHaveLength(8);
    expect(within(skills).getByRole('heading', { name: /AI Agent Orchestration/ })).toBeInTheDocument();
    expect(within(skills).getByRole('heading', { name: /Vibe Coding/ })).toBeInTheDocument();
    expect(within(skills).getByRole('heading', { name: /Hardware & IoT/ })).toBeInTheDocument();
    ['ESP32', 'Arduino', 'Raspberry Pi'].forEach((t) => expect(within(skills).getByText(t)).toBeInTheDocument());
    expect(within(skills).getByText(/MCP/)).toBeInTheDocument();
    expect(within(skills).getByText('LangGraph')).toBeInTheDocument();
    expect(within(skills).getByText('Working proficiency (self-assessed)')).toBeInTheDocument();
  });

  test('filter chip reduces visible categories', async () => {
    global.__setMatchMedia({ [REDUCED]: true }); // no AnimatePresence exit to wait for
    renderApp();
    const skills = document.getElementById('skills');
    click(within(skills).getByRole('button', { name: 'IoT' }));
    await waitFor(() => expect(within(skills).getAllByRole('heading', { level: 3 })).toHaveLength(1), {
      timeout: 5000,
    });
  });
});

describe('experience', () => {
  test('lists 5 roles in order with a single Present badge', () => {
    renderApp();
    const exp = document.getElementById('experience');
    const items = within(exp).getAllByRole('listitem');
    expect(items).toHaveLength(5);
    const companies = [
      'Xpulsar',
      'Fountain Hills Technologies',
      'Zoho Corporation',
      'AltraDimension Technologies',
      'SoftSuave Technologies',
    ];
    companies.forEach((c, i) => expect(items[i]).toHaveTextContent(c));
    expect(within(exp).getAllByText(/Present/)).toHaveLength(1);
    expect(items[0]).toHaveTextContent('Present');
    expect(items[1]).toHaveTextContent('09/2025');
  });
});

describe('projects', () => {
  test('featured Valam card comes first with link and screenshots', () => {
    renderApp();
    const projects = document.getElementById('projects');
    const cards = projects.querySelectorAll('.project-card');
    expect(cards).toHaveLength(7);
    const first = cards[0];
    expect(first).toHaveClass('featured');
    expect(first).toHaveTextContent('Valam');
    expect(first).toHaveTextContent('Mathi');
    const link = first.querySelector('a[href="https://valam.io"]');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    const imgs = Array.from(first.querySelectorAll('img')).filter((i) => i.getAttribute('alt'));
    expect(imgs.length).toBeGreaterThanOrEqual(2);
  });

  test('AI filter keeps Valam and the AI chatbot and reduces the count', async () => {
    global.__setMatchMedia({ [REDUCED]: true });
    renderApp();
    const projects = document.getElementById('projects');
    click(within(projects).getByRole('button', { name: 'AI' }));
    await waitFor(() => expect(projects.querySelectorAll('.project-card').length).toBeLessThan(7));
    await waitFor(() => expect(projects.querySelectorAll('.project-card')).toHaveLength(2));
    expect(within(projects).getByText('Valam')).toBeInTheDocument();
    expect(within(projects).getByText(/AI ChatBot/)).toBeInTheDocument();
  });
});

describe('contact, privacy and socials', () => {
  test('no tel links and no phone number', () => {
    renderApp();
    expect(document.querySelectorAll(`a[href^="${TEL}"]`)).toHaveLength(0);
    expect(document.body.textContent).not.toMatch(/\+?91[\s-]?\d{5}\s?\d{5}/);
  });

  test('email is not shown, linked or copyable', () => {
    renderApp();
    const html = document.body.innerHTML;
    expect(html.toLowerCase()).not.toContain(GMAIL);
    expect(html.toLowerCase()).not.toContain(MAILTO);
    expect(document.body.textContent).not.toMatch(/copy email/i);
    expect(screen.queryByRole('button', { name: /copy email/i })).toBeNull();
  });

  test('has a LinkedIn contact CTA opening safely in a new tab', () => {
    renderApp();
    const cta = within(document.getElementById('contact')).getByRole('link', { name: /Message me on LinkedIn/ });
    expect(cta).toHaveAttribute('href', expect.stringContaining('linkedin.com/in/'));
    expect(cta).toHaveAttribute('target', '_blank');
    expect(cta.getAttribute('rel')).toMatch(/noopener/);
    expect(cta.getAttribute('rel')).toMatch(/noreferrer/);
  });

  test('only GitHub and LinkedIn socials render', () => {
    renderApp();
    const gh = screen.getAllByRole('link', { name: 'GitHub' });
    const li = screen.getAllByRole('link', { name: 'LinkedIn' });
    expect(gh.length).toBeGreaterThanOrEqual(1);
    expect(li.length).toBeGreaterThanOrEqual(1);
    gh.forEach((a) => {
      expect(a).toHaveAttribute('href', 'https://github.com/kabilangr');
      expect(a).toHaveAttribute('target', '_blank');
      expect(a).toHaveAttribute('rel', 'noopener noreferrer');
    });
    li.forEach((a) => {
      expect(a).toHaveAttribute('href', 'https://www.linkedin.com/in/kabilan-g-r-9749631b5/');
      expect(a).toHaveAttribute('target', '_blank');
      expect(a).toHaveAttribute('rel', 'noopener noreferrer');
    });
    Array.from(document.querySelectorAll('a[href]')).forEach((a) => {
      const href = a.getAttribute('href').toLowerCase();
      expect(href).not.toContain(FB);
      expect(href).not.toContain(IG);
    });
  });

  test('no download link is rendered', () => {
    const { container } = renderApp();
    const word = ['res', 'ume'].join('');
    const accent = ['r', '\u00e9', 'sum', '\u00e9'].join('');
    const text = container.textContent.toLowerCase();
    expect(text).not.toContain(`download ${word}`);
    expect(text).not.toContain(`download ${accent}`);
    expect(container.querySelector('[download]')).toBeNull();
    expect(container.querySelector('a[href$=".pdf"]')).toBeNull();
    expect(container.innerHTML.toLowerCase()).not.toContain(`kabilan_gr_${word}`);
  });
});

describe('reduced motion', () => {
  test('disables typewriter and keeps content visible', () => {
    global.__setMatchMedia({ [REDUCED]: true });
    renderApp();
    expect(document.querySelector('.Typewriter')).toBeNull();
    expect(screen.getByText(/Lead Full-Stack Developer · Software Architect · Flutter Developer · React & React Native Engineer/)).toBeInTheDocument();
    ['hero', 'about', 'skills', 'experience', 'projects', 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      expect(el.getAttribute('style') || '').not.toMatch(/opacity:\s*0(?![.\d])/);
      el.querySelectorAll('[style]').forEach((n) => {
        expect(n.getAttribute('style')).not.toMatch(/opacity:\s*0(?![.\d])/);
      });
    });
  });

  test('the roles list has the architect, Flutter and product roles and drops the old beginner-sounding IoT role', () => {
    const { profile } = require('./data/portfolio');
    ['Software Architect', 'Flutter Developer', 'Product Owner', 'Product Developer', 'IoT & Embedded Systems Engineer'].forEach((r) =>
      expect(profile.roles).toContain(r)
    );
    expect(profile.roles[0]).toBe('Lead Full-Stack Developer');
    const fs = require('fs');
    const path = require('path');
    const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
    expect(JSON.stringify(profile) + html + document.body.textContent).not.toMatch(new RegExp('IoT ' + 'Tink' + 'erer', 'i'));
    expect(profile.summary).toContain('6+');
  });

  test('renders the typewriter when motion is allowed', () => {
    renderApp();
    expect(document.querySelector('.Typewriter')).toBeInTheDocument();
  });
});

describe('routing', () => {
  test('legacy route redirects to / and the target section exists', async () => {
    window.history.pushState({}, '', '/workExperience');
    renderApp();
    await act(async () => {});
    expect(window.location.pathname).toBe('/');
    expect(document.getElementById('experience')).toBeInTheDocument();
  });

  test('unknown routes redirect to /', async () => {
    window.history.pushState({}, '', '/does-not-exist');
    renderApp();
    await act(async () => {});
    expect(window.location.pathname).toBe('/');
    expect(document.getElementById('hero')).toBeInTheDocument();
  });
});
