import { QStyle } from './QStyle';
import { QTheme, globalTheme } from './QTheme';
import { QWidget } from '../core/QWidget';
import { QObject } from '../core/QObject';

/**
 * Theme definition interface
 */
export interface ThemeDefinition {
  name: string;
  baseColors: {
    backgroundColor: string;
    color: string;
    borderColor: string;
    shadowColor: string;
    fontFamily: string;
  };
}

/**
 * Manages themes and applies them to widgets
 */
export class QThemeManager extends QObject {
  private _themes: Map<string, QTheme> = new Map();
  private _currentTheme: string = 'default';
  
  constructor() {
    super();
    // Register the global theme as the default theme
    this._themes.set('default', globalTheme);
  }
  
  /**
   * Registers a new theme
   * @param name Theme name
   * @param theme Theme object
   */
  registerTheme(name: string, theme: QTheme): void {
    this._themes.set(name, theme);
  }
  
  /**
   * Gets a theme by name
   * @param name Theme name
   */
  getTheme(name: string): QTheme | undefined {
    return this._themes.get(name);
  }
  
  /**
   * Sets the current theme
   * @param name Theme name
   */
  setCurrentTheme(name: string): boolean {
    if (!this._themes.has(name)) {
      console.error(`Theme "${name}" is not registered`);
      return false;
    }
    
    this._currentTheme = name;
    
    // Update global theme with the new theme
    const theme = this._themes.get(name);
    if (theme) {
      this.applyTheme(theme);
    }
    
    // Emit signal
    this.emit('themeChanged', name);
    
    // Notify all widgets to update their styles
    if (typeof QWidget.notifyAllWidgetsOfThemeChange === 'function') {
      QWidget.notifyAllWidgetsOfThemeChange(name); // Fixed: Added the name parameterefault'); // Provide a theme ID
    }
    
    return true;
  }
  
  /**
   * Gets the name of the current active theme
   * @returns The active theme name, or null if none is set
   */
  getCurrentTheme(): string | null {
    return this._currentTheme;
  }
  
  /**
   * Creates and registers default light and dark themes
   */
  setupDefaultThemes(): QThemeManager {
    // Create light theme
    const lightTheme = new QTheme('light');
    const lightBaseStyle = new QStyle();
    lightBaseStyle.set('background-color', '#ffffff');
    lightBaseStyle.set('color', '#333333');
    lightBaseStyle.set('border-color', '#dddddd');
    lightBaseStyle.set('shadow-color', 'rgba(0,0,0,0.1)');
    lightBaseStyle.set('font-family', 'Arial, sans-serif');
    lightTheme.setDefaultStyle(lightBaseStyle);
    
    // Add light theme component styles
    const lightButtonStyle = new QStyle();
    lightButtonStyle.set('background-color', '#4285f4');
    lightButtonStyle.set('color', 'white');
    lightButtonStyle.set('border-radius', '4px');
    lightButtonStyle.set('padding', '8px 16px');
    lightButtonStyle.set('hover-background-color', '#2b7de9');
    lightTheme.registerStyle('Button', lightButtonStyle);
    
    const lightInputStyle = new QStyle();
    lightInputStyle.set('background-color', 'white');
    lightInputStyle.set('border-color', '#cccccc');
    lightInputStyle.set('color', '#333333');
    lightInputStyle.set('border-radius', '4px');
    lightInputStyle.set('padding', '8px');
    lightInputStyle.set('focus-border-color', '#4285f4');
    lightTheme.registerStyle('Input', lightInputStyle);
    
    // Create dark theme
    const darkTheme = new QTheme('dark');
    const darkBaseStyle = new QStyle();
    darkBaseStyle.set('background-color', '#222222');
    darkBaseStyle.set('color', '#eeeeee');
    darkBaseStyle.set('border-color', '#444444');
    darkBaseStyle.set('shadow-color', 'rgba(0,0,0,0.4)');
    darkBaseStyle.set('font-family', 'Arial, sans-serif');
    darkTheme.setDefaultStyle(darkBaseStyle);
    
    // Add dark theme component styles
    const darkButtonStyle = new QStyle();
    darkButtonStyle.set('background-color', '#3367d6');
    darkButtonStyle.set('color', 'white');
    darkButtonStyle.set('border-radius', '4px');
    darkButtonStyle.set('padding', '8px 16px');
    darkButtonStyle.set('hover-background-color', '#4285f4');
    darkTheme.registerStyle('Button', darkButtonStyle);
    
    const darkInputStyle = new QStyle();
    darkInputStyle.set('background-color', '#333333');
    darkInputStyle.set('border-color', '#555555');
    darkInputStyle.set('color', '#eeeeee');
    darkInputStyle.set('border-radius', '4px');
    darkInputStyle.set('padding', '8px');
    darkInputStyle.set('focus-border-color', '#4285f4');
    darkTheme.registerStyle('Input', darkInputStyle);
    
    // Register themes
    this.registerTheme('light', lightTheme);
    this.registerTheme('dark', darkTheme);
    
    return this;
  }
  
  /**
   * Sets theme based on system preference for dark/light mode
   * @returns The name of the theme that was applied
   */
  applySystemTheme(): string {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeName = prefersDark ? 'dark' : 'light';
    
    // Ensure we have light/dark themes
    if (!this._themes.has(themeName)) {
      this.setupDefaultThemes();
    }
    
    this.setCurrentTheme(themeName);
    return themeName;
  }
  
  /**
   * Listens for system theme changes
   */
  listenToSystemThemeChanges(): void {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', e => {
        const themeName = e.matches ? 'dark' : 'light';
        this.setCurrentTheme(themeName);
      });
  }
  
  /**
   * Applies a theme to the global theme
   * @param theme The theme to apply
   * @private
   */
  private applyTheme(theme: QTheme): void {
    // Get the default style and set it if available
    const defaultStyle = theme.getStyle('');
    if (defaultStyle) {
      globalTheme.setDefaultStyle(defaultStyle);
    }
    
    // Then register all component styles
    const componentTypes = this.getComponentTypes(theme);
    
    for (const componentType of componentTypes) {
      if (componentType) { // Skip the default style
        const componentStyle = theme.getStyle(componentType);
        if (componentStyle) {
          globalTheme.registerStyle(componentType, componentStyle);
        }
      }
    }
  }
  
  /**
   * Gets all component types registered in a theme
   * @param theme The theme to get component types from
   * @private
   */
  private getComponentTypes(theme: QTheme): string[] {
    // This is a placeholder implementation
    // The real implementation would depend on QTheme's API
    // If QTheme doesn't expose this, you could modify it to add this capability
    
    // Example if QTheme had a method to list registered component types:
    // return theme.getRegisteredComponentTypes();
    
    // For now, we'll return a default set of common component types
    return [
      '', // Default style
      'Button', 
      'Input', 
      'Label', 
      'Panel', 
      'Dialog', 
      'List', 
      'Menu', 
      'Tab',
      'Table',
      'TextField',
      'QPushButton',
      'QLabel'
    ];
  }
}

// Export a global theme manager instance for convenience
export const themeManager = new QThemeManager();
