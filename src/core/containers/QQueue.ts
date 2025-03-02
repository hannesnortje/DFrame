import { QList } from './QList';

/**
 * QQueue is a template class that provides a queue.
 */
export class QQueue<T> {
    private _data: QList<T>;
    
    /**
     * Creates a new QQueue
     */
    constructor(items?: T[] | QList<T> | QQueue<T>) {
        if (items instanceof QQueue) {
            this._data = new QList<T>(items._data);
        } else {
            this._data = new QList<T>(items);
        }
    }
    
    /**
     * Returns the number of items in the queue
     */
    size(): number {
        return this._data.size();
    }
    
    /**
     * Returns true if the queue contains no items
     */
    isEmpty(): boolean {
        return this._data.isEmpty();
    }
    
    /**
     * Removes all elements from the queue
     */
    clear(): void {
        this._data.clear();
    }
    
    /**
     * Adds value to the tail of the queue
     */
    enqueue(value: T): void {
        this._data.append(value);
    }
    
    /**
     * Removes the head item from the queue and returns it
     */
    dequeue(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        
        const value = this._data.first();
        this._data.removeAt(0);
        return value;
    }
    
    /**
     * Returns the head item without removing it
     */
    head(): T | undefined {
        return this._data.first();
    }
    
    /**
     * Returns a reference to the internal QList
     */
    toList(): QList<T> {
        return new QList<T>(this._data);
    }
    
    /**
     * Returns a JavaScript array containing all the items in the queue
     */
    toArray(): T[] {
        return this._data.toArray();
    }
    
    /**
     * Returns true if the queue contains an occurrence of value
     */
    contains(value: T): boolean {
        return this._data.contains(value);
    }
    
    /**
     * Swaps the queue with other
     */
    swap(other: QQueue<T>): void {
        const temp = this._data;
        this._data = other._data;
        other._data = temp;
    }
}
