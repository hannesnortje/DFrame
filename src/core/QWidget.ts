import { QObject, Property } from './QObject';
import { QEvent, QEventType } from './QEvent';
import { QPoint } from './QPoint';
import { QSize } from './QSize';
import { QRect } from './QRect';
import { QApplication } from './QApplication';
import { QFont } from '../style/QFont';

/**
 * Base class for all UI widgets
 */
export class QWidget extends QObject {
  // Element properties
  private _element: HTMLElement;
  private _widgetParent: QWidget | null = null;
  private _widgetChildren: QWidget[] = [];
  
  // UI state properties
  private _visible: boolean = true;
  private _enabled: boolean = true;
  private _styleSheet: string = '';
  
  // Position and size properties
  private _x: number = 0;
  private _y: number = 0;
  private _width: number = 100;
  private _height: number = 100;
  
  // Static registry for all active widgets
  private static activeWidgets: Set<QWidget> = new Set<QWidget>();
  
  // Properties needed by various methods
  private _layout: any;
  private _minimumSize: QSize | null = null;
  private _maximumSize: QSize | null = null;
  private _horizontal: number = 0;
  private _vertical: number = 0;
  private _hasFocus: boolean = false;
  private _isHovered: boolean = false;
  
  /**
   * Creates a new QWidget instance
   * @param parent Optional parent widget
   */
  constructor(parent: QWidget | null = null) {
    super(parent);
    
    console.log('QWidget: Creating new widget');
    this._element = document.createElement('div');
    this._element.className = 'qwidget';
    
    // Set essential styles
    this._element.style.cssText = `
      position: absolute;
      box-sizing: border-box;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      min-width: 10px;
      min-height: 10px;
      background: white;
    `;
    
    // Set up parent relationship
    if (parent) {
      console.log('QWidget: Setting parent widget');
      this.setWidgetParent(parent);
    }
    
    this.updateElement();
    this.applyThemeStyle();
    QWidget.activeWidgets.add(this);
  }
  
  /**
   * Clean up resources
   */
  destroy(): void {
    // Remove from parent if any
    if (this._widgetParent) {
      this._widgetParent._widgetChildren = this._widgetParent._widgetChildren.filter(child => child !== this);
      this._widgetParent = null;
    }
    
    // Remove element from DOM
    if (this._element && this._element.parentNode) {
      this._element.parentNode.removeChild(this._element);
    }
    
    // Unregister this widget
    QWidget.activeWidgets.delete(this);
    
    // Destroy all children
    while (this._widgetChildren.length > 0) {
      const child = this._widgetChildren[0];
      child.destroy();
    }
    
    super.destroy();
  }
  
  /**
   * Returns the DOM element for this widget
   */
  get element(): HTMLElement {
    return this._element;
  }
  
  /**
   * Update the DOM element properties based on current state
   */
  public updateElement(): void {
    const styles = {
      position: 'absolute',
      left: `${this._x}px`,
      top: `${this._y}px`,
      width: `${this._width}px`,
      height: `${this._height}px`,
      boxSizing: 'border-box',
      display: 'block',
      visibility: 'visible',
      opacity: '1',
      overflow: 'visible',
      backgroundColor: 'white'
    };
    
    Object.assign(this._element.style, styles);
    
    // Force GPU acceleration
    this._element.style.transform = 'translateZ(0)';
    
    // Force a reflow
    this._element.offsetHeight;
    
    console.log('QWidget: Updated element styles', {
      widget: this,
      styles,
      computed: window.getComputedStyle(this._element)
    });
  }
  
  /**
   * Apply theme styling to the widget
   */
  protected applyThemeStyle(themeStyle?: any): void {
    // Apply base styling
    if (themeStyle) {
      this._element.style.backgroundColor = themeStyle.background || this._element.style.backgroundColor;
      this._element.classList.add(themeStyle.className || '');
    }
    
    // Update element with current properties
    this.updateElement();
  }
  
  /**
   * Set the parent widget
   * @param parent The parent widget or null to remove from parent
   */
  setWidgetParent(parent: QWidget | null): void {
    // Remove from old parent
    if (this._widgetParent) {
      this._widgetParent._widgetChildren = this._widgetParent._widgetChildren.filter(child => child !== this);
      
      if (this._element.parentElement) {
        this._element.parentElement.removeChild(this._element);
      }
    }
    
    // Set new parent
    this._widgetParent = parent;
    
    // Add to new parent's children array and DOM element
    if (parent) {
      parent._widgetChildren.push(this);
      
      if (parent.element) {
        parent.element.appendChild(this._element);
      }
    }
  }
  
  /**
   * Sets the geometry of the widget
   * @param rect Rectangle specifying position and size
   */
  setGeometry(rect: QRect): void {
    const originalRect = this.geometry();
    
    // Update properties
    this._x = rect.x();
    this._y = rect.y();
    this._width = rect.width();
    this._height = rect.height();
    
    // Update element
    this._element.style.left = this._x + 'px';
    this._element.style.top = this._y + 'px';
    this._element.style.width = this._width + 'px';
    this._element.style.height = this._height + 'px';
    
    // Update children if needed
    if (originalRect.width() !== rect.width() || originalRect.height() !== rect.height()) {
      this._element.dispatchEvent(new Event('resize'));
      
      // Notify layout if one exists
      if (this._layout) {
        this._layout.invalidate();
      }
    }
  }
  
  /**
   * Returns the current geometry as a QRect
   */
  geometry(): QRect {
    return new QRect(this._x, this._y, this._width, this._height);
  }
  
  /**
   * Define getters and setters for properties
   */
  // Width property
  get width(): number {
    return this._width;
  }
  
  set width(value: number) {
    if (this._width !== value) {
      this._width = value;
      this._element.style.width = value + 'px';
    }
  }
  
  // Height property
  get height(): number {
    return this._height;
  }
  
  set height(value: number) {
    if (this._height !== value) {
      this._height = value;
      this._element.style.height = value + 'px';
    }
  }
  
  // X position
  get x(): number {
    return this._x;
  }
  
  set x(value: number) {
    if (this._x !== value) {
      this._x = value;
      this._element.style.left = value + 'px';
    }
  }
  
  // Y position
  get y(): number {
    return this._y;
  }
  
  set y(value: number) {
    if (this._y !== value) {
      this._y = value;
      this._element.style.top = value + 'px';
    }
  }
  
  /**
   * Moves widget to the specified position
   * @param x X coordinate
   * @param y Y coordinate
   */
  move(x: number, y: number): void;
  move(point: QPoint): void;
  move(pointOrX: QPoint | number, y?: number): void {
    if (typeof pointOrX === 'number' && typeof y === 'number') {
      this._x = pointOrX;
      this._y = y;
    } else if (pointOrX instanceof QPoint) {
      this._x = pointOrX.x();
      this._y = pointOrX.y();
    }
    
    this._element.style.left = this._x + 'px';
    this._element.style.top = this._y + 'px';
  }
  
  /**
   * Resizes the widget
   * @param width New width
   * @param height New height
   */
  resize(width: number, height: number): void;
  resize(size: QSize): void;
  resize(sizeOrWidth: QSize | number, height?: number): void {
    if (typeof sizeOrWidth === 'number' && typeof height === 'number') {
      this._width = sizeOrWidth;
      this._height = height;
    } else if (sizeOrWidth instanceof QSize) {
      this._width = sizeOrWidth.width();
      this._height = sizeOrWidth.height();
    }
    
    this._element.style.width = this._width + 'px';
    this._element.style.height = this._height + 'px';
    
    // Notify layout if one exists
    if (this._layout) {
      this._layout.invalidate();
    }
  }
  
  /**
   * Sets fixed width and height for this widget
   */
  setFixedSize(width: number, height: number): void;
  setFixedSize(size: QSize): void;
  setFixedSize(sizeOrWidth: QSize | number, height?: number): void {
    if (sizeOrWidth instanceof QSize) {
      this.setMinimumSize(sizeOrWidth);
      this.setMaximumSize(sizeOrWidth);
    } else if (typeof sizeOrWidth === 'number' && typeof height === 'number') {
      this.setMinimumSize(sizeOrWidth, height);
      this.setMaximumSize(sizeOrWidth, height);
    }
  }

  /**
   * Shows the widget
   */
  show(): void {
    console.log('QWidget: Show called', this);
    
    // Force visibility
    this._visible = true;
    this._element.style.display = 'block';
    this._element.style.visibility = 'visible';
    this._element.style.opacity = '1';
    
    // Register with application if top-level widget
    if (!this._widgetParent) {
      const app = QApplication.instance();
      if (app) {
        console.log('QWidget: Registering top-level widget');
        (app as QApplication).registerWidget(this);
      }
    }
    
    // Update all children
    this._widgetChildren.forEach(child => {
      if (child.isVisible()) {
        child.updateElement();
      }
    });
    
    this.updateElement();
    this.emit('shown');
    
    console.log('QWidget: Show complete', {
      element: this._element,
      visible: this._visible,
      display: this._element.style.display,
      computed: window.getComputedStyle(this._element)
    });
  }
  
  /**
   * Hides the widget
   */
  hide(): void {
    if (this._visible) {
      this._visible = false;
      this._element.style.display = 'none';
      this._element.dispatchEvent(new Event('hide'));
      // Fix: Change line 435 to emit with correct argument count
      this.emit('hidden');
    }
    
    // Emit a hide event
    const event = new QEvent(QEventType.Hide);
    this.event(event);
  }
  
  /**
   * Returns true if the widget is visible
   */
  isVisible(): boolean {
    return this._visible;
  }
  
  /**
   * Enables or disables the widget
   * @param enabled True to enable, false to disable
   */
  setEnabled(enabled: boolean): void {
    if (this._enabled !== enabled) {
      this._enabled = enabled;
      this._element.classList.toggle('disabled', !enabled);
      this.emit('enabledChanged', enabled);
    }
    
    // Update all child widgets as well
    for (const child of this._widgetChildren) {
      child.setEnabled(enabled);
    }
  }
  
  /**
   * Returns true if the widget is enabled
   */
  isEnabled(): boolean {
    return this._enabled;
  }
  
  /**
   * Sets the parent widget
   */
  setParent(parent: QWidget | null): void {
    this.setWidgetParent(parent);
  }
  
  /**
   * Gets the parent widget
   */
  parent(): QWidget | null {
    return this._widgetParent;
  }
  
  /**
   * Sets the widget font
   * @param font Font string (CSS format)
   */
  setFont(font: QFont | string): void {
    if (font instanceof QFont) {
      this._element.style.cssText += font.toCss();
    } else {
      this._element.style.cssText += font;
    }
  }
  
  /**
   * Returns the widget font
   */
  font(): string {
    return this._element.style.font;
  }
  
  /**
   * Sets the cursor for the widget
   * @param cursor CSS cursor value
   */
  setCursor(cursor: string): void {
    if (cursor) {
      this._element.style.cursor = cursor;
      this.emit('cursorChanged', cursor);
    }
  }
  
  /**
   * Returns the cursor for this widget
   */
  cursor(): string {
    return this._element.style.cursor;
  }
  
  /**
   * Sets the palette (color) for a specific role
   * @param role The role name
   * @param color CSS color string
   */
  setPalette(role: string, color: string): void {
    if (role === 'background') {
      this._element.style.backgroundColor = color;
    } else if (role === 'foreground') {
      this._element.style.color = color;
    } else if (role === 'border') {
      this._element.style.borderColor = color;
    }
    
    // Fix line 435: Change to use single argument object instead of multiple arguments
    this.emit('paletteChanged', { role, color });
  }
  
  /**
   * Returns the palette color for a specific role
   * @param role The role name
   * @returns CSS color string or undefined
   */
  palette(role: string): string | undefined {
    if (role === 'background') {
      return this._element.style.backgroundColor;
    } else if (role === 'foreground') {
      return this._element.style.color;
    } else if (role === 'border') {
      return this._element.style.borderColor;
    }
    
    return undefined;
  }
  
  /**
   * Brings the widget to the front of its siblings
   */
  raise(): void {
    if (this._widgetParent) {
      // Find the highest z-index among siblings
      const siblings = this._widgetParent._widgetChildren;
      const highestZIndex = siblings.reduce((highest, widget) => {
        const zIndex = parseInt(widget._element.style.zIndex || '0', 10);
        return Math.max(highest, zIndex);
      }, 0);
      
      // Set our z-index one higher
      this._element.style.zIndex = (highestZIndex + 1).toString();
    }
  }
  
  /**
   * Sends the widget to the back of its siblings
   */
  lower(): void {
    if (this._widgetParent) {
      // Find the lowest z-index among siblings
      const siblings = this._widgetParent._widgetChildren;
      const lowestZIndex = siblings.reduce((lowest, widget) => {
        const zIndex = parseInt(widget._element.style.zIndex || '0', 10);
        return Math.min(lowest, zIndex);
      }, 0);
      
      // Set our z-index one lower
      this._element.style.zIndex = (lowestZIndex - 1).toString();
    }
  }
  
  /**
   * Stacks this widget under the specified widget
   */
  stackUnder(widget: QWidget): void {
    if (this._widgetParent && this._widgetParent === widget._widgetParent) {
      const targetZIndex = parseInt(widget._element.style.zIndex || '0', 10);
      this._element.style.zIndex = (targetZIndex - 1).toString();
    }
  }
  
  /**
   * Updates style from application theme or stylesheet
   * @param styleSheet CSS string to apply
   */
  updateStyleFromApplication(styleSheet: string): void {
    // Store local stylesheet
    this._styleSheet = styleSheet;
    
    // Apply the style
    const mergedStyle = this._styleSheet;
    this.updateElement();
    
    // Apply to any children
    for (const child of this._widgetChildren) {
      child.updateStyleFromApplication(mergedStyle);
    }
  }
  
  /**
   * Sets a style sheet for this widget
   * @param styleSheet CSS style sheet
   */
  setStyleSheet(styleSheet: string): void {
    this._styleSheet = styleSheet;
    this._element.style.cssText += styleSheet;
  }
  
  /**
   * Gets the style sheet for this widget
   */
  styleSheet(): string {
    return this._styleSheet;
  }
  
  /**
   * Sets the size policy for the widget
   * @param horizontal Horizontal policy (number)
   * @param vertical Vertical policy (number)
   */
  setSizePolicy(horizontal: number, vertical: number): void {
    this._horizontal = horizontal;
    this._vertical = vertical;
    
    this._element.dataset.horizontalPolicy = horizontal.toString();
    this._element.dataset.verticalPolicy = vertical.toString();
  }
  
  /**
   * Sets the minimum size for this widget
   * @param size QSize instance or width and height
   */
  setMinimumSize(size: QSize): void;
  setMinimumSize(width: number, height: number): void;
  setMinimumSize(sizeOrWidth: QSize | number, height?: number): void {
    const originalSize = this._minimumSize || new QSize(0, 0);
    
    // Update minimum size
    if (sizeOrWidth instanceof QSize) {
      this._minimumSize = sizeOrWidth;
    } else if (typeof sizeOrWidth === 'number' && typeof height === 'number') {
      this._minimumSize = new QSize(sizeOrWidth, height);
    }
    
    // Update widget size if current size is less than minimum
    if (this._minimumSize && (this._width < this._minimumSize.width() || this._height < this._minimumSize.height())) {
      this._element.style.minWidth = this._minimumSize.width() + 'px';
      this._element.style.minHeight = this._minimumSize.height() + 'px';
      
      // Resize if below minimum size
      this.resize(
        Math.max(this._width, this._minimumSize.width()),
        Math.max(this._height, this._minimumSize.height())
      );
    }
  }
  
  /**
   * Gets the minimum size for this widget
   */
  minimumSize(): QSize {
    return this._minimumSize || new QSize(0, 0);
  }
  
  /**
   * Sets the maximum size for this widget
   * @param size QSize instance or width and height
   */
  setMaximumSize(size: QSize): void;
  setMaximumSize(width: number, height: number): void;
  setMaximumSize(sizeOrWidth: QSize | number, height?: number): void {
    const originalSize = this._maximumSize || new QSize(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    
    // Update maximum size
    if (sizeOrWidth instanceof QSize) {
      this._maximumSize = sizeOrWidth;
    } else if (typeof sizeOrWidth === 'number' && typeof height === 'number') {
      this._maximumSize = new QSize(sizeOrWidth, height);
    }
    
    // Update widget size if current size is more than maximum
    if (this._maximumSize && (this._width > this._maximumSize.width() || this._height > this._maximumSize.height())) {
      this._element.style.maxWidth = this._maximumSize.width() + 'px';
      this._element.style.maxHeight = this._maximumSize.height() + 'px';
      
      // Resize if above maximum size
      this.resize(
        Math.min(this._width, this._maximumSize.width()),
        Math.min(this._height, this._maximumSize.height())
      );
    }
  }
  
  /**
   * Gets the maximum size for this widget
   */
  maximumSize(): QSize {
    return this._maximumSize || new QSize(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
  }
  
  /**
   * Returns all child widgets
   */
  children(): QObject[] {
    return [...this._widgetChildren];
  }
  
  /**
   * Set the layout for this widget
   * @param layout Layout to use
   */
  setLayout(layout: any): void {
    this._layout = layout;
    if (layout && typeof layout.setParent === 'function') {
      layout.setParent(this);
    }
  }
  
  /**
   * Gets the layout for this widget
   */
  layout(): any {
    return this._layout;
  }
  
  /**
   * Sets a style object for the widget
   * @param style Style object with CSS properties
   */
  setStyle(style: any): void {
    // Apply all properties in the style object
    if (style) {
      for (const key in style) {
        if (style.hasOwnProperty(key)) {
          (this._element.style as any)[key] = style[key];
        }
      }
    }
  }
  
  /**
   * Gets the current style for the widget
   */
  getStyle(): any {
    return this._element.style;
  }
  
  /**
   * Update the widget style
   */
  updateStyle(): void {
    // Update element styles based on current widget state
    this._element.classList.toggle('qwidget-focused', this._hasFocus);
    this._element.classList.toggle('qwidget-hovered', this._isHovered);
  }
  
  /**
   * Handle event processing
   * @param event The event to process
   * @returns True if the event was handled, false otherwise
   */
  event(event: QEvent): boolean {
    // Handle base widget events
    switch (event.type()) {
      case QEventType.Show:
        this._element.classList.remove('hidden');
        break;
        
      case QEventType.Hide:
        this._element.classList.add('hidden');
        break;
        
      case QEventType.Resize:
        this._element.dispatchEvent(new Event('resize'));
        break;
        
      case QEventType.MouseMove: // Changed from Move to MouseMove
        this._element.dispatchEvent(new Event('move'));
        break;
        
      case QEventType.FocusIn:
        this._hasFocus = true;
        this._element.classList.add('focused');
        break;
        
      case QEventType.FocusOut:
        this._hasFocus = false;
        this._element.classList.remove('focused');
        break;
        
      case QEventType.MouseEnter: // Changed from Enter to MouseEnter
        this._isHovered = true;
        this._element.classList.add('hovered');
        break;
        
      case QEventType.MouseLeave: // Changed from Leave to MouseLeave
        this._isHovered = false;
        this._element.classList.remove('hovered');
        break;
        
      case QEventType.EnabledChanged: // Changed from EnabledChange to EnabledChanged
        this._element.classList.toggle('disabled', !this._enabled);
        break;
        
      case QEventType.Close:
        this.destroy();
        return true;
    }
    
    return super.event(event);
  }
  
  /**
   * Notify all active widgets of theme changes
   * @param id Theme ID
   */
  static notifyAllWidgetsOfThemeChange(id: string): void {
    for (const widget of QWidget.activeWidgets) {
      widget.onThemeChanged(id);
    }
  }
  
  /**
   * Handler for theme changes
   * @param themeId The theme ID that changed
   */
  onThemeChanged(themeId: string): void {
    // Apply theme styling for this widget
    if (this._element) {
      this.refreshStyleFromTheme();
    }
    
    // Notify children about theme change
    for (const child of this._widgetChildren) {
      child.onThemeChanged(themeId);
    }
  }
  
  /**
   * Refresh styling from the current theme
   * @param themeStyle Optional theme style to apply
   */
  refreshStyleFromTheme(themeStyle?: any): void {
    // Get current theme styles
    const newStyle = themeStyle || this.getThemeStyles();
    
    // Apply style
    if (newStyle) {
      this.applyThemeStyle(newStyle);
    }
    
    // Update element
    this.updateElement();
  }
  
  /**
   * Get theme styles for this widget
   */
  getThemeStyles(): any {
    // Default implementation - to be overridden by subclasses
    return {
      background: '#ffffff',
      color: '#000000'
    };
  }
}