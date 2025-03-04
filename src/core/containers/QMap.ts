import { QDebug } from '../QDebug';

/**
 * A map container class similar to Qt's QMap
 */
export class QMap<K, V> {
  private _map: Map<K, V>;
  
  constructor(entries?: readonly (readonly [K, V])[] | null) {
    this._map = new Map(entries);
  }
  
  /**
   * Returns the value associated with the key
   */
  value(key: K, defaultValue: V | undefined = undefined): V | undefined {
    return this._map.has(key) ? this._map.get(key) : defaultValue;
  }
  
  /**
   * Inserts a key-value pair into the map
   */
  insert(key: K, value: V): void {
    this._map.set(key, value);
  }
  
  /**
   * Removes a key and its associated value from the map
   */
  remove(key: K): boolean {
    return this._map.delete(key);
  }
  
  /**
   * Returns true if the map contains an item with key
   */
  contains(key: K): boolean {
    return this._map.has(key);
  }
  
  /**
   * Clears the map
   */
  clear(): void {
    this._map.clear();
  }
  
  /**
   * Returns the number of items in the map
   */
  size(): number {
    return this._map.size;
  }
  
  /**
   * Returns true if the map is empty
   */
  isEmpty(): boolean {
    return this._map.size === 0;
  }
  
  /**
   * Returns the keys in the map
   */
  keys(): K[] {
    return Array.from(this._map.keys());
  }
  
  /**
   * Returns the values in the map
   */
  values(): V[] {
    return Array.from(this._map.values());
  }
  
  /**
   * Returns the entries in the map
   */
  entries(): [K, V][] {
    return Array.from(this._map.entries());
  }

  /**
   * Executes a provided function once per each key/value pair in the Map
   */
  forEach(callback: (value: V, key: K, map: Map<K, V>) => void): void {
    this._map.forEach(callback);
  }
  
  /**
   * Returns the underlying Map object
   */
  toMap(): Map<K, V> {
    return new Map(this._map);
  }
  
  /**
   * Returns an iterator over the keys
   */
  keysIterator(): IterableIterator<K> {
    return this._map.keys();
  }
  
  /**
   * Returns an iterator over the values
   */
  valuesIterator(): IterableIterator<V> {
    return this._map.values();
  }
  
  /**
   * Returns an iterator over the entries
   */
  entriesIterator(): IterableIterator<[K, V]> {
    return this._map.entries();
  }
  
  /**
   * For...of iterability
   */
  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this._map.entries();
  }
}

// Add debugOutput method to QMap
export interface QMap<K, V> {
  debugOutput(debug: QDebug): QDebug;
}

QMap.prototype.debugOutput = function(debug: QDebug): QDebug {
  debug.nospace().print('QMap(');
  
  const keys = this.keys();
  if (keys.length === 0) {
    return debug.print(')');
  }
  
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (i > 0) {
      debug.print(', ');
    }
    debug.print(key).print(': ').print(this.value(key));
  }
  
  return debug.print(')');
};
