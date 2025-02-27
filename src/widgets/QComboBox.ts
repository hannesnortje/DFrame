import { QWidget } from './QWidget';
import { QStyle } from '../core/QStyle';

export class QComboBox extends QWidget {
    protected select: HTMLSelectElement;
    protected _currentIndex: number = -1;
    protected _editable: boolean = false;
    protected _maxVisibleItems: number = 10;
    protected _insertPolicy: QComboBox.InsertPolicy = QComboBox.InsertPolicy.InsertAtBottom;
    protected _sizeAdjustPolicy: QComboBox.SizeAdjustPolicy = QComboBox.SizeAdjustPolicy.AdjustToContentsOnFirstShow;
    protected items: Array<{ text: string, data: any }> = [];

    constructor(parent: QWidget | null = null) {
        super(parent);
        this.element = document.createElement('div');
        this.select = document.createElement('select');
        this.element.appendChild(this.select);
        
        this.setStyle({
            margin: '4px',
            width: 'auto',
            minWidth: '200px'
        });

        this.select.style.padding = '8px 12px';
        this.select.style.fontSize = '14px';
        this.select.style.borderRadius = '4px';
        this.select.style.border = '1px solid #ced4da';
        this.select.style.backgroundColor = '#fff';
        this.select.style.cursor = 'pointer';
        this.select.style.width = '100%';

        this.select.addEventListener('change', () => {
            this._currentIndex = this.select.selectedIndex;
            this.emit('currentIndexChanged', this._currentIndex);
            this.emit('activated', this._currentIndex);
        });
    }

    setProperty(name: string, value: any) {
        if (name === 'items' && Array.isArray(value)) {
            value.forEach(item => this.addItem(item));
            return;
        }
        super.setProperty(name, value);
    }

    addItem(text: string, userData: any = null) {
        const option = document.createElement('option') as HTMLOptionElement;
        option.text = text;
        this.items.push({ text, data: userData });
        this.select.appendChild(option);
    }

    insertItem(index: number, text: string, userData: any = null) {
        const option = document.createElement('option');
        option.text = text;
        this.items.splice(index, 0, { text, data: userData });
        this.select.add(option, index);
    }

    removeItem(index: number) {
        this.select.remove(index);
        this.items.splice(index, 1);
    }

    setItemText(index: number, text: string) {
        if (index >= 0 && index < this.select.options.length) {
            this.select.options[index].text = text;
            this.items[index].text = text;
        }
    }

    itemText(index: number): string {
        return this.items[index]?.text ?? '';
    }

    itemData(index: number): any {
        return this.items[index]?.data ?? null;
    }

    setEditable(editable: boolean) {
        this._editable = editable;
        // Implementation for editable combo box would go here
    }

    setMaxVisibleItems(maxItems: number) {
        this._maxVisibleItems = maxItems;
        this.select.size = Math.min(this.count(), maxItems);
    }

    count(): number {
        return this.items.length;
    }

    currentIndex(): number {
        return this.select.selectedIndex;
    }

    setCurrentIndex(index: number) {
        this.select.selectedIndex = index;
        this._currentIndex = index;
        this.emit('currentIndexChanged', index);
    }

    currentText(): string {
        return this.select.options[this.currentIndex()]?.text ?? '';
    }

    clear() {
        this.select.innerHTML = '';
        this.items = [];
    }
}

// Add Qt-like enums for QComboBox
export namespace QComboBox {
    export enum InsertPolicy {
        NoInsert,
        InsertAtTop,
        InsertAtCurrent,
        InsertAtBottom,
        InsertAfterCurrent,
        InsertBeforeCurrent,
        InsertAlphabetically
    }

    export enum SizeAdjustPolicy {
        AdjustToContents,
        AdjustToContentsOnFirstShow,
        AdjustToMinimumContentsLength
    }
}
