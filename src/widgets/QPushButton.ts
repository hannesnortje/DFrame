import { QWidget } from '../core/QWidget';
import { QEvent, QEventType } from '../core/QEvent';
import { QFont } from '../style/QFont';
import { signal, Signal } from '../core/signals/Signal';

/**
 * A button that can be clicked
 */
export class QPushButton extends QWidget {
  private _text: string;
  protected _isPressed: boolean = false; // Changed from private to protected
  protected _isButtonHovered: boolean = false; // Renamed to avoid collision

  @signal()
  clicked!: Signal;  // Will be instantiated by decorator
  
  /**
   * Creates a new QPushButton
   * @param text Button text
   * @param parent Optional parent widget
   */
  constructor(text: string = '', parent: QWidget | null = null) {
    super(parent);
    
    // Initialize button properties
    this._text = text;
    
    // Set up button appearance
    this.element.classList.add('qpushbutton');
    this.element.textContent = text;
    
    // Set up mouse event handlers
    this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.element.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.element.addEventListener('click', this.handleClick.bind(this));
    this.element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    
    // Set default styling
    this.element.style.cursor = 'pointer';
    this.element.style.padding = '6px 12px';
    this.element.style.backgroundColor = '#f0f0f0';
    this.element.style.border = '1px solid #ccc';
    this.element.style.borderRadius = '3px';
    this.element.style.textAlign = 'center';
    this.element.style.userSelect = 'none';
    this.element.style.transition = 'background-color 0.1s, border-color 0.1s';
  }
  
  /**
   * Sets the button text
   * @param text Text to display on the button
   */
  setText(text: string): void {
    this._text = text;
    this.element.textContent = text;
    this.emit('textChanged', text);
  }
  
  /**
   * Gets the button text
   */
  text(): string {
    return this._text;
  }
  
  /**
   * Handle mouse down event
   */
  private handleMouseDown(e: MouseEvent): void {
    this._isPressed = true;
    this.element.classList.add('pressed');
    this.element.style.backgroundColor = '#d0d0d0';
  }
  
  /**
   * Handle mouse up event
   */
  private handleMouseUp(e: MouseEvent): void {
    this._isPressed = false;
    this.element.classList.remove('pressed');
    this.element.style.backgroundColor = this._isButtonHovered ? '#e0e0e0' : '#f0f0f0';
  }
  
  /**
   * Handle click event
   */
  private handleClick(e: MouseEvent): void {
    if (this.isEnabled()) {
      this.clicked.emit();
    }
  }
  
  /**
   * Handle mouse enter event
   */
  private handleMouseEnter(e: MouseEvent): void {
    this._isButtonHovered = true;
    if (!this._isPressed) {
      this.element.style.backgroundColor = '#e0e0e0';
    }
    this.element.classList.add('hovered');
  }
  
  /**
   * Handle mouse leave event
   */
  private handleMouseLeave(e: MouseEvent): void {
    this._isButtonHovered = false;
    if (!this._isPressed) {
      this.element.style.backgroundColor = '#f0f0f0';
    }
    this.element.classList.remove('hovered');
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
      
      if (btnStyle.borderRadius) {
        this.element.style.borderRadius = btnStyle.borderRadius;
      }
      
      if (btnStyle.padding) {
        this.element.style.padding = btnStyle.padding;
      }
    }
  }
  
  /**
   * Override setEnabled to handle button-specific styling
   */
  setEnabled(enabled: boolean): void {
    super.setEnabled(enabled);
    
    if (enabled) {
      this.element.style.opacity = '1';
      this.element.style.cursor = 'pointer';
    } else {
      this.element.style.opacity = '0.6';
      this.element.style.cursor = 'default';
    }
  }
  
  /**
   * Make the button auto-repeat when held down
   */
  setAutoRepeat(autoRepeat: boolean): void {
    // Implement auto repeat functionality
    // This would involve setting up a timer when mouse is held down
  }

  setFont(font: QFont | string): void {
    super.setFont(font);
  }
}
