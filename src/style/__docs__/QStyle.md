# QStyle

`QStyle` is a class that manages visual properties for DFrame components, providing a consistent way to apply styling across the framework.

## Overview

The `QStyle` class serves as a container for style properties that can be applied to UI components. It provides methods to get, set, and manipulate these properties, and can be used directly or through the `QTheme` system.

## Usage

### Creating a Style

```typescript
import { QStyle } from 'dframe/style';

// Create an empty style
const emptyStyle = new QStyle();

// Create a style with initial properties
const buttonStyle = new QStyle({
  backgroundColor: '#3498db',
  color: 'white',
  padding: '10px 15px',
  borderRadius: '4px',
  fontSize: 14
});
```

### Getting and Setting Properties

```typescript
// Set a property
buttonStyle.set('backgroundColor', '#e74c3c');

// Get a property
const bgColor = buttonStyle.get('backgroundColor'); // '#e74c3c'

// Get with default value if property doesn't exist
const border = buttonStyle.get('border', '1px solid #ddd');

// Check if a property exists
const hasPadding = buttonStyle.has('padding'); // true
const hasMargin = buttonStyle.has('margin'); // false
```

### Merging Styles

You can combine multiple styles by merging them:

```typescript
// Base style
const baseStyle = new QStyle({
  fontFamily: 'Arial',
  fontSize: 14,
  color: 'black'
});

// Warning style
const warningStyle = new QStyle({
  color: 'red',
  fontWeight: 'bold'
});

// Merge warningStyle into baseStyle (overwrites color)
baseStyle.merge(warningStyle);
// Result: fontFamily='Arial', fontSize=14, color='red', fontWeight='bold'

// Merge without overriding existing properties
const anotherStyle = new QStyle({ fontSize: 16 });
baseStyle.merge(anotherStyle, false);
// color='red' is preserved, fontSize=14 is not overridden
```

### Cloning Styles

Create independent copies of a style:

```typescript
const originalStyle = new QStyle({
  backgroundColor: '#3498db',
  color: 'white'
});

// Create an independent copy
const clonedStyle = originalStyle.clone();

// Modify the clone
clonedStyle.set('backgroundColor', '#e74c3c');

// Original remains unchanged
console.log(originalStyle.get('backgroundColor')); // '#3498db'
```

### Working with Fonts

The QStyle class integrates smoothly with QFont:

```typescript
import { QStyle, QFont, FontWeight } from 'dframe/style';

// Create a font
const font = new QFont({
  family: ['Roboto', 'sans-serif'],
  size: 16,
  weight: FontWeight.Bold
});

// Add the font to a style
const headingStyle = new QStyle()
  .setFont(font)
  .set('color', '#333');

// Later retrieve the font object
const retrievedFont = headingStyle.getFont();

// Or create a font from style properties
const styleWithFontProps = new QStyle({
  'font-family': 'Arial, sans-serif',
  'font-size': '14px',
  'font-weight': 'normal'
});

const fontFromStyle = styleWithFontProps.createFontFromProperties();
```

### Helper Methods

QStyle provides convenience methods for common styling tasks:

```typescript
// Set padding
style.setPadding(10, 15, 10, 15); // top, right, bottom, left
style.setPaddingUniform(10);      // all sides

// Set margins
style.setMargin(5, 10, 5, 10);    // top, right, bottom, left
style.setMarginUniform(5);        // all sides

// Set border
style.setBorder(1, 'solid', '#ccc');
style.setBorderRadius(4);
```

## Integration with Components

Components in the DFrame framework can use styles from the theme system or have styles applied directly:

```typescript
import { QButton } from 'dframe/widgets';
import { QStyle } from 'dframe/style';

// Create a custom style
const customButtonStyle = new QStyle({
  backgroundColor: 'purple',
  color: 'white',
  padding: '12px 20px',
  fontSize: 16
});

// Apply to a button
const button = new QButton('Click Me');
button.setStyle(customButtonStyle);

// Or apply individual properties
button.setStyleProperty('backgroundColor', 'green');
```

## Best Practices

1. **Use semantic naming** for style properties to improve clarity
2. **Group related styles** together with QStyle instances
3. **Prefer theme styles** over direct style application for consistency
4. **Use style merging** to create variations from a base style
5. **Clone styles** when you need independent copies to avoid unintended changes

## See Also

- [QTheme](QTheme.md) - For managing styles across your application
- [QFont](QFont.md) - For working with font styling specifically
