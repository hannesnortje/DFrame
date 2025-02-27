import { jest } from '@jest/globals';
// Import the QWidget mock to apply it to prototype
import '../widgets/QWidget.mock';

// Custom types for our mocks to avoid DOM interface complexities
class MockClassList {
  private tokens: Set<string> = new Set();
  
  add = jest.fn((token: string) => {
    this.tokens.add(token);
  });
  
  remove = jest.fn((token: string) => {
    this.tokens.delete(token);
  });
  
  contains = jest.fn((token: string) => {
    return this.tokens.has(token);
  });
  
  item(index: number): string | null {
    return Array.from(this.tokens)[index] || null;
  }
  
  toggle(token: string, force?: boolean): boolean {
    if (force === undefined) {
      if (this.tokens.has(token)) {
        this.tokens.delete(token);
        return false;
      } else {
        this.tokens.add(token);
        return true;
      }
    } else if (force) {
      this.tokens.add(token);
      return true;
    } else {
      this.tokens.delete(token);
      return false;
    }
  }
  
  get length(): number {
    return this.tokens.size;
  }
  
  get value(): string {
    return Array.from(this.tokens).join(' ');
  }
}

// Basic mock element that only implements what we need
class MockElement {
  tagName: string;
  style: Record<string, string> = {};
  children: MockElement[] = [];
  classList: MockClassList = new MockClassList();
  offsetWidth = 0;
  offsetHeight = 0;
  protected _value = '';
  private eventListeners: Record<string, Array<(event: any) => void>> = {};
  
  constructor(tagName: string = 'div') {
    this.tagName = tagName;
  }
  
  get value(): string {
    return this._value;
  }
  
  set value(val: string) {
    this._value = val;
  }
  
  getAttribute = jest.fn((name: string) => null);
  setAttribute = jest.fn();
  
  appendChild = jest.fn(function(this: MockElement, child: MockElement) {
    this.children.push(child);
    return child;
  });
  
  removeChild = jest.fn(function(this: MockElement, child: MockElement) {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
    return child;
  });
  
  remove() {
    // Implementation for HTMLElement.remove()
  }
  
  // Add event listener functionality
  addEventListener = jest.fn((type: string, listener: (event: any) => void) => {
    if (!this.eventListeners[type]) {
      this.eventListeners[type] = [];
    }
    this.eventListeners[type].push(listener);
  });
  
  removeEventListener = jest.fn((type: string, listener: (event: any) => void) => {
    if (this.eventListeners[type]) {
      const index = this.eventListeners[type].indexOf(listener);
      if (index !== -1) {
        this.eventListeners[type].splice(index, 1);
      }
    }
  });
  
  // Method to simulate events for testing
  dispatchEvent = jest.fn((event: MockEvent) => {
    event.target = this;
    event.currentTarget = this;
    
    const listeners = this.eventListeners[event.type] || [];
    listeners.forEach(listener => listener(event));
    
    return !event.defaultPrevented;
  });
}

class MockOptionElement extends MockElement {
  constructor() {
    super('option');
  }
  
  private _optionValue = '';
  
  get value(): string {
    return this._optionValue;
  }
  
  set value(val: string) {
    this._optionValue = val;
  }
  
  // Mock HTMLOptionElement properties
  form = null;
  text = '';
  label = '';
}

class MockSelectElement extends MockElement {
  options: MockOptionElement[] = [];
  selectedIndex = -1;
  
  constructor() {
    super('select');
  }
  
  add(option: MockOptionElement): void {
    this.options.push(option);
    this.appendChild(option);
  }
  
  // Override the remove method with a compatible signature
  remove(index?: number): void {
    if (index !== undefined) {
      if (index >= 0 && index < this.options.length) {
        const option = this.options[index];
        this.options.splice(index, 1);
        const childIndex = this.children.indexOf(option);
        if (childIndex !== -1) {
          this.children.splice(childIndex, 1);
        }
      }
    } else {
      // Call parent method
      super.remove();
    }
  }
}

class MockEvent {
  static NONE = 0;
  static CAPTURING_PHASE = 1;
  static AT_TARGET = 2;
  static BUBBLING_PHASE = 3;
  
  type: string;
  target: MockElement | null = null;
  currentTarget: MockElement | null = null;
  bubbles = false;
  cancelable = false;
  defaultPrevented = false;
  
  constructor(type: string) {
    this.type = type;
  }
  
  preventDefault = jest.fn(function(this: MockEvent) {
    this.defaultPrevented = true;
  });
  
  stopPropagation = jest.fn();
  stopImmediatePropagation = jest.fn();
}

// Create a jest-dom environment without strict TypeScript checks

// Export an empty object to make this a module
export {};

// Define simple mock document and window objects
const mockDocument = {
  createElement: jest.fn((tagName: string) => {
    switch (tagName.toLowerCase()) {
      case 'select':
        return new MockSelectElement();
      case 'option':
        return new MockOptionElement();
      default:
        return new MockElement(tagName);
    }
  })
};

const mockWindow = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  document: mockDocument
};

// Create simplified mock globals without strict type checking
Object.defineProperty(global, 'document', {
  value: mockDocument,
  writable: true
});

Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true
});

// Define basic constructor mocks
Object.defineProperty(global, 'HTMLElement', {
  value: MockElement,
  writable: true
});

Object.defineProperty(global, 'Element', {
  value: MockElement,
  writable: true
});

Object.defineProperty(global, 'Event', {
  value: MockEvent,
  writable: true
});

Object.defineProperty(global, 'HTMLOptionElement', {
  value: MockOptionElement,
  writable: true
});

// Add additional Jest configuration if needed
jest.useFakeTimers();