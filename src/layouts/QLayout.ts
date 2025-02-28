import { QObject } from '../core/QObject';
import { QWidget } from '../widgets/QWidget';
import { Qt } from '../core/Qt';

export interface QLayoutItem {
    widget: QWidget;
    stretch: number;
    alignment: number;
}

export abstract class QLayout extends QObject {
    protected widgets: QLayoutItem[] = [];
    protected parentWidget: QWidget | null = null;
    protected margin: number = 0;
    protected spacing: number = 0;
    protected sizeConstraint: number = Qt.SizeConstraint.SetDefaultConstraint;
    protected childLayouts: QLayout[] = []; // Added to track nested layouts

    // Improve parent widget handling in constructor
    constructor(parent?: QWidget) {
        super();
        if (parent) {
            // Delay setting parent widget until after construction to avoid race conditions
            setTimeout(() => {
                this.setParentWidget(parent);
            }, 0);
        }
    }

    // Updated addWidget method signature to be compatible with QVBoxLayout
    abstract addWidget(widget: QWidget, stretchOrOptions?: number | any, alignment?: number): void;

    // Added method to support adding nested layouts
    addLayout(layout: QLayout): void {
        if (this.parentWidget) {
            layout.setParentWidget(this.parentWidget);
            this.childLayouts.push(layout);
            this.update();
        }
    }

    setContentsMargins(left: number, top: number, right: number, bottom: number) {
        this.margin = Math.max(left, top, right, bottom);
        this.update();
    }

    setSizeConstraint(constraint: number) {
        this.sizeConstraint = constraint;
        this.update();
    }

    setParentWidget(widget: QWidget): void {
        this.parentWidget = widget;
        if (widget) {
            this.update();
        }
    }

    getParentElement(): HTMLElement | null {
        return this.parentWidget ? this.parentWidget.getElement() : null;
    }

    getParentWidget(): QWidget | null {
        return this.parentWidget;
    }

    abstract update(): void;
    abstract minimumSize(): { width: number; height: number };
    abstract sizeHint(): { width: number; height: number };
}
