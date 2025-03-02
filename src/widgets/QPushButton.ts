import { QWidget } from '../core/QWidget';
import { QString } from '../core/containers/QString';
import { QEvent, QEventType } from '../core/QEvent';

/**
 * A button widget with click events
 */
export class QPushButton extends QWidget {
  private _isDown: boolean = false;
  private _isHovered: boolean = false;
  private _buttonText: string = '';
  private _icon: string | null = null;
  private _checkable: boolean = false;
  private _checked: boolean = false;
  private _autoRepeat: boolean = false;
  private _flat: boolean = false;

  constructor(text?: string | QString, parent?: QWidget) {
    super(parent);
    
    if (text) {
      this.setText(text);
    }
    
    // Set default styling
    this.setStyleProperty('padding', '8px 16px');
    this.setStyleProperty('cursor', 'pointer');
    this.setStyleProperty('user-select', 'none');
    this.setStyleProperty('border', '1px solid #ccc');
    this.setStyleProperty('background-color', '#f0f0f0');
    this.setStyleProperty('border-radius', '4px');
    this.setStyleProperty('transition', 'background-color 0.2s');
  }

  /**
   * Sets the button text
   * @override from QWidget
   */
  setText(text: string | QString): void {
    const newText = text instanceof QString ? text.toString() : text;
    
    // Only update and emit if text has changed
    if (this._buttonText !== newText) {
      // Call super implementation
      super.setText(text);
      
      // Store as regular string for easy access
      this._buttonText = newText;
      
      // Also emit with the plain string for test compatibility
      this.emit('textChanged', newText);
    }
  }

  /**
   * Returns the button text as a regular string
   */
  getText(): string {
    return this._buttonText;
  }

  /**
   * Set the button icon
   */
  setIcon(iconUrl: string): void {
    if (this._icon !== iconUrl) {
      this._icon = iconUrl;
      this.emit('iconChanged', iconUrl);
    }
  }

  /**
   * Returns the button icon URL
   */
  getIcon(): string | null {
    return this._icon;
  }

  /**
   * Sets whether the button is checkable
   */
  setCheckable(checkable: boolean): void {
    if (this._checkable !== checkable) {
      this._checkable = checkable;
      if (!checkable) {
        this._checked = false;  // Reset checked state when making non-checkable
      }
      this.emit('checkableChanged', checkable);
    }
  }

  /**
   * Returns whether the button is checkable
   */
  isCheckable(): boolean {
    return this._checkable;
  }

  /**
   * Sets the checked state of the button
   */
  setChecked(checked: boolean): void {
    if (this._checkable && this._checked !== checked) {
      this._checked = checked;
      
      // Emit toggled with primitive boolean for test compatibility
      this.emit('toggled', checked);
    }
  }

  /**
   * Returns whether the button is checked
   */
  isChecked(): boolean {
    return this._checked;
  }

  /**
   * Sets whether the button automatically repeats
   */
  setAutoRepeat(repeat: boolean): void {
    if (this._autoRepeat !== repeat) {
      this._autoRepeat = repeat;
      this.emit('autoRepeatChanged', repeat);
    }
  }

  /**
   * Sets whether the button is flat
   */
  setFlat(flat: boolean): void {
    if (this._flat !== flat) {
      this._flat = flat;
      this.emit('flatChanged', flat);
    }
  }

  /**
   * Returns whether the button is flat
   */
  isFlat(): boolean {
    return this._flat;
  }

  /**
   * Sets the down state directly 
   * @internal - For testing only, not part of public API
   */
  setIsDown(down: boolean): void {
    this._isDown = down;
    this.updateElement();
  }

  /**
   * Overrides base updateElement to handle button styling
   */
  protected updateElement() {
    super.updateElement();
    
    // Update hover and pressed state styling
    const element = this.element();
    element.classList.toggle('hover', this._isHovered);
    element.classList.toggle('pressed', this._isDown);
    
    // Ensure the element is clickable
    element.style.cursor = this.isEnabled() ? 'pointer' : 'not-allowed';
    
    // Add event listeners if not already added
    this.setupEventListeners();
  }
  
  /**
   * Setup DOM event listeners
   */
  private setupEventListeners() {
    const element = this.element();
    
    // Use a custom data attribute to track if listeners are set up
    if (element.dataset.hasListeners === 'true') {
      return;
    }
    
    element.addEventListener('click', (e) => {
      if (this.isEnabled()) {
        this.emit('pressed');
        this.emit('released');
        this.emit('clicked');
        
        // Toggle checked state if checkable
        if (this._checkable) {
          this.setChecked(!this._checked);
        }
      }
    });
    
    element.addEventListener('mousedown', (e) => {
      if (this.isEnabled()) {
        this._isDown = true;
        this.updateElement();
        this.emit('pressed');
      }
    });
    
    element.addEventListener('mouseup', (e) => {
      if (this.isEnabled()) {
        this._isDown = false;
        this.updateElement();
        this.emit('released');
      }
    });
    
    element.addEventListener('mouseenter', (e) => {
      this._isHovered = true;
      this.updateElement();
    });
    
    element.addEventListener('mouseleave', (e) => {
      this._isHovered = false;
      this._isDown = false;
      this.updateElement();
    });
    
    // Mark as having listeners
    element.dataset.hasListeners = 'true';
  }
  
  /**
   * Event handling
   */
  event(event: QEvent): boolean {
    // Let the base class handle it first
    const handled = super.event(event);
    if (handled) {
      return true;
    }
    
    // Button specific event handling
    switch (event.type()) {
      case QEventType.MouseButtonPress:
        this._isDown = true;
        this.updateElement();
        
        // Emit the pressed signal directly - no need to check for connections
        this.emit('pressed');
        return true;
        
      case QEventType.MouseButtonRelease:
        if (this._isDown) {
          this._isDown = false;
          this.updateElement();
          
          // Emit signals in order - no need to check for connections
          this.emit('released');
          this.emit('clicked');
          
          // Toggle if checkable
          if (this._checkable) {
            this.setChecked(!this._checked);
          }
        }
        return true;
        
      case QEventType.MouseEnter:
        this._isHovered = true;
        this.updateElement();
        return true;
        
      case QEventType.MouseLeave:
        this._isHovered = false;
        this._isDown = false;
        this.updateElement();
        return true;
    }
    
    return false;
  }
  
  /**
   * Simulates a click on the button
   */
  click() {
    if (this.isEnabled()) {
      // Emit all signals in the correct order
      this.emit('pressed');
      this.emit('released'); 
      this.emit('clicked');
      
      // Toggle checked state if button is checkable
      if (this._checkable) {
        this.setChecked(!this._checked);
      }
    }
  }
}
