import { QWidget } from './QWidget';
import { QDebug } from '../core/QDebug';

// Mock QDebug.applyToWidget to prevent errors during testing
jest.mock('../core/QDebug', () => ({
    QDebug: {
        applyToWidget: jest.fn(),
        isEnabled: () => false,
    }
}));

describe('QWidget', () => {
    let widget: QWidget;

    beforeEach(() => {
        widget = new QWidget();
    });

    test('should set and get visibility', () => {
        widget.setVisible(false);
        expect(widget.isVisible()).toBe(false);
        expect(widget.getElement().style.display).toBe('none');
    });

    test('should set and get enabled state', () => {
        widget.setEnabled(false);
        expect(widget.isEnabled()).toBe(false);
        expect(widget.getElement().style.pointerEvents).toBe('none');
    });

    test('should set geometry', () => {
        widget.setGeometry(10, 20, 100, 200);
        const style = widget.getElement().style;
        expect(style.left).toBe('10px');
        expect(style.top).toBe('20px');
        expect(style.width).toBe('100px');
        expect(style.height).toBe('200px');
    });

    test('should handle style properties', () => {
        widget.setStyle({ backgroundColor: 'red' });
        expect(widget.getElement().style.backgroundColor).toBe('red');
    });
});
