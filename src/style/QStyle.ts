import { QObject } from '../core/QObject';
import { QWidget } from '../core/QWidget';
import { QMap } from '../core/containers/QMap';
import { QVariant } from '../core/containers/QVariant';
import { QFont } from './QFont';

export enum QPalette {
  Window,
  WindowText,
  Base,
  Text,
  Button,
  ButtonText,
  Highlight,
  HighlightedText
}

export interface StyleProperties {
  [key: string]: any;
}

export class QStyle extends QObject {
  protected static _instance: QStyle | null = null;  // Changed to protected
  protected _internalProperties: StyleProperties = {};
  protected _styleSheet: string = '';
  protected _styleElement: HTMLStyleElement | null = null;  // Changed to protected

  constructor() {  // Changed to public
    super(null);
    this._properties = new QMap<string, QVariant>();
    this.initializeStyles();
    this.initializeStyleElement();
  }

  static instance(): QStyle {
    if (!QStyle._instance) {
      QStyle._instance = new QStyle();
    }
    return QStyle._instance;
  }

  protected initializeStyles(): void {
    this._styleSheet = this.getBaseStyles();
    this.updateStyleSheet();
  }

  protected getBaseStyles(): string {
    const defaultFont = QFont.defaultFont();
    
    return `
      .qwidget {
        position: absolute !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        z-index: auto !important;
        ${defaultFont.toCss()} !important;
        min-width: 10px !important;
        min-height: 10px !important;
        background: var(--widget-background, white) !important;
        color: var(--widget-text, black) !important;
        border: var(--widget-border, none) !important;
        pointer-events: auto !important;
        user-select: none !important;
        transform-style: preserve-3d !important;
        backface-visibility: hidden !important;
        will-change: transform, opacity !important;
        box-sizing: border-box !important;
      }

      .QPushButton {
        display: inline-block !important;
        min-width: 80px !important;
        text-align: center !important;
        background: var(--button-background, #f5f5f5) !important;
        border: 1px solid var(--button-border, #ddd) !important;
        border-radius: var(--button-radius, 4px) !important;
        color: var(--button-text, #333) !important;
        padding: 8px 16px !important;
        cursor: pointer !important;
      }

      .QPushButton:hover {
        background: var(--button-hover-background, #e5e5e5) !important;
      }

      .QPushButton:disabled {
        opacity: 0.6 !important;
        cursor: not-allowed !important;
      }

      .QLabel {
        display: block !important;
        min-height: 20px !important;
        color: var(--label-text, inherit) !important;
      }

      .qhboxlayout {
        flex-direction: row !important;
        gap: 8px !important;
        align-items: center !important;
      }

      .qvboxlayout {
        flex-direction: column !important;
        gap: 8px !important;
      }

      .qwidget[data-layout] {
        display: flex !important;
        flex-direction: column !important;
      }

      .QPushButton {
        display: inline-block !important;
        min-width: 80px !important;
        text-align: center !important;
      }

      .QPushButton button {
        all: unset;
        display: inline-block !important;
        padding: 8px 16px !important;
        background: #f5f5f5 !important;
        border: 1px solid #ddd !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-family: system-ui !important;
        font-size: 14px !important;
        color: #333 !important;
        text-align: center !important;
        min-width: 80px !important;
        margin: 4px !important;
      }

      .QPushButton button:hover {
        background: #e5e5e5 !important;
      }

      .QLabel {
        display: block !important;
        min-height: 20px !important;
      }
    `;
  }

  clone(): QStyle {
    const style = new QStyle();
    style._styleSheet = this._styleSheet;
    style._internalProperties = { ...this._internalProperties };
    style._properties = new QMap(this._properties.entries());
    return style;
  }

  set(key: string, value: any): void {
    this._internalProperties[key] = value;
    this._properties.insert(key, new QVariant(value));
    this.updateStyleSheet();
  }

  get(key: string, defaultValue?: any): any {
    const prop = this._properties.value(key);
    return prop ? prop.value() : defaultValue;
  }

  merge(other: QStyle): QStyle {
    const merged = this.clone();
    other._properties.forEach((value, key) => {
      merged._properties.insert(key, value);
    });
    merged._internalProperties = {
      ...merged._internalProperties,
      ...other._internalProperties
    };
    merged.updateStyleSheet();
    return merged;
  }

  protected updateStyleSheet(): void {
    const customProperties = Object.entries(this._internalProperties)
      .map(([key, value]) => `  --${key}: ${value};`)
      .join('\n');

    this._styleSheet = `
      ${this.getBaseStyles()}
      ${customProperties ? `:root {\n${customProperties}\n}` : ''}
    `;
  }

  styleSheet(): string {
    return this._styleSheet;
  }

  applyToWidget(widget: QWidget): void {
    widget.updateStyleFromApplication(this._styleSheet);
  }

  private initializeStyleElement(): void {
    if (typeof document !== 'undefined') {
      this._styleElement = document.getElementById('qstyle-default') as HTMLStyleElement;
      if (!this._styleElement) {
        this._styleElement = QStyle.createStyleSheet();
      }
      this._styleElement.textContent = this.styleSheet();
    }
  }

  static createStyleSheet(): HTMLStyleElement {
    const style = document.createElement('style');
    style.id = 'qstyle-default';
    document.head.appendChild(style);
    return style;
  }

  static createDefault(): QStyle {
    return this.instance();
  }

  standardFont(role: string = 'default'): QFont {
    const fontVariant = this._properties.value(`font-${role}`);
    if (!fontVariant) {
      return QFont.defaultFont();
    }
    return fontVariant.value() as QFont;
  }

  setStandardFont(font: QFont, role: string = 'default'): void {
    this._properties.insert(`font-${role}`, new QVariant(font));
    this.updateStyleSheet();
  }

  standardPalette(role: QPalette): string {
    const colorVariant = this._properties.value(`color-${QPalette[role]}`);
    return colorVariant ? colorVariant.value() as string : '#000000';
  }

  setStandardPalette(color: string, role: QPalette): void {
    this._properties.insert(`color-${QPalette[role]}`, new QVariant(color));
    this.updateStyleSheet();
  }
}

// Export a singleton instance
export const defaultStyle = QStyle.createDefault();
