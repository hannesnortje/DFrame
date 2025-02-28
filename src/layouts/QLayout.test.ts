import { QLayout } from './QLayout';
import { QWidget } from '../widgets/QWidget';
import { Qt } from '../core/Qt';

class TestLayout extends QLayout {
    addWidget(widget: QWidget, stretchOrOptions?: number | any, alignment?: number): void {
        this.widgets.push({ widget, stretch: stretchOrOptions || 0, alignment: alignment || 0 });
        this.update();
    }

    update(): void {
        // Mock update method
    }

    minimumSize(): { width: number; height: number } {
        return { width: 0, height: 0 };
    }

    sizeHint(): { width: number; height: number } {
        return { width: 0, height: 0 };
    }
}

describe('QLayout', () => {
    let layout: TestLayout;
    let parentWidget: QWidget;

    beforeEach(() => {
        parentWidget = new QWidget();
        layout = new TestLayout(parentWidget);
    });

    test('should set parent widget correctly', () => {
        expect(layout.getParentWidget()).toBe(parentWidget);
    });

    test('should add widget correctly', () => {
        const widget = new QWidget();
        layout.addWidget(widget, 1, Qt.AlignmentFlag.AlignCenter);
        expect(layout.widgets.length).toBe(1);
        expect(layout.widgets[0].widget).toBe(widget);
        expect(layout.widgets[0].stretch).toBe(1);
        expect(layout.widgets[0].alignment).toBe(Qt.AlignmentFlag.AlignCenter);
    });

    test('should add nested layout correctly', () => {
        const nestedLayout = new TestLayout();
        layout.addLayout(nestedLayout);
        expect(layout.childLayouts.length).toBe(1);
        expect(layout.childLayouts[0]).toBe(nestedLayout);
        expect(nestedLayout.getParentWidget()).toBe(parentWidget);
    });

    test('should set contents margins correctly', () => {
        layout.setContentsMargins(10, 20, 30, 40);
        expect(layout.margin).toBe(40);
    });

    test('should set size constraint correctly', () => {
        layout.setSizeConstraint(Qt.SizeConstraint.SetFixedSize);
        expect(layout.sizeConstraint).toBe(Qt.SizeConstraint.SetFixedSize);
    });
});