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

// Updated decorator implementation for TypeScript 5
export function signal<This, T extends Signal<any>>() {
  return (target: undefined, context: ClassFieldDecoratorContext<This, T>) => {
    const signalKey = Symbol(`signal_${String(context.name)}`);
    
    return function(this: This) {
      if (!Object.getOwnPropertyDescriptor(this, signalKey)) {
        Object.defineProperty(this, signalKey, {
          value: new Signal(this),
          enumerable: false,
          configurable: false,
          writable: false
        });
      }
      return Object.getOwnPropertyDescriptor(this, signalKey)!.value as T;
    };
  };
}
