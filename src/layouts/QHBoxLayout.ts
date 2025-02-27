import { QLayout, QLayoutItem } from './QLayout';
import { QWidget } from '../widgets/QWidget';

export class QHBoxLayout extends QLayout {
    protected spacing: number = 5;

    update() {
        let currentX = 0;
        
        // Update widgets
        for (const item of this.widgets) {
            const element = item.widget.getElement();
            element.style.position = 'relative';
            element.style.top = '0';
            element.style.left = `${currentX}px`;
            element.style.height = '100%';
            currentX += element.offsetWidth + this.spacing;
        }
        
        // Update child layouts
        for (const childLayout of this.childLayouts) {
            childLayout.update();
        }
    }

    minimumSize(): { width: number; height: number } {
        return { width: 0, height: 0 };
    }

    sizeHint(): { width: number; height: number } {
        return { width: 200, height: 100 };
    }

    setSpacing(spacing: number) {
        this.spacing = spacing;
        this.update();
    }

    removeWidget(widget: QWidget) {
        const index = this.widgets.findIndex(item => item.widget === widget);
        if (index !== -1) {
            const item = this.widgets[index];
            this.widgets.splice(index, 1);
            this.parent?.getElement().removeChild(item.widget.getElement());
            this.update();
        }
    }

    clear() {
        this.widgets.forEach(item => {
            this.parent?.getElement().removeChild(item.widget.getElement());
        });
        this.widgets = [];
        // Also clear child layouts
        this.childLayouts = [];
        this.update();
    }
}
