import { QStyle } from './QStyle';

/**
 * QTheme manages component styles across the application.
 * It provides default styles and allows for customization.
 */
export class QTheme {
  private styles: Map<string, QStyle> = new Map();
  private defaultStyle: QStyle = new QStyle();
  
  /**
   * Creates a new theme instance
   * @param defaultStyles Default style properties for all components
   */
  constructor(defaultStyles?: Record<string, any>) {
    if (defaultStyles) {
      this.defaultStyle = new QStyle(defaultStyles);
    }
  }

  /**
   * Registers a style for a component type
   * @param componentType The component type identifier
   * @param style The style to register
   */
  registerStyle(componentType: string, style: QStyle): void {
    this.styles.set(componentType, style);
  }

  /**
   * Gets the style for a component type
   * @param componentType The component type identifier
   * @returns The component style merged with default style
   */
  getStyle(componentType: string): QStyle {
    const baseStyle = this.defaultStyle.clone();
    const componentStyle = this.styles.get(componentType);
    
    if (componentStyle) {
      baseStyle.merge(componentStyle);
    }
    
    return baseStyle;
  }

  /**
   * Sets default style properties for all components
   * @param style The default style properties
   */
  setDefaultStyle(style: QStyle): void {
    this.defaultStyle = style;
  }
}

// Create a global theme instance
export const globalTheme = new QTheme();
