// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';

// CRA sets resetMocks: true, so these helpers are plain functions/classes
// (not jest.fn) and are (re)installed in beforeEach.

class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.root = null;
    this.rootMargin = '';
    this.thresholds = [];
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

// Tests may call global.__setMatchMedia({ '(prefers-reduced-motion: reduce)': true })
const mediaState = { matches: {} };

const installMatchMedia = () => {
  window.matchMedia = (query) => ({
    matches: !!mediaState.matches[query],
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
});
