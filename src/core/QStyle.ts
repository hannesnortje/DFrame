import { QObject } from './QObject';

// Define types for styling properties that allows both string and number values
export type StyleProperties = {
    [key: string]: string | number | undefined;
};

// Add Rem utility class to convert px to rem
export class QSize {
    readonly width: number;
    readonly height: number;
    
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

// Add Rem utility to convert px to rem
export class Rem {
    // Default browser font size is 16px
    static readonly baseFontSize: number = 16;
    
    /**
     * Convert pixel value to rem
     * @param px Pixel value
     * @returns String with rem value
     */
    static fromPx(px: number): string {
        return `${px / Rem.baseFontSize}rem`;
    }
    
    /**
     * Convert rem value to pixels
     * @param rem Rem value (without 'rem' unit)
     * @returns Number of pixels
     */
    static toPx(rem: number): number {
        return rem * Rem.baseFontSize;
    }
}

// Update to allow numbers for styling properties
export interface QStyleProperties {
    backgroundColor?: string;
    color?: string;
    border?: string;
    borderRadius?: string | number;
    padding?: string | number;
    margin?: string | number;
    fontSize?: string | number;
    fontWeight?: string;
    marginTop?: string | number;
    marginBottom?: string | number;
    cursor?: string;
    width?: string | number;
    height?: string | number;
    minWidth?: string | number;
    minHeight?: string | number;
    maxWidth?: string | number;
    maxHeight?: string | number;
    boxShadow?: string;
    textAlign?: string;
    display?: string;
    flexDirection?: string;
    alignItems?: string;
    gap?: string | number;
    [key: string]: string | number | undefined;
}

export class QStyle extends QObject {
    // Base styling properties that can be extended
    private static defaultStyle: StyleProperties = {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box'
    };

    static StandardPixmap = {
        SP_TitleBarMenuButton: 'menu',
        SP_TitleBarMinButton: 'minimize',
        SP_TitleBarMaxButton: 'maximize',
        SP_TitleBarCloseButton: 'close'
    };

    static StateFlag = {
        State_None: 0x00000000,
        State_Enabled: 0x00000001,
        State_Raised: 0x00000002,
        State_Sunken: 0x00000004,
        State_Off: 0x00000008,
        State_On: 0x00000010,
        State_Hover: 0x00000020,
        State_Focus: 0x00000040
    };

    static qmlDefaultStyle: QStyleProperties = {
        backgroundColor: '#ffffff',
        padding: '10px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '20px'
    };

    static applyQMLStyle(element: HTMLElement, type: string, properties: Record<string, any> = {}) {
        const style: QStyleProperties = { ...this.qmlDefaultStyle };
        
        switch (type) {
            case 'Rectangle':
                Object.assign(style, {
                    border: '1px solid #ddd',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    width: properties.width ? `${properties.width}px` : '100%',
                    height: properties.height ? `${properties.height}px` : 'auto',
                    backgroundColor: properties.color || '#ffffff'
                });
                break;
            case 'ColumnLayout':
                Object.assign(style, {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: `${properties.spacing || 10}px`,
                    padding: '10px',
                    width: '100%',
                    alignItems: 'stretch'
                });
                break;
            case 'Label':
                Object.assign(style, {
                    padding: '5px',
                    fontSize: '14px',
                    color: '#333333',
                    fontFamily: 'Arial, sans-serif'
                });
                break;
            case 'Button':
                Object.assign(style, {
                    padding: '8px 16px',
                    cursor: 'pointer',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    transition: 'background-color 0.2s'
                });
                break;
            case 'ComboBox':
                Object.assign(style, {
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: '#ffffff',
                    width: '100%',
                    cursor: 'pointer'
                });
                break;
        }

        this.applyStyle(element, style);
    }

    static applyStyle(element: HTMLElement, style: QStyleProperties) {
        // Apply default styles first
        for (const [property, value] of Object.entries(QStyle.defaultStyle)) {
            if (value !== undefined) {
                if (typeof value === 'number' && QStyle.shouldUseRem(property)) {
                    element.style[property as any] = Rem.fromPx(value);
                } else {
                    element.style[property as any] = value as string;
                }
            }
        }

        // Apply custom styles
        for (const [property, value] of Object.entries(style)) {
            if (value !== undefined) {
                if (typeof value === 'number' && QStyle.shouldUseRem(property)) {
                    element.style[property as any] = Rem.fromPx(value);
                } else {
                    element.style[property as any] = value as string;
                }
            }
        }

        return element;
    }

    /**
     * Check if a property should use rem units when given a number
     */
    private static shouldUseRem(property: string): boolean {
        // List of properties that should use rem units when given numeric values
        const remProperties = [
            'fontSize', 'lineHeight', 'margin', 'marginTop', 'marginRight', 
            'marginBottom', 'marginLeft', 'padding', 'paddingTop', 'paddingRight',
            'paddingBottom', 'paddingLeft', 'width', 'height', 'minWidth', 'minHeight',
            'maxWidth', 'maxHeight', 'top', 'right', 'bottom', 'left', 'gap',
            'borderRadius', 'borderWidth'
        ];
        
        return remProperties.includes(property);
    }

    static polish(widget: HTMLElement) {
        // Add default styling
    }

    static unpolish(widget: HTMLElement) {
        // Remove default styling
    }

    static visualRect(direction: Qt.LayoutDirection, rect: QRect): QRect {
        // Implement visual rect calculation based on layout direction
        return rect;
    }
}

// Add Qt-like types
export class QRect {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number
    ) {}
}

export namespace Qt {
    export enum LayoutDirection {
        LeftToRight,
        RightToLeft,
        LayoutDirectionAuto
    }
}
