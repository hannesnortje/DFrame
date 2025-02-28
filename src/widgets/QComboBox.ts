import { QWidget } from './QWidget';
import { QObject } from '../core/QObject';
import { QStyle } from '../core/QStyle';

/**
 * A combo box widget that shows a list of selectable items
 */
export class QComboBox extends QWidget {
    private selectElement: HTMLSelectElement;
    private currentIndex: number = -1;
    private items: string[] = [];

    /**
     * Create a new combo box
     * @param parent The parent widget
     */
    constructor(parent: QWidget | null = null) {
        super(parent);
        
        this.selectElement = document.createElement('select');
        this.selectElement.className = 'dframe-combo-box';
        
        // Style the select element
        QStyle.applyStyle(this.selectElement, {
            padding: '5px',
            borderRadius: '4px',
            border: '1px solid #ced4da',
            backgroundColor: '#fff',
            width: '100%',
            fontSize: '14px'
        });
        
        this.getElement().appendChild(this.selectElement);
        
        // Handle change event
        this.selectElement.addEventListener('change', (e) => {
            this.currentIndex = this.selectElement.selectedIndex;
            this.emit('currentIndexChanged', this.currentIndex);
            this.emit('currentTextChanged', this.currentText());
        });
    }

    /**
     * Add an item to the combo box
     * @param text The text for the item
     */
    addItem(text: string): void {
        const option = document.createElement('option');
        option.text = text;
        option.value = String(this.items.length);
        this.selectElement.appendChild(option);
        this.items.push(text);
    }

    /**
     * Add multiple items to the combo box
     * @param items Array of item texts to add
     */
    addItems(items: string[]): void {
        items.forEach(item => this.addItem(item));
    }

    /**
     * Get the current selected text
     */
    currentText(): string {
        return this.currentIndex >= 0 ? this.items[this.currentIndex] : '';
    }

    /**
     * Set the current index
     * @param index The index to select
     */
    setCurrentIndex(index: number): void {
        if (index >= -1 && index < this.items.length) {
            this.currentIndex = index;
            this.selectElement.selectedIndex = index;
            this.emit('currentIndexChanged', index);
            this.emit('currentTextChanged', this.currentText());
        }
    }

    /**
     * Get the current index
     */
    getCurrentIndex(): number {
        return this.currentIndex;
    }

    /**
     * Clear all items
     */
    clear(): void {
        this.selectElement.innerHTML = '';
        this.items = [];
        this.currentIndex = -1;
    }
}
