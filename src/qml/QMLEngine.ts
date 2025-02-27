import { QWidget } from '../widgets/QWidget';
import { QMLParser, QMLNode } from './QMLParser';
import { QtComponents } from './QtComponents';
import { QStyle } from '../core/QStyle';

interface QMLComponent {
    getElement(): HTMLElement;
    setProperty?(name: string, value: any): void;
    addWidget?(widget: QWidget): void;
}

type ComponentConstructor = new (parent: QWidget | null) => QMLComponent;

export class QMLEngine {
    private components: Map<string, ComponentConstructor> = new Map();

    constructor() {
        this.registerBuiltinComponents();
        console.log('QMLEngine initialized with components:', Array.from(this.components.keys()));
    }

    private registerBuiltinComponents() {
        Object.entries(QtComponents).forEach(([name, component]) => {
            this.components.set(name, component as ComponentConstructor);
        });
    }

    loadString(qmlString: string): QWidget {
        console.log('Parsing QML:', qmlString);
        const node = QMLParser.parse(qmlString);
        console.log('Parsed node:', node);
        const component = this.createComponent(node);
        console.log('Created component:', component);
        return component as QWidget;
    }

    private createComponent(node: QMLNode, parent: QWidget | null = null): QMLComponent {
        console.log('Creating component:', node.type);
        const ComponentClass = this.components.get(node.type);
        if (!ComponentClass) {
            throw new Error(`Unknown component type: ${node.type}`);
        }

        // Create the instance and its container if needed
        const needsContainer = node.type.includes('Layout');
        const container = needsContainer ? new QWidget(parent) : null;
        const instance = new ComponentClass(container || parent);

        // Style both container and instance
        if (container) {
            QStyle.applyQMLStyle(container.getElement(), node.type, node.properties);
        }
        QStyle.applyQMLStyle((instance as QWidget).getElement(), node.type, node.properties);
        
        // Apply properties
        Object.entries(node.properties).forEach(([key, value]) => {
            console.log(`Setting property ${key}:`, value);
            if (instance.setProperty) {
                instance.setProperty(key, value);
            }
        });

        // Create children with proper parent
        node.children.forEach(child => {
            const childWidget = this.createComponent(child, container || instance as QWidget);
            if (instance.addWidget && childWidget instanceof QWidget) {
                console.log('Adding child widget:', child.type);
                instance.addWidget(childWidget);
            }
        });

        return container || instance;
    }
}
