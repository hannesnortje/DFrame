/**
 * Type identifier for variant types
 */
export enum QVariantType {
    Invalid,
    Bool,
    Int,
    UInt,
    Double,
    String,
    List,
    Map,
    Date,
    Color,
    Size,
    Point,
    Rect,
    Object,
    ByteArray
}

/**
 * QVariant acts like a union for the most common Qt data types.
 */
export class QVariant<T = any> {
    private _value: T | null;
    private _type: QVariantType;
    
    /**
     * Creates a new QVariant
     */
    constructor(value?: T) {
        if (value === undefined) {
            this._value = null;
            this._type = QVariantType.Invalid;
        } else {
            this._value = value;
            this._type = this.determineType(value);
        }
    }
    
    /**
     * Determines the variant type based on the value
     */
    private determineType(value: any): QVariantType {
        if (value === null || value === undefined) {
            return QVariantType.Invalid;
        }
        
        if (typeof value === 'boolean') {
            return QVariantType.Bool;
        }
        
        if (typeof value === 'number') {
            // Change this condition - treat all integers as Int type regardless of sign
            if (Number.isInteger(value)) {
                return QVariantType.Int; // Don't differentiate between Int and UInt
            }
            return QVariantType.Double;
        }
        
        if (typeof value === 'string') {
            return QVariantType.String;
        }
        
        if (Array.isArray(value)) {
            return QVariantType.List;
        }
        
        if (value instanceof Map) {
            return QVariantType.Map;
        }
        
        if (value instanceof Date) {
            return QVariantType.Date;
        }
        
        // Handle known Qt types by checking for common properties
        if (value && typeof value === 'object') {
            // Check for Qt-like objects by their structure
            if ('r' in value && 'g' in value && 'b' in value && 'a' in value) {
                return QVariantType.Color;
            }
            
            if ('width' in value && 'height' in value && !('x' in value) && !('y' in value)) {
                return QVariantType.Size;
            }
            
            if ('x' in value && 'y' in value && !('width' in value)) {
                return QVariantType.Point;
            }
            
            if ('x' in value && 'y' in value && 'width' in value && 'height' in value) {
                return QVariantType.Rect;
            }
            
            // Default to Object for other objects
            return QVariantType.Object;
        }
        
        return QVariantType.Invalid;
    }
    
    /**
     * Returns the variant type
     */
    type(): QVariantType {
        return this._type;
    }
    
    /**
     * Returns true if the variant is valid
     */
    isValid(): boolean {
        return this._type !== QVariantType.Invalid;
    }
    
    /**
     * Returns true if the variant is null
     */
    isNull(): boolean {
        return this._value === null;
    }
    
    /**
     * Returns the variant as a value of type T
     */
    value<U = T>(): U | null {
        return this._value as unknown as U | null;
    }
    
    /**
     * Returns the variant as a boolean
     */
    toBool(): boolean {
        if (this._type === QVariantType.Bool) {
            return Boolean(this._value);
        }
        
        if (this._type === QVariantType.Int || this._type === QVariantType.UInt || this._type === QVariantType.Double) {
            return Number(this._value) !== 0;
        }
        
        if (this._type === QVariantType.String) {
            const str = String(this._value).toLowerCase();
            return str === 'true' || str === '1' || str === 'yes';
        }
        
        return false;
    }
    
    /**
     * Returns the variant as an integer
     */
    toInt(): number {
        if (this._type === QVariantType.Int || this._type === QVariantType.UInt || this._type === QVariantType.Double) {
            return Math.floor(Number(this._value));
        }
        
        if (this._type === QVariantType.Bool) {
            return Boolean(this._value) ? 1 : 0;
        }
        
        if (this._type === QVariantType.String) {
            return parseInt(String(this._value), 10) || 0;
        }
        
        return 0;
    }
    
    /**
     * Returns the variant as a double
     */
    toDouble(): number {
        if (this._type === QVariantType.Int || this._type === QVariantType.UInt || this._type === QVariantType.Double) {
            return Number(this._value);
        }
        
        if (this._type === QVariantType.Bool) {
            return Boolean(this._value) ? 1 : 0;
        }
        
        if (this._type === QVariantType.String) {
            return parseFloat(String(this._value)) || 0;
        }
        
        return 0;
    }
    
    /**
     * Returns the variant as a string
     */
    toString(): string {
        if (this._value === null || this._value === undefined) {
            return '';
        }
        
        return String(this._value);
    }
    
    /**
     * Returns a string that describes the type of the variant
     */
    typeName(): string {
        switch(this._type) {
            case QVariantType.Invalid: return 'Invalid';
            case QVariantType.Bool: return 'Bool';
            case QVariantType.Int: return 'Int';
            case QVariantType.UInt: return 'UInt';
            case QVariantType.Double: return 'Double';
            case QVariantType.String: return 'String';
            case QVariantType.List: return 'List';
            case QVariantType.Map: return 'Map';
            case QVariantType.Date: return 'Date';
            case QVariantType.Color: return 'Color';
            case QVariantType.Size: return 'Size';
            case QVariantType.Point: return 'Point';
            case QVariantType.Rect: return 'Rect';
            case QVariantType.Object: return 'Object';
            case QVariantType.ByteArray: return 'ByteArray';
            default: return 'Unknown';
        }
    }
    
    /**
     * Converts a JavaScript value to a QVariant
     */
    static fromValue<U>(value: U): QVariant<U> {
        return new QVariant<U>(value);
    }
    
    /**
     * Creates a null QVariant
     */
    static fromNull(): QVariant<null> {
        return new QVariant<null>(null);
    }
}
