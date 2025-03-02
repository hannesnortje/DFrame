import { QSet } from '../QSet';

describe('QSet', () => {
  test('constructor', () => {
    const set1 = new QSet<number>([1, 2, 3, 3]); // Note the duplicate
    const set2 = new QSet<number>(set1);
    const set3 = new QSet<number>();
    
    expect(set1.size()).toBe(3); // Should deduplicate
    expect(set2.size()).toBe(3);
    expect(set3.size()).toBe(0);
    
    // Check content
    expect(set1.contains(1)).toBe(true);
    expect(set1.contains(2)).toBe(true);
    expect(set1.contains(3)).toBe(true);
  });
  
  test('size and isEmpty', () => {
    const set1 = new QSet<number>([1, 2, 3]);
    const set2 = new QSet<number>();
    
    expect(set1.size()).toBe(3);
    expect(set2.size()).toBe(0);
    
    expect(set1.isEmpty()).toBe(false);
    expect(set2.isEmpty()).toBe(true);
  });
  
  test('insert', () => {
    const set = new QSet<number>();
    
    expect(set.insert(1)).toBe(true);
    expect(set.insert(2)).toBe(true);
    expect(set.insert(1)).toBe(false); // Already exists
    
    expect(set.size()).toBe(2);
  });
  
  test('contains', () => {
    const set = new QSet<number>([1, 2, 3]);
    
    expect(set.contains(1)).toBe(true);
    expect(set.contains(4)).toBe(false);
  });
  
  test('remove', () => {
    const set = new QSet<number>([1, 2, 3]);
    
    expect(set.remove(2)).toBe(true);
    expect(set.size()).toBe(2);
    expect(set.contains(2)).toBe(false);
    
    expect(set.remove(4)).toBe(false); // Doesn't exist
    expect(set.size()).toBe(2);
  });
  
  test('clear', () => {
    const set = new QSet<number>([1, 2, 3]);
    
    set.clear();
    expect(set.isEmpty()).toBe(true);
  });
  
  test('unite', () => {
    const set1 = new QSet<number>([1, 2, 3]);
    const set2 = new QSet<number>([3, 4, 5]);
    
    const union = set1.unite(set2);
    
    expect(union.size()).toBe(5);
    expect(union.contains(1)).toBe(true);
    expect(union.contains(5)).toBe(true);
    
    // Original sets unchanged
    expect(set1.size()).toBe(3);
    expect(set2.size()).toBe(3);
  });
  
  test('intersect', () => {
    const set1 = new QSet<number>([1, 2, 3, 4]);
    const set2 = new QSet<number>([3, 4, 5, 6]);
    
    const intersection = set1.intersect(set2);
    
    expect(intersection.size()).toBe(2);
    expect(intersection.contains(3)).toBe(true);
    expect(intersection.contains(4)).toBe(true);
    expect(intersection.contains(1)).toBe(false);
    expect(intersection.contains(5)).toBe(false);
    
    // Original sets unchanged
    expect(set1.size()).toBe(4);
    expect(set2.size()).toBe(4);
  });
  
  test('subtract', () => {
    const set1 = new QSet<number>([1, 2, 3, 4]);
    const set2 = new QSet<number>([3, 4, 5, 6]);
    
    const difference = set1.subtract(set2);
    
    expect(difference.size()).toBe(2);
    expect(difference.contains(1)).toBe(true);
    expect(difference.contains(2)).toBe(true);
    expect(difference.contains(3)).toBe(false);
    expect(difference.contains(4)).toBe(false);
    
    // Original sets unchanged
    expect(set1.size()).toBe(4);
    expect(set2.size()).toBe(4);
  });
  
  test('toArray and toSet', () => {
    const set = new QSet<number>([1, 2, 3]);
    
    expect(set.toArray().sort()).toEqual([1, 2, 3]);
    
    const jsSet = set.toSet();
    expect(jsSet).toBeInstanceOf(Set);
    expect(jsSet.has(1)).toBe(true);
    expect(jsSet.has(2)).toBe(true);
    expect(jsSet.has(3)).toBe(true);
  });
  
  test('filter', () => {
    const set = new QSet<number>([1, 2, 3, 4, 5]);
    const filtered = set.filter(x => x % 2 === 0);
    
    expect(filtered.size()).toBe(2);
    expect(filtered.contains(2)).toBe(true);
    expect(filtered.contains(4)).toBe(true);
    expect(filtered.contains(1)).toBe(false);
  });
  
  test('map', () => {
    const set = new QSet<number>([1, 2, 3]);
    const mapped = set.map(x => x * 2);
    
    expect(mapped.size()).toBe(3);
    expect(mapped.contains(2)).toBe(true);
    expect(mapped.contains(4)).toBe(true);
    expect(mapped.contains(6)).toBe(true);
  });
  
  test('forEach', () => {
    const set = new QSet<number>([1, 2, 3]);
    const result: number[] = [];
    
    set.forEach(value => {
      result.push(value);
    });
    
    expect(result.sort()).toEqual([1, 2, 3]);
  });
  
  test('subset relationships', () => {
    const superSet = new QSet<number>([1, 2, 3, 4, 5]);
    const subSet = new QSet<number>([2, 3, 4]);
    const equalSet = new QSet<number>([2, 3, 4]);
    const unrelatedSet = new QSet<number>([5, 6, 7]);
    
    expect(subSet.isSubsetOf(superSet)).toBe(true);
    expect(subSet.isProperSubsetOf(superSet)).toBe(true);
    
    expect(subSet.isSubsetOf(equalSet)).toBe(true);
    expect(subSet.isProperSubsetOf(equalSet)).toBe(false);
    
    expect(unrelatedSet.isSubsetOf(superSet)).toBe(false);
    expect(unrelatedSet.isProperSubsetOf(superSet)).toBe(false);
  });
  
  test('equals', () => {
    const set1 = new QSet<number>([1, 2, 3]);
    const set2 = new QSet<number>([3, 2, 1]);
    const set3 = new QSet<number>([1, 2]);
    
    expect(set1.equals(set2)).toBe(true);
    expect(set1.equals(set3)).toBe(false);
  });
  
  test('iterator support', () => {
    const set = new QSet<number>([1, 2, 3]);
    const result: number[] = [];
    
    for (const value of set) {
      result.push(value);
    }
    
    expect(result.sort()).toEqual([1, 2, 3]);
  });
});