import { QObject } from './QObject';

// Define the change event interface
interface ChangeEvent<T> {
    oldValue: T;
    newValue: T;
}

/**
 * A reactive property that emits events when its value changes
 */
export class QReactiveProperty<T> extends QObject {
    private _value: T;
    private _sourceProperty: QReactiveProperty<any> | null = null;
    private _mappingFunction: ((value: any) => T) | null = null;
    private _boundProperties: Set<QReactiveProperty<any>> = new Set();

    /**
     * Create a new reactive property
     * @param initialValue The initial value of the property
     */
    constructor(initialValue: T) {
        super();
        this._value = initialValue;
    }

    /**
     * Get the current value of the property
     */
    get value(): T {
        return this._value;
    }

    /**
     * Set the value of the property
     * Emits a 'changed' signal if the value is different from the current value
     */
    set value(newValue: T) {
        // Skip update if value hasn't changed
        if (this._value === newValue) return;
        
        const oldValue = this._value;
        this._value = newValue;
        
        // Emit changed signal with old and new values
        this.emit('changed', { oldValue, newValue });
        
        // Update any bound properties
        this.updateBoundProperties();
    }

    /**
     * Bind this property to another property
     * This property will update when the source property changes
     * @param sourceProperty The property to bind to
     */
    bind(sourceProperty: QReactiveProperty<T>): void {
        // Unbind from previous source if any
        this.unbind();
        
        // Set new source
        this._sourceProperty = sourceProperty;
        
        // Connect to source's changed signal with proper type casting
        sourceProperty.connect('changed', 
            (payload: any) => {
                const change = payload as ChangeEvent<T>;
                this.value = change.newValue;
            }
        );
        
        // Add this property to the source's bound properties
        sourceProperty._boundProperties.add(this);
        
        // Initialize with the source's current value
        this.value = sourceProperty.value;
    }

    /**
     * Unbind this property from its source
     */
    unbind(): void {
        if (this._sourceProperty) {
            this._sourceProperty._boundProperties.delete(this);
            this._sourceProperty = null;
        }
    }

    /**
     * Update all properties bound to this property
     */
    private updateBoundProperties(): void {
        this._boundProperties.forEach(prop => {
            if (prop._mappingFunction) {
                prop.value = prop._mappingFunction(this._value);
            } else {
                prop.value = this._value;
            }
        });
    }

    /**
     * Create a new property that maps the value of this property
     * @param mapFn Function to map the value of this property to the new property
     * @returns A new property that updates when this property changes
     */
    map<U>(mapFn: (value: T) => U): QReactiveProperty<U> {
        const mappedProp = new QReactiveProperty<U>(mapFn(this.value));
        mappedProp._sourceProperty = this;
        mappedProp._mappingFunction = mapFn;
        this._boundProperties.add(mappedProp);
        return mappedProp;
    }
}
