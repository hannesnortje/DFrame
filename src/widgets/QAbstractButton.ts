import { QWidget } from './QWidget';
import { QStyle } from '../core/QStyle';

/**
 * The abstract base class of button widgets, providing
 * functionality common to buttons.
 */
export abstract class QAbstractButton extends QWidget {
    protected _text: string = '';
    protected _checkable: boolean = false;
    protected _checked: boolean = false;
    protected _autoRepeat: boolean = false;
    protected _autoExclusive: boolean = false;
    protected _autoRepeatDelay: number = 300;
    protected _autoRepeatInterval: number = 100;
    protected _down: boolean = false;
    protected _icon: string | null = null;
    protected _isPressed: boolean = false;
    protected buttonElement: HTMLElement;
    
    constructor(text: string = '', parent: QWidget | null = null) {
        super(parent);
        this._text = text;
        
        // Create the actual button element
        this.buttonElement = document.createElement('button');
        this.buttonElement.textContent = text;
        this.buttonElement.style.border = '1px solid #ced4da';
        this.buttonElement.style.padding = '6px 12px';
        this.buttonElement.style.backgroundColor = '#fff';
        this.buttonElement.style.borderRadius = '4px';
        this.buttonElement.style.cursor = 'pointer';
        this.buttonElement.style.width = '100%';
        this.buttonElement.style.textAlign = 'center';
        this.buttonElement.style.display = 'inline-block';
        this.buttonElement.style.transition = 'all 0.2s';
        
        this.element.appendChild(this.buttonElement);
        
        // Setup event listeners
        this.setupEvents();
    }
    
    /**
     * Sets up all button event listeners
     */
    protected setupEvents(): void {
        // Mouse press
        this.buttonElement.addEventListener('mousedown', (e) => {
            this._down = true;
            this._isPressed = true;
            this.emit('pressed');
            this.updateStyleForState();
        });
        
        // Mouse release
        this.buttonElement.addEventListener('mouseup', (e) => {
            const wasPressed = this._isPressed;
            this._down = false;
            this._isPressed = false;
            if (wasPressed) {
                this.emit('released');
                this.emit('clicked');
                
                // Handle checkbox-like behavior
                if (this._checkable) {
                    this.toggle();
                }
            }
            this.updateStyleForState();
        });
        
        // Mouse leave while pressed
        this.buttonElement.addEventListener('mouseleave', (e) => {
            if (this._isPressed) {
                this._isPressed = false;
                this.emit('released');
            }
            this.updateStyleForState();
        });
        
        // Mouse enter while button is held down
        this.buttonElement.addEventListener('mouseenter', (e) => {
            if (this._down && e.buttons & 1) { // Left button is pressed
                this._isPressed = true;
                this.emit('pressed');
            }
            this.updateStyleForState();
        });
        
        // Focus and blur events
        this.buttonElement.addEventListener('focus', () => this.updateStyleForState());
        this.buttonElement.addEventListener('blur', () => this.updateStyleForState());
    }
    
    /**
     * Update the visual style based on the button's state
     */
    protected updateStyleForState(): void {
        const isEnabled = this.isEnabled();
        const element = this.buttonElement;
        
        element.disabled = !isEnabled;
        
        if (!isEnabled) {
            element.style.backgroundColor = '#f0f0f0';
            element.style.color = '#888';
            element.style.cursor = 'not-allowed';
            return;
        }
        
        if (this._isPressed) {
            element.style.backgroundColor = '#e0e0e0';
            element.style.boxShadow = 'inset 0 3px 5px rgba(0, 0, 0, 0.125)';
        } else if (this._checked) {
            element.style.backgroundColor = '#d4d4d4';
            element.style.boxShadow = 'inset 0 3px 5px rgba(0, 0, 0, 0.125)';
        } else {
            element.style.backgroundColor = '#fff';
            element.style.boxShadow = 'none';
        }
        
        element.style.cursor = 'pointer';
    }
    
    /**
     * Get the button's text
     */
    text(): string {
        return this._text;
    }
    
    /**
     * Set the button's text
     */
    setText(text: string): void {
        this._text = text;
        this.buttonElement.textContent = text;
    }
    
    /**
     * Is the button checkable (toggle button)
     */
    isCheckable(): boolean {
        return this._checkable;
    }
    
    /**
     * Set whether the button is checkable 
     */
    setCheckable(checkable: boolean): void {
        this._checkable = checkable;
        this.updateStyleForState();
    }
    
    /**
     * Is the button currently checked
     */
    isChecked(): boolean {
        return this._checked;
    }
    
    /**
     * Set the checked state
     */
    setChecked(checked: boolean): void {
        if (this._checkable && this._checked !== checked) {
            this._checked = checked;
            this.emit('toggled', checked);
            this.updateStyleForState();
        }
    }
    
    /**
     * Toggle the checked state
     */
    toggle(): void {
        if (this._checkable) {
            const newState = !this._checked;
            this.setChecked(newState);
        }
    }
    
    /**
     * Is auto-repeat enabled
     */
    autoRepeat(): boolean {
        return this._autoRepeat;
    }
    
    /**
     * Set auto-repeat
     */
    setAutoRepeat(enable: boolean): void {
        this._autoRepeat = enable;
    }
    
    /**
     * Set the button down state
     */
    setDown(down: boolean): void {
        if (this._down !== down) {
            this._down = down;
            this.updateStyleForState();
        }
    }
    
    /**
     * Is the button in the down state
     */
    isDown(): boolean {
        return this._down;
    }
    
    /**
     * Set the icon
     * @param iconUrl URL to the icon image
     */
    setIcon(iconUrl: string | null): void {
        this._icon = iconUrl;
        
        // Remove existing icon if any
        const existingIcon = this.buttonElement.querySelector('img');
        if (existingIcon) {
            this.buttonElement.removeChild(existingIcon);
        }
        
        // Add new icon if provided
        if (iconUrl) {
            const icon = document.createElement('img');
            icon.src = iconUrl;
            icon.style.marginRight = '5px';
            icon.style.verticalAlign = 'middle';
            icon.style.maxHeight = '16px';
            this.buttonElement.insertBefore(icon, this.buttonElement.firstChild);
        }
    }
    
    /**
     * Get the current icon URL
     */
    icon(): string | null {
        return this._icon;
    }
    
    /**
     * Set enabled state
     */
    setEnabled(enabled: boolean): void {
        super.setEnabled(enabled);
        this.updateStyleForState();
    }
}
