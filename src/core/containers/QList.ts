/**
 * QList is a template container class that provides a dynamic array.
 */
export class QList<T> {
    private _items: T[];
    
    /**
     * Creates a new QList
     */
    constructor(items: T[] | QList<T> = []) {
        if (items instanceof QList) {
            this._items = [...items.toArray()];
        } else {
            this._items = [...items];
        }
    }
    
    /**
     * Returns the number of items in the list
     */
    size(): number {
        return this._items.length;
    }
    
    /**
     * Returns true if the list is empty
     */
    isEmpty(): boolean {
        return this._items.length === 0;
    }
    
    /**
     * Returns the value at the given index
     */
    at(index: number): T | undefined {
        if (index < 0 || index >= this._items.length) {
            return undefined;
        }
        return this._items[index];
    }
    
    /**
     * Returns the first item in the list
     */
    first(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        return this._items[0];
    }
    
    /**
     * Returns the last item in the list
     */
    last(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        return this._items[this._items.length - 1];
    }
    
    /**
     * Appends an item to the list
     */
    append(value: T): void {
        this._items.push(value);
    }
    
    /**
     * Prepends an item to the list
     */
    prepend(value: T): void {
        this._items.unshift(value);
    }
    
    /**
     * Inserts an item at the given index
     */
    insert(index: number, value: T): void {
        this._items.splice(index, 0, value);
    }
    
    /**
     * Removes the item at the given index
     */
    removeAt(index: number): void {
        if (index >= 0 && index < this._items.length) {
            this._items.splice(index, 1);
        }
    }
    
    /**
     * Removes the first occurrence of value from the list
     */
    removeOne(value: T): boolean {
        const index = this._items.findIndex(item => item === value);
        if (index !== -1) {
            this._items.splice(index, 1);
            return true;
        }
        return false;
    }
    
    /**
     * Removes all occurrences of value from the list
     */
    removeAll(value: T): number {
        let count = 0;
        let index;
        while ((index = this._items.findIndex(item => item === value)) !== -1) {
            this._items.splice(index, 1);
            count++;
        }
        return count;
    }
    
    /**
     * Clears the list
     */
    clear(): void {
        this._items = [];
    }
    
    /**
     * Returns true if the list contains the given value
     */
    contains(value: T): boolean {
        return this._items.includes(value);
    }
    
    /**
     * Returns the index of the first occurrence of value
     */
    indexOf(value: T, from: number = 0): number {
        return this._items.indexOf(value, from);
    }
    
    /**
     * Returns the index of the last occurrence of value
     */
    lastIndexOf(value: T, from: number = -1): number {
        if (from < 0) {
            return this._items.lastIndexOf(value);
        }
        return this._items.lastIndexOf(value, from);
    }
    
    /**
     * Returns a new list containing a subset of items
     */
    mid(pos: number, length: number = -1): QList<T> {
        if (length < 0) {
            return new QList<T>(this._items.slice(pos));
        }
        return new QList<T>(this._items.slice(pos, pos + length));
    }
    
    /**
     * Returns a JavaScript array of all items
     */
    toArray(): T[] {
        return [...this._items];
    }
    
    /**
     * Sorts the items in-place
     */
    sort(compareFn?: (a: T, b: T) => number): void {
        this._items.sort(compareFn);
    }
    
    /**
     * Creates a new sorted QList without modifying this one
     */
    sorted(compareFn?: (a: T, b: T) => number): QList<T> {
        return new QList<T>([...this._items].sort(compareFn));
    }
    
    /**
     * Reverses the items in the list in-place
     */
    reverse(): void {
        this._items.reverse();
    }
    
    /**
     * Creates a new QList with the items in reverse order
     */
    reversed(): QList<T> {
        return new QList<T>([...this._items].reverse());
    }
    
    /**
     * Iterates through all items
     */
    forEach(callback: (item: T, index: number) => void): void {
        this._items.forEach(callback);
    }
    
    /**
     * Maps the list to a new QList
     */
    map<U>(callback: (item: T, index: number) => U): QList<U> {
        return new QList<U>(this._items.map(callback));
    }
    
    /**
     * Filters the list
     */
    filter(callback: (item: T, index: number) => boolean): QList<T> {
        return new QList<T>(this._items.filter(callback));
    }
    
    /**
     * Combines two lists
     */
    concat(other: QList<T>): QList<T> {
        return new QList<T>([...this._items, ...other.toArray()]);
    }
    
    /**
     * Returns a slice of the list
     */
    slice(start?: number, end?: number): QList<T> {
        return new QList<T>(this._items.slice(start, end));
    }
    
    /**
     * Implements the iterator protocol
     */
    [Symbol.iterator](): Iterator<T> {
        return this._items[Symbol.iterator]();
    }
}
