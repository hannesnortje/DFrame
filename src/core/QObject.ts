import { QEvent } from './QEvent';

export type Signal<T = void> = (arg: T) => void;
export type Property = string | number | boolean | object | undefined | null;

export class QObject {
    private _parent: QObject | null;
    private _children: QObject[] = [];
    private signals: Map<string, Set<Signal>> = new Map();
    private properties: Map<string, Property> = new Map();
    private objectName: string = '';
    private blockSignals: boolean = false;

    constructor(parent: QObject | null = null) {
        this._parent = parent;
        if (parent) {
            parent._children.push(this);
        }
    }

    setObjectName(name: string): void {
        this.objectName = name;
        this.emit('objectNameChanged', name);
    }

    getObjectName(): string {
        return this.objectName;
    }

    setParent(parent: QObject | null): void {
        if (this._parent === parent) return;
        
        if (this._parent) {
            const index = this._parent._children.indexOf(this);
            if (index > -1) {
                this._parent._children.splice(index, 1);
            }
        }
        this._parent = parent;
        if (parent) {
            parent._children.push(this);
        }
        this.emit('parentChanged', parent);
    }

    getParent(): QObject | null {
        return this._parent;
    }

    findChild<T extends QObject>(name: string): T | null {
        for (const child of this._children) {
            if (child.objectName === name) {
                return child as T;
            }
            const found = child.findChild<T>(name);
            if (found) return found;
        }
        return null;
    }

    findChildren<T extends QObject>(name: string): T[] {
        const result: T[] = [];
        for (const child of this._children) {
            if (child.objectName === name) {
                result.push(child as T);
            }
            result.push(...child.findChildren<T>(name));
        }
        return result;
    }

    setProperty(name: string, value: Property): boolean {
        const oldValue = this.properties.get(name);
        if (oldValue !== value) {
            this.properties.set(name, value);
            this.emit('propertyChanged', { name, value });
            return true;
        }
        return false;
    }

    property(name: string): Property | undefined {
        return this.properties.get(name);
    }

    connect<T>(signal: string, slot: Signal<T>): void {
        if (!this.signals.has(signal)) {
            this.signals.set(signal, new Set());
        }
        const slots = this.signals.get(signal);
        if (slots) {
            slots.add(slot as Signal<unknown>);
        }
    }

    disconnect<T>(signal: string, slot?: Signal<T>): void {
        if (!slot) {
            this.signals.delete(signal);
        } else {
            this.signals.get(signal)?.delete(slot as Signal<any>);
        }
    }

    emit<T>(signal: string, arg?: T): void {
        if (this.blockSignals) return;
        
        const slots = this.signals.get(signal);
        if (slots) {
            slots.forEach(slot => {
                (slot as Signal<T>)(arg as T);
            });
        }
    }

    blockSignalsTemporarily(block: boolean): boolean {
        const old = this.blockSignals;
        this.blockSignals = block;
        return old;
    }

    deleteLater(): void {
        Promise.resolve().then(() => {
            this.destroy();
        });
    }

    destroy(): void {
        // Save a copy of the object state before destruction
        const finalState = {
            blockSignals: true,
            children: new Set(this._children),
            objectName: this.objectName,
            parent: this._parent,
            properties: new Map(this.properties),
            signals: new Map(this.signals)
        };

        // Clear everything
        this._children.length = 0;
        if (this._parent) {
            const index = this._parent._children.indexOf(this);
            if (index > -1) {
                this._parent._children.splice(index, 1);
            }
        }
        this.properties.clear();
        
        // Emit destroyed signal with final state
        this.blockSignals = false;
        this.emit('destroyed', finalState);
        
        // Final cleanup
        this.signals.clear();
        this.blockSignals = true;
    }

    installEventFilter(filter: QObject): void {
        this.setProperty('eventFilter', filter);
    }

    removeEventFilter(filter: QObject): void {
        if (this.property('eventFilter') === filter) {
            this.properties.delete('eventFilter');  // Use delete instead of setting to null
        }
    }

    dumpObjectInfo(): void {
        console.log(`Object: ${this.objectName || 'unnamed'}`);
        console.log(`Class: ${this.constructor.name}`);
        console.log(`Parent: ${this._parent?.objectName || 'none'}`);
        console.log(`Children: ${this._children.map(c => c.objectName).join(', ')}`);
        console.log('Properties:', Object.fromEntries(this.properties));
        console.log('Signals:', Array.from(this.signals.keys()));
    }

    event(event: QEvent): boolean {
        // Check event filters first
        const filter = this.property('eventFilter') as QObject;
        if (filter && filter.eventFilter(this, event)) {
            return true;
        }
        return this.eventDefault(event);
    }

    eventFilter(watched: QObject, event: QEvent): boolean {
        return false;
    }

    protected eventDefault(event: QEvent): boolean {
        return event.isAccepted();
    }

    protected postEvent(event: QEvent): void {
        // For now, handle events immediately. Later we'll add an event queue.
        this.event(event);
    }

    protected sendEvent(event: QEvent): boolean {
        return this.event(event);
    }
}
