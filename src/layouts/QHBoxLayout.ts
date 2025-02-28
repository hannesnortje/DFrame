import { QLayout } from './QLayout';
import { QWidget } from '../widgets/QWidget';
import { QStyle } from '../core/QStyle';
import { Qt } from '../core/Qt';

interface WidgetOptions {
    alignment?: number;
    stretch?: number;
}

interface WidgetEntry {
    widget: QWidget;
    options?: WidgetOptions;
}

export class QHBoxLayout extends QLayout {
    private _widgets: WidgetEntry[] = [];
    private _spacing: number = 10;
    private _contentsMargins = { top: 0, right: 0, bottom: 0, left: 0 };

    constructor(parent?: QWidget) {
        super(parent);
        this.initLayout();
    }

    private initLayout() {
        if (this.getParentWidget()) {
            QStyle.applyStyle(this.getParentWidget()!.getElement(), {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center', // Default vertical alignment
                boxSizing: 'border-box'
            });
        }
    }

    // Implement the abstract addWidget method from QLayout
    addWidget(widget: QWidget, stretchOrOptions?: number | WidgetOptions, alignment?: number): void {
        // Handle different parameter options
        let options: WidgetOptions = {};
        if (typeof stretchOrOptions === 'object') {
            options = stretchOrOptions;
        } else {
            if (stretchOrOptions !== undefined) {
                options.stretch = stretchOrOptions;
            }
            if (alignment !== undefined) {
                options.alignment = alignment;
            }
        }

        this._widgets.push({ widget, options });
        this.updateLayout();

        // Add the widget to the DOM
        if (this.getParentWidget()) {
            // Create a wrapper for alignment if needed
            if (options && options.alignment) {
                const wrapper = document.createElement('div');
                QStyle.applyStyle(wrapper, {
                    display: 'flex',
                    marginRight: `${this._spacing}px`,
                    boxSizing: 'border-box'
                });

                // Apply alignment styles
                this.applyAlignment(wrapper, options.alignment);
                
                // Add the widget to the wrapper
                wrapper.appendChild(widget.getElement());
                this.getParentWidget()!.getElement().appendChild(wrapper);
            } else {
                // Default behavior - add directly to parent
                const element = widget.getElement();
                QStyle.applyStyle(element, {
                    marginRight: `${this._spacing}px`
                });
                this.getParentWidget()!.getElement().appendChild(element);
            }
        }
    }

    /**
     * Apply alignment to a wrapper element based on Qt.AlignmentFlag
     */
    private applyAlignment(element: HTMLElement, alignment: number): void {
        // Vertical alignment (for QHBoxLayout, this is the main alignment)
        if (alignment & Qt.AlignmentFlag.AlignTop) {
            element.style.alignItems = 'flex-start';
        } else if (alignment & Qt.AlignmentFlag.AlignVCenter) {
            element.style.alignItems = 'center';
        } else if (alignment & Qt.AlignmentFlag.AlignBottom) {
            element.style.alignItems = 'flex-end';
        }

        // Horizontal alignment within the item
        if (alignment & Qt.AlignmentFlag.AlignLeft) {
            element.style.justifyContent = 'flex-start';
        } else if (alignment & Qt.AlignmentFlag.AlignHCenter) {
            element.style.justifyContent = 'center';
        } else if (alignment & Qt.AlignmentFlag.AlignRight) {
            element.style.justifyContent = 'flex-end';
        } else if (alignment & Qt.AlignmentFlag.AlignJustify) {
            element.style.justifyContent = 'space-between';
        }
    }

    // Implementation of abstract methods from QLayout
    minimumSize(): { width: number, height: number } {
        return { width: 0, height: 0 };
    }
    
    sizeHint(): { width: number, height: number } {
        return { width: 100, height: 100 };
    }
    
    update(): void {
        this.updateLayout();
    }

    // Method to remove widgets
    removeWidget(widget: QWidget): void {
        const index = this._widgets.findIndex(item => item.widget === widget);
        if (index !== -1) {
            const widgetToRemove = this._widgets[index].widget;
            const element = widgetToRemove.getElement();
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            this._widgets.splice(index, 1);
        }
    }
    
    // Method to clear all widgets
    clear(): void {
        if (this.getParentWidget()) {
            const parentElement = this.getParentWidget()!.getElement();
            while (parentElement.firstChild) {
                parentElement.removeChild(parentElement.firstChild);
            }
        }
        this._widgets = [];
    }

    setSpacing(spacing: number): void {
        this._spacing = spacing;
        this.updateLayout();
    }

    setContentsMargins(left: number, top: number, right: number, bottom: number): void {
        this._contentsMargins = { left, top, right, bottom };
        this.updateLayout();
    }

    private updateLayout(): void {
        const parentWidget = this.getParentWidget();
        if (!parentWidget) return;

        // Apply margins only if we have a valid parent widget
        const element = parentWidget.getElement();
        if (element) {
            QStyle.applyStyle(element, {
                padding: `${this._contentsMargins.top}px ${this._contentsMargins.right}px ${this._contentsMargins.bottom}px ${this._contentsMargins.left}px`
            });
        }
    }

    // Get spacing value
    getSpacing(): number {
        return this._spacing;
    }

    contentsMargins(): { left: number, top: number, right: number, bottom: number } {
        return { ...this._contentsMargins };
    }
}
