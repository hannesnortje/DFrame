import { QStyle } from '../QStyle';

describe('QStyle', () => {
  let style: QStyle;

  beforeEach(() => {
    style = new QStyle();
  });

  test('should set and get properties', () => {
    style.set('color', 'red');
    style.set('fontSize', 14);
    
    expect(style.get('color')).toBe('red');
    expect(style.get('fontSize')).toBe(14);
  });

  test('should return default value for undefined properties', () => {
    expect(style.get('undefinedProp')).toBeUndefined();
    expect(style.get('undefinedProp', 'default')).toBe('default');
  });

  test('should check if property exists', () => {
    style.set('color', 'blue');
    
    expect(style.has('color')).toBe(true);
    expect(style.has('undefinedProp')).toBe(false);
  });

  test('should merge styles', () => {
    const style1 = new QStyle({ color: 'red', fontSize: 14 });
    const style2 = new QStyle({ color: 'blue', fontWeight: 'bold' });
    
    style1.merge(style2);
    
    expect(style1.get('color')).toBe('blue');
    expect(style1.get('fontSize')).toBe(14);
    expect(style1.get('fontWeight')).toBe('bold');
  });

  test('should create a clone with same properties', () => {
    style.set('color', 'green');
    style.set('fontSize', 16);
    
    const clone = style.clone();
    
    expect(clone.get('color')).toBe('green');
    expect(clone.get('fontSize')).toBe(16);
    
    // Verify clone is independent
    clone.set('color', 'yellow');
    expect(clone.get('color')).toBe('yellow');
    expect(style.get('color')).toBe('green');
  });
});
