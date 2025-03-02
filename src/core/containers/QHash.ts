/**
 * QHash is an implementation of a hash-table-based dictionary, similar to QMap
 * but with faster lookups at the expense of ordered iteration.
 */
export class QHash<K, V> {
    private _map: Map<K, V>;
    
    /**
     * Creates a new QHash
     */
    constructor(entries?: Map<K, V> | QHash<K, V> | Array<[K, V]>) {
        if (entries instanceof QHash) {
            this._map = new Map(entries.toMap());
        } else {
            this._map = new Map(entries);
        }
    }
    
    /**
     * Returns the number of (key, value) pairs in the hash
     */
    size(): number {
        return this._map.size;
    }
    
    /**
     * Returns true if the hash contains no items
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
     * Returns true if the hash contains an item with key
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
     * Removes all items from the hash
     */
    clear(): void {
        this._map.clear();
    }
    
    /**
     * Returns a list of all keys in the hash
     */
    keys(): K[] {
        return Array.from(this._map.keys());
    }
    
    /**
     * Returns a list of all values in the hash
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
     * Takes another hash's entries and inserts them into this hash
     */
    unite(other: QHash<K, V>): void {
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
     * Returns a QHash with the same keys but different values
     */
    mapped<T>(mapper: (value: V, key: K) => T): QHash<K, T> {
        const result = new QHash<K, T>();
        for (const [key, value] of this._map.entries()) {
            result.insert(key, mapper(value, key));
        }
        return result;
    }
    
    /**
     * Returns a filtered QHash containing only the key-value pairs that match the predicate
     */
    filtered(predicate: (value: V, key: K) => boolean): QHash<K, V> {
        const result = new QHash<K, V>();
        for (const [key, value] of this._map.entries()) {
            if (predicate(value, key)) {
                result.insert(key, value);
            }
        }
        return result;
    }
    
    /**
     * Implements the iterator protocol
     */
    [Symbol.iterator](): IterableIterator<[K, V]> {
        return this._map.entries();
    }
}
