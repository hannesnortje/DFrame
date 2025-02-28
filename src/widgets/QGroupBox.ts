import { QWidget } from './QWidget';
import { QStyle } from '../core/QStyle';

/**
 * Group box frame with a title
 */
export class QGroupBox extends QWidget {
    private _title: string = '';
    private titleElement: HTMLElement;
    private contentElement: HTMLElement;
    private _checkable: boolean = false;
    private _checked: boolean = false;
    private checkboxElement: HTMLInputElement | null = null;
    
    /**
     * Create a new group box
     */
    constructor(title: string = '', parent: QWidget | null = null) {
        super(parent);
        
        // Style the group box
        this.element.style.border = '1px solid #ced4da';
        this.element.style.borderRadius = '4px';
        this.element.style.padding = '10px';
        this.element.style.marginBottom = '10px';
        
        // Create title element
        this.titleElement = document.createElement('div');
        this.titleElement.style.margin = '-20px 0 10px 10px';
        this.titleElement.style.backgroundColor = 'white';
        this.titleElement.style.padding = '0 5px';
        this.titleElement.style.display = 'inline-block';
        this.titleElement.style.fontWeight = 'bold';
        this.element.appendChild(this.titleElement);
        
        // Create content container
        this.contentElement = document.createElement('div');
        this.element.appendChild(this.contentElement);
        
        // Set initial title
        this.setTitle(title);
    }
    
    /**
     * Get the group box title
     */
    title(): string {
        return this._title;
    }
    
    /**
     * Set the group box title
     */
    setTitle(title: string): void {
        this._title = title;
        if (this._checkable && this.checkboxElement) {
            // If checkable, create a label for the checkbox
            const label = this.titleElement.querySelector('label');
            if (label) {
                label.textContent = title;
            }
        } else {
            this.titleElement.textContent = title;
        }
    }
    
    /**
     * Get whether the group box is checkable
     */
    isCheckable(): boolean {
        return this._checkable;
    }
    
    /**
     * Set whether the group box is checkable
     */
    setCheckable(checkable: boolean): void {
        if (this._checkable === checkable) return;
        
        this._checkable = checkable;
        
        if (checkable) {
            // Create a checkbox if needed
            this.checkboxElement = document.createElement('input');
            this.checkboxElement.type = 'checkbox';
            this.checkboxElement.checked = this._checked;
            this.checkboxElement.style.marginRight = '5px';
            
            // Create label
            const label = document.createElement('label');
            label.textContent = this._title;
            
            // Clear title element
            this.titleElement.innerHTML = '';
            this.titleElement.appendChild(this.checkboxElement);
            this.titleElement.appendChild(label);
            
            // Setup change handler
            this.checkboxElement.addEventListener('change', () => {
                if (this.checkboxElement) {
                    this.setChecked(this.checkboxElement.checked);
                }
            });
            
            this.updateContentVisibility();
        } else {
            // Remove checkbox if exists
            this.titleElement.innerHTML = '';
            this.titleElement.textContent = this._title;
            this.checkboxElement = null;
            
            // Ensure content is visible
            this.contentElement.style.display = 'block';
        }
    }
    
    /**
     * Get whether the group box is checked
     */
    isChecked(): boolean {
        return this._checked;
    }
    
    /**
     * Set whether the group box is checked
     */
    setChecked(checked: boolean): void {
        if (!this._checkable || this._checked === checked) return;
        
        this._checked = checked;
        
        if (this.checkboxElement) {
            this.checkboxElement.checked = checked;
        }
        
        this.updateContentVisibility();
        this.emit('toggled', checked);
    }
    
    /**
     * Update content visibility based on checked state
     */
    private updateContentVisibility(): void {
        if (this._checkable) {
            this.contentElement.style.display = this._checked ? 'block' : 'none';
        } else {
            this.contentElement.style.display = 'block';
        }
    }
    
    /**
     * Add a widget to the group box content
     */
    addWidget(widget: QWidget): void {
        this.contentElement.appendChild(widget.getElement());
    }
}
