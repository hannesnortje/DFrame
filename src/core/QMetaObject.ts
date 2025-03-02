import { QObject, Property } from './QObject';

/**
 * Represents a method in a QMetaObject.
 */
export interface QMetaMethod {
    name: string;
    returnType: string;
    parameterTypes: string[];
    parameterNames: string[];
    methodType: 'signal' | 'slot' | 'method';
}

/**
 * Represents a property in a QMetaObject.
 */
export interface QMetaProperty {
    name: string;
    type: string;
    readable: boolean;
    writable: boolean;
    resettable: boolean;
    designable: boolean;
    scriptable: boolean;
    stored: boolean;
    user: boolean;
    constant: boolean;
    final: boolean;
    notify: string | null; // Signal name
}

/**
 * QMetaObject provides runtime type information for QObject derived classes.
 * It allows dynamic introspection of object properties and methods.
 */
export class QMetaObject {
    private static metaObjects = new Map<string, QMetaObject>();
    private className: string;
    private superClass: QMetaObject | null = null;
    private properties: Map<string, QMetaProperty> = new Map();
    private methods: Map<string, QMetaMethod> = new Map();
    private enumerators: Map<string, Map<string, number>> = new Map();
    private classInfo: Map<string, string> = new Map();

    constructor(className: string) {
        this.className = className;
    }

    /**
     * Registers a new meta object for a class.
     */
    static registerMetaObject(className: string, superClassName: string | null = null): QMetaObject {
        const metaObject = new QMetaObject(className);
        
        if (superClassName) {
            const superMetaObject = QMetaObject.metaObjects.get(superClassName);
            if (superMetaObject) {
                metaObject.superClass = superMetaObject;
            }
        }
        
        QMetaObject.metaObjects.set(className, metaObject);
        return metaObject;
    }

    /**
     * Returns the meta object for a class name.
     */
    static forType(className: string): QMetaObject | null {
        return QMetaObject.metaObjects.get(className) || null;
    }

    /**
     * Returns the meta object for an object instance.
     */
    static fromObject(obj: QObject): QMetaObject | null {
        return QMetaObject.forType(obj.constructor.name);
    }

    /**
     * Returns a new instance of the class this meta object describes.
     */
    newInstance(parent: QObject | null = null): QObject | null {
        try {
            // Get constructor from global scope
            const constructor = (window as any)[this.className];
            if (typeof constructor === 'function') {
                return new constructor(parent);
            }
        } catch (e) {
            console.error(`Failed to create instance of ${this.className}:`, e);
        }
        return null;
    }

    /**
     * Adds a property to this meta object.
     */
    addProperty(property: QMetaProperty): void {
        this.properties.set(property.name, property);
    }

    /**
     * Adds a method to this meta object.
     */
    addMethod(method: QMetaMethod): void {
        this.methods.set(method.name, method);
    }

    /**
     * Adds an enumerator to this meta object.
     */
    addEnumerator(name: string, values: Record<string, number>): void {
        const enumMap = new Map<string, number>();
        Object.entries(values).forEach(([key, value]) => {
            enumMap.set(key, value);
        });
        this.enumerators.set(name, enumMap);
    }

    /**
     * Adds class info to this meta object.
     */
    addClassInfo(key: string, value: string): void {
        this.classInfo.set(key, value);
    }

    /**
     * Returns the class name.
     */
    getClassName(): string {
        return this.className;
    }

    /**
     * Returns the super class meta object.
     */
    getSuperClass(): QMetaObject | null {
        return this.superClass;
    }

    /**
     * Checks if this class is derived from another class.
     */
    inherits(className: string): boolean {
        if (this.className === className) {
            return true;
        }
        
        if (this.superClass) {
            return this.superClass.inherits(className);
        }
        
        return false;
    }

    /**
     * Returns all properties, including those from superclasses.
     */
    getProperties(): QMetaProperty[] {
        const result = Array.from(this.properties.values());
        
        if (this.superClass) {
            return [...this.superClass.getProperties(), ...result];
        }
        
        return result;
    }

    /**
     * Returns a property by name.
     */
    getProperty(name: string): QMetaProperty | null {
        if (this.properties.has(name)) {
            return this.properties.get(name) || null;
        }
        
        if (this.superClass) {
            return this.superClass.getProperty(name);
        }
        
        return null;
    }

    /**
     * Returns all methods, including those from superclasses.
     */
    getMethods(): QMetaMethod[] {
        const result = Array.from(this.methods.values());
        
        if (this.superClass) {
            return [...this.superClass.getMethods(), ...result];
        }
        
        return result;
    }

    /**
     * Returns a method by name.
     */
    getMethod(name: string): QMetaMethod | null {
        if (this.methods.has(name)) {
            return this.methods.get(name) || null;
        }
        
        if (this.superClass) {
            return this.superClass.getMethod(name);
        }
        
        return null;
    }

    /**
     * Invokes a method on an object.
     */
    invokeMethod(obj: QObject, methodName: string, args: any[] = []): any {
        if (typeof (obj as any)[methodName] === 'function') {
            return (obj as any)[methodName](...args);
        }
        return undefined;
    }

    /**
     * Returns a property value from an object.
     */
    getPropertyValue(obj: QObject, propertyName: string): Property | undefined {
        return obj.property(propertyName);
    }

    /**
     * Sets a property value on an object.
     */
    setPropertyValue(obj: QObject, propertyName: string, value: Property): boolean {
        return obj.setProperty(propertyName, value);
    }

    /**
     * Returns an enumerator value.
     */
    getEnumerator(enumName: string, valueName: string): number | null {
        const enumMap = this.enumerators.get(enumName);
        if (enumMap && enumMap.has(valueName)) {
            return enumMap.get(valueName) || null;
        }
        
        if (this.superClass) {
            return this.superClass.getEnumerator(enumName, valueName);
        }
        
        return null;
    }

    /**
     * Returns class info value for a key.
     */
    getClassInfo(key: string): string | null {
        if (this.classInfo.has(key)) {
            return this.classInfo.get(key) || null;
        }
        
        if (this.superClass) {
            return this.superClass.getClassInfo(key);
        }
        
        return null;
    }
}
