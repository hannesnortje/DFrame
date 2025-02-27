import { QWidget } from './QWidget';
import { Qt } from '../core/Qt';

export class QTextEdit extends QWidget {
    protected textarea: HTMLTextAreaElement;
    protected _readOnly: boolean = false;
    protected _acceptRichText: boolean = true;
    protected _placeholderText: string = '';

    constructor(parent: QWidget | null = null) {
        super(parent);
        this.element = document.createElement('div');
        this.textarea = document.createElement('textarea');
        this.element.appendChild(this.textarea);
        this.textarea.value = '';
        this.initializeTextEdit();
    }

    private initializeTextEdit() {
        this.textarea.addEventListener('input', () => {
            this.emit('textChanged', void 0);
        });
        this.textarea.addEventListener('focus', () => {
            this.emit('focused', void 0);
        });
        this.textarea.addEventListener('blur', () => {
            this.emit('editingFinished', void 0);
        });
    }

    setPlainText(text: string) {
        this.textarea.value = text;
        this.emit('textChanged', undefined);
    }

    toPlainText(): string {
        return this.textarea.value;
    }

    setHtml(text: string) {
        if (this._acceptRichText) {
            this.textarea.innerHTML = text;
            this.emit('textChanged', void 0);
        }
    }

    toHtml(): string {
        return this._acceptRichText ? this.textarea.innerHTML : this.textarea.value;
    }

    setAcceptRichText(accept: boolean) {
        this._acceptRichText = accept;
    }

    setReadOnly(readOnly: boolean) {
        this._readOnly = readOnly;
        this.textarea.readOnly = readOnly;
    }

    isReadOnly(): boolean {
        return this._readOnly;
    }

    setPlaceholderText(text: string) {
        this._placeholderText = text;
        this.textarea.placeholder = text;
    }

    clear() {
        this.setPlainText('');
    }

    append(text: string) {
        this.textarea.value += text;
        this.emit('textChanged', void 0);
    }
}
