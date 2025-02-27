import { QWidget } from './QWidget';
import { Qt } from '../core/Qt';

export class QLineEdit extends QWidget {
    protected input: HTMLInputElement;
    protected _maxLength: number = 32767;
    protected _readOnly: boolean = false;
    protected _placeholderText: string = '';
    protected _echoMode: QLineEdit.EchoMode = QLineEdit.EchoMode.Normal;

    constructor(text: string = '', parent: QWidget | null = null) {
        super(parent);
        this.element = document.createElement('div');
        this.input = document.createElement('input');
        this.input.type = 'text';
        this.element.appendChild(this.input);
        this.setText(text);
        this.initializeLineEdit();

        this.setStyle({
            margin: '4px',
            width: 'auto',
            minWidth: '200px'
        });

        this.input.style.padding = '8px 12px';
        this.input.style.fontSize = '14px';
        this.input.style.borderRadius = '4px';
        this.input.style.border = '1px solid #ced4da';
        this.input.style.width = '100%';
        this.input.style.boxSizing = 'border-box';
    }

    private initializeLineEdit() {
        this.input.addEventListener('input', () => {
            this.emit('textChanged', this.text());
        });
        this.input.addEventListener('focus', () => {
            this.emit('focused', void 0);
        });
        this.input.addEventListener('blur', () => {
            this.emit('editingFinished', void 0);
        });
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.emit('returnPressed', void 0);
            }
        });
    }

    setText(text: string) {
        this.input.value = text;
        this.emit('textChanged', text);
    }

    text(): string {
        return this.input.value;
    }

    setMaxLength(length: number) {
        this._maxLength = length;
        this.input.maxLength = length;
    }

    maxLength(): number {
        return this._maxLength;
    }

    setReadOnly(readOnly: boolean) {
        this._readOnly = readOnly;
        this.input.readOnly = readOnly;
    }

    isReadOnly(): boolean {
        return this._readOnly;
    }

    setPlaceholderText(text: string) {
        this._placeholderText = text;
        this.input.placeholder = text;
    }

    placeholderText(): string {
        return this._placeholderText;
    }

    setEchoMode(mode: QLineEdit.EchoMode) {
        this._echoMode = mode;
        switch (mode) {
            case QLineEdit.EchoMode.Normal:
                this.input.type = 'text';
                break;
            case QLineEdit.EchoMode.Password:
                this.input.type = 'password';
                break;
            case QLineEdit.EchoMode.NoEcho:
                this.input.type = 'password';
                (this.input.style as any).webkitTextSecurity = 'disc';
                break;
            case QLineEdit.EchoMode.PasswordEchoOnEdit:
                this.input.type = 'password';
                break;
        }
    }

    clear() {
        this.setText('');
    }

    selectAll() {
        this.input.select();
    }
}

export namespace QLineEdit {
    export enum EchoMode {
        Normal,
        NoEcho,
        Password,
        PasswordEchoOnEdit
    }
}
