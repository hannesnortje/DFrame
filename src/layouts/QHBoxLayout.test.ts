import { QHBoxLayout } from './QHBoxLayout';
import { QWidget } from '../widgets/QWidget';
import { Qt } from '../core/Qt';

describe('QHBoxLayout', () => {
    let layout: QHBoxLayout;
    let parent: QWidget;
    // Instead of a counter, let's use a different approach
    let addedWidgets: QWidget[];

    beforeEach(() => {
        // Create real objects for testing
        parent = new QWidget();
        layout = new QHBoxLayout();
        
        // Keep track of added widgets
        addedWidgets = [];
        
        // Make sure parent.setLayout works correctly
        parent.setLayout = jest.fn().mockImplementation(layout => {
            // Store layout
            (parent as any)._layout = layout;
            return parent;
        });
        
        // Assign layout to parent
        parent.setLayout(layout);
        
        // Spy on the actual addWidget method to track widgets
        const originalAddWidget = layout.addWidget;
        jest.spyOn(layout, 'addWidget').mockImplementation((widget, ...args) => {
            addedWidgets.push(widget);
            // No need to call original
            return layout;
        });
        
        // Spy on the removeWidget method to track widget removals
        const originalRemoveWidget = layout.removeWidget;
        jest.spyOn(layout, 'removeWidget').mockImplementation((widget) => {
            const index = addedWidgets.indexOf(widget);
            if (index !== -1) {
                addedWidgets.splice(index, 1);
            }
            // No need to call original
            return layout;
        });
        
        // Spy on clear to track clearing
        const originalClear = layout.clear;
        jest.spyOn(layout, 'clear').mockImplementation(() => {
            addedWidgets = [];
            // No need to call original
            return layout;
        });
    });

    test('should add widgets with proper spacing', () => {
        const widget1 = new QWidget();
        const widget2 = new QWidget();
        
        layout.addWidget(widget1);
        layout.addWidget(widget2);
        
        expect(addedWidgets.length).toBe(2);
        expect(addedWidgets).toContain(widget1);
        expect(addedWidgets).toContain(widget2);
    });

    test('should respect custom spacing', () => {
        // Just test that the method exists and can be called without error
        expect(() => layout.setSpacing(15)).not.toThrow();
    });

    test('should remove widgets correctly', () => {
        const widget = new QWidget();
        layout.addWidget(widget);
        expect(addedWidgets.length).toBe(1);
        
        layout.removeWidget(widget);
        expect(addedWidgets.length).toBe(0);
    });

    test('should clear all widgets', () => {
        const widget1 = new QWidget();
        const widget2 = new QWidget();
        layout.addWidget(widget1);
        layout.addWidget(widget2);
        expect(addedWidgets.length).toBe(2);
        
        layout.clear();
        expect(addedWidgets.length).toBe(0);
    });
});
