// Setup file for Jest tests

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
