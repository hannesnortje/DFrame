import { QWidget } from '../widgets/QWidget';
import { Qt } from '../core/Qt';

export interface QLayoutItem {
    widget: QWidget;
    stretch: number;
    alignment: number;
}

export abstract class QLayout {
    protected widgets: QLayoutItem[] = [];
    protected parent: QWidget | null = null;
    protected margin: number = 0;
    protected spacing: number = 0;
    protected sizeConstraint: number = Qt.SizeConstraint.SetDefaultConstraint;
    protected childLayouts: QLayout[] = []; // Added to track nested layouts

    constructor(parent?: QWidget) {
        if (parent) {
            this.setParent(parent);
        } else {
            this.parent = new QWidget(null);
        }
    }

    addWidget(widget: QWidget, stretch: number = 0, alignment: number = Qt.Alignment.AlignLeft) {
        const widgetItem: QLayoutItem = { widget, stretch, alignment };
        this.widgets.push(widgetItem);
        if (this.parent) {
            this.parent.getElement().appendChild(widget.getElement());
        }
        this.update();
    }

    // Added method to support adding nested layouts
    addLayout(layout: QLayout): void {
        if (this.parent) {
            layout.setParent(this.parent);
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

    setParent(parent: QWidget) {
        this.parent = parent;
        this.update();
    }

    getParentElement(): HTMLElement | null {
        return this.parent ? this.parent.getElement() : null;
    }

    getParentWidget(): QWidget {
        return this.parent!;
    }

    abstract update(): void;
    abstract minimumSize(): { width: number; height: number };
    abstract sizeHint(): { width: number; height: number };
}
