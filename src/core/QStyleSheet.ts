import { QObject } from './QObject';
import { QWidget } from '../widgets/QWidget';

export class QStyleSheet extends QObject {
    private _rules: Map<string, Record<string, string>> = new Map();
    private _styleElement: HTMLStyleElement | null = null;
    
    constructor(parent?: QObject) {
        super(parent);
        this._createStyleElement();
    }
    
    private _createStyleElement(): void {
        this._styleElement = document.createElement('style');
        document.head.appendChild(this._styleElement);
    }
    
    addRule(selector: string, properties: Record<string, string>): void {
        this._rules.set(selector, { ...this._rules.get(selector), ...properties });
        this._updateStyles();
    }
    
    removeRule(selector: string): void {
        this._rules.delete(selector);
        this._updateStyles();
    }
    
    private _updateStyles(): void {
        if (!this._styleElement) return;
        
        let css = '';
        this._rules.forEach((properties, selector) => {
            css += `${selector} {\n`;
            Object.entries(properties).forEach(([prop, value]) => {
                css += `  ${prop}: ${value};\n`;
            });
            css += '}\n';
        });
        
        this._styleElement.textContent = css;
    }
    
    applyTo(widget: QWidget): void {
        // Add class names to elements based on their widget type
        const element = widget.getElement();
        const widgetClassName = widget.constructor.name;
        element.classList.add(widgetClassName);
        
        // Apply to children recursively
        widget.getChildren().forEach(child => {
            if (child instanceof QWidget) {
                this.applyTo(child);
            }
        });
    }
}

// Example usage (commented out to avoid runtime errors):
/*
// Create a stylesheet for your application
const styleSheet = new QStyleSheet();

// Add rules similar to CSS
styleSheet.addRule('.QPushButton', {
    backgroundColor: '#2196f3',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none'
});

styleSheet.addRule('.QPushButton:hover', {
    backgroundColor: '#0d8af0',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
});

// Apply the stylesheet to your application
// styleSheet.applyTo(myApp);
*/
