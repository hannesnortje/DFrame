import { QWidget } from './QWidget';
import { Qt } from '../core/Qt';

export class QLabel extends QWidget {
    protected _text: string = '';
    protected _textFormat: number = Qt.TextFormat.PlainText;
    protected _alignment: number = Qt.Alignment.AlignLeft;
    protected _wordWrap: boolean = false;
    protected _indent: number = -1;
    protected _margin: number = 0;

    constructor(text: string = '', parent: QWidget | null = null) {
        super(parent);
        this.element = document.createElement('div');
        this.initializeLabel();
        this.setText(text);
    }

    private initializeLabel() {
        this.element.style.position = 'relative';
        this.element.style.whiteSpace = 'pre';
        this.updateAlignment();
    }

    setText(text: string) {
        this._text = text;
        if (this._textFormat === Qt.TextFormat.PlainText) {
            this.element.textContent = text;
        } else {
            this.element.innerHTML = text;
        }
    }

    text(): string {
        return this._text;
    }

    setTextFormat(format: number) {
        this._textFormat = format;
        this.setText(this._text); // Refresh with new format
    }

    setAlignment(alignment: number) {
        this._alignment = alignment;
        this.updateAlignment();
    }

    setWordWrap(on: boolean) {
        this._wordWrap = on;
        this.element.style.whiteSpace = on ? 'normal' : 'pre';
        this.element.style.overflowWrap = on ? 'break-word' : 'normal';
    }

    setIndent(indent: number) {
        this._indent = indent;
        if (indent >= 0) {
            this.element.style.textIndent = `${indent}px`;
        }
    }

    setMargin(margin: number) {
        this._margin = margin;
        this.element.style.margin = `${margin}px`;
    }

    private updateAlignment() {
        let textAlign = 'left';
        if (this._alignment & Qt.Alignment.AlignHCenter) {
            textAlign = 'center';
        } else if (this._alignment & Qt.Alignment.AlignRight) {
            textAlign = 'right';
        }
        this.element.style.textAlign = textAlign;
    }
}
