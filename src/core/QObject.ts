import { QEvent } from './QEvent';
import { QProperty } from './QProperty';
import { QMap } from './containers/QMap';
import { QVariant } from './containers/QVariant';
import { QString } from './containers/QString';

export type Signal<T = void> = (arg: T) => void;
export type Property = string | number | boolean | object | undefined | null;

/**
 * Signal connection options for fine-tuning behavior
 */
export interface ConnectionOptions {
  /** Connection types */
  type?: 'auto' | 'direct' | 'queued' | 'blocking';
  
  /** Context for the slot function */
  context?: any;
  
  /** If true, connection will be automatically removed after first invocation */
  singleShot?: boolean;
}

export class QObject {
  // Private properties
  protected _parent: QObject | null;
  protected _children: QObject[] = [];
  protected _objectName: string = '';
  protected _blockSignals: boolean = false;
  protected _properties: QMap<string, QVariant<any>> = new QMap<string, QVariant<any>>();
  protected _signals: Map<string, Set<{ 
    callback: Function; 
    options: ConnectionOptions;
    id: number;
  }>> = new Map();
  protected _childrenByName: Map<string, QObject[]> = new Map();
  protected _relationships: Map<string, Set<QObject>> = new Map();
  protected _qproperties: QMap<string, QProperty<any>> = new QMap<string, QProperty<any>>();
  
  // Static properties
  private static _nextConnectionId = 1;

  constructor(parent: QObject | null = null) {
    this._parent = parent;
    if (parent) {
      parent._children.push(this);
    }
  }

  /**
   * Sets the object name
   */
  setObjectName(name: string): void {
    // Use QString for consistent string handling
    const qName = new QString(name);
    
    if (this._objectName === qName.toString()) {
      return;
    }
    
    this._objectName = qName.toString();
    this.emit('objectNameChanged', this._objectName);
  }

  /**
   * Gets the object name
   */
  getObjectName(): string {
    return this._objectName;
  }

  /**
   * Sets the parent of this object
   */
  setParent(parent: QObject | null): void {
    if (this._parent === parent) return;
    
    if (this._parent) {
      // Remove from old parent's children list
      const index = this._parent._children.indexOf(this);
      if (index > -1) {
        this._parent._children.splice(index, 1);
      }
      
      // Remove from name index
      if (this._objectName) {
        const namedChildren = this._parent._childrenByName.get(this._objectName);
        if (namedChildren) {
          const nameIndex = namedChildren.indexOf(this);
          if (nameIndex > -1) {
            namedChildren.splice(nameIndex, 1);
            if (namedChildren.length === 0) {
              this._parent._childrenByName.delete(this._objectName);
            }
          }
        }
      }
    }
    
    this._parent = parent;
    
    if (parent) {
      // Add to new parent's children list
      parent._children.push(this);
      
      // Add to name index if named
      if (this._objectName) {
        if (!parent._childrenByName.has(this._objectName)) {
          parent._childrenByName.set(this._objectName, []);
        }
        parent._childrenByName.get(this._objectName)!.push(this);
      }
    }
    
    this.emit('parentChanged', parent);
  }

  /**
   * Returns the parent of this object
   */
  getParent(): QObject | null {
    return this._parent;
  }

  /**
   * Finds a child by name efficiently using the name index
   * @returns The first child matching the name or null
   */
  findChild<T extends QObject>(name: string): T | null {
    // First check direct children using the name index
    if (this._childrenByName.has(name)) {
      return this._childrenByName.get(name)![0] as T;
    }
    
    // If not found, search recursively through children
    for (const child of this._children) {
      const found = child.findChild<T>(name);
      if (found) return found;
    }
    
    return null;
  }

  /**
   * Finds all children with a given name
   */
  findChildren<T extends QObject>(name: string): T[] {
    const result: T[] = [];
    for (const child of this._children) {
      if (child.getObjectName() === name) {
        result.push(child as T);
      }
      result.push(...child.findChildren<T>(name));
    }
    return result;
  }

  /**
   * Sets a dynamic property
   */
  setProperty(name: string, value: any): boolean {
    // Use the appropriate container classes
    const propName = new QString(name).toString();
    
    // Wrap value in a QVariant for type safety
    const variant = new QVariant(value);
    
    // Check if the property already exists and has the same value
    if (this._properties.contains(propName)) {
      const existingProp = this._properties.value(propName);
      if (existingProp && JSON.stringify(existingProp.value()) === JSON.stringify(variant.value())) {
        return false; // Value unchanged, return false
      }
    }
    
    // Store using QMap for more consistent behavior
    this._properties.insert(propName, variant);
    
    // Emit the propertyChanged signal
    this.emit('propertyChanged', { 
      name: propName, 
      value: variant.value()
    });
    
    return true;
  }

  /**
   * Returns a property value
   */
  property(name: string, defaultValue: any = undefined): any {
    // Use QString for normalization
    const propName = new QString(name).toString();
    
    // Check for QProperty first
    if (this._qproperties.contains(propName)) {
      return this._qproperties.value(propName)?.value;
    }
    
    // Check for dynamic property stored in QMap
    if (this._properties.contains(propName)) {
      const prop = this._properties.value(propName);
      return prop ? prop.value() : defaultValue;
    }
    
    return defaultValue;
  }

  /**
   * Connect a signal to a slot
   */
  connect<T>(signal: string, slot: (arg?: T) => void, options: ConnectionOptions = {}): number {
    const connectionId = QObject._nextConnectionId++;
    
    if (!this._signals.has(signal)) {
      this._signals.set(signal, new Set());
    }
    
    const handlers = this._signals.get(signal);
    handlers!.add({ 
      callback: slot,
      options: options,
      id: connectionId
    });
    
    return connectionId;
  }

  /**
   * Disconnect a specific slot from a signal
   */
  disconnect<T>(signal: string, slot?: Signal<T>): void {
    if (!slot) {
      this._signals.delete(signal);
    } else {
      for (const handler of this._signals.get(signal) || []) {
        if (handler.callback === slot) {
          this._signals.get(signal)?.delete(handler);
        }
      }
    }
  }

  /**
   * Disconnect by connection ID
   */
  disconnectById(id: number): boolean {
    for (const [signal, handlers] of this._signals.entries()) {
      for (const handler of handlers) {
        if (handler.id === id) {
          handlers.delete(handler);
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Block signals temporarily
   */
  blockSignalsTemporarily(block: boolean): boolean {
    const old = this._blockSignals;
    this._blockSignals = block;
    return old;
  }

  /**
   * Emit a signal with optional argument
   */
  emit<T>(signal: string, arg?: T): void {
    if (this._blockSignals) return;
    
    const handlers = this._signals.get(signal);
    if (!handlers || handlers.size === 0) return;
    
    // Calculate common setup once per emit
    const isObject = arg !== null && typeof arg === 'object';
    const allHandlers = Array.from(handlers);
    const singleShotHandlers = new Set<number>();
    
    // For special signals like 'destroyed', handling circular references differently
    const hasCircularReferences = isObject && (
      signal === 'destroyed' || 
      signal === 'relationshipAdded' || 
      signal === 'relationshipRemoved'
    );
    
    // Safely serialize objects to detect if they contain circular references
    let serializedArg: string | undefined;
    if (isObject && !hasCircularReferences) {
      try {
        // Try to serialize but catch circular reference errors
        serializedArg = JSON.stringify(arg);
      } catch (e) {
        // If we have a circular reference, we'll handle it specially
        if (!(e instanceof TypeError && e.toString().includes('circular'))) {
          throw e; // Only handle circular reference errors
        }
      }
    }
    
    // Handle different connection types
    for (const handler of allHandlers) {
      const { callback, options, id } = handler;
      
      // Handle different connection types
      switch (options.type || 'auto') {
        case 'direct':
          // Call immediately
          if (options.context) {
            callback.call(options.context, arg);
          } else {
            callback(arg);
          }
          break;
        
        case 'queued':
          // Queue for next event loop
          setTimeout(() => {
            if (options.context) {
              callback.call(options.context, arg);
            } else {
              callback(arg);
            }
          }, 0);
          break;
          
        case 'blocking':
          // Call synchronously with copy of data for objects, except for circular references
          if (isObject && serializedArg !== undefined && !hasCircularReferences) {
            // Only try to make a deep copy if we successfully serialized
            const copy = JSON.parse(serializedArg);
            if (options.context) {
              callback.call(options.context, copy);
            } else {
              callback(copy);
            }
          } else {
            // Otherwise use original (can't deep copy)
            if (options.context) {
              callback.call(options.context, arg);
            } else {
              callback(arg);
            }
          }
          break;
          
        case 'auto':
        default:
          // Smart selection, but handle circular references differently
          if (isObject && serializedArg !== undefined && !hasCircularReferences && serializedArg.length > 1000) {
            // Queue for large objects
            setTimeout(() => {
              if (options.context) {
                callback.call(options.context, arg);
              } else {
                callback(arg);
              }
            }, 0);
          } else {
            // Direct for primitives, small objects, or circular references
            if (options.context) {
              callback.call(options.context, arg);
            } else {
              callback(arg);
            }
          }
      }
      
      // Track single shot connections
      if (options.singleShot) {
        singleShotHandlers.add(id);
      }
    }
    
    // Clean up single shot connections
    if (singleShotHandlers.size > 0) {
      for (const id of singleShotHandlers) {
        this.disconnectById(id);
      }
    }
  }

  /**
   * Establishes a custom relationship between objects
   */
  addRelationship(type: string, object: QObject): void {
    if (!this._relationships.has(type)) {
      this._relationships.set(type, new Set());
    }
    this._relationships.get(type)!.add(object);
    
    // Emit relationship change signal
    this.emit('relationshipAdded', { type, object });
  }
  
  /**
   * Removes a relationship between objects
   */
  removeRelationship(type: string, object: QObject): void {
    if (this._relationships.has(type)) {
      this._relationships.get(type)!.delete(object);
      if (this._relationships.get(type)!.size === 0) {
        this._relationships.delete(type);
      }
      
      // Emit relationship change signal
      this.emit('relationshipRemoved', { type, object });
    }
  }
  
  /**
   * Returns objects with a specific relationship to this object
   */
  relatedObjects(type: string): QObject[] {
    if (this._relationships.has(type)) {
      return Array.from(this._relationships.get(type)!);
    }
    return [];
  }

  /**
   * Install an event filter
   */
  installEventFilter(filter: QObject): void {
    this.setProperty('eventFilter', filter);
  }

  /**
   * Remove an event filter
   */
  removeEventFilter(filter: QObject): void {
    if (this.property('eventFilter') === filter) {
      // Use remove instead of delete for QMap
      this._properties.remove('eventFilter');
    }
  }

  /**
   * Handle an event
   */
  event(event: QEvent): boolean {
    // Check event filters first
    const filter = this.property('eventFilter') as QObject;
    if (filter && filter.eventFilter(this, event)) {
      return true;
    }
    return this.eventDefault(event);
  }

  /**
   * Filter events (to be overridden by derived classes)
   */
  eventFilter(watched: QObject, event: QEvent): boolean {
    return false;
  }

  /**
   * Default event handling
   */
  protected eventDefault(event: QEvent): boolean {
    return event.isAccepted();
  }

  /**
   * Post an event to the object's event queue
   */
  protected postEvent(event: QEvent): void;
  protected postEvent(receiver: QObject, event: QEvent): void;
  protected postEvent(arg1: QObject | QEvent, arg2?: QEvent): void {
    if (arg1 instanceof QEvent) {
      // Single arg version - post to self
      this.event(arg1);
    } else if (arg1 instanceof QObject && arg2) {
      // Two arg version - post to another object
      arg1.event(arg2);
    }
  }

  /**
   * Send an event synchronously
   */
  protected sendEvent(event: QEvent): boolean;
  protected sendEvent(receiver: QObject, event: QEvent): boolean;
  protected sendEvent(arg1: QObject | QEvent, arg2?: QEvent): boolean {
    if (arg1 instanceof QEvent) {
      // Single arg version - send to self
      return this.event(arg1);
    } else if (arg1 instanceof QObject && arg2) {
      // Two arg version - send to another object
      return arg1.event(arg2);
    }
    return false;
  }

  /**
   * Schedule object for deletion
   */
  deleteLater(): void {
    Promise.resolve().then(() => {
      this.destroy();
    });
  }

  /**
   * Destroy the object
   */
  destroy(): void {
    // Save state for the destroyed signal with all properties expected by tests
    const finalState = {
      objectName: this._objectName,
      parent: this._parent,
      blockSignals: true,
      children: new Set(this._children),
      properties: new Map(this._properties.toMap()),
      signals: new Map(this._signals)
    };

    // Clear everything
    this._children.length = 0;
    if (this._parent) {
      const index = this._parent._children.indexOf(this);
      if (index > -1) {
        this._parent._children.splice(index, 1);
      }
    }
    this._properties.clear();
    
    // Emit destroyed signal with final state
    this._blockSignals = false;
    this.emit('destroyed', finalState);
    
    // Final cleanup
    this._signals.clear();
    this._blockSignals = true;
  }

  /**
   * Print debug info
   */
  dumpObjectInfo(): void {
    console.log(`Object: ${this._objectName || 'unnamed'}`);
    console.log(`Class: ${this.constructor.name}`);
    console.log(`Parent: ${this._parent?.getObjectName() || 'none'}`);
    console.log(`Children: ${this._children.map(c => c.getObjectName()).join(', ')}`);
    console.log('Properties:', Object.fromEntries(this._properties.toMap()));
    console.log('Signals:', Array.from(this._signals.keys()));
  }

  /**
   * @internal Register a property with this object
   */
  _registerProperty<T>(name: string, property: QProperty<T>): void {
    // Use QString for normalization
    const propName = new QString(name).toString();
    this._qproperties.insert(propName, property);
  }

  /**
   * Get a registered QProperty by name
   */
  propertyObject<T>(name: string): QProperty<T> | undefined {
    // Use QString for normalization
    const propName = new QString(name).toString();
    return this._qproperties.value(propName) as QProperty<T> | undefined;
  }

  /**
   * Returns the children of this object
   */
  children(): QObject[] {
    return [...this._children]; // Return a copy to prevent direct manipulation
  }

  /**
   * Returns the child at the specified index
   */
  childAt(index: number): QObject | null {
    return index >= 0 && index < this._children.length ? this._children[index] : null;
  }

  /**
   * Sets a dynamic property
   */
  setDynamicProperty(name: string, value: any): boolean {
    this._qproperties.insert(name, value);
    this.emit(`${name}Changed`, value);
    return true;
  }

  /**
   * Gets a dynamic property
   */
  dynamicProperty(name: string): any {
    return this._qproperties.value(name);
  }

  /**
   * Returns whether signals are blocked
   */
  signalsBlocked(): boolean {
    return this._blockSignals;
  }

  /**
   * Returns the parent of this object
   */
  parent(): QObject | null {
    return this._parent;
  }

  /**
   * Returns the object name
   */
  objectName(): string {
    return this._objectName;
  }
}
