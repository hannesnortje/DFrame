import { QPoint } from './QPoint';
import { QSize } from './QSize';

export class QRect {
    constructor(
        private x: number = 0,
        private y: number = 0,
        private width: number = 0,
        private height: number = 0
    ) {}

    isEmpty(): boolean {
        return this.width <= 0 || this.height <= 0;
    }

    isValid(): boolean {
        return this.width > 0 && this.height > 0;
    }

    isNull(): boolean {
        return this.width === 0 && this.height === 0;
    }

    contains(point: QPoint, proper: boolean = false): boolean {
        const x = point.getX();
        const y = point.getY();
        if (proper) {
            return x > this.x && x < this.x + this.width &&
                   y > this.y && y < this.y + this.height;
        }
        return x >= this.x && x <= this.x + this.width &&
               y >= this.y && y <= this.y + this.height;
    }

    intersects(other: QRect): boolean {
        return !(this.x > other.x + other.width ||
                this.x + this.width < other.x ||
                this.y > other.y + other.height ||
                this.y + this.height < other.y);
    }

    united(other: QRect): QRect {
        const minX = Math.min(this.x, other.x);
        const minY = Math.min(this.y, other.y);
        const maxX = Math.max(this.x + this.width, other.x + other.width);
        const maxY = Math.max(this.y + this.height, other.y + other.height);
        return new QRect(minX, minY, maxX - minX, maxY - minY);
    }

    intersected(other: QRect): QRect {
        if (!this.intersects(other)) return new QRect();
        const maxX = Math.min(this.x + this.width, other.x + other.width);
        const maxY = Math.min(this.y + this.height, other.y + other.height);
        const minX = Math.max(this.x, other.x);
        const minY = Math.max(this.y, other.y);
        return new QRect(minX, minY, maxX - minX, maxY - minY);
    }

    getTopLeft(): QPoint {
        return new QPoint(this.x, this.y);
    }

    getSize(): QSize {
        return new QSize(this.width, this.height);
    }
}
