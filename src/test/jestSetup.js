// Setup file for Jest

// Configure the test environment
console.log('DFrame Test Environment Setup');

// Note about DOM limitations
console.log('NOTE: Some visual layout tests may be skipped in JSDOM');
console.log('For full layout testing, use browser-based tests with Playwright or Cypress');

// Mock browser APIs that aren't fully implemented in JSDOM
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
