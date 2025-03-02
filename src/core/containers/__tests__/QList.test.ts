import { QList } from '../QList';

describe('QList', () => {
  test('constructor', () => {
    const list1 = new QList<number>([1, 2, 3]);
    const list2 = new QList<number>(list1);
    const list3 = new QList<number>();
    
    expect(list1.toArray()).toEqual([1, 2, 3]);
    expect(list2.toArray()).toEqual([1, 2, 3]);
    expect(list3.toArray()).toEqual([]);
  });
  
  test('size and isEmpty', () => {
    const list1 = new QList<number>([1, 2, 3]);
    const list2 = new QList<number>();
    
    expect(list1.size()).toBe(3);
    expect(list2.size()).toBe(0);
    
    expect(list1.isEmpty()).toBe(false);
    expect(list2.isEmpty()).toBe(true);
  });
  
  test('at, first and last', () => {
    const list = new QList<number>([1, 2, 3]);
    
    expect(list.at(0)).toBe(1);
    expect(list.at(1)).toBe(2);
    expect(list.at(2)).toBe(3);
    expect(list.at(3)).toBeUndefined();
    
    expect(list.first()).toBe(1);
    expect(list.last()).toBe(3);
    
    const emptyList = new QList<number>();
    expect(emptyList.first()).toBeUndefined();
    expect(emptyList.last()).toBeUndefined();
  });
  
  test('append, prepend and insert', () => {
    const list = new QList<number>();
    
    list.append(3);
    expect(list.toArray()).toEqual([3]);
    
    list.prepend(1);
    expect(list.toArray()).toEqual([1, 3]);
    
    list.insert(1, 2);
    expect(list.toArray()).toEqual([1, 2, 3]);
  });
  
  test('removeAt', () => {
    const list = new QList<number>([1, 2, 3, 4, 5]);
    
    list.removeAt(2);
    expect(list.toArray()).toEqual([1, 2, 4, 5]);
    
    // Out of bounds - should do nothing
    list.removeAt(10);
    expect(list.toArray()).toEqual([1, 2, 4, 5]);
  });
  
  test('removeOne', () => {
    const list = new QList<number>([1, 2, 3, 2, 1]);
    
    expect(list.removeOne(2)).toBe(true);
    expect(list.toArray()).toEqual([1, 3, 2, 1]);
    
    expect(list.removeOne(10)).toBe(false);
    expect(list.toArray()).toEqual([1, 3, 2, 1]);
  });
  
  test('removeAll', () => {
    const list = new QList<number>([1, 2, 3, 2, 1]);
    
    expect(list.removeAll(2)).toBe(2);
    expect(list.toArray()).toEqual([1, 3, 1]);
    
    expect(list.removeAll(10)).toBe(0);
    expect(list.toArray()).toEqual([1, 3, 1]);
  });
  
  test('clear', () => {
    const list = new QList<number>([1, 2, 3]);
    
    list.clear();
    expect(list.isEmpty()).toBe(true);
    expect(list.toArray()).toEqual([]);
  });
  
  test('contains and indexOf', () => {
    const list = new QList<number>([1, 2, 3, 2, 1]);
    
    expect(list.contains(2)).toBe(true);
    expect(list.contains(10)).toBe(false);
    
    expect(list.indexOf(2)).toBe(1);
    expect(list.indexOf(2, 2)).toBe(3);
    expect(list.indexOf(10)).toBe(-1);
    
    expect(list.lastIndexOf(1)).toBe(4);
    expect(list.lastIndexOf(2)).toBe(3);
    expect(list.lastIndexOf(10)).toBe(-1);
  });
  
  test('mid', () => {
    const list = new QList<number>([1, 2, 3, 4, 5]);
    
    expect(list.mid(1, 3).toArray()).toEqual([2, 3, 4]);
    expect(list.mid(2).toArray()).toEqual([3, 4, 5]);
  });
  
  test('sort and sorted', () => {
    const list = new QList<number>([3, 1, 4, 1, 5]);
    
    // sorted creates a new list
    const sortedList = list.sorted();
    expect(sortedList.toArray()).toEqual([1, 1, 3, 4, 5]);
    expect(list.toArray()).toEqual([3, 1, 4, 1, 5]); // original unchanged
    
    // sort modifies in-place
    list.sort();
    expect(list.toArray()).toEqual([1, 1, 3, 4, 5]);
    
    // Custom comparator
    list.sort((a, b) => b - a);
    expect(list.toArray()).toEqual([5, 4, 3, 1, 1]);
  });
  
  test('reverse and reversed', () => {
    const list = new QList<number>([1, 2, 3, 4, 5]);
    
    // reversed creates a new list
    const reversedList = list.reversed();
    expect(reversedList.toArray()).toEqual([5, 4, 3, 2, 1]);
    expect(list.toArray()).toEqual([1, 2, 3, 4, 5]); // original unchanged
    
    // reverse modifies in-place
    list.reverse();
    expect(list.toArray()).toEqual([5, 4, 3, 2, 1]);
  });
  
  test('forEach', () => {
    const list = new QList<number>([1, 2, 3]);
    const result: number[] = [];
    
    list.forEach((item, index) => {
      result.push(item * index);
    });
    
    expect(result).toEqual([0, 2, 6]);
  });
  
  test('map', () => {
    const list = new QList<number>([1, 2, 3]);
    const mappedList = list.map(x => x * 2);
    
    expect(mappedList.toArray()).toEqual([2, 4, 6]);
    expect(list.toArray()).toEqual([1, 2, 3]); // Original unchanged
  });
  
  test('filter', () => {
    const list = new QList<number>([1, 2, 3, 4, 5]);
    const filteredList = list.filter(x => x % 2 === 0);
    
    expect(filteredList.toArray()).toEqual([2, 4]);
    expect(list.toArray()).toEqual([1, 2, 3, 4, 5]); // Original unchanged
  });
  
  test('concat', () => {
    const list1 = new QList<number>([1, 2]);
    const list2 = new QList<number>([3, 4]);
    
    const combinedList = list1.concat(list2);
    expect(combinedList.toArray()).toEqual([1, 2, 3, 4]);
    
    // Originals unchanged
    expect(list1.toArray()).toEqual([1, 2]);
    expect(list2.toArray()).toEqual([3, 4]);
  });
  
  test('slice', () => {
    const list = new QList<number>([1, 2, 3, 4, 5]);
    
    expect(list.slice(1, 4).toArray()).toEqual([2, 3, 4]);
    expect(list.slice(2).toArray()).toEqual([3, 4, 5]);
  });
  
  test('iterator support', () => {
    const list = new QList<number>([1, 2, 3]);
    const result: number[] = [];
    
    for (const item of list) {
      result.push(item);
    }
    
    expect(result).toEqual([1, 2, 3]);
    
    // Spread operator
    expect([...list]).toEqual([1, 2, 3]);
  });
});
