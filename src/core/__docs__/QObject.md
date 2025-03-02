# QObject

The QObject class is the base class of all objects in DFrame.

## Features

- Parent-child relationships between objects
- Signal and slot mechanism for object communication
- Automatic memory management through object hierarchies

## Examples

### Basic Usage

```typescript
import { QObject } from 'dframe';

const parent = new QObject();
const child = new QObject(parent);

// Basic signal-slot connection
child.connect('valueChanged', (newValue: number) => {
    console.log(`Value changed to: ${newValue}`);
});

child.emit('valueChanged', 42);
```

### Multiple Slots

```typescript
const obj = new QObject();

// Multiple slots can be connected to one signal
obj.connect('dataUpdated', (data: string) => console.log('Logger 1:', data));
obj.connect('dataUpdated', (data: string) => console.log('Logger 2:', data));

obj.emit('dataUpdated', 'New Data');
```

### Parent-Child Management

```typescript
const parent1 = new QObject();
const parent2 = new QObject();
const child = new QObject(parent1);

// Later, change parent
child.setParent(parent2);
```

## API Reference

### Constructor
- `constructor(parent: QObject | null = null)`

### Methods
- `setParent(parent: QObject | null): void`
- `connect<T>(signal: string, slot: Signal<T>): void`
- `emit<T>(signal: string, arg?: T): void`

## Best Practices

1. Always manage object hierarchy properly
2. Use typed signals when possible
3. Clean up connections when no longer needed
