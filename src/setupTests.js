// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';

// CRA sets resetMocks: true, so these helpers are plain functions/classes
// (not jest.fn) and are (re)installed in beforeEach.

// Instances are kept so a test can report "not intersecting" or "intersecting" with
// global.__fireIntersection(isIntersecting).
const observers = [];

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.root = null;
    this.rootMargin = '';
    this.thresholds = [];
    this.targets = [];
    observers.push(this);
  }
  observe(el) {
    this.targets.push(el);
  }
  unobserve() {}
  disconnect() {
    this.targets = [];
  }
  takeRecords() {
    return [];
  }
}

global.__fireIntersection = (isIntersecting) => {
  observers.slice().forEach((o) => {
    if (!o.targets.length) return;
    o.callback(
      o.targets.map((target) => ({ target, isIntersecting, intersectionRatio: isIntersecting ? 1 : 0 })),
      o
    );
  });
};

// Tests may call global.__setMatchMedia({ '(prefers-reduced-motion: reduce)': true }).
// The map is merged over DEFAULT_MEDIA, so a test only lists what it changes. A hover-capable
// desktop is the default: both hover queries match. Override with { '(hover: hover)': false } or
// { '(hover: none)': true } to act as a touch device.
const DEFAULT_MEDIA = {
  '(hover: hover)': true,
  '(hover: hover) and (pointer: fine)': true,
};
const mediaState = { matches: {} };
const mediaMatches = (query) => {
  if (Object.prototype.hasOwnProperty.call(mediaState.matches, query)) return !!mediaState.matches[query];
  return !!DEFAULT_MEDIA[query];
};

const installMatchMedia = () => {
  window.matchMedia = (query) => ({
    matches: mediaMatches(query),
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  });
};

global.__setMatchMedia = (matches = {}) => {
  mediaState.matches = matches;
  installMatchMedia();
};

beforeEach(() => {
  window.IntersectionObserver = MockIntersectionObserver;
  global.IntersectionObserver = MockIntersectionObserver;
  mediaState.matches = {};
  installMatchMedia();
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: () => Promise.resolve() },
  });
  Element.prototype.scrollIntoView = () => {};
  window.scrollTo = () => {};
  window.localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  observers.length = 0;
});
