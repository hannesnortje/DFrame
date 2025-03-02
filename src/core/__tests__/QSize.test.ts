import { QSize, AspectRatioMode } from '../QSize';

describe('QSize', () => {
    test('constructor initializes with default values', () => {
        const size = new QSize();
        expect(size.getWidth()).toBe(0);
        expect(size.getHeight()).toBe(0);
        expect(size.isNull()).toBeTruthy();
    });

    test('isEmpty and isValid work correctly', () => {
        const size1 = new QSize(-1, 10);
        const size2 = new QSize(10, 10);
        
        expect(size1.isEmpty()).toBeTruthy();
        expect(size1.isValid()).toBeFalsy();
        
        expect(size2.isEmpty()).toBeFalsy();
        expect(size2.isValid()).toBeTruthy();
    });

    test('scale respects aspect ratio modes', () => {
        const size = new QSize(100, 50);
        
        // IgnoreAspectRatio
        const size1 = new QSize(100, 50);
        size1.scale(50, 50, AspectRatioMode.IgnoreAspectRatio);
        expect(size1.getWidth()).toBe(50);
        expect(size1.getHeight()).toBe(50);
        
        // KeepAspectRatio
        const size2 = new QSize(100, 50);
        size2.scale(50, 50, AspectRatioMode.KeepAspectRatio);
        expect(size2.getWidth()).toBe(50);
        expect(size2.getHeight()).toBe(25);
    });

    test('expandedTo returns larger dimensions', () => {
        const size1 = new QSize(100, 50);
        const size2 = new QSize(50, 100);
        const result = size1.expandedTo(size2);
        
        expect(result.getWidth()).toBe(100);
        expect(result.getHeight()).toBe(100);
    });

    test('boundedTo returns smaller dimensions', () => {
        const size1 = new QSize(100, 50);
        const size2 = new QSize(50, 100);
        const result = size1.boundedTo(size2);
        
        expect(result.getWidth()).toBe(50);
        expect(result.getHeight()).toBe(50);
    });

    test('transpose swaps width and height', () => {
        const size = new QSize(100, 50);
        size.transpose();
        
        expect(size.getWidth()).toBe(50);
        expect(size.getHeight()).toBe(100);
    });
});
