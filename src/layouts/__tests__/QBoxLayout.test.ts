import { QBoxLayout, Direction } from '../QBoxLayout';
import { QWidget } from '../../core/QWidget';
import { QRect } from '../../core/QRect';

describe('QBoxLayout', () => {
    describe('Constructors and accessors', () => {
        test('constructor creates a layout with default settings', () => {
            const layout = new QBoxLayout();
            
            // Access properties through index accessor for testing
            expect(layout['direction']).toBe(Direction.LeftToRight);
            expect(layout['items'].length).toBe(0); // Fixed: _items -> items
        });
    });
    
    describe('Widget and item management', () => {
        test('addWidget adds a widget to the layout', () => {
            const layout = new QBoxLayout();
            const widget = new QWidget();
            const mockFn = jest.fn();
            
            layout.connect('layoutChanged', mockFn);
            layout.addWidget(widget);
            
            expect(mockFn).toHaveBeenCalled();
            expect(layout['items'].map(item => item.widget)).toContain(widget);
        });
        
        test('addWidget with stretch and alignment', () => {
            const layout = new QBoxLayout();
            const widget1 = new QWidget();
            const widget2 = new QWidget();
            
            layout.addWidget(widget1, 1);
            layout.addWidget(widget2, 2, 0);
            
            const widgetList = layout['items'].map(item => item.widget);
            expect(widgetList).toEqual([widget1, widget2]);
        });
    });
    
    describe('Spacing', () => {
        test('setSpacing changes spacing property', () => {
            const layout = new QBoxLayout();
            const mockFn = jest.fn();
            
            layout.connect('layoutChanged', mockFn);
            
            expect(layout.getSpacing()).toBe(6); // Default spacing
            layout.setSpacing(10);
            expect(mockFn).toHaveBeenCalled();
            expect(layout.getSpacing()).toBe(10);
        });
    });
    
    describe('Margin', () => {
        test('setMargin changes margin property', () => {
            const layout = new QBoxLayout();
            const mockFn = jest.fn();
            
            layout.connect('layoutChanged', mockFn);
            
            expect(layout.getMargin()).toBe(9); // Default margin
            layout.setMargin(20);
            expect(mockFn).toHaveBeenCalled();
            expect(layout.getMargin()).toBe(20);
        });
    });
    
    describe('Direction', () => {
        test('setDirection changes direction property', () => {
            const layout = new QBoxLayout();
            const mockFn = jest.fn();
            
            layout.connect('layoutChanged', mockFn);
            
            expect(layout.getDirection()).toBe(Direction.LeftToRight);
            layout.setDirection(Direction.TopToBottom);
            expect(layout.getDirection()).toBe(Direction.TopToBottom);
            expect(mockFn).toHaveBeenCalled();
        });
    });
    
    describe('Item manipulation', () => {
        test('insertWidget inserts a widget at specified position', () => {
            const layout = new QBoxLayout();
            const widget1 = new QWidget();
            const widget2 = new QWidget();
            const mockFn = jest.fn();
            
            layout.connect('layoutChanged', mockFn);
            layout.addWidget(widget2, 2);
            
            layout.insertWidget(0, widget1, 1, 0);
            expect(layout.itemAt(0)?.widget).toBe(widget1);
            expect(layout.itemAt(0)?.stretch).toBe(1);
            expect(mockFn).toHaveBeenCalled();
            
            expect(layout.count()).toBe(2);
            expect(layout.itemAt(1)?.widget).toBe(widget2);
            expect(layout.itemAt(1)?.stretch).toBe(2);
            
            layout.removeWidget(widget1);
            expect(layout.count()).toBe(1);
            expect(layout.itemAt(0)?.widget).toBe(widget2);
        });
    });
    
    describe('Layout update', () => {
        test('update adjusts widget geometries', () => {
            // Create parent widget with specific size
            const parentWidget = new QWidget();
            parentWidget.setGeometry(new QRect(0, 0, 300, 200));
            
            // Set maximum size to force constraint
            const childWidget = new QWidget();
            childWidget.setMaximumSize({ width: 200, height: 200 }); // Explicitly set max size
            
            const layout = new QBoxLayout();
            layout.addWidget(childWidget);
            layout.setParentWidget(parentWidget);
            
            // Now check that it respects the max size constraint
            expect(layout.itemAt(0)?.widget.getGeometry().width).toBeGreaterThanOrEqual(100);
            expect(layout.itemAt(0)?.widget.getGeometry().width).toBeLessThanOrEqual(200);
        });
        
        test('itemAt with invalid index', () => {
            const layout = new QBoxLayout();
            layout.addWidget(new QWidget());
            expect(layout.itemAt(-1)).toBeNull();
            expect(layout.itemAt(999)).toBeNull();
        });
        
        test('removeWidget with widget not in layout', () => {
            const layout = new QBoxLayout();
            layout.addWidget(new QWidget());
            layout.removeWidget(new QWidget()); // Should not throw
            expect(layout.count()).toBe(1);
        });
    });
});
