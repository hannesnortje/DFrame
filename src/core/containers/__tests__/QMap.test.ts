import { QMap } from '../QMap';

describe('QMap', () => {
  test('constructor', () => {
    const map1 = new QMap<string, number>([['a', 1], ['b', 2]]);
    const map2 = new QMap<string, number>(map1);
    const map3 = new QMap<string, number>();
    const map4 = new QMap<string, number>(new Map([['c', 3]]));
    
    expect(map1.size()).toBe(2);
    expect(map2.size()).toBe(2);
    expect(map3.size()).toBe(0);
    expect(map4.size()).toBe(1);
    
    expect(map1.value('a')).toBe(1);
    expect(map2.value('b')).toBe(2);
    expect(map4.value('c')).toBe(3);
  });
  
  test('size and isEmpty', () => {
    const map1 = new QMap<string, number>([['a', 1], ['b', 2]]);
    const map2 = new QMap<string, number>();
    
    expect(map1.size()).toBe(2);
    expect(map2.size()).toBe(0);
    
    expect(map1.isEmpty()).toBe(false);
    expect(map2.isEmpty()).toBe(true);
  });
  
  test('insert and value', () => {
    const map = new QMap<string, number>();
    
    map.insert('a', 1);
    map.insert('b', 2);
    
    expect(map.size()).toBe(2);
    expect(map.value('a')).toBe(1);
    expect(map.value('b')).toBe(2);
    expect(map.value('c')).toBeUndefined();
    expect(map.value('c', 99)).toBe(99); // Default value
    
    // Overwrite existing key
    map.insert('a', 10);
    expect(map.value('a')).toBe(10);
  });
  
  test('contains', () => {
    const map = new QMap<string, number>([['a', 1], ['b', 2]]);
    
    expect(map.contains('a')).toBe(true);
    expect(map.contains('c')).toBe(false);
  });
  
  test('remove', () => {
    const map = new QMap<string, number>([['a', 1], ['b', 2], ['c', 3]]);
    
    expect(map.remove('b')).toBe(true);
    expect(map.size()).toBe(2);
    expect(map.contains('b')).toBe(false);
    
    expect(map.remove('d')).toBe(false);
    expect(map.size()).toBe(2);
  });
  
  test('clear', () => {
    const map = new QMap<string, number>([['a', 1], ['b', 2]]);
    
    map.clear();
    expect(map.isEmpty()).toBe(true);
    expect(map.size()).toBe(0);
  });
  
  test('keys and values', () => {
    const map = new QMap<string, number>([['a', 1], ['b', 2], ['c', 3]]);
    
    expect(map.keys()).toEqual(['a', 'b', 'c']);
    expect(map.values()).toEqual([1, 2, 3]);
  });
  
  test('toMap', () => {
    const map = new QMap<string, number>([['a', 1], ['b', 2]]);
    const jsMap = map.toMap();
    
    expect(jsMap).toBeInstanceOf(Map);
    expect(jsMap.get('a')).toBe(1);
    expect(jsMap.get('b')).toBe(2);
  });
  
  test('entries', () => {
    const map = new QMap<string, number>([['a', 1], ['b', 2]]);
    const entries = Array.from(map.entries());
    
    expect(entries).toEqual([['a', 1], ['b', 2]]);
  });
  
  test('unite', () => {
    const map1 = new QMap<string, number>([['a', 1], ['b', 2]]);
    const map2 = new QMap<string, number>([['b', 20], ['c', 3]]);
    
    map1.unite(map2);
    
    expect(map1.size()).toBe(3);
    expect(map1.value('a')).toBe(1);
    expect(map1.value('b')).toBe(20); // Overwritten
    expect(map1.value('c')).toBe(3);
  });
  
  test('forEach', () => {
    const map = new QMap<string, number>([['a', 1], ['b', 2]]);
    const result: { key: string, value: number }[] = [];
    
    map.forEach((value, key) => {
      result.push({ key, value });
    });
    
    expect(result).toEqual([
      { key: 'a', value: 1 },
      { key: 'b', value: 2 }
    ]);
  });
  
  test('iterator support', () => {
    const map = new QMap<string, number>([['a', 1], ['b', 2]]);
    const entries: [string, number][] = [];
    
    for (const [key, value] of map) {
      entries.push([key, value]);
    }
    
    expect(entries).toEqual([['a', 1], ['b', 2]]);
  });
});
