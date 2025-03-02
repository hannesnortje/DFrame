import { QWidget } from '../core/QWidget';
import { QObject } from '../core/QObject';

/**
 * Layout direction enum for QBoxLayout
 */
export enum Direction {
  LeftToRight = 0,
  RightToLeft = 1,
  TopToBottom = 2,
  BottomToTop = 3
}

/**
 * Layout item interface
 */
export interface LayoutItem {
  widget: QWidget;
  stretch: number;
  alignment?: number;
}

/**
 * A box layout class that arranges widgets in a line
 */
export class QBoxLayout extends QObject {
  // Export the Direction enum as a static property
  static readonly LeftToRight = Direction.LeftToRight;
  static readonly RightToLeft = Direction.RightToLeft;
  static readonly TopToBottom = Direction.TopToBottom;
  static readonly BottomToTop = Direction.BottomToTop;
  
  // Make direction accessible for tests
  direction: Direction;
  
  // Make items accessible for tests
  items: LayoutItem[] = [];
  
  private _spacing: number = 6;
  private _margin: number = 9;
  private _parentWidget: QWidget | null = null;
  
  /**
   * Create a new box layout with the specified direction
   */
  constructor(direction: Direction = Direction.LeftToRight) {
    super(null);
    this.direction = direction;
  }
  
  /**
   * Add a widget to the layout
   */
  addWidget(widget: QWidget, stretch: number = 0, alignment?: number): void {
    this.items.push({
      widget,
      stretch,
      alignment
    });
    
    if (this._parentWidget) {
      widget.setParent(this._parentWidget);
      this.update();
    }
    
    this.emit('layoutChanged');
  }
  
  /**
   * Insert a widget at a specific index
   */
  insertWidget(index: number, widget: QWidget, stretch: number = 0, alignment?: number): void {
    // Ensure index is valid
    if (index < 0) index = 0;
    if (index > this.items.length) index = this.items.length;
    
    this.items.splice(index, 0, {
      widget,
      stretch,
      alignment
    });
    
    if (this._parentWidget) {
      widget.setParent(this._parentWidget);
      this.update();
    }
    
    this.emit('layoutChanged');
  }
  
  /**
   * Remove a widget from the layout
   */
  removeWidget(widget: QWidget): void {
    const index = this.items.findIndex(item => item.widget === widget);
    
    if (index !== -1) {
      this.items.splice(index, 1);
      
      if (this._parentWidget) {
        widget.setParent(null);
        this.update();
      }
      
      this.emit('layoutChanged');
    }
  }
  
  /**
   * Get item at specific index
   */
  itemAt(index: number): LayoutItem | null {
    if (index < 0 || index >= this.items.length) {
      return null;
    }
    return this.items[index];
  }
  
  /**
   * Get number of items in layout
   */
  count(): number {
    return this.items.length;
  }
  
  /**
   * Add a stretchable space
   */
  addStretch(stretch: number = 0): void {
    // Create a dummy QWidget as a placeholder
    const stretchWidget = new QWidget();
    stretchWidget.setObjectName('stretch-spacer');
    
    // Add to items with the stretch factor
    this.items.push({
      widget: stretchWidget,
      stretch
    });
    
    if (this._parentWidget) {
      stretchWidget.setParent(this._parentWidget);
      this.update();
    }
    
    this.emit('layoutChanged');
  }
  
  /**
   * Set the parent widget for this layout
   */
  setParentWidget(widget: QWidget): void {
    this._parentWidget = widget;
    
    // Set the parent for all widgets in the layout
    for (const item of this.items) {
      if (item.widget) {
        item.widget.setParent(widget);
      }
    }
    
    this.update();
    this.emit('layoutChanged');
  }
  
  /**
   * Set the layout for a widget
   */
  setLayout(layout: QBoxLayout): void {
    if (this._parentWidget) {
      layout.setParentWidget(this._parentWidget);
    }
  }
  
  /**
   * Set the spacing between items
   */
  setSpacing(spacing: number): void {
    this._spacing = spacing;
    this.update();
    this.emit('layoutChanged');
  }
  
  /**
   * Get the spacing between items
   */
  getSpacing(): number {
    return this._spacing;
  }
  
  /**
   * Set the margin around the layout
   */
  setMargin(margin: number): void {
    this._margin = margin;
    this.update();
    this.emit('layoutChanged');
  }
  
  /**
   * Get the margin around the layout
   */
  getMargin(): number {
    return this._margin;
  }
  
  /**
   * Set the layout direction
   */
  setDirection(direction: Direction): void {
    this.direction = direction;
    this.update();
    this.emit('layoutChanged');
  }
  
  /**
   * Get the layout direction
   */
  getDirection(): Direction {
    return this.direction;
  }
  
  /**
   * Updates the layout
   */
  update(): void {
    if (!this._parentWidget) return;
    
    const rect = this._parentWidget.geometry();
    const isHorizontal = this.direction === Direction.LeftToRight || 
                         this.direction === Direction.RightToLeft;
    
    // First pass: calculate minimum required space and total stretch factors
    let totalStretch = 0;
    let itemCount = 0;
    let totalMinimumSpace = 0;
    const minimumSizes: number[] = [];
    
    // Calculate minimum sizes and total stretch
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (!item.widget) {
        minimumSizes.push(0);
        continue;
      }
      
      // Get minimum size
      let minSize = 0;
      if (isHorizontal) {
        minSize = item.widget.minimumSize().width();
      } else {
        minSize = item.widget.minimumSize().height();
      }
      
      // If minimum size is not set, use a reasonable default
      if (minSize <= 0) {
        minSize = isHorizontal ? 10 : 10;
      }
      
      minimumSizes.push(minSize);
      totalMinimumSpace += minSize;
      totalStretch += item.stretch > 0 ? item.stretch : 1;
      itemCount++;
    }
    
    // Calculate available space
    let availableSpace = isHorizontal ? rect.width() : rect.height();
    availableSpace -= this._margin * 2; // margins on both sides
    availableSpace -= this._spacing * (Math.max(0, itemCount - 1)); // spacing between items
    
    // If available space is less than minimum required, use minimum sizes
    const useMinimumSizes = availableSpace < totalMinimumSpace;
    
    // Calculate freeSpace (space available after allocating minimums)
    const freeSpace = Math.max(0, availableSpace - totalMinimumSpace);
    
    // Calculate starting position
    let pos = this._margin;
    if (this.direction === Direction.RightToLeft) {
      pos = rect.width() - this._margin;
    } else if (this.direction === Direction.BottomToTop) {
      pos = rect.height() - this._margin;
    }
    
    // Second pass: allocate space to widgets
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (!item.widget) continue;
      
      // Start with minimum size
      let size = minimumSizes[i];
      
      // Add extra space according to stretch factor if available
      if (!useMinimumSizes && freeSpace > 0 && totalStretch > 0) {
        const stretch = item.stretch > 0 ? item.stretch : 1;
        const extraSpace = Math.floor(freeSpace * (stretch / totalStretch));
        size += extraSpace;
      }
      
      // Calculate item geometry
      let x = 0;
      let y = 0;
      let width = 0;
      let height = 0;
      
      if (this.direction === Direction.LeftToRight) {
        x = pos;
        y = this._margin;
        width = size;
        height = rect.height() - this._margin * 2;
        pos += size + this._spacing;
      } else if (this.direction === Direction.RightToLeft) {
        x = pos - size;
        y = this._margin;
        width = size;
        height = rect.height() - this._margin * 2;
        pos = x - this._spacing;
      } else if (this.direction === Direction.TopToBottom) {
        x = this._margin;
        y = pos;
        width = rect.width() - this._margin * 2;
        height = size;
        pos += size + this._spacing;
      } else { // BottomToTop
        x = this._margin;
        y = pos - size;
        width = rect.width() - this._margin * 2;
        height = size;
        pos = y - this._spacing;
      }
      
      // Apply size constraints from min/max sizes
      if (isHorizontal) {
        const maxWidth = item.widget.maximumSize().width();
        if (maxWidth > 0 && width > maxWidth) width = maxWidth;
        
        const minWidth = item.widget.minimumSize().width();
        if (minWidth > 0 && width < minWidth) width = minWidth;
      } else {
        const maxHeight = item.widget.maximumSize().height();
        if (maxHeight > 0 && height > maxHeight) height = maxHeight;
        
        const minHeight = item.widget.minimumSize().height();
        if (minHeight > 0 && height < minHeight) height = minHeight;
      }
      
      // Set the geometry
      item.widget.setGeometry({ x, y, width, height });
    }
  }
}
