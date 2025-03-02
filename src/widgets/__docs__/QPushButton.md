# QPushButton

QPushButton provides a command button that can be clicked by the user.

## Features

- Text display and management
- Inherits all QWidget features (geometry, visibility, etc.)
- Signal emission on text changes

## Examples

### Basic Usage

```typescript
import { QPushButton } from 'dframe';

// Create a button with initial text
const button = new QPushButton('Click Me');

// Update button text
button.setText('New Text');

// Monitor text changes
button.connect('textChanged', (newText: string) => {
    console.log(`Button text changed to: ${newText}`);
});
```

### With Parent Widget

```typescript
import { QWidget, QPushButton } from 'dframe';

const parent = new QWidget();
const button = new QPushButton('OK', parent);

button.setGeometry({
    x: 10,
    y: 10,
    width: 100,
    height: 30
});
```

## API Reference

### Constructor
- `constructor(text: string = '', parent: QWidget | null = null)`

### Methods
- `setText(text: string): void`
- `getText(): string`

### Signals
- `textChanged`: Emitted when the button's text changes

## Best Practices

1. Provide meaningful button text
2. Use consistent button sizes
3. Connect to relevant signals for interaction handling
