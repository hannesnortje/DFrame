import { QWidget } from './QWidget';
import { QStyle } from '../core/QStyle';

export class QPushButton extends QWidget {
    protected _checkable: boolean = false;
    protected _checked: boolean = false;
    protected _autoRepeat: boolean = false;
    protected _autoRepeatDelay: number = 300;
    protected _autoRepeatInterval: number = 100;
    protected _autoRepeatTimer: number | null = null;

    constructor(text: string = '', parent: QWidget | null = null) {
        super(parent);
        this.element = document.createElement('button');
        this.setText(text);
        this.setStyle({
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            transition: 'background-color 0.2s, transform 0.1s',
            width: 'auto',
            margin: '4px'
        });

        this.element.addEventListener('mouseover', () => {
            this.setStyle({ backgroundColor: '#0056b3' });
        });

        this.element.addEventListener('mouseout', () => {
            this.setStyle({ backgroundColor: '#007bff' });
        });

        this.element.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.element.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.element.addEventListener('mouseleave', () => this.handleMouseLeave());
        this.element.addEventListener('click', () => this.handleClick());
    }

    private handleMouseDown(e: MouseEvent) {
        if (this._autoRepeat) {
            this.emit('clicked', undefined);
            this._autoRepeatTimer = window.setTimeout(() => {
                this._autoRepeatTimer = window.setInterval(() => {
                    this.emit('clicked', undefined);
                }, this._autoRepeatInterval);
            }, this._autoRepeatDelay);
        }
        this.emit('pressed', e);
    }

    private handleMouseUp(e: MouseEvent) {
        if (this._autoRepeat) {
            this.stopAutoRepeat();
        }
        this.emit('released', e);
    }

    private handleMouseLeave() {
        if (this._autoRepeat) {
            this.stopAutoRepeat();
        }
    }

    private handleClick() {
        if (this._checkable) {
            this.toggle();
        }
        this.emit('clicked', void 0);
    }

    private startAutoRepeat() {
        if (this._autoRepeatTimer === null) {
            this.emit('clicked', void 0);
            this._autoRepeatTimer = window.setTimeout(() => {
                this._autoRepeatTimer = window.setInterval(() => {
                    this.emit('clicked', void 0);
                }, this._autoRepeatInterval);
            }, this._autoRepeatDelay);
        }
    }

    private stopAutoRepeat() {
        if (this._autoRepeatTimer !== null) {
            clearInterval(this._autoRepeatTimer);
            this._autoRepeatTimer = null;
        }
    }

    setCheckable(checkable: boolean) {
        this._checkable = checkable;
        if (!checkable) {
            this.setChecked(false);
        }
    }

    isCheckable(): boolean {
        return this._checkable;
    }

    setChecked(checked: boolean) {
        if (this._checkable && this._checked !== checked) {
            this._checked = checked;
            this.updateCheckState();
            this.emit('toggled', checked);
        }
    }

    isChecked(): boolean {
        return this._checked;
    }

    toggle() {
        if (this._checkable) {
            this.setChecked(!this._checked);
        }
    }

    setAutoRepeat(enable: boolean) {
        this._autoRepeat = enable;
        if (!enable) {
            this.stopAutoRepeat();
        }
    }

    setAutoRepeatDelay(delay: number) {
        this._autoRepeatDelay = delay;
    }

    setAutoRepeatInterval(interval: number) {
        this._autoRepeatInterval = interval;
    }

    private updateCheckState() {
        if (this._checked) {
            this.element.classList.add('checked');
            QStyle.applyStyle(this.element, {
                backgroundColor: '#005cbf',
                border: '1px solid #005cbf'
            });
        } else {
            this.element.classList.remove('checked');
            QStyle.applyStyle(this.element, {
                backgroundColor: '#007bff',
                border: '1px solid #007bff'
            });
        }
    }

    setText(text: string) {
        this.element.textContent = text;
    }

    text(): string {
        return this.element.textContent || '';
    }

    setButtonType(type: 'button' | 'submit' | 'reset') {
        (this.element as HTMLButtonElement).type = type;
    }
}
