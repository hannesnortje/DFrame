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
 * Debug output class similar to Qt's QDebug
 */
export class QDebug {
  private _output: string = '';
  private _space: boolean = true;
  private _context: string = '';
  
  /**
   * Creates a new QDebug instance
   * @param context Optional context string
   */
  constructor(context: string = '') {
    this._context = context;
    if (context) {
      this._output = `${context}: `;
    }
  }
  
  /**
   * Print a value and return this for chaining
   * @param value Value to print
   */
  print(value: any): QDebug {
    if (this._space && this._output.length > 0) {
      this._output += ' ';
    }
    
    if (value === null) {
      this._output += 'null';
    } else if (value === undefined) {
      this._output += 'undefined';
    } else if (typeof value === 'object' && typeof value.debugOutput === 'function') {
      value.debugOutput(this);
    } else {
      this._output += String(value);
    }
    
    return this;
  }
  
  /**
   * Prints a space and returns this for chaining
   */
  space(): QDebug {
    this._output += ' ';
    return this;
  }
  
  /**
   * Sets whether to automatically add spaces between items
   */
  maybeSpace(enable: boolean): QDebug {
    this._space = enable;
    return this;
  }
  
  /**
   * Disables automatic spacing
   */
  nospace(): QDebug {
    this._space = false;
    return this;
  }
  
  /**
   * Enables automatic spacing
   */
  setAutoSpace(): QDebug {
    this._space = true;
    return this;
  }
  
  /**
   * Returns the current output as a string
   */
  toString(): string {
    return this._output;
  }
  
  /**
   * Logs the current output to the console
   * @param level Optional log level (log, info, warn, error)
   */
  log(level: 'log' | 'info' | 'warn' | 'error' = 'log'): QDebug {
    console[level](this._output);
    return this;
  }
  
  /**
   * Resets the output to empty
   */
  reset(): QDebug {
    this._output = this._context ? `${this._context}: ` : '';
    return this;
  }
}

/**
 * Global function to create a QDebug instance and log a message
 */
export function qDebug(message?: string): QDebug {
  const debug = new QDebug();
  if (message) {
    debug.print(message);
  }
  return debug;
}
