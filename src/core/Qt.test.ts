import { Qt } from './Qt';

describe('Qt Enum Tests', () => {
    test('Qt.LayoutDirection.RightToLeft should be 1', () => {
        expect(Qt.LayoutDirection.RightToLeft).toBe(1);
    });
});