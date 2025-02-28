import { QAbstractButton } from './QAbstractButton';
import { QWidget } from './QWidget';
import { QStyle } from '../core/QStyle';

/**
 * CheckBox with a text label
 */
export class QCheckBox extends QAbstractButton {
    private checkboxElement: HTMLInputElement;
    private labelElement: HTMLLabelElement;
    private containerElement: HTMLDivElement;
    
    /**
     * Create a new checkbox
     */
    constructor(text: string = '', parent: QWidget | null = null) {
        super(text, parent);
        
        // We'll create a proper checkbox rather than using a button
        this.element.removeChild(this.buttonElement);
        
        // Create container for checkbox and label
        this.containerElement = document.createElement('div');
        this.containerElement.style.display = 'flex';
        this.containerElement.style.alignItems = 'center';
        this.element.appendChild(this.containerElement);
        
        // Create actual checkbox input
        this.checkboxElement = document.createElement('input');
        this.checkboxElement.type = 'checkbox';
        this.checkboxElement.style.margin = '0 5px 0 0';
        this.containerElement.appendChild(this.checkboxElement);
        
        // Create label for checkbox
        this.labelElement = document.createElement('label');
        this.labelElement.textContent = text;
        this.containerElement.appendChild(this.labelElement);
        
        // Set as checkable by default
        this._checkable = true;
        
        // Setup events for checkbox
        this.setupCheckboxEvents();
    }
    
    /**
     * Setup events specific to checkbox
     */
    private setupCheckboxEvents(): void {
        // Handle change event
        this.checkboxElement.addEventListener('change', () => {
            this._checked = this.checkboxElement.checked;
            this.emit('toggled', this._checked);
            this.emit('clicked');
        });
        
        // Handle disabled state
        this.checkboxElement.addEventListener('click', (e) => {
            if (!this.isEnabled()) {
                e.preventDefault();
                return false;
            }
            return true;
        });
    }
    
    /**
     * Set the checkbox text
     */
    setText(text: string): void {
        super.setText(text);
        this.labelElement.textContent = text;
    }
    
    /**
     * Set the checked state
     */
    setChecked(checked: boolean): void {
        if (this._checked !== checked) {
            this._checked = checked;
            this.checkboxElement.checked = checked;
            this.emit('toggled', checked);
        }
    }
    
    /**
     * Update visual style based on state
     */
    protected updateStyleForState(): void {
        const isEnabled = this.isEnabled();
        
        this.checkboxElement.disabled = !isEnabled;
        
        if (!isEnabled) {
            this.labelElement.style.color = '#888';
            this.containerElement.style.cursor = 'not-allowed';
            this.containerElement.style.opacity = '0.65';
        } else {
            this.labelElement.style.color = '';
            this.containerElement.style.cursor = 'pointer';
            this.containerElement.style.opacity = '1';
        }
        
        // Update checkbox checked state
        this.checkboxElement.checked = this._checked;
    }
    
    /**
     * Get whether the checkbox is in tri-state mode
     */
    isTristate(): boolean {
        return false; // Not implemented yet
    }
    
    /**
     * Set whether checkbox should use tri-state mode
     */
    setTristate(tristate: boolean = true): void {
        // Not implemented yet
    }
}
