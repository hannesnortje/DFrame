import { QObject } from './QObject';

export class QReactiveProperty<T> extends QObject {
    private _value: T;
    
    constructor(initialValue: T, parent?: QObject) {
        super(parent);
        this._value = initialValue;
    }
    
    get value(): T {
        return this._value;
    }
    
    set value(newValue: T) {
        if (this._value !== newValue) {
            const oldValue = this._value;
            this._value = newValue;
            this.emit('changed', { oldValue, newValue });
        }
    }
    
    bind(source: QReactiveProperty<T>): void {
        source.connect('changed', (change: any) => {
            this.value = change.newValue;
        });
    }
    
    map<R>(mapper: (value: T) => R): QReactiveProperty<R> {
        const result = new QReactiveProperty<R>(mapper(this._value), this);
        this.connect('changed', (change: any) => {
            result.value = mapper(change.newValue);
        });
        return result;
    }
}
