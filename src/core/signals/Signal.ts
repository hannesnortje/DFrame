type Slot<T extends any[]> = (...args: T) => void;

export class Signal<T extends any[] = []> {
  private slots: Set<Slot<T>> = new Set();
  private sender: any;

  constructor(sender: any) {
    this.sender = sender;
  }

  connect(slot: Slot<T>): void {
    this.slots.add(slot);
  }

  disconnect(slot: Slot<T>): void {
    this.slots.delete(slot);
  }

  emit(...args: T): void {
    this.slots.forEach(slot => slot.apply(this.sender, args));
  }
}

export function signal<T extends any[] = []>(target: any, propertyKey: string) {
  const signalKey = Symbol(`signal_${propertyKey}`);
  
  Object.defineProperty(target, propertyKey, {
    get() {
      if (!this[signalKey]) {
        this[signalKey] = new Signal<T>(this);
      }
      return this[signalKey];
    }
  });
}
