import { QObject } from './QObject';

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
}
