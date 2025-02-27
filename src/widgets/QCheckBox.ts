import { QWidget } from './QWidget';
import { Qt } from '../core/Qt';

export class QCheckBox extends QWidget {
    protected checkbox: HTMLInputElement;
    protected label: HTMLLabelElement;
    protected _text: string = '';
    protected _tristate: boolean = false;
    protected _checkState: number = Qt.CheckState.Unchecked;

    constructor(text: string = '', parent: QWidget | null = null) {
        super(parent);
        this.element = document.createElement('div');
        this.checkbox = document.createElement('input');
        this.label = document.createElement('label');
        this.initializeCheckBox();
        this.setText(text);
    }

    private initializeCheckBox() {
        this.checkbox.type = 'checkbox';
        this.element.appendChild(this.checkbox);
        this.element.appendChild(this.label);

        this.checkbox.addEventListener('change', () => {
            this._checkState = this.checkbox.checked ? 
                Qt.CheckState.Checked : Qt.CheckState.Unchecked;
            this.emit('stateChanged', this._checkState);
            this.emit('toggled', this.isChecked());
        });
    }

    setText(text: string) {
        this._text = text;
        this.label.textContent = text;
    }

    text(): string {
        return this._text;
    }

    setCheckState(state: number) {
        this._checkState = state;
        this.checkbox.checked = state === Qt.CheckState.Checked;
        this.checkbox.indeterminate = state === Qt.CheckState.PartiallyChecked;
        this.emit('stateChanged', state);
    }

    checkState(): number {
        return this._checkState;
    }

    setTristate(tristate: boolean = true) {
        this._tristate = tristate;
    }

    isTristate(): boolean {
        return this._tristate;
    }

    setChecked(checked: boolean) {
        this.setCheckState(checked ? Qt.CheckState.Checked : Qt.CheckState.Unchecked);
    }

    isChecked(): boolean {
        return this._checkState === Qt.CheckState.Checked;
    }

    toggle() {
        this.setChecked(!this.isChecked());
    }
}
