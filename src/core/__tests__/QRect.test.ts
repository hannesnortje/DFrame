import { QRect } from '../QRect';
import { QPoint } from '../QPoint';

describe('QRect', () => {
    test('constructor initializes with default values', () => {
        const rect = new QRect();
        expect(rect.isNull()).toBeTruthy();
        expect(rect.isEmpty()).toBeTruthy();
        expect(rect.isValid()).toBeFalsy();
    });

    test('contains checks point containment', () => {
        const rect = new QRect(0, 0, 100, 100);
        
        // Non-proper containment
        expect(rect.contains(new QPoint(0, 0))).toBeTruthy();
        expect(rect.contains(new QPoint(100, 100))).toBeTruthy();
        expect(rect.contains(new QPoint(50, 50))).toBeTruthy();
        expect(rect.contains(new QPoint(-1, 50))).toBeFalsy();
        
        // Proper containment
        expect(rect.contains(new QPoint(0, 0), true)).toBeFalsy();
        expect(rect.contains(new QPoint(50, 50), true)).toBeTruthy();
    });

    test('intersection operations work correctly', () => {
        const rect1 = new QRect(0, 0, 100, 100);
        const rect2 = new QRect(50, 50, 100, 100);
        const rect3 = new QRect(200, 200, 100, 100);
        
        expect(rect1.intersects(rect2)).toBeTruthy();
        expect(rect1.intersects(rect3)).toBeFalsy();
        
        const intersection = rect1.intersected(rect2);
        expect(intersection.getTopLeft().getX()).toBe(50);
        expect(intersection.getTopLeft().getY()).toBe(50);
        expect(intersection.getSize().getWidth()).toBe(50);
        expect(intersection.getSize().getHeight()).toBe(50);
    });

    test('union operation works correctly', () => {
        const rect1 = new QRect(0, 0, 100, 100);
        const rect2 = new QRect(50, 50, 100, 100);
        
        const union = rect1.united(rect2);
        expect(union.getTopLeft().getX()).toBe(0);
        expect(union.getTopLeft().getY()).toBe(0);
        expect(union.getSize().getWidth()).toBe(150);
        expect(union.getSize().getHeight()).toBe(150);
    });
});
