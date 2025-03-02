import { QObject } from '../core/QObject';
import { QWidget } from '../core/QWidget';

export enum Direction {
    LeftToRight,
    RightToLeft,
    TopToBottom,
    BottomToTop
}

interface LayoutItem {
    widget: QWidget;
    stretch: number;
    alignment: number;
}

export class QBoxLayout extends QObject {
    private direction: Direction;
    private items: LayoutItem[] = [];
    private spacing: number = 6;
    private margin: number = 9;
    private sizeConstraint: number = 0;

    constructor(direction: Direction) {
        super();
        this.direction = direction;
    }

    addWidget(widget: QWidget, stretch: number = 0, alignment: number = 0): void {
        this.items.push({ widget, stretch, alignment });
        this.emit('layoutChanged');
    }

    insertWidget(index: number, widget: QWidget, stretch: number = 0, alignment: number = 0): void {
        this.items.splice(index, 0, { widget, stretch, alignment });
        this.emit('layoutChanged');
    }

    removeWidget(widget: QWidget): void {
        const index = this.items.findIndex(item => item.widget === widget);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.emit('layoutChanged');
        }
    }

    setSpacing(spacing: number): void {
        if (this.spacing !== spacing) {
            this.spacing = spacing;
            this.emit('layoutChanged');
        }
    }

    getSpacing(): number {
        return this.spacing;
    }

    setMargin(margin: number): void {
        if (this.margin !== margin) {
            this.margin = margin;
            this.emit('layoutChanged');
        }
    }

    getMargin(): number {
        return this.margin;
    }

    setDirection(direction: Direction): void {
        if (this.direction !== direction) {
            this.direction = direction;
            this.emit('layoutChanged');
        }
    }

    getDirection(): Direction {
        return this.direction;
    }

    count(): number {
        return this.items.length;
    }

    itemAt(index: number): LayoutItem | null {
        return this.items[index] || null;
    }
}
