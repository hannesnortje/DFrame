import { QQueue } from '../QQueue';
import { QList } from '../QList';

describe('QQueue', () => {
  test('constructor', () => {
    // Empty constructor
    const queue1 = new QQueue<number>();
    expect(queue1.size()).toBe(0);
    expect(queue1.isEmpty()).toBe(true);
    
    // Array constructor
    const queue2 = new QQueue<number>([1, 2, 3]);
    expect(queue2.size()).toBe(3);
    expect(queue2.isEmpty()).toBe(false);
    
    // QList constructor
    const list = new QList<number>([1, 2, 3]);
    const queue3 = new QQueue<number>(list);
    expect(queue3.size()).toBe(3);
    
    // QQueue constructor
    const queue4 = new QQueue<number>(queue2);
    expect(queue4.size()).toBe(3);
  });
  
  test('enqueue and dequeue', () => {
    const queue = new QQueue<number>();
    
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    
    expect(queue.size()).toBe(3);
    expect(queue.head()).toBe(1);
    
    // Dequeue should return and remove the head item
    expect(queue.dequeue()).toBe(1);
    expect(queue.size()).toBe(2);
    expect(queue.head()).toBe(2);
    
    expect(queue.dequeue()).toBe(2);
    expect(queue.dequeue()).toBe(3);
    expect(queue.size()).toBe(0);
    
    // Dequeue on empty queue should return undefined
    expect(queue.dequeue()).toBeUndefined();
  });
  
  test('head', () => {
    const queue = new QQueue<number>([1, 2, 3]);
    
    // Should return the head item without removing it
    expect(queue.head()).toBe(1);
    expect(queue.size()).toBe(3);
    
    // Empty queue should return undefined
    const emptyQueue = new QQueue<number>();
    expect(emptyQueue.head()).toBeUndefined();
  });
  
  test('clear', () => {
    const queue = new QQueue<number>([1, 2, 3]);
    
    queue.clear();
    expect(queue.size()).toBe(0);
    expect(queue.isEmpty()).toBe(true);
  });
  
  test('contains', () => {
    const queue = new QQueue<number>([1, 2, 3]);
    
    expect(queue.contains(2)).toBe(true);
    expect(queue.contains(4)).toBe(false);
  });
  
  test('toList and toArray', () => {
    const queue = new QQueue<number>([1, 2, 3]);
    
    const list = queue.toList();
    expect(list).toBeInstanceOf(QList);
    expect(list.toArray()).toEqual([1, 2, 3]);
    
    const array = queue.toArray();
    expect(array).toEqual([1, 2, 3]);
  });
  
  test('swap', () => {
    const queue1 = new QQueue<number>([1, 2, 3]);
    const queue2 = new QQueue<number>([4, 5]);
    
    queue1.swap(queue2);
    
    expect(queue1.toArray()).toEqual([4, 5]);
    expect(queue2.toArray()).toEqual([1, 2, 3]);
  });
});
