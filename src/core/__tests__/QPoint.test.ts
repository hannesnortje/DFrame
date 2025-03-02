import { QPoint } from '../QPoint';

describe('QPoint', () => {
    test('constructor initializes with default values', () => {
        const point = new QPoint();
        expect(point.getX()).toBe(0);
        expect(point.getY()).toBe(0);
        expect(point.isNull()).toBeTruthy();
    });

    test('manhattanLength calculates correctly', () => {
        const point1 = new QPoint(3, 4);
        const point2 = new QPoint(-3, -4);
        
        expect(point1.manhattanLength()).toBe(7);
        expect(point2.manhattanLength()).toBe(7);
    });

    test('arithmetic operations work correctly', () => {
        const point1 = new QPoint(10, 20);
        const point2 = new QPoint(5, 10);
        
        const added = point1.add(point2);
        expect(added.getX()).toBe(15);
        expect(added.getY()).toBe(30);
        
        const subtracted = point1.subtract(point2);
        expect(subtracted.getX()).toBe(5);
        expect(subtracted.getY()).toBe(10);
        
        const multiplied = point1.multiply(2);
        expect(multiplied.getX()).toBe(20);
        expect(multiplied.getY()).toBe(40);
        
        const divided = point1.divide(2);
        expect(divided.getX()).toBe(5);
        expect(divided.getY()).toBe(10);
    });

    test('division by zero throws error', () => {
        const point = new QPoint(10, 20);
        expect(() => point.divide(0)).toThrow('Division by zero');
    });
});
