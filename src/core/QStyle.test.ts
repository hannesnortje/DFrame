import { QSize } from './QStyle';

describe('QSize', () => {
    it('should create an instance with given width and height', () => {
        const width = 100;
        const height = 200;
        const size = new QSize(width, height);

        expect(size.width).toBe(width);
        expect(size.height).toBe(height);
    });

    it('should have width and height as read-only properties', () => {
        const size = new QSize(100, 200);

        expect(() => {
            (size as any).width = 300;
        }).toThrowError(TypeError);

        expect(() => {
            (size as any).height = 400;
        }).toThrowError(TypeError);
    });
});