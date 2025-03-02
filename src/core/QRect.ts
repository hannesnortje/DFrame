import { QPoint } from './QPoint';
import { QSize } from './QSize';

/**
 * A class representing a rectangle
 */
export class QRect {
  // Make properties available for access
  public _x: number;
  public _y: number;
  public _width: number;
  public _height: number;
  
  /**
   * Creates a new QRect
   */
  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
  }
  
  /**
   * Returns the x coordinate
   */
  x(): number {
    return this._x;
  }
  
  /**
   * Returns the y coordinate
   */
  y(): number {
    return this._y;
  }
  
  /**
   * Returns the width
   */
  width(): number {
    return this._width;
  }
  
  /**
   * Returns the height
   */
  height(): number {
    return this._height;
  }
  
  /**
   * Returns the left coordinate
   */
  left(): number {
    return this._x;
  }
  
  /**
   * Returns the top coordinate
   */
  top(): number {
    return this._y;
  }
  
  /**
   * Returns the right coordinate
   */
  right(): number {
    return this._x + this._width;
  }
  
  /**
   * Returns the bottom coordinate
   */
  bottom(): number {
    return this._y + this._height;
  }
  
  /**
   * Returns the size of the rectangle
   */
  getSize(): QSize {
    return new QSize(this._width, this._height);
  }
  
  /**
   * Sets the size of the rectangle
   */
  setSize(size: QSize | { width: number, height: number }): void {
    if (size instanceof QSize) {
      this._width = size._width;
      this._height = size._height;
    } else {
      this._width = size.width;
      this._height = size.height;
    }
  }
  
  /**
   * Returns the top-left point
   */
  topLeft(): QPoint {
    return new QPoint(this._x, this._y);
  }
  
  /**
   * Alias for topLeft (backward compatibility)
   */
  getTopLeft(): QPoint {
    return this.topLeft();
  }
  
  /**
   * Returns the bottom-right point
   */
  bottomRight(): QPoint {
    return new QPoint(this.right(), this.bottom());
  }
  
  /**
   * Moves the rectangle to the given position
   */
  moveTopLeft(point: QPoint | { x: number, y: number }): void {
    if (point instanceof QPoint) {
      this._x = point._x;
      this._y = point._y;
    } else {
      this._x = point.x;
      this._y = point.y;
    }
  }
  
  /**
   * Checks if the rectangle is empty
   */
  isEmpty(): boolean {
    return this._width <= 0 || this._height <= 0;
  }
  
  /**
   * Checks if the rectangle is valid
   */
  isValid(): boolean {
    return this._width > 0 && this._height > 0;
  }
  
  /**
   * Checks if the rectangle is null
   */
  isNull(): boolean {
    return this._width === 0 && this._height === 0;
  }
  
  /**
   * Checks if the rectangle contains the point
   * @param point The point to check
   * @param proper If true, the point must be fully inside (not on the edge)
   */
  contains(point: QPoint | { x: number, y: number }, proper: boolean = false): boolean {
    let px: number, py: number;
    
    if (point instanceof QPoint) {
      px = point._x;
      py = point._y;
    } else {
      px = point.x;
      py = point.y;
    }
    
    if (proper) {
      return px > this._x && px < (this._x + this._width) && 
             py > this._y && py < (this._y + this._height);
    } else {
      return px >= this._x && px <= (this._x + this._width) && 
             py >= this._y && py <= (this._y + this._height);
    }
  }
  
  /**
   * Checks if the rectangle intersects with another
   */
  intersects(other: QRect): boolean {
    return !(this.right() <= other.left() || 
             other.right() <= this.left() ||
             this.bottom() <= other.top() ||
             other.bottom() <= this.top());
  }
  
  /**
   * Creates a new rectangle that is the intersection of this and other
   */
  intersected(other: QRect): QRect {
    if (!this.intersects(other)) {
      return new QRect();
    }
    
    const left = Math.max(this._x, other._x);
    const top = Math.max(this._y, other._y);
    const right = Math.min(this._x + this._width, other._x + other._width);
    const bottom = Math.min(this._y + this._height, other._y + other._height);
    
    return new QRect(left, top, right - left, bottom - top);
  }
  
  /**
   * Creates a new rectangle that is the union of this and other
   */
  united(other: QRect): QRect {
    const left = Math.min(this._x, other._x);
    const top = Math.min(this._y, other._y);
    const right = Math.max(this._x + this._width, other._x + other._width);
    const bottom = Math.max(this._y + this._height, other._y + other._height);
    
    return new QRect(left, top, right - left, bottom - top);
  }
  
  /**
   * Returns a copy of the rectangle
   */
  clone(): QRect {
    return new QRect(this._x, this._y, this._width, this._height);
  }
  
  /**
   * Compares with another rectangle
   */
  equals(other: QRect): boolean {
    return this._x === other._x && 
           this._y === other._y && 
           this._width === other._width && 
           this._height === other._height;
  }
  
  /**
   * Returns a string representation
   */
  toString(): string {
    return `QRect(${this._x}, ${this._y}, ${this._width}, ${this._height})`;
  }
  
  /**
   * Create a QRect from an object with x, y, width, height properties
   */
  static fromObject(obj: { x: number, y: number, width: number, height: number }): QRect {
    return new QRect(obj.x, obj.y, obj.width, obj.height);
  }
}
