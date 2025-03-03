# QTheme

`QTheme` is a class that manages component styles across the application, providing default styles and allowing for customization.

## Overview

The `QTheme` class provides a centralized way to manage styles for different components in your application. It maintains a registry of component styles and merges them with default styles when requested. This enables consistent styling across all components while allowing for customization when needed.

## Usage

### Creating a Theme

```typescript
import { QTheme, QStyle } from 'dframe/style';

// Create a theme with default styles
const theme = new QTheme({
  fontFamily: 'Arial, sans-serif',
  fontSize: 14,
  color: '#333',
  backgroundColor: '#fff'
});

// Create a theme without default styles
const emptyTheme = new QTheme();
```

### Registering Component Styles

```typescript
// Create component-specific styles
const buttonStyle = new QStyle({
  backgroundColor: '#3498db',
  color: 'white',
  padding: '10px 15px',
  borderRadius: '4px'
});

const inputStyle = new QStyle({
  border: '1px solid #ddd',
  padding: '8px',
  borderRadius: '2px'
});

// Register these styles with the theme
theme.registerStyle('Button', buttonStyle);
theme.registerStyle('Input', inputStyle);
```

### Getting Component Styles

When a component needs its style, it requests it from the theme:

```typescript
// Get the style for a button
const buttonStyle = theme.getStyle('Button');

// The returned style merges the component-specific style with the theme's default style
// Result includes: backgroundColor, color, padding, borderRadius, fontFamily, fontSize
```

### Setting Default Style

You can update the default style for all components:

```typescript
// Create a new default style
const darkDefaultStyle = new QStyle({
  fontFamily: 'Roboto, sans-serif',
  fontSize: 16,
  color: '#eee',
  backgroundColor: '#222'
});

// Set as the new default
theme.setDefaultStyle(darkDefaultStyle);

// All subsequent getStyle() calls will merge with this new default
```

## Global Theme

DFrame provides a global theme instance that's used by default:

```typescript
import { globalTheme, QStyle } from 'dframe/style';

// Register styles with the global theme
globalTheme.registerStyle('TextField', new QStyle({
  borderColor: '#ddd',
  padding: '6px'
}));

// Components will automatically use these styles
import { QTextField } from 'dframe/widgets';
const textField = new QTextField();
// textField uses the style registered above
```

## Creating Theme Variants

You can create multiple themes for different parts of your application:

```typescript
import { QTheme, QStyle } from 'dframe/style';

// Light theme
const lightTheme = new QTheme({
  backgroundColor: '#fff',
  color: '#333'
});

// Dark theme
const darkTheme = new QTheme({
  backgroundColor: '#222',
  color: '#eee'
});

// Register component styles for each theme
lightTheme.registerStyle('Button', new QStyle({
  backgroundColor: '#3498db',
  color: 'white'
}));

darkTheme.registerStyle('Button', new QStyle({
  backgroundColor: '#2980b9',
  color: '#fff'
}));

// Switch between themes
function applyTheme(theme: QTheme): void {
  // Set as the active theme
  globalTheme.setDefaultStyle(theme.getDefaultStyle());
  
  // Copy all component-specific styles
  // This is just a conceptual example, actual implementation depends on QTheme's API
  theme.getRegisteredStyles().forEach((style, componentType) => {
    globalTheme.registerStyle(componentType, style);
  });
  
  // Trigger re-rendering or style updates if needed
  document.body.classList.toggle('dark-theme', theme === darkTheme);
}
```

## Theme Manager Example

For larger applications, you might want to create a theme manager class:

```typescript
import { QTheme, QStyle, globalTheme } from 'dframe/style';
import { QFont } from 'dframe/style';

class QThemeManager {
  private themes: Map<string, QTheme> = new Map();
  private activeThemeName: string | null = null;
  
  constructor() {
    // Create default themes
    this.createDefaultThemes();
  }
  
  private createDefaultThemes(): void {
    // Light theme
    const lightTheme = new QTheme({
      backgroundColor: '#ffffff',
      color: '#333333',
      borderColor: '#dddddd'
    });
    
    // Dark theme
    const darkTheme = new QTheme({
      backgroundColor: '#222222',
      color: '#eeeeee',
      borderColor: '#444444'
    });
    
    // Register themes
    this.registerTheme('light', lightTheme);
    this.registerTheme('dark', darkTheme);
    
    // Set light as default
    this.setActiveTheme('light');
  }
  
  registerTheme(name: string, theme: QTheme): void {
    this.themes.set(name, theme);
  }
  
  getTheme(name: string): QTheme | undefined {
    return this.themes.get(name);
  }
  
  setActiveTheme(name: string): boolean {
    const theme = this.themes.get(name);
    if (!theme) {
      return false;
    }
    
    // Apply the theme to the global theme
    globalTheme.setDefaultStyle(theme.getDefaultStyle());
    
    // Copy component styles
    // Implementation depends on QTheme's API
    
    // Update active theme name
    this.activeThemeName = name;
    
    // Update system appearance
    document.documentElement.setAttribute('data-theme', name);
    
    return true;
  }
  
  getActiveThemeName(): string | null {
    return this.activeThemeName;
  }
  
  isActiveTheme(name: string): boolean {
    return this.activeThemeName === name;
  }
}

// Usage
const themeManager = new QThemeManager();
themeManager.setActiveTheme('dark');

// Check if dark theme is active
console.log(themeManager.isActiveTheme('dark')); // true

// Switch back to light
themeManager.setActiveTheme('light');
```

## Integration with System Preferences

Modern browsers support detecting user's system preference for light/dark mode:

```typescript
const themeManager = new QThemeManager();

// Check for system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Set initial theme based on system preference
themeManager.setActiveTheme(prefersDark ? 'dark' : 'light');

// Listen for changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  themeManager.setActiveTheme(e.matches ? 'dark' : 'light');
});
```

## Best Practices

1. **Create semantic themes** (e.g., "light", "dark", "high-contrast") rather than visually descriptive ones
2. **Use consistent naming** for style properties across themes
3. **Test all themes** to ensure components appear correctly in each
4. **Consider accessibility** when designing themes, especially color contrast
5. **Allow user preferences** to override default theme selection