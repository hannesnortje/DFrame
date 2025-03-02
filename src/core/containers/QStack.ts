import { QList } from './QList';

/**
 * QStack is a template class that provides a stack.
 */
export class QStack<T> {
    private _data: QList<T>;
    
    /**
     * Creates a new QStack
     */
    constructor(items?: T[] | QList<T> | QStack<T>) {
        if (items instanceof QStack) {
            this._data = new QList<T>(items._data);
        } else {
            this._data = new QList<T>(items);
        }
    }
    
    /**
     * Returns the number of items in the stack
     */
    size(): number {
        return this._data.size();
    }
    
    /**
     * Returns true if the stack contains no items
     */
    isEmpty(): boolean {
        return this._data.isEmpty();
    }
    
    /**
     * Removes all elements from the stack
     */
    clear(): void {
        this._data.clear();
    }
    
    /**
     * Pushes value onto the top of the stack
     */
    push(value: T): void {
        this._data.append(value);
    }
    
    /**
     * Removes the top item from the stack and returns it
     */
    pop(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        
        const value = this._data.last();
        this._data.removeAt(this._data.size() - 1);
        return value;
    }
    
    /**
     * Returns the top item without removing it
     */
    top(): T | undefined {
        return this._data.last();
    }
    
    /**
     * Returns a reference to the internal QList
     */
    toList(): QList<T> {
        return new QList<T>(this._data);
    }
    
    /**
     * Returns a JavaScript array containing all the items in the stack
     */
    toArray(): T[] {
        return this._data.toArray();
    }
    
    /**
     * Returns true if the stack contains an occurrence of value
     */
    contains(value: T): boolean {
        return this._data.contains(value);
    }
    
    /**
     * Swaps the stack with other
     */
    swap(other: QStack<T>): void {
        const temp = this._data;
        this._data = other._data;
        other._data = temp;
    }
}
