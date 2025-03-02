# QWidget

QWidget is the base class for all user interface objects in DFrame.

## Features

- Geometry management
- Visibility control
- Widget hierarchy

## Examples

### Basic Widget Usage

```typescript
import { QWidget } from 'dframe';

const widget = new QWidget();

// Set geometry
widget.setGeometry({
    x: 100,
    y: 100,
    width: 200,
    height: 150
});

// Show the widget
widget.show();
```

### Widget Hierarchy

```typescript
const parentWidget = new QWidget();
const childWidget = new QWidget(parentWidget);

// Geometry changes can be monitored
childWidget.connect('geometryChanged', (geometry) => {
    console.log('New geometry:', geometry);
});

// Visibility changes can be monitored
childWidget.connect('visibilityChanged', (visible) => {
    console.log('Visibility changed:', visible);
});
```

## API Reference

### Constructor
- `constructor(parent: QWidget | null = null)`

### Methods
- `setGeometry(rect: Rect): void`
- `show(): void`
- `hide(): void`

### Signals
- `geometryChanged`: Emitted when the widget's geometry changes
- `visibilityChanged`: Emitted when the widget's visibility changes

## Interfaces

```typescript
interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}
```

## Best Practices

1. Always set appropriate geometries
2. Manage parent-child relationships properly
3. Use signals to react to widget changes
