import { QObject, ConnectionOptions, Signal } from './QObject';
import { QEvent, QEventType } from './QEvent';
import { QMap } from './containers/QMap';
import { QString } from './containers/QString';
import { QVariant } from './containers/QVariant';
import { QPoint } from './QPoint';
import { QSize } from './QSize';
import { QRect } from './QRect';
import { QStyle } from '../style/QStyle';
import { globalTheme } from '../style/QTheme';

/**
 * Widget state flags
 */
export enum WidgetState {
  None = 0,
  MouseOver = 1 << 0,
  Pressed = 1 << 1,
  Focused = 1 << 2,
  Disabled = 1 << 3,
  Hidden = 1 << 4
}

/**
 * Base class for all UI widgets
 * 
 * Note: QWidget inherits from QObject but has its own widget hierarchy management
 * in addition to the QObject parent-child relationships
 */
export class QWidget extends QObject {
  // Static registry to keep track of all active widgets
  private static activeWidgets: Set<QWidget> = new Set();

  // Use QMap for style properties
  private _styleProperties: QMap<string, QVariant> = new QMap<string, QVariant>();
  
  // Add style object to handle unified style approach
  protected style: QStyle;
  
  // Component type for theme integration
  protected componentType: string = '';
  
  // Use QString for text content
  private _text: QString = new QString('');
  
  // Widget state
  private _state: number = WidgetState.None;
  private _rect: QRect = new QRect(0, 0, 100, 30);
  private _visible: boolean = true;
  private _enabled: boolean = true;

  // Size policy and constraints
  private _minSize: QSize = new QSize(0, 0);
  private _maxSize: QSize = new QSize(16777215, 16777215);
  private _sizePolicy = { horizontal: 0, vertical: 0 };
  
  // Appearance
  private _palette = new Map<string, string>();
  private _font: string = '';
  private _cursor: string = '';
  private _styleSheet: string = '';

  // HTML element reference for DOM manipulation
  private _element: HTMLElement | null = null;
  
  // Widget hierarchy - separate from QObject hierarchy
  protected _widgetChildren: QWidget[] = [];
  protected _widgetParent: QWidget | null = null;
  
  constructor(parent?: QWidget) {
    super(parent);
    if (parent) {
      this.setWidgetParent(parent);
    }

    // Register this widget in the static registry
    QWidget.activeWidgets.add(this);
    
    // Set component type from constructor name by default
    this.componentType = this.constructor.name;
    
    // Initialize style object
    this.style = new QStyle();
    
    // Apply default theme styles if available
    try {
      const themeStyle = globalTheme.getStyle(this.componentType);
      if (themeStyle) {
        this.applyThemeStyle(themeStyle);
      }
    } catch (e) {
      // Theme might not be initialized yet, that's okay
    }
  }

  /**
   * Forward setObjectName from QObject
   */
  setObjectName(name: string): void {
    super.setObjectName(name);
  }

  /**
   * Forward objectName from QObject
   */
  objectName(): string {
    return super.objectName();
  }

  /**
   * Forward connect from QObject
   */
  connect<T>(signal: string, slot: (arg?: T) => void, options?: ConnectionOptions): number {
    return super.connect(signal, slot, options);
  }

  /**
   * Forward disconnect from QObject
   */
  disconnect<T>(signal: string, slot?: Signal<T>): void {
    super.disconnect(signal, slot);
  }

  /**
   * Forward emit from QObject
   */
  emit<T>(signal: string, arg?: T): void {
    super.emit(signal, arg);
  }
  
  /**
   * Sets the widget text using QString for proper Unicode handling
   */
  setText(text: string | QString): void {
    // Create/use QString for text content
    const newText = typeof text === 'string' ? new QString(text) : text;
    
    // Only update if text has changed - Fixed comparison
    if (this._text.toString() !== newText.toString()) {
      this._text = newText;
      this.updateElement();
      
      // Emit textChanged with QString
      this.emit('textChanged', this._text);
    }
  }
  
  /**
   * Returns the widget text as a QString
   */
  text(): QString {
    return this._text;
  }
  
  /**
   * Returns the text content as a plain string
   */
  plainText(): string {
    return this._text.toString();
  }
  
  /**
   * Sets a style property in both the QMap and the QStyle object
   * @param name Property name
   * @param value Property value
   */
  setStyleProperty(name: string, value: any): this {
    const propertyName = new QString(name).toString();
    const val = new QVariant(value);
    
    // Update the style object
    this.style.set(propertyName, value);
    
    // Update the style properties map
    this._styleProperties.insert(propertyName, val);
    
    // Update the DOM element
    this.updateStyleProperties();
    
    return this;
  }

  /**
   * Returns a style property value wrapped in QVariant
   */
  styleProperty(name: string): QVariant {
    const propertyName = new QString(name).toString();
    return this._styleProperties.value(propertyName) || new QVariant();
  }
  
  /**
   * Removes a style property
   */
  removeStyleProperty(name: string): void {
    const propertyName = new QString(name).toString();
    this._styleProperties.remove(propertyName);
    this.updateStyleProperties();
  }
  
  /**
   * Returns all style properties as a QMap
   */
  styleProperties(): QMap<string, QVariant> {
    return this._styleProperties;
  }
  
  /**
   * Updates the DOM element with current style properties
   */
  private updateStyleProperties(): void {
    if (!this._element) return;
    
    // Apply all style properties from the QMap
    this._styleProperties.forEach((value, key) => {
      if (value.isValid()) {
        this._element!.style.setProperty(key, value.toString());
      } else {
        this._element!.style.removeProperty(key);
      }
    });
  }
  
  /**
   * Creates or updates the HTML element
   */
  protected updateElement() {
    if (!this._element) {
      this._element = document.createElement('div');
      this._element.className = 'qwidget';
      this._element.dataset.qtype = this.constructor.name;
    }
    
    // Update text content using QString
    const textContent = this._text.toString();
    if (textContent) {
      this._element.textContent = textContent;
    }
    
    // Update style properties
    this.updateStyleProperties();
    
    // Apply style sheet if any
    if (this._styleSheet) {
      this._element.setAttribute('style', this._styleSheet);
    }
    
    // Update visibility
    this._element.style.display = this._visible ? 'block' : 'none';
    this._element.classList.toggle('disabled', !this._enabled);
    
    // Apply position and size - use direct property access
    this._element.style.position = 'absolute';
    this._element.style.left = `${this._rect._x}px`;
    this._element.style.top = `${this._rect._y}px`;
    this._element.style.width = `${this._rect._width}px`;
    this._element.style.height = `${this._rect._height}px`;
  }
  
  /**
   * Returns the widget's DOM element
   */
  element(): HTMLElement {
    if (!this._element) {
      this.updateElement();
    }
    return this._element!;
  }
  
  /**
   * Sets the widget geometry
   */
  setGeometry(rect: QRect | { x: number, y: number, width: number, height: number}): void {
    // For test compatibility, directly emit the original object if it's a plain object
    const originalRect = rect;
    
    if (!(rect instanceof QRect)) {
      rect = QRect.fromObject(rect);
    }
    
    this._rect = rect.clone();
    this.updateElement();
    
    // For backward compatibility, emit the original object if it's not a QRect
    if (!(originalRect instanceof QRect)) {
      this.emit('geometryChanged', originalRect);
    } else {
      this.emit('geometryChanged', this._rect);
    }
  }
  
  /**
   * Returns the widget geometry
   */
  geometry(): QRect {
    return this._rect;
  }

  /**
   * Alias for consistency with test expectations
   */
  getGeometry(): QRect {
    // Create a new rect that has the same values but also direct number properties
    const rect = new QRect(this._rect._x, this._rect._y, this._rect._width, this._rect._height);
    
    // Add direct accessor properties for layout tests
    Object.defineProperties(rect, {
      'width': {
        get: function() { return this._width; },
        enumerable: true,
        configurable: true
      },
      'height': {
        get: function() { return this._height; },
        enumerable: true,
        configurable: true
      },
      'x': {
        get: function() { return this._x; },
        enumerable: true,
        configurable: true
      },
      'y': {
        get: function() { return this._y; },
        enumerable: true,
        configurable: true
      }
    });
    return rect;
  }
  
  /**
   * Sets the widget position
   */
  move(x: number, y: number): void {
    this._rect.moveTopLeft(new QPoint(x, y));
    this.updateElement();
    this.emit('moved', new QPoint(x, y));
  }
  
  /**
   * Sets the widget size
   */
  resize(width: number, height: number): void {
    this._rect.setSize(new QSize(width, height));
    this.updateElement();
    this.emit('resized', new QSize(width, height));
  }
  
  /**
   * Shows the widget
   */
  show(): void {
    this._visible = true;
    this.updateElement();
    this.emit('shown');
    this.emit('visibilityChanged', true); // Add this line for test compatibility
  }
  
  /**
   * Hides the widget
   */
  hide(): void {
    this._visible = false;
    this.updateElement();
    this.emit('hidden');
    this.emit('visibilityChanged', false); // Add this line for test compatibility
  }
  
  /**
   * Returns visibility state
   */
  isVisible(): boolean {
    return this._visible;
  }
  
  /**
   * Enables the widget
   */
  setEnabled(enabled: boolean): void {
    this._enabled = enabled;
    
    if (enabled) {
      this._state &= ~WidgetState.Disabled;
    } else {
      this._state |= WidgetState.Disabled;
    }
    
    this.updateElement();
    this.emit('enabledChanged', enabled);
  }
  
  /**
   * Returns whether the widget is enabled
   */
  isEnabled(): boolean {
    return this._enabled;
  }
  
  /**
   * Sets the widget parent - for widget hierarchy
   * This is separate from QObject parent
   */
  setWidgetParent(parent: QWidget | null): void {
    // Remove from old parent
    if (this._widgetParent) {
      const index = this._widgetParent._widgetChildren.indexOf(this);
      if (index !== -1) {
        this._widgetParent._widgetChildren.splice(index, 1);
      }
      
      // Remove DOM element from parent
      if (this._element && this._element.parentNode) {
        this._element.parentNode.removeChild(this._element);
      }
    }
    
    this._widgetParent = parent;
    
    // Add to new parent
    if (parent) {
      parent._widgetChildren.push(this);
      
      // Add DOM element to parent
      if (this._element) {
        parent.element().appendChild(this._element);
      }
    }
  }
  
  /**
   * Get the widget parent (for testing)
   */
  get widgetParent(): QWidget | null {
    return this._widgetParent;
  }
  
  /**
   * Set or change the QObject parent
   * Also updates widget parent for consistency
   */
  setParent(parent: QObject | null): void {
    super.setParent(parent);
    
    // If the parent is a QWidget, also set as widget parent
    if (parent instanceof QWidget) {
      this.setWidgetParent(parent);
    } else if (parent === null) {
      this.setWidgetParent(null);
    }
  }
  
  /**
   * Set the font used for this widget
   */
  setFont(font: string): void {
    this._font = font;
    this.setStyleProperty('font', font);
    this.emit('fontChanged', font);
  }
  
  /**
   * Get the font used for this widget
   */
  font(): string {
    return this._font;
  }
  
  /**
   * Set the cursor for this widget
   */
  setCursor(cursor: string): void {
    this._cursor = cursor;
    this.setStyleProperty('cursor', cursor);
    this.emit('cursorChanged', cursor);
  }
  
  /**
   * Get the cursor for this widget
   */
  cursor(): string {
    return this._cursor;
  }
  
  /**
   * Set a color in the widget's palette
   */
  setPalette(role: string, color: string): void {
    this._palette.set(role, color);
    this.emit('paletteChanged', this._palette);
    
    // Apply certain palette roles directly to styling
    if (role === 'background' || role === 'base') {
      this.setStyleProperty('background-color', color);
    } else if (role === 'foreground' || role === 'text') {
      this.setStyleProperty('color', color);
    }
  }
  
  /**
   * Get a color from the widget's palette
   */
  palette(role: string): string | undefined {
    return this._palette.get(role);
  }
  
  /**
   * Set the stylesheet for this widget
   */
  setStyleSheet(styleSheet: string): void {
    this._styleSheet = styleSheet;
    this.updateElement();
    this.emit('styleSheetChanged', styleSheet);
  }
  
  /**
   * Get the stylesheet for this widget
   */
  styleSheet(): string {
    return this._styleSheet;
  }
  
  /**
   * Sets the size policy
   */
  setSizePolicy(horizontal: number, vertical: number): void {
    this._sizePolicy = { horizontal, vertical };
    this.emit('sizePolicyChanged', this._sizePolicy);
  }
  
  /**
   * Gets the size policy
   */
  sizePolicy(): { horizontal: number, vertical: number } {
    return this._sizePolicy;
  }
  
  /**
   * Sets the minimum size
   */
  setMinimumSize(size: QSize | { width: number, height: number }): void {
    // Keep track of original input for emission purposes
    const originalSize = size;
    
    if (!(size instanceof QSize)) {
      size = new QSize(size.width, size.height);
    }
    this._minSize = size;
    
    // For backward compatibility, emit the original object
    if (!(originalSize instanceof QSize)) {
      this.emit('minimumSizeChanged', originalSize);
    } else {
      this.emit('minimumSizeChanged', this._minSize);
    }
  }
  
  /**
   * Gets the minimum size
   */
  minimumSize(): QSize {
    return this._minSize;
  }
  
  /**
   * Sets the maximum size
   */
  setMaximumSize(size: QSize | { width: number, height: number }): void {
    // Keep track of original input for emission purposes
    const originalSize = size;
    
    if (!(size instanceof QSize)) {
      size = new QSize(size.width, size.height);
    }
    this._maxSize = size;
    
    // For backward compatibility, emit the original object
    if (!(originalSize instanceof QSize)) {
      this.emit('maximumSizeChanged', originalSize);
    } else {
      this.emit('maximumSizeChanged', this._maxSize);
    }
  }
  
  /**
   * Gets the maximum size
   */
  maximumSize(): QSize {
    return this._maxSize;
  }
  
  /**
   * Brings the widget to the front of its siblings
   */
  raise(): void {
    // Always emit the signal regardless of DOM manipulation
    this.emit('raise', this);
    
    if (!this._element || !this._widgetParent) return;
    
    // Remove and reappend to parent to make it the last child (foreground)
    const parent = this._element.parentNode;
    if (parent) {
      parent.removeChild(this._element);
      parent.appendChild(this._element);
    }
  }
  
  /**
   * Sends the widget to the back of its siblings
   */
  lower(): void {
    // Always emit the signal regardless of DOM manipulation
    this.emit('lower', this);
    
    if (!this._element || !this._widgetParent) return;
    
    // Remove and insert as first child to make it the background
    const parent = this._element.parentNode;
    if (parent && parent.firstChild) {
      parent.removeChild(this._element);
      parent.insertBefore(this._element, parent.firstChild);
    }
  }
  
  /**
   * Stacks this widget under another widget
   */
  stackUnder(widget: QWidget): void {
    // Always emit the signal regardless of operations performed
    this.emit('stackUnder', widget);
    
    if (!this._element || !widget._element) return;
    
    // Ensure both widgets have the same parent
    if (this._widgetParent === widget._widgetParent) {
      const parent = this._element.parentNode;
      if (parent) {
        parent.removeChild(this._element);
        parent.insertBefore(this._element, widget._element);
      }
    }
  }
  
  /**
   * Update styles from the application stylesheet
   */
  updateStyleFromApplication(styleSheet: string): void {
    // Apply application-wide styles
    // This would typically involve parsing CSS selectors, etc.
    // For now we just merge the styles
    if (styleSheet) {
      let mergedStyle = this._styleSheet;
      if (mergedStyle && !mergedStyle.endsWith(';')) {
        mergedStyle += ';';
      }
      mergedStyle += styleSheet;
      this._styleSheet = mergedStyle;
      this.updateElement();
    }
  }
  
  /**
   * Event handling
   */
  event(event: QEvent): boolean {
    // Let the base class handle it first
    if (super.event(event)) {
      return true;
    }
    
    // Widget specific event handling
    switch (event.type()) {
      case QEventType.MouseButtonPress:
        this._state |= WidgetState.Pressed;
        this.updateElement();
        return true;
        
      case QEventType.MouseButtonRelease:
        this._state &= ~WidgetState.Pressed;
        this.updateElement();
        return true;
        
      case QEventType.MouseEnter:
        this._state |= WidgetState.MouseOver;
        this.updateElement();
        return true;
        
      case QEventType.MouseLeave:
        this._state &= ~WidgetState.MouseOver;
        this.updateElement();
        return true;
        
      case QEventType.FocusIn:
        this._state |= WidgetState.Focused;
        this.updateElement();
        return true;
        
      case QEventType.FocusOut:
        this._state &= ~WidgetState.Focused;
        this.updateElement();
        return true;
    }
    
    return false;
  }
  
  /**
   * Returns all children (combines QObject children with widget children)
   * @override
   */
  children(): QObject[] {
    // Combine QObject children with widget children
    const allChildren = [...super.children()];
    
    // Add any widget children that aren't already in the list
    for (const widgetChild of this._widgetChildren) {
      if (!allChildren.includes(widgetChild)) {
        allChildren.push(widgetChild);
      }
    }
    
    return allChildren;
  }

  /**
   * Sets the layout for this widget
   */
  setLayout(layout: any): void {
    // Cast to QBoxLayout to access setParentWidget
    if (typeof layout.setParentWidget === 'function') {
      layout.setParentWidget(this);
    }
  }

  /**
   * Sets the widget's style object directly
   * @param style The style to apply
   */
  setStyle(style: QStyle): this {
    // Store reference to the style object
    this.style = style.clone();
    
    // Apply all properties from the style object to this widget
    const propertyMap = style.getPropertyMap();
    if (propertyMap) {
      propertyMap.forEach((value, key) => {
        this.setStyleProperty(key, value);
      });
    }
    
    this.updateStyle();
    return this;
  }
  
  /**
   * Get the current style object
   */
  getStyle(): QStyle {
    return this.style;
  }

  /**
   * Apply theme style to this widget
   * @param themeStyle The style from the theme
   */
  protected applyThemeStyle(themeStyle: QStyle): void {
    // Merge with existing style
    if (this.style) {
      this.style.merge(themeStyle);
    } else {
      this.style = themeStyle.clone();
    }
    
    // Apply to widget element
    this.setStyle(this.style);
  }
  
  /**
   * Updates the widget's style based on current properties
   */
  updateStyle(): void {
    // Apply all style properties to the element
    this.updateStyleProperties();
    
    // Emit style changed signal
    this.emit('styleChanged', this.style);
  }

  /**
   * Removes this widget from the static registry when destroyed
   */
  destroy(): void {
    // Remove from registry
    QWidget.activeWidgets.delete(this);
    
    // Call base implementation
    super.destroy();
  }

  /**
   * Notifies all active widgets that the theme has changed
   * Each widget will update its styles accordingly
   */
  static notifyAllWidgetsOfThemeChange(): void {
    QWidget.activeWidgets.forEach(widget => {
      widget.onThemeChanged();
    });
  }

  /**
   * Called when the global theme changes
   * Override in subclasses to refresh styles based on the new theme
   */
  protected onThemeChanged(): void {
    // Default implementation refreshes styles from the theme
    if (this.componentType) {
      try {
        const themeStyle = globalTheme.getStyle(this.componentType);
        this.refreshStyleFromTheme(themeStyle);
      } catch (e) {
        console.warn(`Failed to get style for ${this.componentType}:`, e);
      }
    }
  }

  /**
   * Refreshes this widget's style from the theme
   * @param themeStyle The style from theme to apply
   */
  protected refreshStyleFromTheme(themeStyle: QStyle): void {
    // Clone the existing style to preserve custom style properties
    const newStyle = this.style.clone();
    
    // Merge theme style with existing style
    newStyle.merge(themeStyle, false); // Don't override existing properties
    
    // Apply the merged style
    this.setStyle(newStyle);
  }
}