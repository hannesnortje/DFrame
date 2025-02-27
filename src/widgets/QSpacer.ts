import { QWidget } from './QWidget';
import { Qt } from '../core/Qt';

/**
 * QSpacer is a widget that expands to fill available space in layouts.
 * Use it for creating dynamic spacing between widgets in layouts.
 */
export class QSpacer extends QWidget {
    private horizontalPolicy: number;
    private verticalPolicy: number;
    private minimumWidth: number;
    private minimumHeight: number;
    
    /**
     * Creates a new spacer widget.
     * 
     * @param horizontalPolicy How the spacer should behave horizontally
     * @param verticalPolicy How the spacer should behave vertically
     * @param minimumWidth Minimum width of the spacer (default: 0)
     * @param minimumHeight Minimum height of the spacer (default: 0)
     */
    constructor(
        horizontalPolicy: number = Qt.Expanding,
        verticalPolicy: number = Qt.Expanding,
        minimumWidth: number = 0,
        minimumHeight: number = 0
    ) {
        super();
        this.horizontalPolicy = horizontalPolicy;
        this.verticalPolicy = verticalPolicy;
        this.minimumWidth = minimumWidth;
        this.minimumHeight = minimumHeight;
        
        // Set the element's styling to be invisible but take up space
        const element = this.getElement();
        element.style.background = 'transparent';
        element.style.border = 'none';
        element.style.minWidth = `${minimumWidth}px`;
        element.style.minHeight = `${minimumHeight}px`;
    }
    
    /**
     * Get the horizontal size policy of the spacer
     */
    getHorizontalPolicy(): number {
        return this.horizontalPolicy;
    }
    
    /**
     * Get the vertical size policy of the spacer
     */
    getVerticalPolicy(): number {
        return this.verticalPolicy;
    }
    
    /**
     * Set the horizontal size policy
     * @param policy The horizontal size policy
     */
    setHorizontalPolicy(policy: number): void {
        this.horizontalPolicy = policy;
    }
    
    /**
     * Set the vertical size policy
     * @param policy The vertical size policy
     */
    setVerticalPolicy(policy: number): void {
        this.verticalPolicy = policy;
    }
    
    /**
     * Create a horizontal spacer with the given minimum width
     * @param minimumWidth Minimum width of the spacer
     */
    static createHorizontal(minimumWidth: number = 0): QSpacer {
        return new QSpacer(Qt.Expanding, Qt.Fixed, minimumWidth, 0);
    }
    
    /**
     * Create a vertical spacer with the given minimum height
     * @param minimumHeight Minimum height of the spacer
     */
    static createVertical(minimumHeight: number = 0): QSpacer {
        return new QSpacer(Qt.Fixed, Qt.Expanding, 0, minimumHeight);
    }
}
