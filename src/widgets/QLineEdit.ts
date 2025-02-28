import { QWidget } from './QWidget';
import { QObject } from '../core/QObject';
import { QStyle } from '../core/QStyle';

/**
 * A widget that allows entering a single line of text
 */
export class QLineEdit extends QWidget {
    private inputElement: HTMLInputElement;
    
    /**
     * Create a new line edit
     * @param text Initial text
     * @param parent Parent widget
     */
    constructor(text: string = '', parent: QWidget | null = null) {
        super(parent);
        
        this.inputElement = document.createElement('input');
        this.inputElement.type = 'text';
        this.inputElement.value = text;
        this.inputElement.className = 'dframe-line-edit';
        
        // Style the input element
        QStyle.applyStyle(this.inputElement, {
            padding: '5px 10px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            width: '100%',
            boxSizing: 'border-box',
            fontSize: '14px',
            lineHeight: '1.5'
        });
        
        this.getElement().appendChild(this.inputElement);
        
        // Handle input events
        this.inputElement.addEventListener('input', () => {
            this.emit('textChanged', this.inputElement.value);
        });
        
        this.inputElement.addEventListener('change', () => {
            this.emit('editingFinished', this.inputElement.value);
        });
        
        this.inputElement.addEventListener('focus', () => {
            this.emit('focused');
        });
        
        this.inputElement.addEventListener('blur', () => {
            this.emit('blurred');
        });
    }
    
    /**
     * Get the current text
     */
    text(): string {
        return this.inputElement.value;
    }
    
    /**
     * Set the text
     * @param text The text to set
     */
    setText(text: string): void {
        this.inputElement.value = text;
    }
    
    /**
     * Set placeholder text
     * @param placeholder Text to show when empty
     */
    setPlaceholder(placeholder: string): void {
        this.inputElement.placeholder = placeholder;
    }
    
    /**
     * Set whether the input is read-only
     * @param readOnly Whether the input is read-only
     */
    setReadOnly(readOnly: boolean): void {
        this.inputElement.readOnly = readOnly;
    }
    
    /**
     * Get whether the input is read-only
     */
    isReadOnly(): boolean {
        return this.inputElement.readOnly;
    }
    
    /**
     * Select all text
     */
    selectAll(): void {
        this.inputElement.select();
    }
    
    /**
     * Clear the text
     */
    clear(): void {
        this.inputElement.value = '';
    }
    
    /**
     * Set maximum length
     */
    setMaxLength(maxLength: number): void {
        this.inputElement.maxLength = maxLength;
    }
    
    /**
     * Get the native input element
     */
    getInputElement(): HTMLInputElement {
        return this.inputElement;
    }
}
