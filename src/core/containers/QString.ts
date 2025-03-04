import { QDebug } from '../QDebug';

/**
 * String handling class similar to Qt's QString
 */
export class QString {
  private _value: string;
  
  constructor(value: string | number | boolean = '') {
    this._value = String(value);
  }
  
  /**
   * Returns the string value
   */
  toString(): string {
    return this._value;
  }
  
  /**
   * Returns the length of the string
   */
  length(): number {
    return this._value.length;
  }
  
  /**
   * Returns true if the string is empty
   */
  isEmpty(): boolean {
    return this._value.length === 0;
  }
  
  /**
   * Returns the character at the specified index
   */
  charAt(index: number): string {
    return this._value.charAt(index);
  }
  
  /**
   * Returns the Unicode code point at the specified index
   */
  charCodeAt(index: number): number {
    return this._value.charCodeAt(index);
  }
  
  /**
   * Returns a substring
   */
  substring(start: number, end?: number): QString {
    return new QString(this._value.substring(start, end));
  }
  
  /**
   * Returns a substring
   */
  substr(start: number, length?: number): QString {
    return new QString(this._value.substr(start, length));
  }
  
  /**
   * Returns the index of the first occurrence of the specified value
   */
  indexOf(searchValue: string, fromIndex?: number): number {
    return this._value.indexOf(searchValue, fromIndex);
  }
  
  /**
   * Returns the index of the last occurrence of the specified value
   */
  lastIndexOf(searchValue: string, fromIndex?: number): number {
    return this._value.lastIndexOf(searchValue, fromIndex);
  }
  
  /**
   * Returns a new string with all matches of a pattern replaced
   */
  replace(searchValue: string | RegExp, replaceValue: string): QString {
    return new QString(this._value.replace(searchValue, replaceValue));
  }
  
  /**
   * Splits the string into an array of substrings
   */
  split(separator: string | RegExp, limit?: number): QString[] {
    return this._value.split(separator, limit).map(s => new QString(s));
  }
  
  /**
   * Returns a new string with whitespace trimmed from both ends
   */
  trim(): QString {
    return new QString(this._value.trim());
  }
  
  /**
   * Returns a new string with whitespace trimmed from the start
   */
  trimStart(): QString {
    return new QString(this._value.trimStart());
  }
  
  /**
   * Returns a new string with whitespace trimmed from the end
   */
  trimEnd(): QString {
    return new QString(this._value.trimEnd());
  }
  
  /**
   * Converts the string to uppercase
   */
  toUpperCase(): QString {
    return new QString(this._value.toUpperCase());
  }
  
  /**
   * Converts the string to lowercase
   */
  toLowerCase(): QString {
    return new QString(this._value.toLowerCase());
  }
  
  /**
   * Checks if the string starts with the specified value
   */
  startsWith(searchString: string, position?: number): boolean {
    return this._value.startsWith(searchString, position);
  }
  
  /**
   * Checks if the string ends with the specified value
   */
  endsWith(searchString: string, position?: number): boolean {
    return this._value.endsWith(searchString, position || this._value.length);
  }
  
  /**
   * Returns a new string padded to the specified length
   */
  padStart(targetLength: number, padString?: string): QString {
    return new QString(this._value.padStart(targetLength, padString));
  }
  
  /**
   * Returns a new string padded to the specified length
   */
  padEnd(targetLength: number, padString?: string): QString {
    return new QString(this._value.padEnd(targetLength, padString));
  }
}

// Add debugOutput method to QString
export interface QString {
  debugOutput(debug: QDebug): QDebug;
}

QString.prototype.debugOutput = function(debug: QDebug): QDebug {
  return debug.print(`"${this.toString()}"`);
};
