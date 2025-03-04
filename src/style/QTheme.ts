import { QStyle } from './QStyle';
import { QMap } from '../core/containers/QMap';

/**
 * Theme options interface
 */
export interface ThemeOptions {
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  shadowColor?: string;
  fontFamily?: string;
  [key: string]: any;
}

/**
 * Theme class for managing styles of different components
 */
export class QTheme {
  private _styles: Map<string, QStyle> = new Map();
  private _name: string = 'default';
  private _defaultStyle: QStyle = new QStyle();
  
  /**
   * Creates a new theme
   * @param nameOrOptions Theme name or options object
   */
  constructor(nameOrOptions: string | ThemeOptions = 'default') {
    if (typeof nameOrOptions === 'string') {
      this._name = nameOrOptions;
    } else {
      // Create a default style from the options object
      const defaultStyle = new QStyle();
      
      // Add all properties to the default style
      Object.entries(nameOrOptions).forEach(([key, value]) => {
        if (key === 'name') {
          this._name = value as string;
        } else {
          defaultStyle.set(key, value);
        }
      });
      
      this._defaultStyle = defaultStyle;
      this._styles.set('', defaultStyle);
    }
  }
  
  /**
   * Sets a style for a component type
   */
  setStyle(componentType: string, style: QStyle): void {
    this._styles.set(componentType, style.clone());
  }
  
  /**
   * Gets a style for a component type
   */
  getStyle(componentType: string): QStyle | undefined {
    return this._styles.get(componentType)?.clone();
  }
  
  /**
   * Alias for setStyle to maintain compatibility with existing code
   */
  registerStyle(componentType: string, style: QStyle): void {
    this.setStyle(componentType, style);
  }
  
  /**
   * Sets the default style for components that don't have specific styles
   */
  setDefaultStyle(style: QStyle): void {
    this._defaultStyle = style.clone();
    this._styles.set('', style.clone());
  }
  
  /**
   * Checks if the theme has a style for the given component
   */
  hasStyle(componentType: string): boolean {
    return this._styles.has(componentType);
  }
  
  /**
   * Sets the theme name
   */
  setName(name: string): void {
    this._name = name;
  }
  
  /**
   * Returns the theme name
   */
  name(): string {
    return this._name;
  }
  
  /**
   * Merges another theme into this one
   */
  merge(other: QTheme, overwrite: boolean = false): void {
    other._styles.forEach((style, componentType) => {
      if (overwrite || !this._styles.has(componentType)) {
        this._styles.set(componentType, style.clone());
      } else {
        // Merge the style properties
        const existingStyle = this._styles.get(componentType);
        if (existingStyle) {
          existingStyle.merge(style); // Changed to use single argument
        }
      }
    });
  }
  
  /**
   * Creates a clone of this theme
   */
  clone(): QTheme {
    const clone = new QTheme(this._name);
    this._styles.forEach((style, componentType) => {
      clone._styles.set(componentType, style.clone());
    });
    return clone;
  }
  
  /**
   * Resets the theme to empty
   */
  clear(): void {
    this._styles.clear();
  }
  
  /**
   * Gets all registered component types in this theme
   */
  getRegisteredComponentTypes(): string[] {
    return Array.from(this._styles.keys());
  }
}

// Create global theme instance
export const globalTheme = new QTheme('default');

// Initialize with some basic styles
const initializeDefaultTheme = () => {
  // Button style
  const buttonStyle = new QStyle();
  buttonStyle.set('background-color', '#3498db');
  buttonStyle.set('color', '#ffffff');
  buttonStyle.set('border', 'none');
  buttonStyle.set('border-radius', '4px');
  buttonStyle.set('padding', '8px 16px');
  buttonStyle.set('cursor', 'pointer');
  globalTheme.setStyle('QPushButton', buttonStyle);

  // Label style
  const labelStyle = new QStyle();
  labelStyle.set('color', '#333333');
  labelStyle.set('font-family', 'Arial, sans-serif');
  globalTheme.setStyle('QLabel', labelStyle);
};

// Initialize the theme
initializeDefaultTheme();
