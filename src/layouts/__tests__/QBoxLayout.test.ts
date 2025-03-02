import { QBoxLayout, Direction } from '../QBoxLayout';
import { QWidget } from '../../core/QWidget';

describe('QBoxLayout', () => {
    let layout: QBoxLayout;

    beforeEach(() => {
        layout = new QBoxLayout(Direction.LeftToRight);
    });

    test('constructor initializes with direction', () => {
        expect(layout['direction']).toBe(Direction.LeftToRight);
    });

    test('addWidget adds widget and emits signal', () => {
        const mockFn = jest.fn();
        const widget = new QWidget();
        
        layout.connect('layoutChanged', mockFn);
        layout.addWidget(widget);
        
        expect(layout['items'].map(item => item.widget)).toContain(widget);
        expect(mockFn).toHaveBeenCalled();
    });

    test('multiple widgets can be added', () => {
        const widget1 = new QWidget();
        const widget2 = new QWidget();
        
        layout.addWidget(widget1);
        layout.addWidget(widget2);
        
        const widgetList = layout['items'].map(item => item.widget);
        expect(widgetList).toContain(widget1);
        expect(widgetList).toContain(widget2);
    });

    test('spacing management', () => {
        const mockFn = jest.fn();
        layout.connect('layoutChanged', mockFn);
        
        expect(layout.getSpacing()).toBe(6); // Default spacing
        
        layout.setSpacing(10);
        expect(layout.getSpacing()).toBe(10);
        expect(mockFn).toHaveBeenCalled();
        
        // Setting same spacing should not emit
        mockFn.mockClear();
        layout.setSpacing(10);
        expect(mockFn).not.toHaveBeenCalled();
    });

    test('margin management', () => {
        const mockFn = jest.fn();
        layout.connect('layoutChanged', mockFn);
        
        expect(layout.getMargin()).toBe(9); // Default margin
        
        layout.setMargin(20);
        expect(layout.getMargin()).toBe(20);
        expect(mockFn).toHaveBeenCalled();
    });

    test('direction management', () => {
        const mockFn = jest.fn();
        layout.connect('layoutChanged', mockFn);
        
        expect(layout.getDirection()).toBe(Direction.LeftToRight);
        
        layout.setDirection(Direction.TopToBottom);
        expect(layout.getDirection()).toBe(Direction.TopToBottom);
        expect(mockFn).toHaveBeenCalled();
    });

    test('widget insertion and removal', () => {
        const widget1 = new QWidget();
        const widget2 = new QWidget();
        const mockFn = jest.fn();
        layout.connect('layoutChanged', mockFn);
        
        layout.insertWidget(0, widget1, 1, 0);
        expect(layout.itemAt(0)?.widget).toBe(widget1);
        expect(layout.itemAt(0)?.stretch).toBe(1);
        
        layout.addWidget(widget2, 2, 0);
        expect(layout.count()).toBe(2);
        expect(layout.itemAt(1)?.widget).toBe(widget2);
        expect(layout.itemAt(1)?.stretch).toBe(2);
        
        layout.removeWidget(widget1);
        expect(layout.count()).toBe(1);
        expect(layout.itemAt(0)?.widget).toBe(widget2);
    });

    test('layout constraints', () => {
        const widget = new QWidget();
        widget.setMinimumSize({ width: 100, height: 100 });
        widget.setMaximumSize({ width: 200, height: 200 });
        
        layout.addWidget(widget);
        expect(layout.itemAt(0)?.widget.getGeometry().width).toBeGreaterThanOrEqual(100);
        expect(layout.itemAt(0)?.widget.getGeometry().width).toBeLessThanOrEqual(200);
    });

    test('null handling', () => {
        expect(layout.itemAt(-1)).toBeNull();
        expect(layout.itemAt(999)).toBeNull();
        
        const widget = new QWidget();
        layout.addWidget(widget);
        layout.removeWidget(new QWidget()); // Should not throw
        expect(layout.count()).toBe(1);
    });
});
