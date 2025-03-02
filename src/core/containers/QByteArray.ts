/**
 * QByteArray provides an array of bytes with Qt-like functionality.
 */
export class QByteArray {
    private _data: Uint8Array;
    
    /**
     * Creates a new QByteArray
     */
    constructor(data?: Uint8Array | number[] | string | QByteArray) {
        if (data instanceof QByteArray) {
            this._data = new Uint8Array(data.toUint8Array());
        } else if (data instanceof Uint8Array) {
            this._data = new Uint8Array(data);
        } else if (Array.isArray(data)) {
            this._data = new Uint8Array(data);
        } else if (typeof data === 'string') {
            // Use a simple conversion for string encoding that works in all environments
            this._data = new Uint8Array(data.split('').map(c => c.charCodeAt(0)));
        } else {
            this._data = new Uint8Array();
        }
    }
    
    /**
     * Returns the number of bytes
     */
    size(): number {
        return this._data.length;
    }
    
    /**
     * Returns true if the byte array is empty
     */
    isEmpty(): boolean {
        return this._data.length === 0;
    }
    
    /**
     * Returns the byte at the given index
     */
    at(index: number): number {
        if (index < 0 || index >= this._data.length) {
            return 0;
        }
        return this._data[index];
    }
    
    /**
     * Appends the bytes to this byte array
     */
    append(data: QByteArray | Uint8Array | number[] | string): QByteArray {
        let bytesToAppend: Uint8Array;
        
        if (data instanceof QByteArray) {
            bytesToAppend = data.toUint8Array();
        } else if (data instanceof Uint8Array) {
            bytesToAppend = data;
        } else if (Array.isArray(data)) {
            bytesToAppend = new Uint8Array(data);
        } else if (typeof data === 'string') {
            bytesToAppend = new TextEncoder().encode(data);
        } else {
            return this;
        }
        
        const newArray = new Uint8Array(this._data.length + bytesToAppend.length);
        newArray.set(this._data);
        newArray.set(bytesToAppend, this._data.length);
        
        this._data = newArray;
        return this;
    }
    
    /**
     * Returns a new QByteArray with the data appended
     */
    plus(data: QByteArray | Uint8Array | number[] | string): QByteArray {
        return new QByteArray(this).append(data);
    }
    
    /**
     * Returns a substring
     */
    mid(pos: number, len: number = -1): QByteArray {
        if (pos < 0) {
            pos = 0;
        }
        
        if (pos >= this._data.length) {
            return new QByteArray();
        }
        
        if (len < 0 || pos + len > this._data.length) {
            len = this._data.length - pos;
        }
        
        return new QByteArray(this._data.slice(pos, pos + len));
    }
    
    /**
     * Returns the first len bytes
     */
    left(len: number): QByteArray {
        if (len <= 0) {
            return new QByteArray();
        }
        
        return this.mid(0, len);
    }
    
    /**
     * Returns the last len bytes
     */
    right(len: number): QByteArray {
        if (len <= 0) {
            return new QByteArray();
        }
        
        return this.mid(Math.max(0, this._data.length - len), len);
    }
    
    /**
     * Converts to a JavaScript string using UTF-8 encoding
     */
    toString(): string {
        // Simple string conversion that works in all environments
        return Array.from(this._data)
            .map(byte => String.fromCharCode(byte))
            .join('');
    }
    
    /**
     * Converts to a hexadecimal string
     */
    toHex(): string {
        return Array.from(this._data)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }
    
    /**
     * Converts to a base64 string
     */
    toBase64(): string {
        if (typeof btoa === 'function') {
            // Browser environment
            const binary = Array.from(this._data)
                .map(byte => String.fromCharCode(byte))
                .join('');
            return btoa(binary);
        } else {
            // Node.js environment
            const buf = Buffer.from(this._data);
            return buf.toString('base64');
        }
    }
    
    /**
     * Returns a Uint8Array copy of the data
     */
    toUint8Array(): Uint8Array {
        return new Uint8Array(this._data);
    }
    
    /**
     * Creates a QByteArray from a hex string
     */
    static fromHex(hexString: string): QByteArray {
        // Remove any spaces or non-hex characters
        hexString = hexString.replace(/[^0-9a-fA-F]/g, '');
        
        const result = new Uint8Array(hexString.length / 2);
        
        for (let i = 0; i < hexString.length; i += 2) {
            result[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
        }
        
        return new QByteArray(result);
    }
    
    /**
     * Creates a QByteArray from a base64 string
     */
    static fromBase64(base64String: string): QByteArray {
        if (typeof atob === 'function') {
            // Browser environment
            const binary = atob(base64String);
            const bytes = new Uint8Array(binary.length);
            
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            
            return new QByteArray(bytes);
        } else {
            // Node.js environment
            const buf = Buffer.from(base64String, 'base64');
            return new QByteArray(new Uint8Array(buf));
        }
    }
    
    /**
     * Returns a copy of the byte array
     */
    clone(): QByteArray {
        return new QByteArray(this._data);
    }
}
