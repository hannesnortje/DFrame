/**
 * Utility functions for the DFrame library
 */

/**
 * Safely get a nested property from an object
 * @param obj The object to get the property from
 * @param path The path to the property (e.g. 'a.b.c')
 * @param defaultValue The default value if the property doesn't exist
 */
export function get<T>(obj: any, path: string, defaultValue?: T): T | undefined {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined || typeof result !== 'object') {
      return defaultValue;
    }
    
    result = result[key];
  }
  
  return (result === undefined) ? defaultValue : result as T;
}

/**
 * Debounce a function to prevent multiple calls in rapid succession
 * @param func The function to debounce
 * @param wait The time to wait in milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: number | null = null;
  
  return function(this: any, ...args: Parameters<T>): void {
    const context = this;
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = window.setTimeout(() => {
      func.apply(context, args);
      timeout = null;
    }, wait);
  };
}

/**
 * Throttle a function to limit the rate at which it executes
 * @param func The function to throttle
 * @param limit The time limit in milliseconds
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeout: number | null = null;
  
  return function(this: any, ...args: Parameters<T>): void {
    const context = this;
    const now = Date.now();
    
    if (now - lastCall < limit) {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      
      timeout = window.setTimeout(() => {
        lastCall = now;
        func.apply(context, args);
      }, limit - (now - lastCall));
    } else {
      lastCall = now;
      func.apply(context, args);
    }
  };
}

/**
 * Generate a unique ID
 */
export function uniqueId(prefix: string = ''): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`;
}

/**
 * Check if a value is an object (not null, not array)
 */
export function isObject(value: any): boolean {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Convert camelCase to kebab-case
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert kebab-case to camelCase
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}
