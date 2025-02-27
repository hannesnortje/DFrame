export function Property(target: any, key: string) {
    const privateKey = `_${key}`;
    
    // Property getter
    const getter = function(this: any) {
        return this[privateKey];
    };
    
    // Property setter
    const setter = function(this: any, newVal: any) {
        const oldVal = this[privateKey];
        this[privateKey] = newVal;
        
        // Emit changed signal if available
        if (this.emit && typeof this.emit === 'function') {
            this.emit(`${key}Changed`, { oldValue: oldVal, newValue: newVal });
        }
    };
    
    // Delete property and replace with getter/setter
    if (delete target[key]) {
        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    }
}

export function Signal(target: any, key: string) {
    const originalMethod = target[key];
    
    target[key] = function(...args: any[]) {
        const result = originalMethod?.apply(this, args);
        if (this.emit && typeof this.emit === 'function') {
            this.emit(key, ...args);
        }
        return result;
    };
    
    return target;
}
