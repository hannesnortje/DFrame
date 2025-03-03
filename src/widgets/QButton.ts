import { QWidget } from '../core/QWidget';
import { QString } from '../core/containers/QString';
import { QStyle, globalTheme } from '../style';
import { QVariant } from '../core/containers/QVariant';

// Register default button style in the global theme
globalTheme.registerStyle('Button', new QStyle({
  backgroundColor: '#4285f4',
  color: 'white',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '4px',
  fontSize: 14,
  cursor: 'pointer'
}));

/**
 * A push button widget
 */
export class QButton extends QWidget {
  private _buttonElement: HTMLButtonElement;

  constructor(text?: string, parent?: QWidget) {
    super(parent);
    
    // Create a button element and store it
    this._buttonElement = document.createElement('button');
    
    // Replace the div with our button in the DOM if it's already in DOM
    const currentElement = this.element();
    const parentNode = currentElement.parentNode;
    
    if (parentNode) {
      parentNode.replaceChild(this._buttonElement, currentElement);
    }
    
    // Set the internal reference to point to our button element
    // Using a safer approach to override the private property
    try {
      Object.defineProperty(this, '_element', {
        value: this._buttonElement,
        writable: true
      });
    } catch (e) {
      // If property is not configurable, try a different approach
      // This is a fallback in case the first method fails
      (this as any)._element = this._buttonElement;
    }
    
    // Set initial text if provided
    if (text) {
      this.setText(text);
    } else {
      this.setText('Button');
    }
    
    // Apply default button styling
    this.applyButtonStyle();
    
    // Add default event handlers
    this._buttonElement.addEventListener('click', (event) => {
      this.emit('clicked', event);
    });
  }
  
  /**
   * Sets the button text
   * @param text Button label text
   */
  setText(text: string | QString): this {
    this._buttonElement.textContent = text.toString();
    return this;
  }
  
  /**
   * Gets the button text
   * Overriding to match return type with parent class
   */
  text(): QString {
    const textContent = this._buttonElement.textContent || '';
    return new QString(textContent);
  }
  
  /**
   * Connect a function to the click event
   * @param handler Function to call when button is clicked
   */
  onClick(handler: (arg?: MouseEvent) => void): this {
    this.connect('clicked', handler);
    return this;
  }
  
  /**
   * Apply button-specific styling
   */
  private applyButtonStyle(): void {
    // Get button style from theme
    const buttonStyle = globalTheme.getStyle('Button');
    
    // Apply style properties directly to the button element
    Object.entries(buttonStyle).forEach(([key, value]) => {
      // Both set style on the DOM element and update the QWidget's style property system
      this.setStyleProperty(key, value);
      this.applyStyleProperty(key, value);
    });
    
    // Ensure the element has button styling
    this._buttonElement.style.outline = 'none';
    this._buttonElement.style.cursor = 'pointer';
    
    // Initialize disabled state visual
    this.updateDisabledState();
  }
  
  /**
   * Apply a single style property directly to the DOM element
   */
  private applyStyleProperty(property: string, value: any): void {
    // Directly apply common CSS properties
    switch (property) {
      case 'backgroundColor':
        this._buttonElement.style.backgroundColor = value;
        break;
      case 'color':
        this._buttonElement.style.color = value;
        break;
      case 'padding':
        this._buttonElement.style.padding = value;
        break;
      case 'border':
        this._buttonElement.style.border = value;
        break;
      case 'borderRadius':
        this._buttonElement.style.borderRadius = value;
        break;
      case 'fontSize':
        this._buttonElement.style.fontSize = typeof value === 'number' ? `${value}px` : value;
        break;
    }
  }
  
  /**
   * Override setStyleProperty to apply styles directly to the button
   */
  setStyleProperty(property: string, value: any): this {
    super.setStyleProperty(property, value);
    this.applyStyleProperty(property, value);
    return this;
  }
  
  /**
   * Override method from QWidget to handle button-specific styling
   */
  setEnabled(enabled: boolean): this {
    super.setEnabled(enabled);
    this.updateDisabledState();
    return this;
  }
  
  /**
   * Updates the visual state based on enabled/disabled status
   */
  private updateDisabledState(): void {
    this._buttonElement.disabled = !this.isEnabled();
    
    if (!this.isEnabled()) {
      this._buttonElement.style.opacity = '0.6';
      this._buttonElement.style.cursor = 'not-allowed';
    } else {
      this._buttonElement.style.opacity = '1';
      this._buttonElement.style.cursor = 'pointer';
    }
  }
  
  /**
   * Override to return the button element rather than QWidget's element
   */
  element(): HTMLElement {
    return this._buttonElement;
  }
}
