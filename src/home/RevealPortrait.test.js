import { act, render, screen, waitFor } from '@testing-library/react';
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
    expect(svg.querySelector('image')).toHaveAttribute('href', profile.portrait.robot);
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
});
