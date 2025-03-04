import '@testing-library/jest-dom';

// Mock window and document
declare global {
  namespace NodeJS {
    interface Global {
      window: Window & typeof globalThis;
      document: Document;
      HTMLElement: typeof HTMLElement;
      Buffer: typeof Buffer;
    }
  }
}

// Mock window object
if (typeof window === 'undefined') {
  (global as any).window = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  };
}

// Mock document object
if (typeof document === 'undefined') {
  (global as any).document = {
    createElement: jest.fn().mockReturnValue({
      style: {},
      classList: {
        add: jest.fn(),
        remove: jest.fn(),
        toggle: jest.fn()
      }
    }),
    getElementById: jest.fn(),
    body: {
      appendChild: jest.fn()
    }
  };
}

// Mock HTMLElement
if (typeof HTMLElement === 'undefined') {
  (global as any).HTMLElement = class {};
}

// Mock Buffer if needed
if (typeof Buffer === 'undefined') {
  (global as any).Buffer = {
    from: jest.fn()
  };
}

// Polyfill TextEncoder/TextDecoder if needed
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = class TextEncoder {
    encode(input: string): Uint8Array {
      return new Uint8Array(
        input.split('').map(char => char.charCodeAt(0))
      );
    }
  } as any;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = class TextDecoder {
    decode(input: Uint8Array): string {
      return Array.from(input)
        .map(byte => String.fromCharCode(byte))
        .join('');
    }
  } as any;
}

// Add other polyfills as needed

// Ensure btoa/atob are available
if (typeof global.btoa === 'undefined') {
  global.btoa = (str: string) => {
    return Buffer.from(str, 'binary').toString('base64');
  };
}

if (typeof global.atob === 'undefined') {
  global.atob = (b64: string) => {
    return Buffer.from(b64, 'base64').toString('binary');
  };
}
