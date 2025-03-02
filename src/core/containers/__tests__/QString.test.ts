import { QString } from '../QString';

describe('QString', () => {
  test('constructor and toString', () => {
    const s1 = new QString('hello');
    const s2 = new QString(s1);
    const s3 = new QString();
    
    expect(s1.toString()).toBe('hello');
    expect(s2.toString()).toBe('hello');
    expect(s3.toString()).toBe('');
  });
  
  test('length and isEmpty', () => {
    const s1 = new QString('hello');
    const s2 = new QString();
    
    expect(s1.length()).toBe(5);
    expect(s2.length()).toBe(0);
    
    expect(s1.isEmpty()).toBe(false);
    expect(s2.isEmpty()).toBe(true);
  });
  
  test('mid, left, right', () => {
    const s = new QString('hello world');
    
    expect(s.mid(6).toString()).toBe('world');
    expect(s.mid(6, 3).toString()).toBe('wor');
    expect(s.left(5).toString()).toBe('hello');
    expect(s.right(5).toString()).toBe('world');
  });
  
  test('toLower and toUpper', () => {
    const s = new QString('Hello World');
    
    expect(s.toLower().toString()).toBe('hello world');
    expect(s.toUpper().toString()).toBe('HELLO WORLD');
  });
  
  test('trimmed', () => {
    const s = new QString('  hello world  ');
    expect(s.trimmed().toString()).toBe('hello world');
  });
  
  test('indexOf and lastIndexOf', () => {
    const s = new QString('hello world hello');
    
    expect(s.indexOf('hello')).toBe(0);
    expect(s.indexOf('hello', 1)).toBe(12);
    expect(s.lastIndexOf('hello')).toBe(12);
    expect(s.lastIndexOf('hello', 10)).toBe(0);
    
    // With QString argument
    expect(s.indexOf(new QString('hello'))).toBe(0);
  });
  
  test('startsWith and endsWith', () => {
    const s = new QString('hello world');
    
    expect(s.startsWith('hello')).toBe(true);
    expect(s.startsWith('world')).toBe(false);
    expect(s.endsWith('world')).toBe(true);
    expect(s.endsWith('hello')).toBe(false);
    
    // With QString argument
    expect(s.startsWith(new QString('hello'))).toBe(true);
    expect(s.endsWith(new QString('world'))).toBe(true);
  });
  
  test('replace', () => {
    const s = new QString('hello world');
    
    expect(s.replace('hello', 'hi').toString()).toBe('hi world');
    expect(s.replace(/o/g, 'O').toString()).toBe('hellO wOrld');
    
    // With QString arguments
    expect(s.replace(new QString('hello'), new QString('hi')).toString()).toBe('hi world');
  });
  
  test('split', () => {
    const s = new QString('hello world');
    const parts = s.split(' ');
    
    expect(parts.length).toBe(2);
    expect(parts[0].toString()).toBe('hello');
    expect(parts[1].toString()).toBe('world');
  });
  
  test('append', () => {
    const s = new QString('hello');
    
    // Create a new QString with the appended value
    const s2 = s.append(' world');
    expect(s2.toString()).toBe('hello world');
    
    // Append to the new QString object, not the original
    const s3 = s2.append('!');
    expect(s3.toString()).toBe('hello world!');
    
    // Original should remain unchanged (immutable behavior)
    expect(s.toString()).toBe('hello');
  });
  
  test('repeated', () => {
    const s = new QString('abc');
    expect(s.repeated(3).toString()).toBe('abcabcabc');
  });
  
  test('contains', () => {
    const s = new QString('hello world');
    
    expect(s.contains('hello')).toBe(true);
    expect(s.contains('world')).toBe(true);
    expect(s.contains('goodbye')).toBe(false);
    
    expect(s.contains(new QString('hello'))).toBe(true);
  });
  
  test('toNumber and toInt', () => {
    const s1 = new QString('123');
    const s2 = new QString('123.45');
    const s3 = new QString('abc');
    
    expect(s1.toNumber()).toBe(123);
    expect(s1.toInt()).toBe(123);
    expect(s2.toNumber()).toBe(123.45);
    expect(s2.toInt()).toBe(123);
    expect(s3.toNumber()).toBeNaN();
    expect(s3.toInt()).toBe(0);
  });
  
  test('compare', () => {
    const s1 = new QString('abc');
    const s2 = new QString('def');
    
    expect(s1.compare('abc')).toBe(0);
    expect(s1.compare('def')).toBeLessThan(0);
    expect(s2.compare('abc')).toBeGreaterThan(0);
  });
  
  test('static methods', () => {
    expect(QString.number(123).toString()).toBe('123');
    expect(QString.empty().toString()).toBe('');
    expect(QString.join(',', ['a', 'b', 'c']).toString()).toBe('a,b,c');
    expect(QString.join(',', [new QString('a'), new QString('b')]).toString()).toBe('a,b');
  });
});
