import { QLayout } from './QLayout';
import { QWidget } from '../widgets/QWidget';
import { QStyle } from '../core/QStyle';
import { Qt } from '../core/Qt';

interface WidgetOptions {
    alignment?: number; // Use Qt alignment flags
    stretch?: number;
}

interface WidgetEntry {
    widget: QWidget;
    options?: WidgetOptions;
}

export class QVBoxLayout extends QLayout {
    private _widgets: WidgetEntry[] = [];
    private _spacing: number = 10;
    private _contentsMargins = { top: 0, right: 0, bottom: 0, left: 0 };

    constructor(parent?: QWidget) {
        super(parent);
        this.initLayout();
    }

    // Fix the updateLayout method to properly handle element creation and updates
    private initLayout() {
        if (this.getParentWidget()) {
            // Make sure the parent widget's element is properly styled for a vertical layout
            QStyle.applyStyle(this.getParentWidget()!.getElement(), {
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%', // Take up full parent height
                overflow: 'visible', // Allow content to be visible
                boxSizing: 'border-box'
            });
        }
    }

    // Fix the addWidget method to ensure widgets are properly displayed
    addWidget(widget: QWidget, stretchOrOptions?: number | WidgetOptions, alignment?: number): void {
        // Handle different parameter options as before...
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

        // Add the widget to the DOM - Make sure this part works correctly
        const parentElement = this.getParentWidget()?.getElement();
        if (parentElement) {
            // Create a wrapper for alignment if needed
            if (options && options.alignment) {
                const wrapper = document.createElement('div');
                QStyle.applyStyle(wrapper, {
                    display: 'flex',
                    width: '100%',
                    marginBottom: `${this._spacing}px`,
                    boxSizing: 'border-box'
                });

                // Apply alignment styles
                this.applyAlignment(wrapper, options.alignment);
                
                // Make sure the widget element style is properly set for display
                const widgetElement = widget.getElement();
                QStyle.applyStyle(widgetElement, {
                    display: 'block',  // Ensure the widget is displayed
                    visibility: 'visible'
                });
                
                // Add the widget to the wrapper
                wrapper.appendChild(widgetElement);
                parentElement.appendChild(wrapper);
            } else {
                // Default behavior - add directly to parent
                const widgetElement = widget.getElement();
                QStyle.applyStyle(widgetElement, {
                    marginBottom: `${this._spacing}px`,
                    display: 'block',  // Ensure the widget is displayed
                    visibility: 'visible'
                });
                parentElement.appendChild(widgetElement);
            }
        }

        this.updateLayout();
    }

    /**
     * Apply alignment to a wrapper element based on Qt.AlignmentFlag
     */
    private applyAlignment(element: HTMLElement, alignment: number): void {
        // Horizontal alignment
        if (alignment & Qt.AlignmentFlag.AlignLeft) {
            element.style.justifyContent = 'flex-start';
        } else if (alignment & Qt.AlignmentFlag.AlignHCenter) {
            element.style.justifyContent = 'center';
        } else if (alignment & Qt.AlignmentFlag.AlignRight) {
            element.style.justifyContent = 'flex-end';
        } else if (alignment & Qt.AlignmentFlag.AlignJustify) {
            element.style.justifyContent = 'space-between';
        }

        // Vertical alignment
        if (alignment & Qt.AlignmentFlag.AlignTop) {
            element.style.alignItems = 'flex-start';
        } else if (alignment & Qt.AlignmentFlag.AlignVCenter) {
            element.style.alignItems = 'center';
        } else if (alignment & Qt.AlignmentFlag.AlignBottom) {
            element.style.alignItems = 'flex-end';
        }
    }

    // Implement required abstract methods from QLayout
    
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

    // Fix the error in updateLayout method

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

    // Override the spacing getter to maintain compatibility
    getSpacing(): number {
        return this._spacing;
    }

    contentsMargins(): { left: number, top: number, right: number, bottom: number } {
        return { ...this._contentsMargins };
    }
}
