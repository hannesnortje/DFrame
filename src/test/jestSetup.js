// Global test setup for Jest

// Mock any browser APIs that JSDOM doesn't support
if (typeof window !== 'undefined') {
  // Add any missing browser APIs here
  if (!window.MouseEvent) {
    window.MouseEvent = class MockMouseEvent {
      constructor(type, options = {}) {
        this.type = type;
        this.bubbles = options.bubbles || false;
        this.cancelable = options.cancelable || false;
      }
    };
  }
  
  // Mock HTMLElement methods that might not be in JSDOM
  if (typeof HTMLElement !== 'undefined') {
    HTMLElement.prototype.scrollIntoView = HTMLElement.prototype.scrollIntoView || function() {};
  }
}

// Add global jest mocks
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
