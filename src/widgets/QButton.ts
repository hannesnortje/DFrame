import { QWidget } from '../core/QWidget';

/**
 * Base class for buttons
 */
export class QButton extends QWidget {
  private _text: string = '';
  
  /**
   * Creates a new button
   * @param text Button text
   * @param parent Optional parent widget
   */
  constructor(text: string = '', parent: QWidget | null = null) {
    super(parent);
    
    // Set button class
    this.element.classList.add('qbutton');
    this.element.textContent = text;
    this._text = text;
    
    // Set up default button style
    this.element.style.cursor = 'pointer';
    this.element.style.backgroundColor = '#f0f0f0';
    this.element.style.padding = '5px 10px';
    this.element.style.border = '1px solid #ccc';
    this.element.style.borderRadius = '3px';
    this.element.style.display = 'inline-block';
    this.element.style.textAlign = 'center';
    this.element.style.userSelect = 'none';
    
    // Set up mouse event handling
    this.setupEventHandlers();
  }
  
  /**
   * Set up event handlers
   */
  protected setupEventHandlers(): void {
    this.element.addEventListener('click', (e) => {
      if (this.isEnabled()) {
        this.emit('clicked');
      }
    });
    
    this.element.addEventListener('mousedown', (e) => {
      if (this.isEnabled()) {
        this.element.style.backgroundColor = '#d0d0d0';
        this.emit('pressed');
      }
    });
    
    this.element.addEventListener('mouseup', (e) => {
      if (this.isEnabled()) {
        this.element.style.backgroundColor = '#f0f0f0';
        this.emit('released');
      }
    });
  }
  
  /**
   * Sets the text on the button
   */
  setText(text: string): void {
    this._text = text;
    this.element.textContent = text;
    this.emit('textChanged', text);
  }
  
  /**
   * Returns the current button text
   */
  text(): string {
    return this._text;
  }
  
  /**
   * Override setEnabled to provide button-specific styling
   */
  setEnabled(enabled: boolean): void {
    super.setEnabled(enabled);
    
    if (enabled) {
      this.element.style.opacity = '1';
      this.element.style.cursor = 'pointer';
    } else {
      this.element.style.opacity = '0.5';
      this.element.style.cursor = 'default';
    }
  }
  
  /**
   * Apply theme styling
   */
  protected applyThemeStyle(themeStyle?: any): void {
    super.applyThemeStyle(themeStyle);
    
    if (themeStyle && themeStyle.button) {
      const btnStyle = themeStyle.button;
      
      if (btnStyle.background) {
        this.element.style.backgroundColor = btnStyle.background;
      }
      
      if (btnStyle.color) {
        this.element.style.color = btnStyle.color;
      }
      
      if (btnStyle.border) {
        this.element.style.border = btnStyle.border;
      }
    }
  }
}
