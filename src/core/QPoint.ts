export class QPoint {
    constructor(
        private x: number = 0,
        private y: number = 0
    ) {}

    isNull(): boolean {
        return this.x === 0 && this.y === 0;
    }

    manhattanLength(): number {
        return Math.abs(this.x) + Math.abs(this.y);
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    setX(x: number): void {
        this.x = x;
    }

    setY(y: number): void {
        this.y = y;
    }

    add(other: QPoint): QPoint {
        return new QPoint(this.x + other.x, this.y + other.y);
    }

    subtract(other: QPoint): QPoint {
        return new QPoint(this.x - other.x, this.y - other.y);
    }

    multiply(factor: number): QPoint {
        return new QPoint(this.x * factor, this.y * factor);
    }

    divide(divisor: number): QPoint {
        if (divisor === 0) throw new Error('Division by zero');
        return new QPoint(this.x / divisor, this.y / divisor);
    }
}
