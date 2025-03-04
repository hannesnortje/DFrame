/**
 * Font weight constants
 */
export enum FontWeight {
  Light = 300,
  Normal = 400,
  Bold = 700,
  ExtraBold = 800
}

/**
 * Font style types
 */
export type FontStyle = 'normal' | 'italic' | 'oblique';

/**
 * Font decoration types
 */
export type FontDecoration = 'none' | 'underline' | 'line-through' | 'overline' | (string & {});

/**
 * Font stretch values
 */
export type FontStretch = 'normal' | 'condensed' | 'expanded' | (string & {});

/**
 * Font options interface
 */
export interface FontOptions {
  family?: string;
  size?: number;
  weight?: FontWeight | number | string;
  style?: FontStyle;
  decoration?: FontDecoration;
  stretch?: FontStretch;
  letterSpacing?: number | string;
  lineHeight?: number | string;
  variant?: string;
}

/**
 * QFont provides font handling for the application
 */
export class QFont {
  private _family: string = 'system-ui';
  private _size: number = 14;
  private _weight: number = 400;
  private _italic: boolean = false;
  private _underline: boolean = false;
  private _strikeOut: boolean = false;

  constructor(family?: string, pointSize?: number, weight?: number, italic?: boolean) {
    if (family) this._family = family;
    if (pointSize) this._size = pointSize;
    if (weight) this._weight = weight;
    if (italic) this._italic = italic;
  }

  setFamily(family: string): void {
    this._family = family;
  }

  setPointSize(size: number): void {
    this._size = size;
  }

  setWeight(weight: number): void {
    this._weight = weight;
  }

  setItalic(italic: boolean): void {
    this._italic = italic;
  }

  setUnderline(underline: boolean): void {
    this._underline = underline;
  }

  setStrikeOut(strikeOut: boolean): void {
    this._strikeOut = strikeOut;
  }

  toCss(): string {
    const styles = [
      `font-family: ${this._family}`,
      `font-size: ${this._size}px`,
      `font-weight: ${this._weight}`,
      this._italic ? 'font-style: italic' : '',
      this._underline ? 'text-decoration: underline' : '',
      this._strikeOut ? 'text-decoration: line-through' : ''
    ];

    return styles.filter(s => s).join('; ');
  }

  static defaultFont(): QFont {
    return new QFont('system-ui', 14, 400, false);
  }
}
