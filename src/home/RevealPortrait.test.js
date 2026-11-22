import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import { RevealPortrait } from './RevealPortrait';
import { profile } from '../data/portfolio';

const move = (el, x, y) => {
  act(() => {
    el.dispatchEvent(new MouseEvent('pointermove', { clientX: x, clientY: y, bubbles: true }));
  });
};

describe('RevealPortrait', () => {
  const ALT = 'Pixar-style illustration of Kabilan GR smiling at a wooden café table under fairy lights';

  test('with real images, renders the cartoon <img> and the robot <image>', () => {
    expect(profile.portrait.cartoon).toBeTruthy();
    expect(profile.portrait.robot).toBeTruthy();
    render(<RevealPortrait />);
    expect(screen.getByAltText(ALT)).toHaveAttribute('src', profile.portrait.cartoon);
    const svg = screen.getByTestId('reveal-layer');
    // the robot layer is lazy: no href until the first pointer contact
    expect(svg.querySelector('image')).not.toHaveAttribute('href');
    fireEvent.pointerEnter(screen.getByTestId('reveal-frame'), { clientX: 5, clientY: 5 });
    expect(svg.querySelector('image')).toHaveAttribute('href', expect.stringMatching(/\/img\/hero\/portrait-robot-\d+\.webp$/));
    expect(screen.queryByText('SYS://KABILAN.AI')).not.toBeInTheDocument();
  });

  test('the cartoon img is high priority and not lazy', () => {
    render(<RevealPortrait />);
    const img = screen.getByAltText(ALT);
    expect(img).toHaveAttribute('fetchpriority', 'high');
    expect(img).not.toHaveAttribute('loading');
  });

  test('falls back to the photo and the SVG robot when both images are null', () => {
    render(<RevealPortrait portrait={{ cartoon: null, robot: null }} />);
    expect(screen.getByAltText(ALT)).toBeInTheDocument();
    expect(screen.getByText('SYS://KABILAN.AI')).toBeInTheDocument();
  });

  test('the reveal layer is aria-hidden', () => {
    render(<RevealPortrait />);
    expect(screen.getByTestId('reveal-layer')).toHaveAttribute('aria-hidden', 'true');
  });

  test('has a gooey mask with 7 circles and a goo filter', () => {
    render(<RevealPortrait />);
    const svg = screen.getByTestId('reveal-layer');
    expect(svg.querySelectorAll('mask circle')).toHaveLength(7);
    expect(svg.querySelector('filter feGaussianBlur')).toBeInTheDocument();
    expect(svg.querySelector('feColorMatrix[values*="22 -9"]')).toBeInTheDocument();
  });

  test('pointermove updates the mask circles', async () => {
    render(<RevealPortrait />);
    const frame = screen.getByTestId('reveal-frame');
    move(frame, 30, 40);
    await waitFor(() => {
      const lead = screen.getByTestId('reveal-dot-0');
      expect(lead.getAttribute('cx')).toBe('30.0');
      expect(lead.getAttribute('cy')).toBe('40.0');
      expect(Number(lead.getAttribute('r'))).toBeGreaterThan(0);
    });
  });

  test('shows the hover hint when motion is allowed', () => {
    render(<RevealPortrait />);
    expect(screen.getByText('Hover to meet my robot twin')).toBeInTheDocument();
  });

  test('the cartoon img has a responsive srcset and sizes', () => {
    render(<RevealPortrait />);
    const img = screen.getByAltText(ALT);
    expect(img.getAttribute('srcset')).toContain('640w');
    expect(img.getAttribute('srcset')).toContain('1600w');
    expect(img).toHaveAttribute('sizes', profile.portrait.sizes);
    expect(img.getAttribute('srcset')).toBe(profile.portrait.cartoonSrcSet);
  });

  test('the index.html preload matches the img srcset and sizes exactly', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', '..', 'public', 'index.html'), 'utf8');
    expect((html.match(/rel="preload" as="image"/g) || [])).toHaveLength(1);
    const srcset = /imagesrcset="([^"]+)"/.exec(html)[1].replace(/%PUBLIC_URL%/g, '');
    const sizes = /imagesizes="([^"]+)"/.exec(html)[1];
    expect(srcset).toBe(profile.portrait.cartoonSrcSet);
    expect(sizes).toBe(profile.portrait.sizes);
    expect((html.match(/\?v=3/g) || []).length).toBeGreaterThanOrEqual(5);
  });

  test('the eight hero WebP files exist and the 1280 cartoon is at most 200 KB', () => {
    const dir = path.join(__dirname, '..', '..', 'public', 'img', 'hero');
    ['cartoon', 'robot'].forEach((k) =>
      [640, 960, 1280, 1600].forEach((w) => expect(fs.existsSync(path.join(dir, `portrait-${k}-${w}.webp`))).toBe(true))
    );
    expect(fs.statSync(path.join(dir, 'portrait-cartoon-1280.webp')).size).toBeLessThanOrEqual(200 * 1024);
  });

  test('with Save-Data on, the robot layer never loads on its own', () => {
    jest.useFakeTimers();
    Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } });
    try {
      render(<RevealPortrait />);
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      expect(screen.getByTestId('reveal-layer').querySelector('image')).not.toHaveAttribute('href');
    } finally {
      delete navigator.connection;
      jest.useRealTimers();
    }
  });

  test('without Save-Data the idle preload sets the robot href', () => {
    jest.useFakeTimers();
    try {
      render(<RevealPortrait />);
      act(() => {
        jest.advanceTimersByTime(4000);
      });
      expect(screen.getByTestId('reveal-layer').querySelector('image')).toHaveAttribute('href');
    } finally {
      jest.useRealTimers();
    }
  });

  test('hint says Hover on hover devices and Tap or drag on touch devices', () => {
    const { unmount } = render(<RevealPortrait />);
    expect(screen.getByText('Hover to meet my robot twin')).toBeInTheDocument();
    unmount();
    global.__setMatchMedia({ '(hover: none)': true, '(hover: hover)': false });
    render(<RevealPortrait />);
    expect(screen.getByText('Tap or drag to meet my robot twin')).toBeInTheDocument();
  });

  test('a tap peeks for 1.6 seconds', () => {
    jest.useFakeTimers();
    try {
      render(<RevealPortrait />);
      const frame = screen.getByTestId('reveal-frame');
      act(() => {
        frame.dispatchEvent(new MouseEvent('pointerdown', { clientX: 20, clientY: 20, bubbles: true }));
        frame.dispatchEvent(new MouseEvent('pointerup', { clientX: 24, clientY: 20, bubbles: true }));
      });
      expect(frame).toHaveAttribute('data-peek', 'true');
      act(() => {
        jest.advanceTimersByTime(1700);
      });
      expect(frame).not.toHaveAttribute('data-peek', 'true');
    } finally {
      jest.useRealTimers();
    }
  });

  test('a drag of 10 px or more does not peek', () => {
    render(<RevealPortrait />);
    const frame = screen.getByTestId('reveal-frame');
    act(() => {
      frame.dispatchEvent(new MouseEvent('pointerdown', { clientX: 20, clientY: 20, bubbles: true }));
      frame.dispatchEvent(new MouseEvent('pointerup', { clientX: 60, clientY: 20, bubbles: true }));
    });
    expect(frame).not.toHaveAttribute('data-peek', 'true');
  });

  test('auto-wander is off when the hero is not visible, and the touch rule stays in the CSS', () => {
    global.__setMatchMedia({ '(hover: none)': true, '(hover: hover)': false });
    render(<RevealPortrait />);
    act(() => global.__fireIntersection(false));
    expect(screen.getByTestId('reveal-frame')).toHaveAttribute('data-wander', 'off');
    const css = fs.readFileSync(path.join(__dirname, 'RevealPortrait.css'), 'utf8');
    expect(css).toContain('touch-action: pan-y');
    expect(css).not.toContain('border-strong');
  });
});
