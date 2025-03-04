import { QWidget } from '../core/QWidget';
import { QRect } from '../core/QRect';
import { QSize } from '../core/QSize';

/**
 * Layout direction
 */
export enum Direction {
  LeftToRight,
  RightToLeft,
  TopToBottom,
  BottomToTop
}

/**
 * Stretch factor and alignment information
 */
interface ItemInfo {
  widget: QWidget;
  stretch: number;
  alignment?: string;
}

/**
 * Base class for box layouts
 */
export class QBoxLayout {
  protected _direction: Direction;
  protected _spacing: number = 5;
  protected _margin: number = 10;
  protected _items: ItemInfo[] = [];
  protected _parent: QWidget | null = null;
  
  /**
   * Creates a new QBoxLayout
   * @param direction Direction of layout
   */
  constructor(direction: Direction = Direction.LeftToRight) {
    this._direction = direction;
  }
  
  /**
   * Sets the widget this layout is attached to
   */
  setParent(parent: QWidget | null): void {
    this._parent = parent;
    this.invalidate();
  }
  
  /**
   * Gets the parent widget
   */
  parent(): QWidget | null {
    return this._parent;
  }
  
  /**
   * Sets the direction of the layout
   */
  setDirection(direction: Direction): void {
    this._direction = direction;
    this.invalidate();
  }
  
  /**
   * Gets the direction of the layout
   */
  direction(): Direction {
    return this._direction;
  }
  
  /**
   * Sets the spacing between items
   */
  setSpacing(spacing: number): void {
    this._spacing = spacing;
    this.invalidate();
  }
  
  /**
   * Gets the spacing between items
   */
  spacing(): number {
    return this._spacing;
  }
  
  /**
   * Sets the margin around the layout
   */
  setMargin(margin: number): void {
    this._margin = margin;
    this.invalidate();
  }
  
  /**
   * Gets the margin around the layout
   */
  margin(): number {
    return this._margin;
  }
  
  /**
   * Adds a widget to the layout
   * @param widget Widget to add
   * @param stretch Stretch factor
   * @param alignment Optional alignment
   */
  addWidget(widget: QWidget, stretch: number = 0, alignment?: string): void {
    this._items.push({ 
      widget, 
      stretch, 
      alignment 
    });
    
    if (this._parent && widget.parent() !== this._parent) {
      widget.setParent(this._parent);
    }
    
    this.invalidate();
  }
  
  /**
   * Adds a stretch to the layout
   * @param stretch Stretch factor
   */
  addStretch(stretch: number = 1): void {
    // Create a dummy spacer widget
    const spacer = new QWidget();
    spacer.setMinimumSize(0, 0);
    spacer.setMaximumSize(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    
    if (this._parent) {
      spacer.setParent(this._parent);
    }
    
    this._items.push({ 
      widget: spacer, 
      stretch: stretch 
    });
    
    this.invalidate();
  }
  
  /**
   * Adds spacing to the layout
   * @param size Size of the spacing
   */
  addSpacing(size: number): void {
    // Create a fixed-size spacer widget
    const spacer = new QWidget();
    
    if (this._direction === Direction.LeftToRight || this._direction === Direction.RightToLeft) {
      spacer.setFixedSize(size, 0);
    } else {
      spacer.setFixedSize(0, size);
    }
    
    if (this._parent) {
      spacer.setParent(this._parent);
    }
    
    this._items.push({ 
      widget: spacer, 
      stretch: 0 
    });
    
    this.invalidate();
  }
  
  /**
   * Removes a widget from the layout
   * @param widget Widget to remove
   */
  removeWidget(widget: QWidget): void {
    const index = this._items.findIndex(item => item.widget === widget);
    
    if (index !== -1) {
      this._items.splice(index, 1);
      this.invalidate();
    }
  }
  
  /**
   * Removes all widgets from the layout
   */
  removeAllWidgets(): void {
    this._items = [];
    this.invalidate();
  }
  
  /**
   * Updates the layout
   */
  invalidate(): void {
    if (this._parent) {
      this.updateLayout();
    }
  }
  
  /**
   * Updates the layout geometry
   */
  updateLayout(): void {
    if (!this._parent) return;
    
    const rect = this._parent.geometry();
    const availableWidth = rect.width() - (this._margin * 2);
    const availableHeight = rect.height() - (this._margin * 2);
    
    // Calculate total stretch and fixed size
    let totalStretch = 0;
    let totalFixedSize = 0;
    
    for (const item of this._items) {
      if (item.stretch > 0) {
        totalStretch += item.stretch;
      } else {
        const size = this.isHorizontal() 
          ? item.widget.width
          : item.widget.height;
        totalFixedSize += size;
      }
    }
    
    // Add spacing
    if (this._items.length > 1) {
      totalFixedSize += (this._items.length - 1) * this._spacing;
    }
    
    // Calculate available space for stretched items
    const availableSizeForStretch = this.isHorizontal() 
      ? availableWidth - totalFixedSize
      : availableHeight - totalFixedSize;
    
    // Position items
    let pos = this._margin;
    
    for (let i = 0; i < this._items.length; i++) {
      const item = this._items[i];
      const widget = item.widget;
      let itemWidth: number;
      let itemHeight: number;
      
      // Calculate width and height
      if (this.isHorizontal()) {
        // Horizontal layout
        if (item.stretch > 0 && totalStretch > 0) {
          itemWidth = Math.floor((item.stretch / totalStretch) * availableSizeForStretch);
        } else {
          itemWidth = widget.width;
        }
        itemHeight = availableHeight;
      } else {
        // Vertical layout
        itemWidth = availableWidth;
        if (item.stretch > 0 && totalStretch > 0) {
          itemHeight = Math.floor((item.stretch / totalStretch) * availableSizeForStretch);
        } else {
          itemHeight = widget.height;
        }
      }
      
      // Set position and size
      if (this.isHorizontal()) {
        widget.setGeometry(new QRect(
          rect.x() + pos,
          rect.y() + this._margin,
          itemWidth,
          itemHeight
        ));
        pos += itemWidth + this._spacing;
      } else {
        widget.setGeometry(new QRect(
          rect.x() + this._margin,
          rect.y() + pos,
          itemWidth,
          itemHeight
        ));
        pos += itemHeight + this._spacing;
      }
    }
  }
  
  /**
   * Sets fixed width and height for a widget
   */
  private setFixedSize(widget: QWidget, width: number, height: number): void {
    widget.setMinimumSize(width, height);
    widget.setMaximumSize(width, height);
  }
  
  /**
   * Checks if the layout is horizontal
   */
  private isHorizontal(): boolean {
    return this._direction === Direction.LeftToRight || 
           this._direction === Direction.RightToLeft;
  }
}

/**
 * Horizontal box layout
 */
export class QHBoxLayout extends QBoxLayout {
  constructor() {
    super(Direction.LeftToRight);
  }
}

/**
 * Vertical box layout
 */
export class QVBoxLayout extends QBoxLayout {
  constructor() {
    super(Direction.TopToBottom);
  }
}

/**
 * Grid layout
 */
export class QGridLayout {
  private _parent: QWidget | null = null;
  private _grid: Map<string, QWidget> = new Map();
  private _spacing: number = 5;
  private _margin: number = 10;
  private _rows: number = 0;
  private _columns: number = 0;
  
  /**
   * Sets the parent widget
   */
  setParent(parent: QWidget | null): void {
    this._parent = parent;
    this.invalidate();
  }
  
  /**
   * Adds a widget to the grid
   */
  addWidget(widget: QWidget, row: number, column: number, rowSpan: number = 1, columnSpan: number = 1): void {
    const key = `${row},${column}`;
    this._grid.set(key, widget);
    
    // Update row and column count
    this._rows = Math.max(this._rows, row + rowSpan);
    this._columns = Math.max(this._columns, column + columnSpan);
    
    if (this._parent && widget.parent() !== this._parent) {
      widget.setParent(this._parent);
    }
    
    this.invalidate();
  }
  
  /**
   * Updates the layout
   */
  invalidate(): void {
    if (this._parent) {
      this.updateLayout();
    }
  }
  
  /**
   * Updates the layout geometry
   */
  updateLayout(): void {
    if (!this._parent) return;
    
    const rect = this._parent.geometry();
    const availableWidth = rect.width() - (this._margin * 2);
    const availableHeight = rect.height() - (this._margin * 2);
    
    const cellWidth = this._columns > 0 ? availableWidth / this._columns : 0;
    const cellHeight = this._rows > 0 ? availableHeight / this._rows : 0;
    
    // Position each widget in the grid
    this._grid.forEach((widget, key) => {
      const [row, column] = key.split(',').map(Number);
      
      const x = rect.x() + this._margin + (column * cellWidth);
      const y = rect.y() + this._margin + (row * cellHeight);
      
      widget.setGeometry(new QRect(x, y, cellWidth - this._spacing, cellHeight - this._spacing));
    });
  }
  
  /**
   * Sets the spacing between items
   */
  setSpacing(spacing: number): void {
    this._spacing = spacing;
    this.invalidate();
  }
  
  /**
   * Gets the spacing between items
   */
  spacing(): number {
    return this._spacing;
  }
  
  /**
   * Sets the margin around the layout
   */
  setMargin(margin: number): void {
    this._margin = margin;
    this.invalidate();
  }
  
  /**
   * Gets the margin around the layout
   */
  margin(): number {
    return this._margin;
  }
}
