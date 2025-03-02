# QBoxLayout

QBoxLayout arranges widgets in a horizontal or vertical box.

## Features

- Horizontal or vertical widget arrangement
- Dynamic widget addition
- Signal emission on layout changes

## Examples

### Horizontal Layout

```typescript
import { QBoxLayout, Direction, QWidget } from 'dframe';

const layout = new QBoxLayout(Direction.LeftToRight);
const widget1 = new QWidget();
const widget2 = new QWidget();

layout.addWidget(widget1);
layout.addWidget(widget2);

// Monitor layout changes
layout.connect('layoutChanged', () => {
    console.log('Layout was modified');
});
```

### Vertical Layout

```typescript
import { QBoxLayout, Direction } from 'dframe';

const layout = new QBoxLayout(Direction.TopToBottom);

// Add widgets vertically
layout.addWidget(new QWidget());
layout.addWidget(new QWidget());
```

## API Reference

### Constructor
- `constructor(direction: Direction)`

### Methods
- `addWidget(widget: QWidget): void`

### Signals
- `layoutChanged`: Emitted when widgets are added or removed

### Enums
```typescript
enum Direction {
    LeftToRight,
    RightToLeft,
    TopToBottom,
    BottomToTop
}
```

## Best Practices

1. Choose appropriate direction for your use case
2. Add widgets in logical order
3. Listen for layout changes when needed
