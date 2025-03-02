import { QObject } from './QObject';

/**
 * Options for property configuration
 */
export interface PropertyOptions<T> {
  /** Default value */
  defaultValue?: T;
  
  /** Validation function that returns true if value is valid */
  validator?: (value: T) => boolean;
  
  /** Transform function applied before setting the value */
  transform?: (value: T) => T;
  
  /** Signal name to emit on change (defaults to propertyName + 'Changed') */
  notify?: string;
  
  /** If true, property won't emit change signals */
  silent?: boolean;
  
  /** If true, property can't be changed */
  readonly?: boolean;
}

/**
 * Interface for property change data
 */
export interface PropertyChangeData<T> {
  value: T;
  oldValue?: T;
}

/**
 * A property wrapper with automatic change detection and signaling
 */
export class QProperty<T> {
  private _value: T;
  private _owner: QObject;
  private _name: string;
  private _options: PropertyOptions<T>;

  /**
   * Creates a new property
   * 
   * @param owner The QObject that owns this property
   * @param name Property name
   * @param options Property configuration options
   */
  constructor(owner: QObject, name: string, options: PropertyOptions<T> = {}) {
    this._owner = owner;
    this._name = name;
    this._options = options;
    this._value = options.defaultValue as T;
    
    // Register with the owner
    owner['_registerProperty'](name, this);
  }

  /**
   * Gets the current value
   */
  get value(): T {
    return this._value;
  }

  /**
   * Sets a new value, with validation and change detection
   */
  set value(newValue: T) {
    if (this._options.readonly) {
      console.warn(`Property ${this._name} is readonly`);
      return;
    }
    
    // Apply transform if provided
    if (this._options.transform) {
      newValue = this._options.transform(newValue);
    }
    
    // Apply validation if provided
    if (this._options.validator && !this._options.validator(newValue)) {
      console.warn(`Invalid value for property ${this._name}`);
      return;
    }
    
    // Skip if value hasn't changed (using simple equality)
    if (this._value === newValue) {
      return;
    }
    
    const oldValue = this._value;
    this._value = newValue;
    
    // Emit change signals
    if (!this._options.silent) {
      // Emit standard property notification signal
      const notifySignal = this._options.notify || `${this._name}Changed`;
      
      // Use a change object containing both new and old values
      const changeData: PropertyChangeData<T> = { value: newValue, oldValue };
      this._owner.emit(notifySignal, changeData);
      
      // Also emit the generic propertyChanged signal
      this._owner.emit('propertyChanged', {
        name: this._name,
        value: newValue,
        oldValue: oldValue
      });
    }
  }
  
  /**
   * Binds this property to another property or value
   */
  bind(source: QProperty<T> | (() => T)): () => void {
    // If binding to another property
    if (source instanceof QProperty) {
      // Initial sync
      this.value = source.value;
      
      // Set up binding
      const handler = (arg?: PropertyChangeData<T>) => {
        if (arg && arg.value !== undefined) {
          this.value = arg.value;
        }
      };
      
      // Connect to source property changes
      const notifySignal = source._options.notify || `${source._name}Changed`;
      source._owner.connect(notifySignal, handler);
      
      // Return unbind function
      return () => source._owner.disconnect(notifySignal, handler);
    }
    // If binding to a function
    else if (typeof source === 'function') {
      // Apply initial value immediately
      const initialValue = source();
      this.value = initialValue;
      
      // Set up binding with a polling approach
      const interval = setInterval(() => {
        const newValue = source();
        if (this._value !== newValue) {
          this.value = newValue;
        }
      }, 100); // Poll every 100ms
      
      // Return unbind function
      return () => clearInterval(interval);
    }
    
    throw new Error('Invalid binding source');
  }
  
  /**
   * Reset to default value if available
   */
  reset(): void {
    if ('defaultValue' in this._options) {
      this.value = this._options.defaultValue as T;
    }
  }
}
