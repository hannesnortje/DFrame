import { QWidget } from './QWidget';
import { QObject } from '../core/QObject';
import { QStyle } from '../core/QStyle';

/**
 * A widget that allows editing multi-line text
 */
export class QTextEdit extends QWidget {
    private textareaElement: HTMLTextAreaElement;
    
    /**
     * Create a new text edit
     * @param text Initial text
     * @param parent Parent widget
     */
    constructor(text: string = '', parent: QWidget | null = null) {
        super(parent);
        
        this.textareaElement = document.createElement('textarea');
        this.textareaElement.value = text;
        this.textareaElement.className = 'dframe-text-edit';
        
        // Style the textarea element
        QStyle.applyStyle(this.textareaElement, {
            padding: '8px 10px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            width: '100%',
            minHeight: '100px',
            boxSizing: 'border-box',
            fontSize: '14px',
            lineHeight: '1.5',
            resize: 'vertical'
        });
        
        this.getElement().appendChild(this.textareaElement);
        
        // Handle input events
        this.textareaElement.addEventListener('input', () => {
            this.emit('textChanged', this.textareaElement.value);
        });
        
        this.textareaElement.addEventListener('focus', () => {
            this.emit('focused');
        });
        
        this.textareaElement.addEventListener('blur', () => {
            this.emit('blurred');
        });
    }
    
    /**
     * Get the current text
     */
    getText(): string {
        return this.textareaElement.value;
    }
    
    /**
     * Set the text
     * @param text The text to set
     */
    setText(text: string): void {
        this.textareaElement.value = text;
        this.emit('textChanged', text);
    }
    
    /**
     * Append text to the end
     * @param text The text to append
     */
    append(text: string): void {
        this.textareaElement.value += text;
        this.emit('textChanged', this.textareaElement.value);
    }
    
    /**
     * Set whether the input is read-only
     * @param readOnly Whether the input is read-only
     */
    setReadOnly(readOnly: boolean): void {
        this.textareaElement.readOnly = readOnly;
    }
    
    /**
     * Get whether the input is read-only
     */
    isReadOnly(): boolean {
        return this.textareaElement.readOnly;
    }
    
    /**
     * Select all text
     */
    selectAll(): void {
        this.textareaElement.select();
    }
    
    /**
     * Clear the text
     */
    clear(): void {
        this.textareaElement.value = '';
        this.emit('textChanged', '');
    }
    
    /**
     * Get the textarea element
     */
    getTextareaElement(): HTMLTextAreaElement {
        return this.textareaElement;
    }
}
