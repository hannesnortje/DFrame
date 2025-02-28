import { Qt } from './Qt';

export type Signal<T = void> = (payload: T) => void;
export type Slot<T = void> = (payload: T) => void;

/**
 * Base class for all DFrame objects
 */
export class QObject {
    private events: Map<string, ((...args: unknown[]) => void)[]> = new Map();
    private _objectName: string = '';
    private destroyed: boolean = false;
    protected parent: QObject | null = null;
    private children: Set<QObject> = new Set();

    /**
     * Create a new QObject
     */
    constructor(parent: QObject | null = null) {
        if (parent) {
            this.setParent(parent);
        }
    }

    /**
     * Set the object name
     * @param name Name to set
     */
    setObjectName(name: string): void {
        this._objectName = name;
    }

    /**
     * Get the object name
     */
    objectName(): string {
        return this._objectName;
    }

    deleteLater() {
        setTimeout(() => this.destroy(), 0);
    }

    isDestroyed(): boolean {
        return this.destroyed;
    }

    private destroy() {
        if (this.destroyed) return;
        
        this.emit('destroyed', this);
        this.children.forEach(child => child.destroy());
        this.setParent(null);
        this.events.clear();
        this.destroyed = true;
    }

    /**
     * Emit an event with optional arguments
     * @param eventName The name of the event to emit
     * @param args Arguments to pass to the event handlers
     */
    emit(eventName: string, ...args: unknown[]): void {
        const handlers = this.events.get(eventName) || [];
        handlers.forEach(handler => handler(...args));
    }

    /**
     * Connect to an event
     * @param eventName The name of the event to connect to
     * @param handler The function to call when the event is emitted
     */
    connect(eventName: string, handler: (...args: unknown[]) => void): void {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        
        this.events.get(eventName)!.push(handler);
    }

    /**
     * Disconnect from an event
     * @param eventName The name of the event to disconnect from
     * @param handler The handler to disconnect, or undefined to disconnect all handlers
     */
    disconnect(eventName: string, handler?: (...args: unknown[]) => void): void {
        if (!this.events.has(eventName)) {
            return;
        }
        
        if (!handler) {
            this.events.delete(eventName);
            return;
        }
        
        const handlers = this.events.get(eventName)!;
        const index = handlers.indexOf(handler);
        
        if (index !== -1) {
            handlers.splice(index, 1);
        }
        
        if (handlers.length === 0) {
            this.events.delete(eventName);
        }
    }

    setParent(parent: QObject | null) {
        if (this.parent) {
            this.parent.children?.delete(this);
        }
        this.parent = parent;
        if (parent && parent.children) {
            parent.children.add(this);
        }
    }

    getParent(): QObject | null {
        return this.parent;
    }

    getChildren(): QObject[] {
        return Array.from(this.children);
    }

    findChildren<T extends QObject>(type: new (...args: any[]) => T): T[] {
        return Array.from(this.children).filter(child => child instanceof type) as T[];
    }

    deleteChild(child: QObject) {
        if (this.children.has(child)) {
            this.children.delete(child);
            child.setParent(null);
        }
    }

    findChild<T extends QObject>(name: string): T | null {
        for (const child of this.children) {
            if (child.objectName() === name) {
                return child as T;
            }
        }
        return null;
    }
}
