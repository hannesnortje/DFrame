/**
 * QMap is a template container class that provides an associative array.
 */
export class QMap<K, V> {
    private _map: Map<K, V>;
    
    /**
     * Creates a new QMap
     */
    constructor(entries?: Map<K, V> | QMap<K, V> | Array<[K, V]>) {
        if (entries instanceof QMap) {
            this._map = new Map(entries.toMap());
        } else {
            this._map = new Map(entries);
        }
    }
    
    /**
     * Returns the number of (key, value) pairs in the map
     */
    size(): number {
        return this._map.size;
    }
    
    /**
     * Returns true if the map contains no items
     */
    isEmpty(): boolean {
        return this._map.size === 0;
    }
    
    /**
     * Inserts a new item with key and value
     */
    insert(key: K, value: V): void {
        this._map.set(key, value);
    }
    
    /**
     * Returns the value associated with key
     */
    value(key: K, defaultValue?: V): V | undefined {
        if (this._map.has(key)) {
            return this._map.get(key);
        }
        return defaultValue;
    }
    
    /**
     * Returns true if the map contains an item with key
     */
    contains(key: K): boolean {
        return this._map.has(key);
    }
    
    /**
     * Removes all items with the given key
     */
    remove(key: K): boolean {
        return this._map.delete(key);
    }
    
    /**
     * Removes all items from the map
     */
    clear(): void {
        this._map.clear();
    }
    
    /**
     * Returns a list of all keys in the map
     */
    keys(): K[] {
        return Array.from(this._map.keys());
    }
    
    /**
     * Returns a list of all values in the map
     */
    values(): V[] {
        return Array.from(this._map.values());
    }
    
    /**
     * Returns a JavaScript Map
     */
    toMap(): Map<K, V> {
        return new Map(this._map);
    }
    
    /**
     * Returns an iterator over [key, value] pairs
     */
    entries(): IterableIterator<[K, V]> {
        return this._map.entries();
    }
    
    /**
     * Takes another map's entries and inserts them into this map
     */
    unite(other: QMap<K, V>): void {
        for (const [key, value] of other.entries()) {
            this._map.set(key, value);
        }
    }
    
    /**
     * Iterates through all key-value pairs
     */
    forEach(callback: (value: V, key: K) => void): void {
        this._map.forEach(callback);
    }
    
    /**
     * Implements the iterator protocol
     */
    [Symbol.iterator](): IterableIterator<[K, V]> {
        return this._map.entries();
    }
}
