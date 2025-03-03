# QDebug

The `QDebug` class provides a stream-like interface for formatting and outputting debug information. It's designed to be used with DFrame classes and provides a consistent way to output debug information for complex objects.

## Basic Usage

```typescript
import { qDebug } from 'dframe';

// Simple output
qDebug().print('Hello, world!'); // Outputs to console

// Chaining operations
qDebug().space().print('x:').print(10).print('y:').print(20);
// Outputs: "x: 10 y: 20"

// Custom output target
const debug = new QDebug(message => myCustomLogger.log(message));
debug.print('Custom output').flush();
```

## Formatting Options

```typescript
// Control spacing
qDebug().nospace().print('no').print('spaces'); // Outputs: "nospaces"
qDebug().space().print('with').print('spaces'); // Outputs: "with spaces"

// Indentation
qDebug().indented()
  .print('Level 1')
  .newline().increaseIndent()
  .print('Level 2')
  .newline().increaseIndent()
  .print('Level 3')
  .decreaseIndent().newline()
  .print('Back to Level 2');

// Number formatting
qDebug().setFieldWidth(5).print(42); // Outputs: "   42"
qDebug().setPrecision(2).print(Math.PI); // Outputs: "3.14"

// Compact output
qDebug().compact().print([1, 2, 3]); // Outputs: "1, 2, 3" 
```

## Integration with DFrame Classes

DFrame classes can implement a `debugOutput` method to customize their output:

```typescript
// Example implementation for a custom class
class MyClass {
  private _value: number = 42;
  private _name: string = 'example';
  
  debugOutput(debug: QDebug): QDebug {
    return debug.nospace()
      .print('MyClass(')
      .print(this._name).print(', ')
      .print(this._value)
      .print(')');
  }
}

const obj = new MyClass();
qDebug().print(obj); // Outputs: "MyClass(example, 42)"
```

## Output Formats

The `QDebug` class supports three output formats:

- `Default`: Standard output format with reasonable spacing
- `Indented`: Each level is indented for better readability
- `Compact`: Minimizes whitespace for more compact output

```typescript
qDebug().setFormat(DebugFormat.Indented);
qDebug().compact(); // Shorthand for DebugFormat.Compact
```

## Collecting Output

Instead of immediately outputting to console, you can collect the output:

```typescript
const debug = QDebug.string();
debug.print('Collected').print('output');
const result = debug.toString(); // "Collected output"
```

## Global Functions

For convenience, the `qDebug` function creates a console-output `QDebug` instance:

```typescript
// These are equivalent:
qDebug().print('Hello');
QDebug.console().print('Hello');
```
