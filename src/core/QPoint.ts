/**
 * Represents a point in 2D space
 */
export class QPoint {
  // Make properties accessible 
  public _x: number;
  public _y: number;
  
  constructor(x: number = 0, y: number = 0) {
    this._x = x;
    this._y = y;
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
   * Alias for x coordinate for backward compatibility
   */
  getX(): number {
    return this._x;
  }
  
  /**
   * Alias for y coordinate for backward compatibility
   */
  getY(): number {
    return this._y;
  }
  
  /**
   * Sets the x coordinate
   */
  setX(x: number): void {
    this._x = x;
  }
  
  /**
   * Sets the y coordinate
   */
  setY(y: number): void {
    this._y = y;
  }
  
  /**
   * Adds another point to this point (returns a new point)
   */
  add(other: QPoint): QPoint {
    return new QPoint(this._x + other._x, this._y + other._y);
  }
  
  /**
   * Subtracts another point from this point (returns a new point)
   */
  subtract(other: QPoint): QPoint {
    return new QPoint(this._x - other._x, this._y - other._y);
  }
  
  /**
   * Multiplies this point by a factor (returns a new point)
   */
  multiply(factor: number): QPoint {
    return new QPoint(this._x * factor, this._y * factor);
  }
  
  /**
   * Divides this point by a factor (returns a new point)
   */
  divide(factor: number): QPoint {
    if (factor === 0) {
      throw new Error('Division by zero');
    }
    return new QPoint(this._x / factor, this._y / factor);
  }
  
  /**
   * Returns a new point that is the sum of this and another point
   */
  plus(other: QPoint): QPoint {
    return this.add(other);
  }
  
  /**
   * Returns a new point that is the difference of this and another point
   */
  minus(other: QPoint): QPoint {
    return this.subtract(other);
  }
  
  /**
   * Returns the Manhattan length (absolute x + absolute y)
   */
  manhattanLength(): number {
    return Math.abs(this._x) + Math.abs(this._y);
  }
  
  /**
   * Returns the Euclidean distance from origin
   */
  length(): number {
    return Math.sqrt(this._x * this._x + this._y * this._y);
  }
  
  /**
   * Checks if the point is null (both coordinates are 0)
   */
  isNull(): boolean {
    return this._x === 0 && this._y === 0;
  }
  
  /**
   * Checks equality with another point
   */
  equals(other: QPoint): boolean {
    return this._x === other._x && this._y === other._y;
  }
  
  /**
   * Creates a clone of this point
   */
  clone(): QPoint {
    return new QPoint(this._x, this._y);
  }
  
  /**
   * Returns a string representation
   */
  toString(): string {
    return `QPoint(${this._x}, ${this._y})`;
  }
}
