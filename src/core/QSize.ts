export class QSize {
    constructor(
        private width: number = 0,
        private height: number = 0
    ) {}

    isEmpty(): boolean {
        return this.width <= 0 || this.height <= 0;
    }

    isValid(): boolean {
        return this.width >= 0 && this.height >= 0;
    }

    isNull(): boolean {
        return this.width === 0 && this.height === 0;
    }

    scale(width: number, height: number, mode: AspectRatioMode): void {
        if (mode === AspectRatioMode.IgnoreAspectRatio) {
            this.width = width;
            this.height = height;
        } else {
            const ratio = Math.min(width / this.width, height / this.height);
            this.width = Math.floor(this.width * ratio);
            this.height = Math.floor(this.height * ratio);
        }
    }

    expandedTo(other: QSize): QSize {
        return new QSize(
            Math.max(this.width, other.width),
            Math.max(this.height, other.height)
        );
    }

    boundedTo(other: QSize): QSize {
        return new QSize(
            Math.min(this.width, other.width),
            Math.min(this.height, other.height)
        );
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    setWidth(width: number): void {
        this.width = width;
    }

    setHeight(height: number): void {
        this.height = height;
    }

    transpose(): void {
        [this.width, this.height] = [this.height, this.width];
    }
}

export enum AspectRatioMode {
    IgnoreAspectRatio,
    KeepAspectRatio,
    KeepAspectRatioByExpanding
}
