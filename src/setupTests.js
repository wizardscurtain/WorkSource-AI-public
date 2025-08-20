// Jest setup file
import '@testing-library/jest-dom';

class MockIntersectionObserver {
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
  takeRecords() { return []; }
}

if (typeof window !== 'undefined') {
  window.IntersectionObserver = MockIntersectionObserver;
}

if (typeof global !== 'undefined') {
  global.IntersectionObserver = MockIntersectionObserver;
}
