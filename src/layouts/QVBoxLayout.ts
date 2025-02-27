import { QLayout, QLayoutItem } from './QLayout';
import { QWidget } from '../widgets/QWidget';
import { Qt } from '../core/Qt';

export class QVBoxLayout extends QLayout {
    protected spacing: number = 5;

    constructor(parent?: QWidget) {
        super(parent);
        if (this.parent) {
            this.parent.setStyle({
                display: 'flex',
                flexDirection: 'column',
                gap: `${this.spacing}px`,
                width: '100%',
                minHeight: '600px',     // Increased from 300px
                height: 'auto',         // Will adjust to content
                alignItems: 'center',
                padding: '20px',
                overflowY: 'auto'       // Add scrolling if needed
            });
        }
    }

    addWidget(widget: QWidget, stretch: number = 0, alignment: number = 0) {
        if (!this.parent) {
            console.warn('Layout has no parent widget, creating container');
            this.parent = new QWidget(null);
            this.parent.setStyle({
                display: 'flex',
                flexDirection: 'column',
                gap: `${this.spacing}px`,
                width: '100%',
                alignItems: 'center'
            });
        }

        const widgetItem: QLayoutItem = { widget, stretch, alignment };
        this.widgets.push(widgetItem);
        
        widget.setStyle({
            flex: stretch ? `${stretch}` : '0 0 auto',
            alignSelf: this.getAlignmentStyle(alignment),
            minHeight: '40px',          // Added minimum height for widgets
            marginBottom: '10px'        // Added spacing between widgets
        });
        
        this.parent.getElement().appendChild(widget.getElement());
    }

    private getAlignmentStyle(alignment: number): string {
        if (alignment & Qt.Alignment.AlignHCenter) return 'center';
        if (alignment & Qt.Alignment.AlignRight) return 'flex-end';
        return 'flex-start';
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

    update() {
        if (!this.parent) return;

        let totalHeight = 0;
        this.widgets.forEach(item => {
            const element = item.widget.getElement();
            element.style.marginBottom = `${this.spacing}px`;
            totalHeight += (element.offsetHeight || 40) + this.spacing;
        });

        // Add extra padding at the bottom
        totalHeight += 40;

        // Update parent to contain all children (with minimum height)
        const minHeight = 600;
        this.parent.getElement().style.minHeight = `${Math.max(totalHeight, minHeight)}px`;

        // Update child layouts
        for (const childLayout of this.childLayouts) {
            childLayout.update();
        }
    }

    minimumSize(): { width: number; height: number } {
        return { width: 0, height: 0 };
    }

    sizeHint(): { width: number; height: number } {
        return { width: 100, height: 200 };
    }
}
