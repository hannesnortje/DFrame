import { QVariant, QVariantType } from '../QVariant';

describe('QVariant', () => {
  test('constructor and basic type identification', () => {
    const v1 = new QVariant(42);
    const v2 = new QVariant('hello');
    const v3 = new QVariant(true);
    const v4 = new QVariant(3.14);
    const v5 = new QVariant();
    
    expect(v1.type()).toBe(QVariantType.Int);
    expect(v2.type()).toBe(QVariantType.String);
    expect(v3.type()).toBe(QVariantType.Bool);
    expect(v4.type()).toBe(QVariantType.Double);
    expect(v5.type()).toBe(QVariantType.Invalid);
  });
  
  test('value retrieval', () => {
    const v1 = new QVariant(42);
    const v2 = new QVariant('hello');
    const v3 = new QVariant();
    
    expect(v1.value()).toBe(42);
    expect(v2.value()).toBe('hello');
    expect(v3.value()).toBeNull();
  });
  
  test('isValid and isNull', () => {
    const v1 = new QVariant(42);
    const v2 = new QVariant(null);
    const v3 = new QVariant();
    
    expect(v1.isValid()).toBe(true);
    expect(v1.isNull()).toBe(false);
    
    expect(v2.isValid()).toBe(false);
    expect(v2.isNull()).toBe(true);
    
    expect(v3.isValid()).toBe(false);
    expect(v3.isNull()).toBe(true);
  });
  
  test('toBool conversion', () => {
    // Boolean values
    expect(new QVariant(true).toBool()).toBe(true);
    expect(new QVariant(false).toBool()).toBe(false);
    
    // Number values
    expect(new QVariant(1).toBool()).toBe(true);
    expect(new QVariant(0).toBool()).toBe(false);
    
    // String values
    expect(new QVariant('true').toBool()).toBe(true);
    expect(new QVariant('false').toBool()).toBe(false);
    expect(new QVariant('yes').toBool()).toBe(true);
    expect(new QVariant('1').toBool()).toBe(true);
    expect(new QVariant('0').toBool()).toBe(false);
    expect(new QVariant('no').toBool()).toBe(false);
    
    // Invalid/null variants
    expect(new QVariant().toBool()).toBe(false);
  });
  
  test('toInt conversion', () => {
    // Number values
    expect(new QVariant(42).toInt()).toBe(42);
    expect(new QVariant(42.8).toInt()).toBe(42);
    expect(new QVariant(-10).toInt()).toBe(-10);
    
    // Boolean values
    expect(new QVariant(true).toInt()).toBe(1);
    expect(new QVariant(false).toInt()).toBe(0);
    
    // String values
    expect(new QVariant('42').toInt()).toBe(42);
    expect(new QVariant('42.8').toInt()).toBe(42);
    expect(new QVariant('-10').toInt()).toBe(-10);
    expect(new QVariant('invalid').toInt()).toBe(0);
    
    // Invalid/null variants
    expect(new QVariant().toInt()).toBe(0);
  });
  
  test('toDouble conversion', () => {
    // Number values
    expect(new QVariant(42).toDouble()).toBe(42);
    expect(new QVariant(42.5).toDouble()).toBe(42.5);
    expect(new QVariant(-10.75).toDouble()).toBe(-10.75);
    
    // Boolean values
    expect(new QVariant(true).toDouble()).toBe(1);
    expect(new QVariant(false).toDouble()).toBe(0);
    
    // String values
    expect(new QVariant('42').toDouble()).toBe(42);
    expect(new QVariant('42.5').toDouble()).toBe(42.5);
    expect(new QVariant('-10.75').toDouble()).toBe(-10.75);
    expect(new QVariant('invalid').toDouble()).toBe(0);
    
    // Invalid/null variants
    expect(new QVariant().toDouble()).toBe(0);
  });
  
  test('toString conversion', () => {
    // String values
    expect(new QVariant('hello').toString()).toBe('hello');
    
    // Number values
    expect(new QVariant(42).toString()).toBe('42');
    expect(new QVariant(42.5).toString()).toBe('42.5');
    
    // Boolean values
    expect(new QVariant(true).toString()).toBe('true');
    expect(new QVariant(false).toString()).toBe('false');
    
    // Invalid/null variants
    expect(new QVariant().toString()).toBe('');
  });
  
  test('typeName', () => {
    expect(new QVariant(42).typeName()).toBe('Int');
    expect(new QVariant(42.5).typeName()).toBe('Double');
    expect(new QVariant('hello').typeName()).toBe('String');
    expect(new QVariant(true).typeName()).toBe('Bool');
    expect(new QVariant([1, 2, 3]).typeName()).toBe('List');
    expect(new QVariant(new Map()).typeName()).toBe('Map');
    expect(new QVariant().typeName()).toBe('Invalid');
  });
  
  test('object detection', () => {
    // Point-like object
    const point = { x: 10, y: 20 };
    expect(new QVariant(point).type()).toBe(QVariantType.Point);
    
    // Size-like object
    const size = { width: 100, height: 200 };
    expect(new QVariant(size).type()).toBe(QVariantType.Size);
    
    // Rect-like object
    const rect = { x: 10, y: 20, width: 100, height: 200 };
    expect(new QVariant(rect).type()).toBe(QVariantType.Rect);
    
    // Color-like object
    const color = { r: 255, g: 0, b: 0, a: 1 };
    expect(new QVariant(color).type()).toBe(QVariantType.Color);
    
    // Generic object
    const obj = { foo: 'bar' };
    expect(new QVariant(obj).type()).toBe(QVariantType.Object);
  });
  
  test('static factory methods', () => {
    const v1 = QVariant.fromValue(42);
    expect(v1.type()).toBe(QVariantType.Int);
    expect(v1.value()).toBe(42);
    
    const v2 = QVariant.fromNull();
    expect(v2.type()).toBe(QVariantType.Invalid);
    expect(v2.value()).toBeNull();
  });
});
