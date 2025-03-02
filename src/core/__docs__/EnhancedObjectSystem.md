# Enhanced Object System

DFrame provides an enhanced object system that builds on Qt concepts while leveraging TypeScript's strengths.

## QProperty: Automatic Change Tracking

QProperty provides automatic change detection and signaling for properties:

```typescript
import { QObject, QProperty } from 'dframe';

class Person extends QObject {
  name: QProperty<string>;
  age: QProperty<number>;
  
  constructor() {
    super();
    
    this.name = new QProperty(this, 'name', {
      defaultValue: '',
      // Validate name is not empty
      validator: value => value.trim().length > 0
    });
    
    this.age = new QProperty(this, 'age', {
      defaultValue: 0,
      // Age must be non-negative
      validator: value => value >= 0,
      // Round down to integer
      transform: value => Math.floor(value)
    });
    
    // Listen for property changes
    this.connect('nameChanged', (newValue, oldValue) => {
      console.log(`Name changed from ${oldValue} to ${newValue}`);
    });
  }
}

const person = new Person();

// Set properties - automatically emits 'nameChanged' signal
person.name.value = 'John';

// Get property values
console.log(person.name.value); // 'John'

// Validator prevents invalid values
person.age.value = -5; // Warning logged, value not changed

// Transform applied automatically
person.age.value = 25.7;
console.log(person.age.value); // 25 (floored)
```

## Property Binding

Properties can be bound together to automatically stay in sync:

```typescript
import { QObject, QProperty } from 'dframe';

class ViewModel extends QObject {
  firstName: QProperty<string>;
  lastName: QProperty<string>;
  fullName: QProperty<string>;
  
  constructor() {
    super();
    
    this.firstName = new QProperty(this, 'firstName', { defaultValue: '' });
    this.lastName = new QProperty(this, 'lastName', { defaultValue: '' });
    this.fullName = new QProperty(this, 'fullName', { defaultValue: '' });
    
    // Bind fullName to be derived from firstName and lastName
    const unbind = this.fullName.bind(() => {
      return `${this.firstName.value} ${this.lastName.value}`.trim();
    });
    
    // Later, if needed:
    // unbind();
  }
}

const viewModel = new ViewModel();
viewModel.firstName.value = 'John';
viewModel.lastName.value = 'Doe';

console.log(viewModel.fullName.value); // "John Doe"
```

## Enhanced Meta-Object System

```typescript
import { QObject, QMetaObject, QProperty } from 'dframe';

// Register meta information
const personMeta = QMetaObject.registerMetaObject('Person', 'QObject');
personMeta.addProperty({
  name: 'name',
  type: 'string',
  readable: true,
  writable: true,
  defaultValue: ''
});

// Create dynamic UI based on meta information
function createPropertyEditor(obj: QObject): HTMLElement {
  const container = document.createElement('div');
  const meta = QMetaObject.fromObject(obj);
  
  if (!meta) return container;
  
  // Get all properties from meta-object
  const properties = meta.getProperties();
  
  // Create editor for each property
  for (const prop of properties) {
    if (prop.readable && prop.writable) {
      const editor = document.createElement('div');
      
      const label = document.createElement('label');
      label.textContent = prop.name;
      
      const input = document.createElement('input');
      input.value = String(meta.getPropertyValue(obj, prop.name) || '');
      
      input.onchange = () => {
        meta.setPropertyValue(obj, prop.name, input.value);
      };
      
      editor.appendChild(label);
      editor.appendChild(input);
      container.appendChild(editor);
    }
  }
  
  return container;
}
```

## Advanced Object Relationships

```typescript
import { QObject } from 'dframe';

// Define relationship types
const RelationshipTypes = {
  DEPENDS_ON: 'dependsOn',
  PROVIDES_DATA_TO: 'providesDataTo',
  CONTROLS: 'controls'
};

// Create objects
const dataSource = new QObject();
dataSource.setObjectName('dataSource');

const processor = new QObject();
processor.setObjectName('processor');

const display = new QObject();
display.setObjectName('display');

// Establish relationships
processor.addRelationship(RelationshipTypes.DEPENDS_ON, dataSource);
display.addRelationship(RelationshipTypes.DEPENDS_ON, processor);
processor.addRelationship(RelationshipTypes.PROVIDES_DATA_TO, display);

// Query relationships
const dependencies = processor.relatedObjects(RelationshipTypes.DEPENDS_ON);
console.log(dependencies[0].getObjectName()); // 'dataSource'

// React to relationship changes
processor.connect('relationshipAdded', ({ type, object }) => {
  console.log(`New relationship: ${type} with ${object.getObjectName()}`);
});
```

## Optimized Signal-Slot Connections

```typescript
import { QObject } from 'dframe';

class DataProcessor extends QObject {
  processData() {
    // Process large dataset
    const result = { /* large data structure */ };
    
    // Emit with optimization options
    this.emit('dataProcessed', result);
  }
}

const processor = new DataProcessor();

// Connection with options
processor.connect('dataProcessed', (result) => {
  console.log('Handling processed data');
}, { 
  // Queue the callback for better UI responsiveness
  type: 'queued',
  
  // Only run once
  singleShot: true,
  
  // Set this context
  context: myViewClass
});
```

## Memory Management

The enhanced object system helps prevent memory leaks through better relationship management:

```typescript
import { QObject } from 'dframe';

function createObjectTree() {
  const parent = new QObject();
  
  // Children automatically track their parent
  const child1 = new QObject(parent);
  const child2 = new QObject(parent);
  
  // Grandchildren are part of the tree
  const grandchild = new QObject(child1);
  
  // Relationships are tracked
  child1.addRelationship('dependsOn', child2);
  
  // Destroying parent cleans up entire tree
  parent.connect('destroyed', () => {
    console.log('Parent and all children destroyed');
  });
  
  return parent;
}

const root = createObjectTree();
root.destroy(); // Cleans up the entire object tree
```
