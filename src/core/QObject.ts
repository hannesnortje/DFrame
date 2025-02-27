import { Qt } from './Qt';

export type Signal<T = void> = (payload: T) => void;
export type Slot<T = void> = (payload: T) => void;

export class QObject {
    private signals: Map<string, Set<Slot<any>>> = new Map();
    protected parent: QObject | null = null;
    private children: Set<QObject> = new Set();
    private _objectName: string = '';
    private destroyed: boolean = false;

    constructor(parent: QObject | null = null) {
        if (parent) {
            this.setParent(parent);
        }
    }

    setObjectName(name: string) {
        this._objectName = name;
    }

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
        this.signals.clear();
        this.destroyed = true;
    }

    connect<T>(signal: string, slot: Slot<T>, connectionType = Qt.ConnectionType.AutoConnection) {
        if (this.destroyed) return;
        if (!this.signals.has(signal)) {
            this.signals.set(signal, new Set());
        }
        this.signals.get(signal)!.add(slot);
    }

    disconnect<T>(signal: string, slot: Slot<T>) {
        if (this.signals.has(signal)) {
            this.signals.get(signal)!.delete(slot);
        }
    }

    emit<T>(signal: string, payload: T) {
        if (this.signals.has(signal)) {
            this.signals.get(signal)!.forEach(slot => slot(payload));
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
