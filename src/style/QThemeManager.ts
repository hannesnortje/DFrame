import { QTheme, QStyle, globalTheme } from './index';
import { QObject } from '../core/QObject';
import { QWidget } from '../core/QWidget';

/**
 * QThemeManager provides a way to manage multiple themes
 * and switch between them.
 */
export class QThemeManager extends QObject {
  private themes: Map<string, QTheme> = new Map();
  private currentTheme: string | null = null;
  
  /**
   * Creates a new theme manager
   */
  constructor() {
    super();
  }
  
  /**
   * Registers a theme with the manager
   * @param name The name to identify the theme
   * @param theme The theme instance
   */
  registerTheme(name: string, theme: QTheme): QThemeManager {
    this.themes.set(name, theme);
    return this;
  }
  
  /**
   * Gets a registered theme by name
   * @param name The theme name
   * @returns The theme instance or undefined if not found
   */
  getTheme(name: string): QTheme | undefined {
    return this.themes.get(name);
  }
  
  /**
   * Sets the active theme and applies it
   * @param name Name of the theme to activate
   * @returns True if theme was found and applied, false otherwise
   */
  setTheme(name: string): boolean {
    const theme = this.themes.get(name);
    if (!theme) {
      return false;
    }
    
    // Apply theme to global theme
    this.applyTheme(theme);
    this.currentTheme = name;
    
    // Emit signal
    this.emit('themeChanged', name);
    
    // Notify all widgets to update their styles
    QWidget.notifyAllWidgetsOfThemeChange();
    
    return true;
  }
  
  /**
   * Gets the name of the current active theme
   * @returns The active theme name, or null if none is set
   */
  getCurrentTheme(): string | null {
    return this.currentTheme;
  }
  
  /**
   * Creates and registers default light and dark themes
   */
  setupDefaultThemes(): QThemeManager {
    // Create light theme
    const lightTheme = new QTheme({
      backgroundColor: '#ffffff',
      color: '#333333',
      borderColor: '#dddddd',
      shadowColor: 'rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    });
    
    // Add light theme component styles
    lightTheme.registerStyle('Button', new QStyle({
      backgroundColor: '#4285f4',
      color: 'white',
      borderRadius: '4px',
      padding: '8px 16px',
      hoverBackgroundColor: '#2b7de9'
    }));
    
    lightTheme.registerStyle('Input', new QStyle({
      backgroundColor: 'white',
      borderColor: '#cccccc',
      color: '#333333',
      borderRadius: '4px',
      padding: '8px',
      focusBorderColor: '#4285f4'
    }));
    
    // Create dark theme
    const darkTheme = new QTheme({
      backgroundColor: '#222222',
      color: '#eeeeee',
      borderColor: '#444444',
      shadowColor: 'rgba(0,0,0,0.4)',
      fontFamily: 'Arial, sans-serif'
    });
    
    // Add dark theme component styles
    darkTheme.registerStyle('Button', new QStyle({
      backgroundColor: '#3367d6',
      color: 'white',
      borderRadius: '4px',
      padding: '8px 16px',
      hoverBackgroundColor: '#4285f4'
    }));
    
    darkTheme.registerStyle('Input', new QStyle({
      backgroundColor: '#333333',
      borderColor: '#555555',
      color: '#eeeeee',
      borderRadius: '4px',
      padding: '8px',
      focusBorderColor: '#4285f4'
    }));
    
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
    if (!this.themes.has(themeName)) {
      this.setupDefaultThemes();
    }
    
    this.setTheme(themeName);
    return themeName;
  }
  
  /**
   * Listens for system theme changes
   */
  listenToSystemThemeChanges(): void {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', e => {
        const themeName = e.matches ? 'dark' : 'light';
        this.setTheme(themeName);
      });
  }
  
  /**
   * Applies a theme to the global theme
   * @param theme The theme to apply
   * @private
   */
  private applyTheme(theme: QTheme): void {
    // First set the default style
    globalTheme.setDefaultStyle(theme.getStyle(''));
    
    // Then register all component styles
    // This assumes we can get a list of registered style names from QTheme
    // If this isn't available in the API, we'd need to modify QTheme
    const componentTypes = this.getComponentTypes(theme);
    
    for (const componentType of componentTypes) {
      if (componentType) { // Skip the default style
        globalTheme.registerStyle(componentType, theme.getStyle(componentType));
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
      'Button', 
      'Input', 
      'Label', 
      'Panel', 
      'Dialog', 
      'List', 
      'Menu', 
      'Tab',
      'Table',
      'TextField'
    ];
  }
}

// Export a global theme manager instance for convenience
export const themeManager = new QThemeManager();
