import { QString } from './containers/QString';
import { QVariant } from './containers/QVariant';

/**
 * Debugging format options
 */
export enum DebugFormat {
  /** Default format for debug output */
  Default,
  /** Format for line-by-line indented output */
  Indented,
  /** Format with compact representation */
  Compact
}

/**
 * Class for debugging output with streaming operations
 */
export class QDebug {
  private _buffer: string[] = [];
  private _indent: number = 0;
  private _indentStep: number = 2; // Each level adds 2 spaces
  private _addSpace: boolean = true;
  private _format: DebugFormat = DebugFormat.Default;
  private _precision: number = 6;
  private _fieldWidth: number = 0;
  private _isQuoteEnabled: boolean = true;
  private _needsQuotes: boolean = false;

  /**
   * Create a new QDebug instance
   * @param outputDevice Optional output target (defaults to console.log)
   */
  constructor(private outputDevice?: (message: string) => void) {
    if (!outputDevice) {
      this.outputDevice = (msg: string) => console.log(msg);
    }
  }

  /**
   * Create a QDebug instance for console output
   */
  static console(): QDebug {
    return new QDebug(console.log);
  }

  /**
   * Create a QDebug instance for string accumulation
   */
  static string(): QDebug {
    // Don't set an output device to accumulate only
    return new QDebug(undefined);
  }
  
  /**
   * Set the output format
   */
  setFormat(format: DebugFormat): QDebug {
    this._format = format;
    return this;
  }
  
  /**
   * Get the current output format
   */
  format(): DebugFormat {
    return this._format;
  }
  
  /**
   * Make output more compact
   */
  compact(): QDebug {
    this._format = DebugFormat.Compact;
    return this;
  }

  /**
   * Enable indented output
   */
  indented(): QDebug {
    this._format = DebugFormat.Indented;
    this._indent = 0; // Reset indent level
    return this;
  }

  /**
   * Increase indentation level
   */
  increaseIndent(): QDebug {
    this._indent += 2; // Add exactly 2 spaces
    return this;
  }

  /**
   * Decrease indentation level
   */
  decreaseIndent(): QDebug {
    this._indent = Math.max(0, this._indent - 2); // Remove exactly 2 spaces
    return this;
  }

  /**
   * Set field width for numbers
   */
  setFieldWidth(width: number): QDebug {
    this._fieldWidth = width;
    return this;
  }

  /**
   * Set precision for floating-point numbers
   */
  setPrecision(precision: number): QDebug {
    this._precision = precision;
    return this;
  }

  /**
   * Enable adding spaces between items
   */
  space(): QDebug {
    this._addSpace = true;
    return this;
  }

  /**
   * Disable adding spaces between items
   */
  nospace(): QDebug {
    this._addSpace = false;
    return this;
  }

  /**
   * Control auto-quoting of strings
   */
  setQuotesEnabled(enabled: boolean): QDebug {
    this._isQuoteEnabled = enabled;
    return this;
  }

  /**
   * Add a value to the debug output
   */
  print(value: any): QDebug {
    this.maybeAddSpace();
    
    // Handle common primitive types
    if (value === undefined) {
      this._buffer.push('undefined');
    }
    else if (value === null) {
      this._buffer.push('null');
    }
    else if (typeof value === 'string') {
      this.printString(value);
    }
    else if (typeof value === 'number') {
      this.printNumber(value);
    }
    else if (typeof value === 'boolean') {
      this._buffer.push(value ? 'true' : 'false');
    }
    // Handle special QDebug-aware types
    else if (typeof value.debugOutput === 'function') {
      // Use the object's custom debug output method
      return value.debugOutput(this);
    }
    // Basic object type handling
    else if (Array.isArray(value)) {
      this.printArray(value);
    }
    else if (value instanceof Map) {
      this.printMap(value);
    }
    else if (value instanceof Set) {
      this.printSet(value);
    }
    else if (typeof value === 'object') {
      this.printObject(value);
    }
    else {
      // Default case - convert to string
      this._buffer.push(String(value));
    }
    
    return this;
  }

  /**
   * Add a new line to the output
   */
  newline(): QDebug {
    this._buffer.push('\n');
    
    // Apply indentation at the beginning of the new line based on current indent level
    if (this._format === DebugFormat.Indented) {
      // The test expects spaces immediately after newlines
      // Looking at the expected characters, we need to add the spaces immediately
      // after the newline, not later in the output
      this._buffer.push(' '.repeat(this._indent));
    }
    
    return this;
  }

  /**
   * Finish and output the debug message
   */
  flush(): void {
    if (this.outputDevice) {
      this.outputDevice(this._buffer.join(''));
    }
    // Clear the buffer after outputting
    this._buffer = [];
  }

  /**
   * Get the accumulated string without flushing
   */
  toString(): string {
    return this._buffer.join('');
  }

  /**
   * Format and print a string value
   */
  private printString(value: string): void {
    if (this._needsQuotes && this._isQuoteEnabled) {
      this._buffer.push(`"${value}"`);
    } else {
      this._buffer.push(value);
    }
  }

  /**
   * Format and print a numeric value
   */
  private printNumber(value: number): void {
    // Format based on settings
    let output: string;
    
    if (Number.isInteger(value)) {
      output = value.toString();
    } else {
      output = value.toFixed(this._precision);
      // Remove trailing zeros after decimal point
      output = output.replace(/\.?0+$/, '');
    }
    
    // Apply field width if specified
    if (this._fieldWidth > 0) {
      output = output.padStart(this._fieldWidth);
    }
    
    this._buffer.push(output);
  }

  /**
   * Format and print an array
   */
  private printArray(arr: any[]): void {
    if (arr.length === 0) {
      this._buffer.push("[]");
      return;
    }
    
    const isCompact = this._format === DebugFormat.Compact;
    const indented = this._format === DebugFormat.Indented;
    
    if (!isCompact) this._buffer.push("[");
    if (indented) this.increaseIndent();
    
    for (let i = 0; i < arr.length; i++) {
      if (indented && i > 0) this.newline();
      
      // Save quote settings and disable for array items
      const savedQuoteSetting = this._needsQuotes;
      this._needsQuotes = true;
      
      // Print the value
      this.print(arr[i]);
      
      // Restore quote settings
      this._needsQuotes = savedQuoteSetting;
      
      // Add comma except for the last item
      if (i < arr.length - 1) {
        this._buffer.push(isCompact ? ", " : ",");
      }
    }
    
    if (indented) this.decreaseIndent();
    if (!isCompact) this._buffer.push("]");
  }

  /**
   * Format and print a Map
   */
  private printMap(map: Map<any, any>): void {
    if (map.size === 0) {
      this._buffer.push("Map{}");
      return;
    }
    
    const isCompact = this._format === DebugFormat.Compact;
    const indented = this._format === DebugFormat.Indented;
    
    this._buffer.push(isCompact ? "Map{" : "Map {");
    if (indented) this.increaseIndent();
    
    let index = 0;
    map.forEach((value, key) => {
      if (indented && index > 0) this.newline();
      
      // Save quote setting and enable for map keys
      const savedQuoteSetting = this._needsQuotes;
      this._needsQuotes = true;
      
      // Print key and value
      this.print(key);
      this._buffer.push(isCompact ? ":" : " => ");
      this.print(value);
      
      // Restore quote setting
      this._needsQuotes = savedQuoteSetting;
      
      // Add comma except for the last item
      if (index < map.size - 1) {
        this._buffer.push(isCompact ? ", " : ",");
      }
      
      index++;
    });
    
    if (indented) this.decreaseIndent();
    this._buffer.push("}");
  }

  /**
   * Format and print a Set
   */
  private printSet(set: Set<any>): void {
    if (set.size === 0) {
      this._buffer.push("Set{}");
      return;
    }
    
    const isCompact = this._format === DebugFormat.Compact;
    const indented = this._format === DebugFormat.Indented;
    
    this._buffer.push(isCompact ? "Set{" : "Set {");
    if (indented) this.increaseIndent();
    
    let index = 0;
    set.forEach(value => {
      if (indented && index > 0) this.newline();
      
      // Save quote setting and enable for set items
      const savedQuoteSetting = this._needsQuotes;
      this._needsQuotes = true;
      
      // Print the value
      this.print(value);
      
      // Restore quote setting
      this._needsQuotes = savedQuoteSetting;
      
      // Add comma except for the last item
      if (index < set.size - 1) {
        this._buffer.push(isCompact ? ", " : ",");
      }
      
      index++;
    });
    
    if (indented) this.decreaseIndent();
    this._buffer.push("}");
  }

  /**
   * Format and print a generic object
   */
  private printObject(obj: object): void {
    const keys = Object.keys(obj);
    
    if (keys.length === 0) {
      this._buffer.push("{}");
      return;
    }
    
    const isCompact = this._format === DebugFormat.Compact;
    const indented = this._format === DebugFormat.Indented;
    
    const className = obj.constructor && obj.constructor.name !== 'Object' 
      ? `${obj.constructor.name} ` 
      : '';
    
    this._buffer.push(isCompact ? `${className}{` : `${className}{`);
    if (indented) this.increaseIndent();
    
    keys.forEach((key, index) => {
      if (indented && index > 0) this.newline();
      
      // Print key and value
      this._buffer.push(key);
      this._buffer.push(isCompact ? ":" : ": ");
      
      // Save quote setting
      const savedQuoteSetting = this._needsQuotes;
      this._needsQuotes = true;
      
      // Print the value
      this.print((obj as any)[key]);
      
      // Restore quote setting
      this._needsQuotes = savedQuoteSetting;
      
      // Add comma except for the last item
      if (index < keys.length - 1) {
        this._buffer.push(isCompact ? ", " : ",");
      }
    });
    
    if (indented) this.decreaseIndent();
    this._buffer.push("}");
  }

  /**
   * Add a space if needed
   */
  private maybeAddSpace(): void {
    if (this._addSpace && this._buffer.length > 0) {
      const last = this._buffer[this._buffer.length - 1];
      if (last !== '\n' && !last.endsWith(' ') && last !== '[' && last !== '{') {
        this._buffer.push(' ');
      }
    }
  }

  /**
   * Helper for tests to inspect buffer contents
   * @internal
   */
  getBuffer(): string[] {
    return [...this._buffer];
  }

  /**
   * Set the contents of the buffer directly (for testing only)
   * @internal
   */
  setBuffer(contents: string[]): void {
    this._buffer = [...contents];
  }
}

/**
 * Create and return a QDebug instance for console output
 */
export function qDebug(): QDebug {
  return QDebug.console();
}
