# Geometry Classes

Core classes for handling geometry operations in DFrame.

## QSize

Represents the size of a 2D object.

```typescript
import { QSize, AspectRatioMode } from 'dframe';

const size = new QSize(100, 100);
size.scale(200, 150, AspectRatioMode.KeepAspectRatio);
```

### Key Features
- Size validation and comparison
- Aspect ratio handling
- Size constraints

### Methods
- `isEmpty()`: Checks if width or height is <= 0
- `isValid()`: Checks if width and height are >= 0
- `scale()`: Scales size while optionally preserving aspect ratio
- `expandedTo()`: Returns size expanded to contain another size
- `boundedTo()`: Returns size bounded by another size

## QPoint

Represents a point in 2D space.

```typescript
import { QPoint } from 'dframe';

const point1 = new QPoint(10, 20);
const point2 = new QPoint(5, 10);
const sum = point1.add(point2);
```

### Key Features
- Basic arithmetic operations
- Manhattan length calculation
- Null point detection

### Methods
- `add()`: Adds two points
- `subtract()`: Subtracts two points
- `multiply()`: Multiplies by a factor
- `divide()`: Divides by a divisor
- `manhattanLength()`: Returns |x| + |y|

## QRect

Represents a rectangle in 2D space.

```typescript
import { QRect, QPoint } from 'dframe';

const rect = new QRect(0, 0, 100, 100);
const point = new QPoint(50, 50);
console.log(rect.contains(point)); // true
```

### Key Features
- Point containment testing
- Rectangle intersection
- Rectangle union
- Size and position access

### Methods
- `contains()`: Tests if a point is inside
- `intersects()`: Tests intersection with another rect
- `intersected()`: Returns intersection with another rect
- `united()`: Returns union with another rect

## Best Practices

1. Use QSize for widget dimensions
2. Use QPoint for coordinates and offsets
3. Use QRect for widget geometry and hit testing
4. Consider aspect ratio when scaling
5. Check validity before operations
