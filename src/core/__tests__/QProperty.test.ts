import { QObject } from '../QObject';
import { QProperty, PropertyChangeData } from '../QProperty';

describe('QProperty', () => {
  // Mock console.warn to avoid test noise
  const originalWarn = console.warn;
  beforeEach(() => {
    console.warn = jest.fn();
  });
  
  afterEach(() => {
    console.warn = originalWarn;
    jest.useRealTimers();
  });
  
  // Setup fake timers for binding tests
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test('basic property usage', () => {
    const obj = new QObject();
    const prop = new QProperty<string>(obj, 'test', {
      defaultValue: 'default'
    });
    
    expect(prop.value).toBe('default');
    
    prop.value = 'changed';
    expect(prop.value).toBe('changed');
  });
  
  test('property emits change signals', () => {
    const obj = new QObject();
    const prop = new QProperty<number>(obj, 'counter', {
      defaultValue: 0
    });
    
    const mockFn = jest.fn();
    obj.connect('counterChanged', mockFn);
    
    prop.value = 42;
    expect(mockFn).toHaveBeenCalledWith({ value: 42, oldValue: 0 });
    
    // Setting same value shouldn't emit signal
    mockFn.mockClear();
    prop.value = 42;
    expect(mockFn).not.toHaveBeenCalled();
  });
  
  test('validator prevents invalid values', () => {
    const obj = new QObject();
    const prop = new QProperty<number>(obj, 'age', {
      defaultValue: 20,
      validator: value => value >= 0 && value <= 150
    });
    
    const mockFn = jest.fn();
    obj.connect('ageChanged', mockFn);
    
    // Try setting an invalid value
    prop.value = -10;
    
    // Value should not change
    expect(prop.value).toBe(20);
    expect(mockFn).not.toHaveBeenCalled();
    
    // A warning should have been logged
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('Invalid value for property age')
    );
    
    // Try setting a valid value
    prop.value = 30;
    expect(prop.value).toBe(30);
    expect(mockFn).toHaveBeenCalled();
  });
  
  test('transform modifies values', () => {
    const obj = new QObject();
    const prop = new QProperty<number>(obj, 'price', {
      defaultValue: 0,
      transform: value => Math.round(value * 100) / 100 // Round to 2 decimal places
    });
    
    prop.value = 10.999;
    expect(prop.value).toBe(11);
    
    prop.value = 5.123;
    expect(prop.value).toBe(5.12);
  });
  
  test('binding between properties', () => {
    const obj = new QObject();
    const source = new QProperty<string>(obj, 'source', {
      defaultValue: 'initial'
    });
    const target = new QProperty<string>(obj, 'target', {
      defaultValue: ''
    });
    
    const unbind = target.bind(source);
    expect(target.value).toBe('initial');
    
    source.value = 'updated';
    expect(target.value).toBe('updated');
    
    unbind();
    source.value = 'changed again';
    expect(target.value).toBe('updated'); // No change after unbind
  });
  
  test('binding to a function', () => {
    const obj = new QObject();
    const first = new QProperty<string>(obj, 'first', {
      defaultValue: 'John'
    });
    const last = new QProperty<string>(obj, 'last', {
      defaultValue: 'Doe'
    });
    const full = new QProperty<string>(obj, 'full', {
      defaultValue: ''
    });
    
    const unbind = full.bind(() => `${first.value} ${last.value}`);
    
    // Advance timers to ensure initial binding is applied
    jest.advanceTimersByTime(100);
    expect(full.value).toBe('John Doe');
    
    // Change a property and verify binding updates
    first.value = 'Jane';
    jest.advanceTimersByTime(100);
    expect(full.value).toBe('Jane Doe');
    
    // Unbind and verify changes stop propagating
    unbind();
    first.value = 'Alice';
    jest.advanceTimersByTime(100);
    expect(full.value).toBe('Jane Doe'); // No change after unbind
  });
});
