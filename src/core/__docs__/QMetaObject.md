# QMetaObject

QMetaObject provides meta-information about QObject-derived classes at runtime.

## Features

- Dynamic type introspection
- Object hierarchy exploration
- Property and method reflection
- Dynamic instance creation
- Enumeration value lookup

## Examples

### Registering Meta Objects

```typescript
import { QMetaObject } from 'dframe';

// Register meta objects for a class hierarchy
const buttonMeta = QMetaObject.registerMetaObject('QPushButton');
const checkBoxMeta = QMetaObject.registerMetaObject('QCheckBox', 'QPushButton');

// Add property metadata
buttonMeta.addProperty({
  name: 'text',
  type: 'string',
  readable: true,
  writable: true,
  notify: 'textChanged'
});

// Add method metadata
buttonMeta.addMethod({
  name: 'click',
  returnType: 'void',
  parameterTypes: [],
  parameterNames: [],
  methodType: 'slot'
});
```

### Dynamically Creating Objects

```typescript
import { QMetaObject, QObject } from 'dframe';

// Get meta object by type
const meta = QMetaObject.forType('QPushButton');
if (meta) {
  // Create new instance
  const button = meta.newInstance();
  
  // Set properties and invoke methods
  meta.setPropertyValue(button, 'text', 'Click Me');
  meta.invokeMethod(button, 'click');
}
```

### Dynamic Property Access

```typescript
import { QMetaObject, QObject } from 'dframe';

function logProperties(obj: QObject): void {
  const meta = QMetaObject.fromObject(obj);
  if (!meta) return;
  
  console.log(`Object class: ${meta.getClassName()}`);
  
  for (const property of meta.getProperties()) {
    const value = meta.getPropertyValue(obj, property.name);
    console.log(`${property.name} (${property.type}): ${value}`);
  }
}
```

### Checking Type Relationships

```typescript
import { QMetaObject, QPushButton, QWidget } from 'dframe';

const button = new QPushButton();
const buttonMeta = QMetaObject.fromObject(button);

console.log(buttonMeta.inherits('QWidget')); // true
console.log(buttonMeta.inherits('QObject')); // true
console.log(buttonMeta.inherits('QLabel'));  // false
```

## API Reference

### Static Methods
- `registerMetaObject(className: string, superClassName?: string): QMetaObject`
- `forType(className: string): QMetaObject | null`
- `fromObject(obj: QObject): QMetaObject | null`

### Instance Methods
- `newInstance(parent?: QObject): QObject | null`
- `addProperty(property: QMetaProperty): void`
- `addMethod(method: QMetaMethod): void`
- `addEnumerator(name: string, values: Record<string, number>): void`
- `addClassInfo(key: string, value: string): void`
- `getClassName(): string`
- `getSuperClass(): QMetaObject | null`
- `inherits(className: string): boolean`
- `getProperties(): QMetaProperty[]`
- `getProperty(name: string): QMetaProperty | null`
- `getMethods(): QMetaMethod[]`
- `getMethod(name: string): QMetaMethod | null`
- `invokeMethod(obj: QObject, methodName: string, args?: any[]): any`
- `getPropertyValue(obj: QObject, propertyName: string): Property | undefined`
- `setPropertyValue(obj: QObject, propertyName: string, value: Property): boolean`
- `getEnumerator(enumName: string, valueName: string): number | null`
- `getClassInfo(key: string): string | null`

## Interfaces

### QMetaProperty
```typescript
interface QMetaProperty {
    name: string;
    type: string;
    readable: boolean;
    writable: boolean;
    resettable: boolean;
    designable: boolean;
    scriptable: boolean;
    stored: boolean;
    user: boolean;
    constant: boolean;
    final: boolean;
    notify: string | null; // Signal name
}
```

### QMetaMethod
```typescript
interface QMetaMethod {
    name: string;
    returnType: string;
    parameterTypes: string[];
    parameterNames: string[];
    methodType: 'signal' | 'slot' | 'method';
}
```

## Best Practices

1. Register meta objects early in your application
2. Use meta objects for type validation instead of `instanceof`
3. Create generic components that can work with any object type
4. Use metadata to generate UI for property editing
5. Use meta-properties to implement serialization/deserialization
