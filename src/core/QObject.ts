import { QEvent } from './QEvent';
import { QProperty } from './QProperty';

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
  private _parent: QObject | null;
  private _children: QObject[] = [];
  private _objectName: string = '';
  private _blockSignals: boolean = false;
  private _properties: Map<string, Property> = new Map();
  private _signals: Map<string, Set<{ 
    callback: Function; 
    options: ConnectionOptions;
    id: number;
  }>> = new Map();
  private _childrenByName: Map<string, QObject[]> = new Map();
  private _relationships: Map<string, Set<QObject>> = new Map();
  private _qproperties: Map<string, QProperty<any>> = new Map();
  
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
    if (this._objectName === name) return;
    
    // Update parent's name index if this object is in a parent
    if (this._parent) {
      // Remove from old name index
      if (this._objectName) {
        const oldNamedChildren = this._parent._childrenByName.get(this._objectName);
        if (oldNamedChildren) {
          const oldNameIndex = oldNamedChildren.indexOf(this);
          if (oldNameIndex > -1) {
            oldNamedChildren.splice(oldNameIndex, 1);
            if (oldNamedChildren.length === 0) {
              this._parent._childrenByName.delete(this._objectName);
            }
          }
        }
      }
      
      // Add to new name index
      if (!this._parent._childrenByName.has(name)) {
        this._parent._childrenByName.set(name, []);
      }
      this._parent._childrenByName.get(name)!.push(this);
    }
    
    this._objectName = name;
    this.emit('objectNameChanged', name);
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
   * Sets a property value
   */
  setProperty<T>(name: string, value: T): boolean {
    // Check if we have a QProperty registered
    const prop = this._qproperties.get(name);
    if (prop) {
      const oldValue = prop.value;
      prop.value = value;
      return oldValue !== value;
    }
    
    // Fall back to the standard property map
    const oldValue = this._properties.get(name);
    if (oldValue !== value) {
      this._properties.set(name, value as Property);
      this.emit('propertyChanged', { name, value });
      return true;
    }
    return false;
  }

  /**
   * Gets a property value
   */
  property<T>(name: string): T | undefined {
    // Check if we have a QProperty registered
    const prop = this._qproperties.get(name);
    if (prop) {
      return prop.value;
    }
    
    // Fall back to the standard property map
    return this._properties.get(name) as T | undefined;
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
          // Call synchronously with copy of data for objects
          if (isObject) {
            const copy = JSON.parse(JSON.stringify(arg));
            if (options.context) {
              callback.call(options.context, copy);
            } else {
              callback(copy);
            }
          } else {
            if (options.context) {
              callback.call(options.context, arg);
            } else {
              callback(arg);
            }
          }
          break;
          
        case 'auto':
        default:
          // Smart selection - use direct for primitives, queued for large objects
          if (isObject && JSON.stringify(arg).length > 1000) {
            // Queue for large objects
            setTimeout(() => {
              if (options.context) {
                callback.call(options.context, arg);
              } else {
                callback(arg);
              }
            }, 0);
          } else {
            // Direct for primitives and small objects
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
      this._properties.delete('eventFilter');  // Use delete instead of setting to null
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
   * Post an event
   */
  protected postEvent(event: QEvent): void {
    // For now, handle events immediately. Later we'll add an event queue.
    this.event(event);
  }

  /**
   * Send an event synchronously
   */
  protected sendEvent(event: QEvent): boolean {
    return this.event(event);
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
    // Save a copy of the object state before destruction
    const finalState = {
      blockSignals: true,
      children: new Set(this._children),
      objectName: this._objectName,
      parent: this._parent,
      properties: new Map(this._properties),
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
    console.log('Properties:', Object.fromEntries(this._properties));
    console.log('Signals:', Array.from(this._signals.keys()));
  }

  /**
   * @internal Register a property with this object
   */
  _registerProperty<T>(name: string, property: QProperty<T>): void {
    this._qproperties.set(name, property);
  }

  /**
   * Get a registered QProperty by name
   */
  propertyObject<T>(name: string): QProperty<T> | undefined {
    return this._qproperties.get(name);
  }
}
