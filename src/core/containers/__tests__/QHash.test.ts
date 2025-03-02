import { QHash } from '../QHash';

describe('QHash', () => {
  test('constructor', () => {
    const hash1 = new QHash<string, number>([['a', 1], ['b', 2]]);
    const hash2 = new QHash<string, number>(hash1);
    const hash3 = new QHash<string, number>();
    const hash4 = new QHash<string, number>(new Map([['c', 3]]));
    
    expect(hash1.size()).toBe(2);
    expect(hash2.size()).toBe(2);
    expect(hash3.size()).toBe(0);
    expect(hash4.size()).toBe(1);
    
    expect(hash1.value('a')).toBe(1);
    expect(hash2.value('b')).toBe(2);
    expect(hash4.value('c')).toBe(3);
  });
  
  test('size and isEmpty', () => {
    const hash1 = new QHash<string, number>([['a', 1], ['b', 2]]);
    const hash2 = new QHash<string, number>();
    
    expect(hash1.size()).toBe(2);
    expect(hash2.size()).toBe(0);
    
    expect(hash1.isEmpty()).toBe(false);
    expect(hash2.isEmpty()).toBe(true);
  });
  
  test('insert and value', () => {
    const hash = new QHash<string, number>();
    
    hash.insert('a', 1);
    hash.insert('b', 2);
    
    expect(hash.size()).toBe(2);
    expect(hash.value('a')).toBe(1);
    expect(hash.value('b')).toBe(2);
    expect(hash.value('c')).toBeUndefined();
    expect(hash.value('c', 99)).toBe(99); // Default value
    
    // Overwrite existing key
    hash.insert('a', 10);
    expect(hash.value('a')).toBe(10);
  });
  
  test('contains', () => {
    const hash = new QHash<string, number>([['a', 1], ['b', 2]]);
    
    expect(hash.contains('a')).toBe(true);
    expect(hash.contains('c')).toBe(false);
  });
  
  test('remove', () => {
    const hash = new QHash<string, number>([['a', 1], ['b', 2], ['c', 3]]);
    
    expect(hash.remove('b')).toBe(true);
    expect(hash.size()).toBe(2);
    expect(hash.contains('b')).toBe(false);
    
    expect(hash.remove('d')).toBe(false);
    expect(hash.size()).toBe(2);
  });
  
  test('clear', () => {
    const hash = new QHash<string, number>([['a', 1], ['b', 2]]);
    
    hash.clear();
    expect(hash.isEmpty()).toBe(true);
    expect(hash.size()).toBe(0);
  });
  
  test('keys and values', () => {
    const hash = new QHash<string, number>([['a', 1], ['b', 2], ['c', 3]]);
    
    // Sort to ensure consistent testing since hashes don't guarantee order
    expect(hash.keys().sort()).toEqual(['a', 'b', 'c']);
    expect(hash.values().sort()).toEqual([1, 2, 3]);
  });
  
  test('toMap', () => {
    const hash = new QHash<string, number>([['a', 1], ['b', 2]]);
    const jsMap = hash.toMap();
    
    expect(jsMap).toBeInstanceOf(Map);
    expect(jsMap.get('a')).toBe(1);
    expect(jsMap.get('b')).toBe(2);
  });
  
  test('unite', () => {
    const hash1 = new QHash<string, number>([['a', 1], ['b', 2]]);
    const hash2 = new QHash<string, number>([['b', 20], ['c', 3]]);
    
    hash1.unite(hash2);
    
    expect(hash1.size()).toBe(3);
    expect(hash1.value('a')).toBe(1);
    expect(hash1.value('b')).toBe(20); // Overwritten
    expect(hash1.value('c')).toBe(3);
  });
  
  test('forEach', () => {
    const hash = new QHash<string, number>([['a', 1], ['b', 2]]);
    const result: { key: string, value: number }[] = [];
    
    hash.forEach((value, key) => {
      result.push({ key, value });
    });
    
    // Sort to ensure consistent testing since forEach order isn't guaranteed
    result.sort((a, b) => a.key.localeCompare(b.key));
    
    expect(result).toEqual([
      { key: 'a', value: 1 },
      { key: 'b', value: 2 }
    ]);
  });
  
  test('mapped', () => {
    const hash = new QHash<string, number>([['a', 1], ['b', 2], ['c', 3]]);
    const doubled = hash.mapped(value => value * 2);
    
    expect(doubled.value('a')).toBe(2);
    expect(doubled.value('b')).toBe(4);
    expect(doubled.value('c')).toBe(6);
  });
  
  test('filtered', () => {
    const hash = new QHash<string, number>([['a', 1], ['b', 2], ['c', 3], ['d', 4]]);
    const evens = hash.filtered((value) => value % 2 === 0);
    
    expect(evens.size()).toBe(2);
    expect(evens.contains('a')).toBe(false);
    expect(evens.contains('b')).toBe(true);
    expect(evens.contains('c')).toBe(false);
    expect(evens.contains('d')).toBe(true);
  });
  
  test('iterator support', () => {
    const hash = new QHash<string, number>([['a', 1], ['b', 2]]);
    const entries: [string, number][] = [];
    
    for (const [key, value] of hash) {
      entries.push([key, value]);
    }
    
    // Sort for consistent testing
    entries.sort((a, b) => a[0].localeCompare(b[0]));
    
    expect(entries).toEqual([['a', 1], ['b', 2]]);
  });
});
