# QFont

`QFont` is a class for specifying and manipulating text font properties in the DFrame framework.

## Overview

The `QFont` class provides a comprehensive way to work with fonts in your application. It encapsulates various font properties such as family, size, weight, style, decoration, and more, providing a consistent interface for font manipulation.

## Usage

### Creating a Font

```typescript
import { QFont, FontWeight, FontStyle } from 'dframe/style';

// Create with default properties
const defaultFont = new QFont();

// Create with custom properties using options object
const customFont = new QFont({
  family: ['Roboto', 'sans-serif'],
  size: 16,
  weight: FontWeight.Bold,
  style: FontStyle.Italic
});

// Create from a CSS font string
const stringFont = new QFont('italic bold 16px "Open Sans", sans-serif');
```

### Setting Properties

```typescript
// Property setting with method chaining
const font = new QFont()
  .setFamily(['Helvetica', 'Arial', 'sans-serif'])
  .setSize(14)
  .setWeight(FontWeight.W500)
  .setStyle(FontStyle.Normal)
  .setDecoration(TextDecoration.None)
  .setLetterSpacing(0.5)
  .setLineHeight(1.5);
```

### Getting Properties

```typescript
const familyNames = font.family();
const fontSize = font.size();
const fontWeight = font.weight();
const fontStyle = font.style();
// ... and so on for other properties
```

### Converting to a Font String

```typescript
const fontString = font.toString();
// Example output: "500 14px Helvetica, Arial, sans-serif"
```

### Cloning

```typescript
const originalFont = new QFont({ 
  family: 'Roboto', 
  size: 14 
});

// Create an independent copy
const clonedFont = originalFont.clone();

// Modify the clone without affecting the original
clonedFont.setSize(18);
```

### Applying to DOM Elements

```typescript
const element = document.getElementById('my-element');
font.applyToElement(element);
```

### Getting CSS Properties

```typescript
const cssProperties = font.toCssProperties();
// Returns: { 'font-family': 'Helvetica, Arial, sans-serif', 'font-size': '14px', ... }
```

## Available Enums

### FontWeight

```typescript
enum FontWeight {
  Normal = 'normal',
  Bold = 'bold',
  Bolder = 'bolder',
  Lighter = 'lighter',
  W100 = '100',
  W200 = '200',
  W300 = '300',
  W400 = '400',
  W500 = '500',
  W600 = '600',
  W700 = '700',
  W800 = '800',
  W900 = '900'
}
```

### FontStyle

```typescript
enum FontStyle {
  Normal = 'normal',
  Italic = 'italic',
  Oblique = 'oblique'
}
```

### TextDecoration

```typescript
enum TextDecoration {
  None = 'none',
  Underline = 'underline',
  Overline = 'overline',
  LineThrough = 'line-through'
}
```

### FontStretch

```typescript
enum FontStretch {
  Normal = 'normal',
  Condensed = 'condensed',
  Expanded = 'expanded',
  ExtraCondensed = 'extra-condensed',
  ExtraExpanded = 'extra-expanded',
  SemiCondensed = 'semi-condensed',
  SemiExpanded = 'semi-expanded',
  UltraCondensed = 'ultra-condensed',
  UltraExpanded = 'ultra-expanded'
}
```

## Integration with QStyle and QTheme

`QFont` can be used with `QStyle` and `QTheme` to create consistent typography across your application:

```typescript
import { QStyle, QTheme, QFont, FontWeight, globalTheme } from 'dframe/style';

// Create common fonts
const headerFont = new QFont({
  family: ['Roboto', 'sans-serif'],
  weight: FontWeight.Bold
});

const bodyFont = new QFont({
  family: ['Open Sans', 'sans-serif'],
  size: 14
});

// Use in styles
const headerStyle = new QStyle({
  font: headerFont,
  color: '#333'
});

const bodyStyle = new QStyle({
  font: bodyFont,
  color: '#555'
});

// Register in theme
globalTheme.registerStyle('Header', headerStyle);
globalTheme.registerStyle('Body', bodyStyle);
```
