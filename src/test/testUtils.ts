/**
 * Test utilities to help with common DOM-related issues in Jest
 */

// Setup DOM event mocks if needed
if (typeof MouseEvent === 'undefined') {
  class MockMouseEvent {
    type: string;
    bubbles: boolean;
    cancelable: boolean;
    
    constructor(type: string, options: any = {}) {
      this.type = type;
      this.bubbles = options.bubbles || false;
      this.cancelable = options.cancelable || false;
    }
  }
  
  global.MouseEvent = MockMouseEvent as any;
}

/**
 * Helper to simulate click events
 */
export function simulateClick(element: HTMLElement): void {
  if (!element) {
    console.warn('Attempted to click on null element');
    return;
  }

  // First try dispatchEvent if available
  if (typeof element.dispatchEvent === 'function') {
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(clickEvent);
    return;
  }
  
  // Fallback if dispatchEvent not available (like in our mocks)
  if (typeof element.click === 'function') {
    element.click();
  }
}

/**
 * Helper to simulate mousedown events
 */
export function simulateMouseDown(element: HTMLElement): void {
  if (!element) return;
  
  if (typeof element.dispatchEvent === 'function') {
    const mouseDownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(mouseDownEvent);
  }
}

/**
 * Helper to simulate mouseup events
 */
export function simulateMouseUp(element: HTMLElement): void {
  if (!element) return;
  
  if (typeof element.dispatchEvent === 'function') {
    const mouseUpEvent = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(mouseUpEvent);
  }
}
