import { QWidget } from '../core/QWidget';
import { QString } from '../core/containers/QString';
import { globalTheme } from '../style/QTheme';
import { QFont } from '../style/QFont';

/**
 * A label widget that displays text or an image
 */
export class QLabel extends QWidget {
  private _text: string = '';
  private _textElement: HTMLElement;
  
  /**
   * Creates a new QLabel instance
   * @param text Initial text to display
   * @param parent Optional parent widget
   */
  constructor(text: string = '', parent: QWidget | null = null) {
    super(parent);
    
    // Set widget class
    this.element.classList.add('qlabel');
    
    // Create text element
    this._textElement = document.createElement('span');
    this.element.appendChild(this._textElement);
    
    // Set initial text
    this.setText(text);
    
    // Apply default styling
    this.element.style.display = 'flex';
    this.element.style.alignItems = 'center';
    this.element.style.justifyContent = 'flex-start';
    this.element.style.overflow = 'hidden';
    this.element.style.whiteSpace = 'nowrap';
    this.element.style.textOverflow = 'ellipsis';
  }
  
  /**
   * Sets the text to be displayed
   */
  setText(text: string): void {
    this._text = text;
    this._textElement.textContent = text;
    this.emit('textChanged', text);
  }
  
  /**
   * Returns the current text
   */
  text(): string {
    return this._text;
  }
  
  /**
   * Sets text alignment
   * @param alignment Alignment (left, center, right)
   */
  setAlignment(alignment: string): void {
    switch (alignment.toLowerCase()) {
      case 'left':
        this.element.style.justifyContent = 'flex-start';
        break;
      case 'center':
        this.element.style.justifyContent = 'center';
        break;
      case 'right':
        this.element.style.justifyContent = 'flex-end';
        break;
    }
  }
  
  /**
   * Sets whether the text can be wrapped
   */
  setWordWrap(wrap: boolean): void {
    this.element.style.whiteSpace = wrap ? 'normal' : 'nowrap';
  }
  
  /**
   * Sets the font for the label
   */
  setFont(font: QFont | string): void {
    super.setFont(font);
    this._textElement.style.font = typeof font === 'string' ? font : font.toString();
  }
}
