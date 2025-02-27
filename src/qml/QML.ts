import { QObject } from '../core/QObject';

export class QMLComponent extends QObject {
    private _properties: Record<string, any> = {};
    private _component: Function;
    
    constructor(component: Function, parent?: QObject) {
        super(parent);
        this._component = component;
    }
    
    render(): HTMLElement {
        return this._component(this._properties);
    }
    
    set(name: string, value: any): QMLComponent {
        this._properties[name] = value;
        this.emit('propertyChanged', { name, value });
        return this;
    }
    
    get(name: string): any {
        return this._properties[name];
    }
}

// Example usage:
/*
const button = qml`
    Button {
        text: "Click Me"
        onClicked: { console.log("Button clicked") }
        width: 100
        height: 30
    }
`;
*/
