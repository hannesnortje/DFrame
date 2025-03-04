import { QDebug } from '../QDebug';

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
 * A container that can hold values of different types
 */
export class QVariant<T = any> {
  private _value: T;
  private _typeName: string;
  
  constructor(value: T) {
    this._value = value;
    this._typeName = this.detectType(value);
  }
  
  /**
   * Returns the contained value
   */
  value(): T {
    return this._value;
  }
  
  /**
   * Returns the type name of the contained value
   */
  typeName(): string {
    return this._typeName;
  }
  
  /**
   * Returns true if the variant contains a value
   */
  isValid(): boolean {
    return this._value !== undefined && this._value !== null;
  }
  
  /**
   * Converts the variant to a string representation
   */
  toString(): string {
    if (this._value === null) return 'null';
    if (this._value === undefined) return 'undefined';
    return String(this._value);
  }
  
  /**
   * Converts the variant to a number
   */
  toNumber(): number {
    if (typeof this._value === 'number') return this._value;
    return Number(this._value);
  }
  
  /**
   * Converts the variant to a boolean
   */
  toBoolean(): boolean {
    if (typeof this._value === 'boolean') return this._value;
    return Boolean(this._value);
  }
  
  /**
   * Returns true if the variant contains the specified type
   */
  canConvert(typeName: string): boolean {
    switch (typeName.toLowerCase()) {
      case 'string':
        return true; // Everything can be converted to string
      case 'number':
        return !isNaN(Number(this._value));
      case 'boolean':
        return true; // Everything can be converted to boolean
      case 'object':
        return typeof this._value === 'object' && this._value !== null;
      default:
        return this._typeName === typeName;
    }
  }
  
  /**
   * Detects the type of a value
   */
  private detectType(value: any): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }
}
