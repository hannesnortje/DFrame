import { QByteArray } from '../QByteArray';

describe('QByteArray', () => {
  test('constructor', () => {
    // String constructor
    const ba1 = new QByteArray('hello');
    expect(ba1.size()).toBe(5);
    expect(ba1.at(0)).toBe(104); // 'h'
    
    // Uint8Array constructor
    const ba2 = new QByteArray(new Uint8Array([104, 101, 108, 108, 111]));
    expect(ba2.size()).toBe(5);
    expect(ba2.toString()).toBe('hello');
    
    // Number array constructor
    const ba3 = new QByteArray([104, 101, 108, 108, 111]);
    expect(ba3.size()).toBe(5);
    expect(ba3.toString()).toBe('hello');
    
    // QByteArray constructor
    const ba4 = new QByteArray(ba1);
    expect(ba4.size()).toBe(5);
    expect(ba4.toString()).toBe('hello');
    
    // Empty constructor
    const ba5 = new QByteArray();
    expect(ba5.size()).toBe(0);
    expect(ba5.isEmpty()).toBe(true);
  });
  
  test('size and isEmpty', () => {
    const ba1 = new QByteArray('hello');
    const ba2 = new QByteArray();
    
    expect(ba1.size()).toBe(5);
    expect(ba1.isEmpty()).toBe(false);
    
    expect(ba2.size()).toBe(0);
    expect(ba2.isEmpty()).toBe(true);
  });
  
  test('at', () => {
    const ba = new QByteArray('hello');
    
    expect(ba.at(0)).toBe(104); // 'h'
    expect(ba.at(1)).toBe(101); // 'e'
    expect(ba.at(4)).toBe(111); // 'o'
    
    // Out of bounds returns 0
    expect(ba.at(5)).toBe(0);
    expect(ba.at(-1)).toBe(0);
  });
  
  test('append', () => {
    let ba = new QByteArray('hello');
    
    // Append string
    ba = ba.append(' world');
    expect(ba.toString()).toBe('hello world');
    
    // Append QByteArray
    ba = ba.append(new QByteArray('!'));
    expect(ba.toString()).toBe('hello world!');
    
    // Append Uint8Array
    ba = ba.append(new Uint8Array([63, 63]));
    expect(ba.toString()).toBe('hello world!??');
  });
  
  test('plus', () => {
    const ba1 = new QByteArray('hello');
    
    // Original unchanged
    const ba2 = ba1.plus(' world');
    expect(ba1.toString()).toBe('hello');
    expect(ba2.toString()).toBe('hello world');
  });
  
  test('mid, left, right', () => {
    const ba = new QByteArray('hello world');
    
    expect(ba.mid(0, 5).toString()).toBe('hello');
    expect(ba.mid(6, 5).toString()).toBe('world');
    expect(ba.mid(6).toString()).toBe('world');
    
    expect(ba.left(5).toString()).toBe('hello');
    expect(ba.right(5).toString()).toBe('world');
    
    // Edge cases
    expect(ba.mid(100).toString()).toBe('');
    expect(ba.left(0).toString()).toBe('');
    expect(ba.right(0).toString()).toBe('');
  });
  
  test('toString', () => {
    const ba = new QByteArray('hello world');
    expect(ba.toString()).toBe('hello world');
  });
  
  test('toHex', () => {
    const ba = new QByteArray([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // 'Hello'
    expect(ba.toHex()).toBe('48656c6c6f');
  });
  
  test('toBase64', () => {
    const ba = new QByteArray('hello world');
    // Base64 for 'hello world'
    expect(ba.toBase64()).toBe('aGVsbG8gd29ybGQ=');
  });
  
  test('toUint8Array', () => {
    const original = new Uint8Array([104, 101, 108, 108, 111]);
    const ba = new QByteArray(original);
    
    const result = ba.toUint8Array();
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBe(5);
    expect(Array.from(result)).toEqual(Array.from(original));
  });
  
  test('fromHex', () => {
    const ba = QByteArray.fromHex('48656c6c6f');
    expect(ba.toString()).toBe('Hello');
    
    // Should handle spaces and other non-hex characters
    const ba2 = QByteArray.fromHex('48 65 6c 6c 6f');
    expect(ba2.toString()).toBe('Hello');
  });
  
  test('fromBase64', () => {
    const ba = QByteArray.fromBase64('aGVsbG8gd29ybGQ=');
    expect(ba.toString()).toBe('hello world');
  });
  
  test('clone', () => {
    const ba1 = new QByteArray('hello');
    const ba2 = ba1.clone();
    
    // Should be equal but different instances
    expect(ba2.toString()).toBe('hello');
    
    // Modifying original shouldn't affect clone
    ba1.append(' world');
    expect(ba1.toString()).toBe('hello world');
    expect(ba2.toString()).toBe('hello');
  });
});
