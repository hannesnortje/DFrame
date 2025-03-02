/**
 * QSet is a template container class that provides a set of values.
 */
export class QSet<T> {
    private _set: Set<T>;
    
    /**
     * Creates a new QSet
     */
    constructor(items?: Iterable<T> | QSet<T>) {
        if (items instanceof QSet) {
            this._set = new Set(items.toSet());
        } else {
            this._set = new Set(items);
        }
    }
    
    /**
     * Returns the number of items in the set
     */
    size(): number {
        return this._set.size;
    }
    
    /**
     * Returns true if the set contains no items
     */
    isEmpty(): boolean {
        return this._set.size === 0;
    }
    
    /**
     * Inserts value into the set
     */
    insert(value: T): boolean {
        const sizeBeforeInsert = this._set.size;
        this._set.add(value);
        return this._set.size !== sizeBeforeInsert;
    }
    
    /**
     * Returns true if the set contains value
     */
    contains(value: T): boolean {
        return this._set.has(value);
    }
    
    /**
     * Removes value from the set
     */
    remove(value: T): boolean {
        return this._set.delete(value);
    }
    
    /**
     * Removes all items from the set
     */
    clear(): void {
        this._set.clear();
    }
    
    /**
     * Returns the union of this set and other
     */
    unite(other: QSet<T>): QSet<T> {
        return new QSet(new Set([...this._set, ...other._set]));
    }
    
    /**
     * Returns the intersection of this set and other
     */
    intersect(other: QSet<T>): QSet<T> {
        const result = new Set<T>();
        for (const item of this._set) {
            if (other.contains(item)) {
                result.add(item);
            }
        }
        return new QSet(result);
    }
    
    /**
     * Returns the difference of this set and other
     */
    subtract(other: QSet<T>): QSet<T> {
        const result = new Set(this._set);
        for (const item of other._set) {
            result.delete(item);
        }
        return new QSet(result);
    }
    
    /**
     * Returns a JavaScript Set
     */
    toSet(): Set<T> {
        return new Set(this._set);
    }
    
    /**
     * Returns an array containing all the items in the set
     */
    toArray(): T[] {
        return Array.from(this._set);
    }
    
    /**
     * Creates a new QSet containing only the items that satisfy the predicate
     */
    filter(predicate: (value: T) => boolean): QSet<T> {
        const result = new Set<T>();
        for (const item of this._set) {
            if (predicate(item)) {
                result.add(item);
            }
        }
        return new QSet(result);
    }
    
    /**
     * Creates a new QSet by mapping each value
     */
    map<U>(mapper: (value: T) => U): QSet<U> {
        const result = new Set<U>();
        for (const item of this._set) {
            result.add(mapper(item));
        }
        return new QSet(result);
    }
    
    /**
     * Iterates through all items
     */
    forEach(callback: (value: T) => void): void {
        this._set.forEach(callback);
    }
    
    /**
     * Returns true if this set is a subset of other
     */
    isSubsetOf(other: QSet<T>): boolean {
        for (const item of this._set) {
            if (!other.contains(item)) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Returns true if this set is a proper subset of other
     */
    isProperSubsetOf(other: QSet<T>): boolean {
        return this.size() < other.size() && this.isSubsetOf(other);
    }
    
    /**
     * Returns true if this set is equal to other
     */
    equals(other: QSet<T>): boolean {
        if (this.size() !== other.size()) {
            return false;
        }
        
        for (const item of this._set) {
            if (!other.contains(item)) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Implements the iterator protocol
     */
    [Symbol.iterator](): IterableIterator<T> {
        return this._set.values();
    }
}