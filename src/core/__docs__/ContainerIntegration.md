# Container Integration with QObject System

This document demonstrates how the Qt container classes are integrated with the core QObject system.

## Property System

The QObject property system has been enhanced with container classes for improved type safety and robust behavior:

```typescript
import { QObject } from '../core/QObject';
import { QString } from '../core/containers/QString';
import { QVariant } from '../core/containers/QVariant';

// Create a basic object
const obj = new QObject();

// Set properties using QString for keys
const nameKey = new QString('name');
obj.setProperty(nameKey.toString(), 'John');

// QVariant is used internally for type safety
obj.setProperty('age', 30); // Stored as QVariant<number>
obj.setProperty('active', true); // Stored as QVariant<boolean>

// Property retrieval is type-safe
const name = obj.property('name'); // 'John'
const age = obj.property('age'); // 30
```

## QProperty Integration

```typescript
import { QObject } from '../core/QObject';
import { QProperty } from '../core/QProperty';
import { QString } from '../core/containers/QString';

class User extends QObject {
  name: QProperty<QString>;
  score: QProperty<number>;
  
  constructor() {
    super();
    
    // QProperty with QString value
    this.name = new QProperty<QString>(this, 'name', {
      defaultValue: new QString('Anonymous')
    });
    
    this.score = new QProperty<number>(this, 'score', {
      defaultValue: 0,
      validator: value => value >= 0
    });
  }
  
  setDisplayName(name: string | QString) {
    // Handle both string and QString input
    if (typeof name === 'string') {
      this.name.value = new QString(name);
    } else {
      this.name.value = name;
    }
  }
  
  getDisplayName(): string {
    return this.name.value.toString();
  }
}

const user = new User();

// Using QString
user.setDisplayName(new QString('JohnDoe'));

// Regular string works too
user.setDisplayName('JaneDoe');

// Access via QObject property system or QProperty
console.log(user.property('name').toString()); // 'JaneDoe'
console.log(user.name.value.toString()); // 'JaneDoe'
```

## Signal Parameter Integration

Signals can now be used with container classes:

```typescript
import { QObject } from '../core/QObject';
import { QString } from '../core/containers/QString';
import { QList } from '../core/containers/QList';

class DataModel extends QObject {
  private _items: QList<QString> = new QList<QString>();
  
  constructor() {
    super();
  }
  
  addItem(item: string | QString) {
    const qItem = typeof item === 'string' ? new QString(item) : item;
    this._items.append(qItem);
    
    // Emitting with QList
    this.emit('itemsChanged', this._items);
    
    // Emitting with QString
    this.emit('itemAdded', qItem);
  }
  
  getItems(): QList<QString> {
    return this._items;
  }
}

const model = new DataModel();

// Connect to signals
model.connect('itemAdded', (item: QString) => {
  console.log(`New item: ${item.toString()}`);
});

model.connect('itemsChanged', (items: QList<QString>) => {
  console.log(`Item count: ${items.size()}`);
  
  // Use QList methods
  items.forEach(item => {
    console.log(` - ${item.toString()}`);
  });
});

// Add items
model.addItem('First item');
model.addItem(new QString('Second item'));
```

## Benefits of Container Integration

1. **Type Safety**: Container classes provide runtime type checking
2. **Consistent API**: Same method naming across the framework
3. **Enhanced Functionality**: Specialized methods for common operations
4. **Better Interoperability**: Container classes work well together
5. **Signal Parameter Safety**: Type-safe signal parameters
