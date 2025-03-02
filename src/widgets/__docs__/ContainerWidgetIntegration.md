# Container Integration with Widget System

The DFrame widget system has been enhanced with container classes for improved type safety and functionality.

## QString in Text Properties

Widgets now use QString for text handling, providing enhanced Unicode support, consistent text operations, and type safety.

```typescript
import { QWidget } from '../core/QWidget';
import { QString } from '../core/containers/QString';

// Create a widget with text
const widget = new QWidget();
widget.setText('Hello World');

// Get text as QString object
const text: QString = widget.text();
console.log(text.toUpper().toString()); // "HELLO WORLD"

// QString operations are available
if (text.startsWith('Hello')) {
  console.log('Text starts with Hello');
}

// Handle Unicode correctly
widget.setText('こんにちは世界');
const japaneseText = widget.text();
console.log(japaneseText.length()); // 6 (correct character count)
```

## QMap for Style Properties

Widget styles are stored in QMap, providing organized and type-safe storage of style properties.

```typescript
import { QWidget } from '../core/QWidget';
import { QVariant } from '../core/containers/QVariant';

const widget = new QWidget();

// Set style properties
widget.setStyleProperty('color', 'blue');
widget.setStyleProperty('font-size', 16); // Numbers are supported
widget.setStyleProperty('margin', '10px 5px');

// Get style property as QVariant
const fontSize = widget.styleProperty('font-size');
if (fontSize.isValid() && fontSize.type() === QVariantType.Int) {
  const size = fontSize.toInt();
  console.log(`Font size is ${size}px`);
}

// Access all style properties as QMap
const allStyles = widget.styleProperties();
allStyles.forEach((value, key) => {
  console.log(`${key}: ${value.toString()}`);
});

// Remove a style property
widget.removeStyleProperty('margin');
```

## QLabel with Rich Text Support

The QLabel widget is enhanced with QString and container classes for rich text support.

```typescript
import { QLabel, TextAlignment, TextFormat } from '../widgets/QLabel';

// Create a label with text
const label = new QLabel('Hello World');

// Set alignment
label.setAlignment(TextAlignment.Center);

// Apply text formatting
label.setTextFormat(TextFormat.RichText);
label.setHtml('<b>Bold</b> and <i>italic</i> text');

// Use word wrapping
label.setWordWrap(true);

// Style the label
label.setStyleProperty('color', 'navy');
label.setStyleProperty('font-family', 'Arial, sans-serif');
```

## Benefits of Container Integration

1. **Type Safety**: Method parameters and return values are properly typed
2. **Immutable Operations**: String operations return new objects without modifying originals
3. **Enhanced Functionality**: Rich set of methods for text and style manipulation
4. **Consistent APIs**: Common naming conventions across the framework
5. **Improved Debugging**: Better object inspection with specific types

## Extending with Custom Containers

You can create custom container classes to store widget-specific data:

```typescript
import { QList } from '../core/containers/QList';
import { QWidget } from '../core/QWidget';

// Store action history for a widget
class WidgetHistory {
  private _actions: QList<string> = new QList<string>();
  private _widget: QWidget;
  
  constructor(widget: QWidget) {
    this._widget = widget;
  }
  
  recordAction(action: string): void {
    this._actions.append(action);
    // Limit history size
    if (this._actions.size() > 100) {
      this._actions.removeAt(0);
    }
  }
  
  getLastActions(count: number): QList<string> {
    const size = this._actions.size();
    if (size === 0) return new QList<string>();
    
    const startIdx = Math.max(0, size - count);
    return this._actions.mid(startIdx);
  }
  
  clear(): void {
    this._actions.clear();
  }
}
```
