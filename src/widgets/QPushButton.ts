import { QWidget } from '../core/QWidget';

export class QPushButton extends QWidget {
    private text: string;
    private icon: string | null = null;
    private checkable: boolean = false;
    private checked: boolean = false;
    private autoRepeat: boolean = false;
    private flat: boolean = false;

    constructor(text: string = '', parent: QWidget | null = null) {
        super(parent);
        this.text = text;
    }

    setText(text: string): void {
        if (this.text !== text) {
            this.text = text;
            this.emit('textChanged', text);
        }
    }

    getText(): string {
        return this.text;
    }

    setIcon(iconUrl: string): void {
        if (this.icon !== iconUrl) {
            this.icon = iconUrl;
            this.emit('iconChanged', iconUrl);
        }
    }

    getIcon(): string | null {
        return this.icon;
    }

    setCheckable(checkable: boolean): void {
        if (this.checkable !== checkable) {
            this.checkable = checkable;
            if (!checkable) {
                this.checked = false;  // Reset checked state when making non-checkable
            }
            this.emit('checkableChanged', checkable);
        }
    }

    isCheckable(): boolean {
        return this.checkable;
    }

    setChecked(checked: boolean): void {
        if (this.checkable && this.checked !== checked) {
            this.checked = checked;
            this.emit('toggled', checked);
        }
    }

    isChecked(): boolean {
        return this.checked;
    }

    setAutoRepeat(repeat: boolean): void {
        if (this.autoRepeat !== repeat) {
            this.autoRepeat = repeat;
            this.emit('autoRepeatChanged', repeat);
        }
    }

    setFlat(flat: boolean): void {
        if (this.flat !== flat) {
            this.flat = flat;
            this.emit('flatChanged', flat);
        }
    }

    isFlat(): boolean {
        return this.flat;
    }

    click(): void {
        if (this.isEnabled()) {
            this.emit('clicked');
            if (this.checkable) {
                this.setChecked(!this.checked);
            }
        }
    }
}
