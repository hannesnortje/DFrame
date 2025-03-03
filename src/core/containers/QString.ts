import { QDebug } from '../QDebug';

/**
 * QString provides an abstraction of Unicode strings with implicit sharing.
 * It offers similar functionality to JavaScript's String with additional Qt-like methods.
 */
export class QString {
    private _data: string;
    
    /**
     * Creates a new QString
     */
    constructor(str: string | QString = '') {
        this._data = str instanceof QString ? str.toString() : str;
    }
    
    /**
     * Returns the length of the string
     */
    length(): number {
        return this._data.length;
    }
    
    /**
     * Returns true if the string is empty
     */
    isEmpty(): boolean {
        return this._data.length === 0;
    }
    
    /**
     * Returns true if the string is null
     */
    isNull(): boolean {
        return this._data === null;
    }
    
    /**
     * Returns a substring
     */
    mid(pos: number, len: number = -1): QString {
        if (len < 0) {
            return new QString(this._data.substring(pos));
        }
        return new QString(this._data.substring(pos, pos + len));
    }
    
    /**
     * Returns the first n characters
     */
    left(n: number): QString {
        return new QString(this._data.substring(0, n));
    }
    
    /**
     * Returns the last n characters
     */
    right(n: number): QString {
        if (n >= this._data.length) {
            return new QString(this._data);
        }
        return new QString(this._data.substring(this._data.length - n));
    }
    
    /**
     * Converts the string to lowercase
     */
    toLower(): QString {
        return new QString(this._data.toLowerCase());
    }
    
    /**
     * Converts the string to uppercase
     */
    toUpper(): QString {
        return new QString(this._data.toUpperCase());
    }
    
    /**
     * Trims whitespace from both ends
     */
    trimmed(): QString {
        return new QString(this._data.trim());
    }
    
    /**
     * Returns the position of a substring
     */
    indexOf(str: string | QString, from: number = 0): number {
        const searchStr = str instanceof QString ? str.toString() : str;
        return this._data.indexOf(searchStr, from);
    }
    
    /**
     * Returns the last position of a substring
     */
    lastIndexOf(str: string | QString, from: number = -1): number {
        const searchStr = str instanceof QString ? str.toString() : str;
        if (from < 0) {
            return this._data.lastIndexOf(searchStr);
        }
        return this._data.lastIndexOf(searchStr, from);
    }
    
    /**
     * Returns true if the string starts with a substring
     */
    startsWith(str: string | QString): boolean {
        const prefix = str instanceof QString ? str.toString() : str;
        return this._data.startsWith(prefix);
    }
    
    /**
     * Returns true if the string ends with a substring
     */
    endsWith(str: string | QString): boolean {
        const suffix = str instanceof QString ? str.toString() : str;
        return this._data.endsWith(suffix);
    }
    
    /**
     * Returns a string where all occurrences of before are replaced with after
     */
    replace(before: string | RegExp | QString, after: string | QString): QString {
        const afterStr = after instanceof QString ? after.toString() : after;
        if (before instanceof QString) {
            return new QString(this._data.replace(before.toString(), afterStr));
        }
        return new QString(this._data.replace(before, afterStr));
    }
    
    /**
     * Splits the string
     */
    split(separator: string | RegExp | QString): QString[] {
        const sep = separator instanceof QString ? separator.toString() : separator;
        return this._data.split(sep).map(s => new QString(s));
    }
    
    /**
     * Appends a string
     */
    append(str: string | QString): QString {
        const appendStr = str instanceof QString ? str.toString() : str;
        // Return a new QString with the combined value, not just the appended part
        return new QString(this._data + appendStr);
    }
    
    /**
     * Returns a string repeated n times
     */
    repeated(times: number): QString {
        return new QString(this._data.repeat(times));
    }
    
    /**
     * Returns true if the string contains a substring
     */
    contains(str: string | QString): boolean {
        const searchStr = str instanceof QString ? str.toString() : str;
        return this._data.includes(searchStr);
    }
    
    /**
     * Converts the QString to a JavaScript string
     */
    toString(): string {
        return this._data;
    }
    
    /**
     * Converts the QString to a number
     */
    toNumber(): number {
        return parseFloat(this._data);
    }
    
    /**
     * Converts the QString to an integer
     */
    toInt(): number {
        const result = parseInt(this._data, 10);
        // Return 0 for NaN results, as Qt does
        return isNaN(result) ? 0 : result;
    }
    
    /**
     * Compares this QString with another
     */
    compare(other: string | QString): number {
        const otherStr = other instanceof QString ? other.toString() : other;
        if (this._data < otherStr) return -1;
        if (this._data > otherStr) return 1;
        return 0;
    }
    
    /**
     * Creates a QString from a number
     */
    static number(num: number): QString {
        return new QString(num.toString());
    }
    
    /**
     * Returns an empty QString
     */
    static empty(): QString {
        return new QString('');
    }
    
    /**
     * Joins an array of QStrings with a separator
     */
    static join(separator: string | QString, strings: (string | QString)[]): QString {
        const sep = separator instanceof QString ? separator.toString() : separator;
        const mapped = strings.map(s => s instanceof QString ? s.toString() : s);
        return new QString(mapped.join(sep));
    }
}

// Add debugOutput method to QString
export interface QString {
  debugOutput(debug: QDebug): QDebug;
}

QString.prototype.debugOutput = function(debug: QDebug): QDebug {
  return debug.print(`"${this.toString()}"`);
};
