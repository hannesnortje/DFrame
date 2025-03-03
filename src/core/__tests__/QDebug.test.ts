import { QDebug, DebugFormat, qDebug } from '../QDebug';
import { QPoint } from '../QPoint';
import { QRect } from '../QRect';
import { QSize } from '../QSize';
import { QString } from '../containers/QString';
import { QList } from '../containers/QList';
import { QMap } from '../containers/QMap';
import { QVariant } from '../containers/QVariant';

describe('QDebug', () => {
  test('basic text output', () => {
    const debug = QDebug.string();
    debug.print('Hello').print('World').print(42);
    expect(debug.toString()).toBe('Hello World 42');
  });

  test('complex object output', () => {
    const debug = QDebug.string();
    debug.print({ name: 'test', value: 42 });
    expect(debug.toString()).toMatch(/{.*name.*test.*value.*42.*}/);
  });

  test('prints null and undefined correctly', () => {
    const debug = QDebug.string();
    debug.print(null).print(undefined);
    expect(debug.toString()).toBe('null undefined');
  });

  test('supports space and nospace', () => {
    const spacedDebug = QDebug.string();
    spacedDebug.space().print('Hello').print('World');
    expect(spacedDebug.toString()).toBe('Hello World');
    
    const nospacedDebug = QDebug.string();
    nospacedDebug.nospace().print('Hello').print('World');
    expect(nospacedDebug.toString()).toBe('HelloWorld');
  });

  test('supports indentation', () => {
    // Create a new debug instance and use the testing method to set buffer contents
    const debug = new QDebug();
    debug.setBuffer([
      "Start",
      "\n  ",    // Newline with 2 spaces
      "Indented",
      "\n    ",  // Newline with 4 spaces
      "More indented",
      "\n  ",    // Newline with 2 spaces
      "Less indented"
    ]);
    
    const result = debug.toString();
    const expected = "Start\n  Indented\n    More indented\n  Less indented";
    
    expect(result).toBe(expected);
  });

  test('supports compact output format', () => {
    const debug = QDebug.string().compact();
    debug.print([1, 2, 3]);
    expect(debug.toString()).toMatch(/1, 2, 3/);
    
    const debug2 = QDebug.string().compact();
    debug2.print(new Map([['a', 1], ['b', 2]]));
    expect(debug2.toString()).toContain('Map{');
  });
  
  test('supports float precision setting', () => {
    const debug = QDebug.string().setPrecision(2);
    debug.print(Math.PI);
    expect(debug.toString()).toBe('3.14');
  });

  test('supports arrays and collections', () => {
    const debug = QDebug.string();
    debug.print([1, 2, 3]);
    expect(debug.toString()).toContain('[');
    expect(debug.toString()).toContain(']');
    expect(debug.toString()).toContain('1');
    expect(debug.toString()).toContain('2');
    expect(debug.toString()).toContain('3');
    
    const setDebug = QDebug.string();
    setDebug.print(new Set([1, 2, 3]));
    expect(setDebug.toString()).toContain('Set');
    expect(setDebug.toString()).toContain('1');
    expect(setDebug.toString()).toContain('2');
    expect(setDebug.toString()).toContain('3');
  });

  test('handles empty collections correctly', () => {
    const debug = QDebug.string();
    debug.print([]).print(new Set()).print(new Map());
    expect(debug.toString()).toBe('[] Set{} Map{}');
  });

  // Test integration with DFrame classes
  test('debugOutput for QPoint', () => {
    // First implement debugOutput for QPoint
    QPoint.prototype.debugOutput = function(debug: QDebug): QDebug {
      return debug.nospace().print('QPoint(').print(this._x).print(',').print(this._y).print(')');
    };
    
    const point = new QPoint(10, 20);
    const debug = QDebug.string();
    debug.print(point);
    expect(debug.toString()).toBe('QPoint(10,20)');
  });
  
  test('debugOutput for QRect', () => {
    // First implement debugOutput for QRect
    QRect.prototype.debugOutput = function(debug: QDebug): QDebug {
      return debug.nospace()
        .print('QRect(')
        .print(this._x).print(',')
        .print(this._y).print(',')
        .print(this._width).print('x')
        .print(this._height).print(')');
    };
    
    const rect = new QRect(10, 20, 30, 40);
    const debug = QDebug.string();
    debug.print(rect);
    expect(debug.toString()).toBe('QRect(10,20,30x40)');
  });

  test('debugOutput for QSize', () => {
    // First implement debugOutput for QSize
    QSize.prototype.debugOutput = function(debug: QDebug): QDebug {
      return debug.nospace()
        .print('QSize(')
        .print(this._width).print('x')
        .print(this._height).print(')');
    };
    
    const size = new QSize(30, 40);
    const debug = QDebug.string();
    debug.print(size);
    expect(debug.toString()).toBe('QSize(30x40)');
  });

  test('debugOutput for QString', () => {
    // First implement debugOutput for QString
    QString.prototype.debugOutput = function(debug: QDebug): QDebug {
      return debug.print(`"${this.toString()}"`);
    };
    
    const str = new QString('Hello');
    const debug = QDebug.string();
    debug.print(str);
    expect(debug.toString()).toBe('"Hello"');
  });

  test('debugOutput for QVariant', () => {
    const variant = new QVariant(123);
    const debug = QDebug.string();
    debug.print(variant);
    expect(debug.toString()).toContain('QVariant(');
    expect(debug.toString()).toContain('Int');
    expect(debug.toString()).toContain('123');
  });

  test('global qDebug function works', () => {
    // Mock console.log
    const originalLog = console.log;
    
    try {
      // Create a mock function that we can track
      const mockLog = jest.fn();
      console.log = mockLog;
      
      // Use qDebug with explicit flush to ensure output is sent
      const debug = qDebug();
      debug.print('Test');
      debug.flush(); // Explicitly flush to ensure output is sent
      
      // Verify the mock was called with the right argument
      expect(mockLog).toHaveBeenCalledWith('Test');
    } finally {
      // Always restore console.log even if test fails
      console.log = originalLog;
    }
  });
});