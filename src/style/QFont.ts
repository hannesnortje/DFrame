/**
 * Represents font weight values 
 */
export enum FontWeight {
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

/**
 * Represents font style values
 */
export enum FontStyle {
  Normal = 'normal',
  Italic = 'italic',
  Oblique = 'oblique'
}

/**
 * Represents text decoration values
 */
export enum TextDecoration {
  None = 'none',
  Underline = 'underline',
  Overline = 'overline',
  LineThrough = 'line-through'
}

/**
 * Represents font stretch values
 */
export enum FontStretch {
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

/**
 * Font options for initialization
 */
export interface FontOptions {
  family?: string | string[];
  size?: number;
  weight?: FontWeight | string | number;
  style?: FontStyle | string;
  decoration?: TextDecoration | string;
  stretch?: FontStretch | string;
  letterSpacing?: number | string;
  lineHeight?: number | string;
}

/**
 * QFont provides a way to specify and manipulate font properties.
 * It encapsulates all font-related settings like family, size,
 * weight, style, etc., and provides a consistent interface for
 * working with fonts across the framework.
 */
export class QFont {
  private _family: string[] = ['Arial', 'sans-serif'];
  private _size: number = 14;
  private _weight: FontWeight | string = FontWeight.Normal;
  private _style: FontStyle = FontStyle.Normal;
  private _decoration: TextDecoration = TextDecoration.None;
  private _stretch: FontStretch = FontStretch.Normal;
  private _letterSpacing: string = 'normal';
  private _lineHeight: string = 'normal';

  /**
   * Creates a new QFont with the specified options
   * @param options Font initialization options
   */
  constructor(options?: FontOptions | string) {
    if (typeof options === 'string') {
      // Parse font shorthand string
      this.fromString(options);
    } else if (options) {
      // Apply provided options
      if (options.family) {
        this.setFamily(options.family);
      }
      
      if (options.size !== undefined) {
        this.setSize(options.size);
      }
      
      if (options.weight !== undefined) {
        this.setWeight(options.weight);
      }
      
      if (options.style) {
        this.setStyle(options.style);
      }
      
      if (options.decoration) {
        this.setDecoration(options.decoration);
      }
      
      if (options.stretch) {
        this.setStretch(options.stretch);
      }
      
      if (options.letterSpacing !== undefined) {
        this.setLetterSpacing(options.letterSpacing);
      }
      
      if (options.lineHeight !== undefined) {
        this.setLineHeight(options.lineHeight);
      }
    }
  }

  /**
   * Sets the font family
   * @param family Font family name or array of family names
   */
  setFamily(family: string | string[]): QFont {
    if (typeof family === 'string') {
      // Split by commas and trim whitespace
      this._family = family.split(',').map(f => f.trim());
    } else {
      this._family = [...family];
    }
    return this;
  }

  /**
   * Gets the font family
   */
  family(): string[] {
    return [...this._family];
  }

  /**
   * Sets the font size in pixels
   * @param size Font size in pixels
   */
  setSize(size: number): QFont {
    this._size = size;
    return this;
  }

  /**
   * Gets the font size in pixels
   */
  size(): number {
    return this._size;
  }

  /**
   * Sets the font weight
   * @param weight Font weight
   */
  setWeight(weight: FontWeight | string | number): QFont {
    if (typeof weight === 'number') {
      // Convert numeric weight to string
      this._weight = weight.toString();
    } else {
      this._weight = weight;
    }
    return this;
  }

  /**
   * Gets the font weight
   */
  weight(): FontWeight | string {
    return this._weight;
  }

  /**
   * Sets the font style
   * @param style Font style
   */
  setStyle(style: FontStyle | string): QFont {
    this._style = style as FontStyle;
    return this;
  }

  /**
   * Gets the font style
   */
  style(): FontStyle {
    return this._style;
  }

  /**
   * Sets the text decoration
   * @param decoration Text decoration
   */
  setDecoration(decoration: TextDecoration | string): QFont {
    this._decoration = decoration as TextDecoration;
    return this;
  }

  /**
   * Gets the text decoration
   */
  decoration(): TextDecoration {
    return this._decoration;
  }

  /**
   * Sets the font stretch
   * @param stretch Font stretch
   */
  setStretch(stretch: FontStretch | string): QFont {
    this._stretch = stretch as FontStretch;
    return this;
  }

  /**
   * Gets the font stretch
   */
  stretch(): FontStretch {
    return this._stretch;
  }

  /**
   * Sets the letter spacing
   * @param spacing Letter spacing value
   */
  setLetterSpacing(spacing: number | string): QFont {
    if (typeof spacing === 'number') {
      this._letterSpacing = `${spacing}px`;
    } else {
      this._letterSpacing = spacing;
    }
    return this;
  }

  /**
   * Gets the letter spacing
   */
  letterSpacing(): string {
    return this._letterSpacing;
  }

  /**
   * Sets the line height
   * @param height Line height value
   */
  setLineHeight(height: number | string): QFont {
    if (typeof height === 'number') {
      this._lineHeight = height.toString();
    } else {
      this._lineHeight = height;
    }
    return this;
  }

  /**
   * Gets the line height
   */
  lineHeight(): string {
    return this._lineHeight;
  }

  /**
   * Creates a new font by cloning this one
   */
  clone(): QFont {
    const font = new QFont();
    font._family = [...this._family];
    font._size = this._size;
    font._weight = this._weight;
    font._style = this._style;
    font._decoration = this._decoration;
    font._stretch = this._stretch;
    font._letterSpacing = this._letterSpacing;
    font._lineHeight = this._lineHeight;
    return font;
  }

  /**
   * Converts the font to a CSS font string
   */
  toString(): string {
    // Build the font shorthand property
    let fontString = '';
    
    if (this._style !== FontStyle.Normal) {
      fontString += this._style + ' ';
    }
    
    if (this._weight !== FontWeight.Normal) {
      fontString += this._weight + ' ';
    }
    
    fontString += this._size + 'px ';
    
    // Quote font family names as needed and join with commas
    const families = this._family.map(family => {
      // Quote family names that contain spaces or special characters
      if (family.includes(' ') || /[^a-zA-Z0-9_-]/.test(family)) {
        return `"${family}"`;
      }
      return family;
    }).join(', ');
    
    fontString += families;
    
    return fontString;
  }

  /**
   * Attempts to parse a font string into this font object
   * @param fontString CSS font string
   */
  fromString(fontString: string): QFont {
    // Reset to defaults
    this._family = ['Arial', 'sans-serif'];
    this._size = 14;
    this._weight = FontWeight.Normal;
    this._style = FontStyle.Normal;

    // Simple parsing for common font string formats
    const parts = fontString.trim().split(/\s+/);
    
    // Look for font-size and family which are required
    let familyStartIndex = -1;
    
    // Find the font size (should end with px, rem, em, etc.)
    for (let i = 0; i < parts.length; i++) {
      // Check if this part has a font size
      if (/^\d+(\.\d+)?(px|em|rem|pt|%|vh|vw)$/.test(parts[i])) {
        // Convert to number by removing the unit
        const sizeStr = parts[i].replace(/[^0-9.]/g, '');
        this._size = parseFloat(sizeStr);
        familyStartIndex = i + 1;
        break;
      } else if (/^\d+$/.test(parts[i])) {
        // Numeric with no unit, assume pixels
        this._size = parseInt(parts[i], 10);
        familyStartIndex = i + 1;
        break;
      }
    }

    // Check for font-style and font-weight before the size
    for (let i = 0; i < familyStartIndex; i++) {
      const part = parts[i].toLowerCase();
      
      // Check for font style
      if (part === 'italic' || part === 'oblique') {
        this._style = part as FontStyle;
      }
      
      // Check for font weight
      else if (
        part === 'bold' || part === 'bolder' || 
        part === 'lighter' || /^[1-9]00$/.test(part)
      ) {
        this._weight = part;
      }
    }
    
    // Get font family (everything after size)
    if (familyStartIndex >= 0 && familyStartIndex < parts.length) {
      const familyPart = parts.slice(familyStartIndex).join(' ');
      
      // Split by commas, but don't split quoted strings
      const families: string[] = [];
      let currentFamily = '';
      let inQuotes = false;
      
      for (let i = 0; i < familyPart.length; i++) {
        const char = familyPart[i];
        
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          families.push(currentFamily.trim());
          currentFamily = '';
        } else {
          currentFamily += char;
        }
      }
      
      if (currentFamily.trim()) {
        families.push(currentFamily.trim());
      }
      
      if (families.length > 0) {
        // Remove quotes from font family names
        this._family = families.map(f => f.replace(/["']/g, ''));
      }
    }
    
    return this;
  }

  /**
   * Applies the font to a DOM element by setting its inline styles
   * @param element DOM element to apply font to
   */
  applyToElement(element: HTMLElement): void {
    element.style.fontFamily = this._family.join(', ');
    element.style.fontSize = `${this._size}px`;
    element.style.fontWeight = this._weight.toString();
    element.style.fontStyle = this._style;
    element.style.textDecoration = this._decoration;
    element.style.fontStretch = this._stretch;
    element.style.letterSpacing = this._letterSpacing;
    element.style.lineHeight = this._lineHeight;
  }

  /**
   * Returns an object with CSS properties for this font
   */
  toCssProperties(): Record<string, string> {
    return {
      'font-family': this._family.join(', '),
      'font-size': `${this._size}px`,
      'font-weight': this._weight.toString(),
      'font-style': this._style,
      'text-decoration': this._decoration,
      'font-stretch': this._stretch,
      'letter-spacing': this._letterSpacing,
      'line-height': this._lineHeight
    };
  }
}
