import { QFont } from './QFont';

/**
 * QStyle defines the styling capabilities for DFrame components.
 * It provides a consistent way to apply visual properties across the framework.
 */
export class QStyle {
  private properties: Map<string, any> = new Map();

  /**
   * Creates a new style instance
   * @param styleProps Optional initial style properties
   */
  constructor(styleProps?: Record<string, any>) {
    if (styleProps) {
      Object.entries(styleProps).forEach(([key, value]) => {
        this.set(key, value);
      });
    }
  }

  /**
   * Sets a style property
   * @param property The property name to set
   * @param value The value to assign
   * @returns The QStyle instance for chaining
   */
  set(property: string, value: any): QStyle {
    this.properties.set(property, value);
    return this;
  }

  /**
   * Gets a style property value
   * @param property The property to retrieve
   * @param defaultValue Optional default value if property isn't set
   * @returns The property value or default value
   */
  get(property: string, defaultValue?: any): any {
    return this.properties.has(property) ? this.properties.get(property) : defaultValue;
  }

  /**
   * Checks if a property is defined in this style
   * @param property The property to check
   * @returns True if the property is defined
   */
  has(property: string): boolean {
    return this.properties.has(property);
  }

  /**
   * Merges another style into this one
   * @param style The style to merge
   * @param override Whether to override existing properties
   * @returns The QStyle instance for chaining
   */
  merge(style: QStyle, override = true): QStyle {
    style.properties.forEach((value, key) => {
      if (override || !this.has(key)) {
        this.set(key, value);
      }
    });
    return this;
  }

  /**
   * Creates a new style by cloning this style
   * @returns A new QStyle instance with the same properties
   */
  clone(): QStyle {
    const newStyle = new QStyle();
    this.properties.forEach((value, key) => {
      newStyle.set(key, value);
    });
    return newStyle;
  }

  /**
   * Sets a font for this style
   * @param font The font to use
   * @returns The QStyle instance for chaining
   */
  setFont(font: QFont): QStyle {
    // Store the font object itself for reference
    this.set('font', font);
    
    // Extract CSS properties from font and set them individually
    const fontProps = font.toCssProperties();
    Object.entries(fontProps).forEach(([key, value]) => {
      this.set(key, value);
    });
    
    return this;
  }

  /**
   * Gets the font object if one was explicitly set
   * @returns The font object or undefined if not set
   */
  getFont(): QFont | undefined {
    return this.get('font');
  }

  /**
   * Creates a font object from the current style properties
   * @returns A QFont instance based on current style properties
   */
  createFontFromProperties(): QFont {
    const font = new QFont({
      family: this.get('font-family') || this.get('fontFamily'),
      size: parseFloat(String(this.get('font-size') || this.get('fontSize') || 14)),
      weight: this.get('font-weight') || this.get('fontWeight'),
      style: this.get('font-style') || this.get('fontStyle'),
      decoration: this.get('text-decoration') || this.get('textDecoration'),
      stretch: this.get('font-stretch') || this.get('fontStretch'),
      letterSpacing: this.get('letter-spacing') || this.get('letterSpacing'),
      lineHeight: this.get('line-height') || this.get('lineHeight'),
    });
    
    return font;
  }

  /**
   * Helper method for setting consistent padding
   * @param top Top padding in pixels
   * @param right Right padding in pixels
   * @param bottom Bottom padding in pixels
   * @param left Left padding in pixels
   * @returns The QStyle instance for chaining
   */
  setPadding(top: number, right: number, bottom: number, left: number): QStyle {
    this.set('padding', `${top}px ${right}px ${bottom}px ${left}px`);
    return this;
  }

  /**
   * Helper method for setting padding uniformly on all sides
   * @param padding Padding in pixels
   * @returns The QStyle instance for chaining
   */
  setPaddingUniform(padding: number): QStyle {
    this.set('padding', `${padding}px`);
    return this;
  }

  /**
   * Helper method for setting consistent margins
   * @param top Top margin in pixels
   * @param right Right margin in pixels
   * @param bottom Bottom margin in pixels
   * @param left Left margin in pixels
   * @returns The QStyle instance for chaining
   */
  setMargin(top: number, right: number, bottom: number, left: number): QStyle {
    this.set('margin', `${top}px ${right}px ${bottom}px ${left}px`);
    return this;
  }

  /**
   * Helper method for setting margin uniformly on all sides
   * @param margin Margin in pixels
   * @returns The QStyle instance for chaining
   */
  setMarginUniform(margin: number): QStyle {
    this.set('margin', `${margin}px`);
    return this;
  }

  /**
   * Helper method for setting border
   * @param width Border width in pixels
   * @param style Border style (solid, dashed, etc.)
   * @param color Border color
   * @returns The QStyle instance for chaining
   */
  setBorder(width: number, style: string, color: string): QStyle {
    this.set('border', `${width}px ${style} ${color}`);
    return this;
  }

  /**
   * Helper method for setting border radius
   * @param radius Border radius in pixels
   * @returns The QStyle instance for chaining
   */
  setBorderRadius(radius: number): QStyle {
    this.set('borderRadius', `${radius}px`);
    return this;
  }

  /**
   * Returns the internal property map
   * Used by QWidget to efficiently apply all properties
   */
  getPropertyMap(): Map<string, any> {
    return this.properties;
  }
}
