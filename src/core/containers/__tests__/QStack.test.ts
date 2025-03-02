import { QStack } from '../QStack';
import { QList } from '../QList';

describe('QStack', () => {
  test('constructor', () => {
    // Empty constructor
    const stack1 = new QStack<number>();
    expect(stack1.size()).toBe(0);
    expect(stack1.isEmpty()).toBe(true);
    
    // Array constructor
    const stack2 = new QStack<number>([1, 2, 3]);
    expect(stack2.size()).toBe(3);
    expect(stack2.isEmpty()).toBe(false);
    
    // QList constructor
    const list = new QList<number>([1, 2, 3]);
    const stack3 = new QStack<number>(list);
    expect(stack3.size()).toBe(3);
    
    // QStack constructor
    const stack4 = new QStack<number>(stack2);
    expect(stack4.size()).toBe(3);
  });
  
  test('push and pop', () => {
    const stack = new QStack<number>();
    
    stack.push(1);
    stack.push(2);
    stack.push(3);
    
    expect(stack.size()).toBe(3);
    expect(stack.top()).toBe(3);
    
    // Pop should return and remove the top item
    expect(stack.pop()).toBe(3);
    expect(stack.size()).toBe(2);
    expect(stack.top()).toBe(2);
    
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBe(1);
    expect(stack.size()).toBe(0);
    
    // Pop on empty stack should return undefined
    expect(stack.pop()).toBeUndefined();
  });
  
  test('top', () => {
    const stack = new QStack<number>([1, 2, 3]);
    
    // Should return the top item without removing it
    expect(stack.top()).toBe(3);
    expect(stack.size()).toBe(3);
    
    // Empty stack should return undefined
    const emptyStack = new QStack<number>();
    expect(emptyStack.top()).toBeUndefined();
  });
  
  test('clear', () => {
    const stack = new QStack<number>([1, 2, 3]);
    
    stack.clear();
    expect(stack.size()).toBe(0);
    expect(stack.isEmpty()).toBe(true);
  });
  
  test('contains', () => {
    const stack = new QStack<number>([1, 2, 3]);
    
    expect(stack.contains(2)).toBe(true);
    expect(stack.contains(4)).toBe(false);
  });
  
  test('toList and toArray', () => {
    const stack = new QStack<number>([1, 2, 3]);
    
    const list = stack.toList();
    expect(list).toBeInstanceOf(QList);
    expect(list.toArray()).toEqual([1, 2, 3]);
    
    const array = stack.toArray();
    expect(array).toEqual([1, 2, 3]);
  });
  
  test('swap', () => {
    const stack1 = new QStack<number>([1, 2, 3]);
    const stack2 = new QStack<number>([4, 5]);
    
    stack1.swap(stack2);
    
    expect(stack1.toArray()).toEqual([4, 5]);
    expect(stack2.toArray()).toEqual([1, 2, 3]);
  });
});
