import { QObject } from './QObject';

/**
 * Event types enumeration
 */
export enum QEventType {
  None = 0,
  Close = 1,
  Resize = 2,
  MouseButtonPress = 3,
  MouseButtonRelease = 4,
  MouseDoubleClick = 5,
  MouseMove = 6,
  MouseEnter = 7,
  MouseLeave = 8,
  KeyPress = 9,
  KeyRelease = 10,
  FocusIn = 11,
  FocusOut = 12,
  Show = 13,
  Hide = 14,
  WindowActivate = 15,
  WindowDeactivate = 16,
  Paint = 17,
  DragEnter = 18,
  DragLeave = 19,
  DragMove = 20,
  Drop = 21,
  Wheel = 22,
  ContextMenu = 23,
  Timer = 24,
  ToolTip = 25,
  HoverEnter = 26,
  HoverLeave = 27,
  Scroll = 28,
  TabletMove = 29,
  TabletPress = 30,
  TabletRelease = 31
}

export { QEventType as EventType };

/**
 * Base class for all events
 */
export class QEvent {
  private _type: QEventType;
  private _accepted: boolean;
  
  constructor(type: QEventType) {
    this._type = type;
    this._accepted = true;
  }
  
  /**
   * Returns the event type
   */
  type(): QEventType {
    return this._type;
  }
  
  /**
   * Alias for type() to maintain compatibility with tests
   */
  getType(): QEventType {
    return this._type;
  }
  
  /**
   * Sets whether the event is accepted
   */
  setAccepted(accepted: boolean): void {
    this._accepted = accepted;
  }
  
  /**
   * Returns whether the event is accepted
   */
  isAccepted(): boolean {
    return this._accepted;
  }
  
  /**
   * Accepts the event
   */
  accept(): void {
    this._accepted = true;
  }
  
  /**
   * Ignores the event
   */
  ignore(): void {
    this._accepted = false;
  }
  
  /**
   * Register a custom event type
   */
  static registerEventType(): QEventType {
    // Start custom event types at 1000 to ensure they are well above predefined ones
    // This matches the expectation in the test
    const baseCustomId = 1000; 
    
    // If this is the first custom event, start at baseCustomId
    if (QEvent.lastCustomEventTypeId < baseCustomId) {
      QEvent.lastCustomEventTypeId = baseCustomId - 1;
    }
    
    // Generate a new event type ID by adding to the last known ID
    const nextId = ++QEvent.lastCustomEventTypeId;
    return nextId;
  }
  
  // Track the last custom event type ID
  private static lastCustomEventTypeId: number = QEventType.TabletRelease;
}

/**
 * Mouse event class
 */
export class QMouseEvent extends QEvent {
  private _x: number;
  private _y: number;
  private _button: number;
  
  constructor(type: QEventType, x: number, y: number, button: number) {
    super(type);
    this._x = x;
    this._y = y;
    this._button = button;
  }
  
  /**
   * Returns the x position
   */
  x(): number {
    return this._x;
  }
  
  /**
   * Returns the y position
   */
  y(): number {
    return this._y;
  }
  
  /**
   * Returns the button
   */
  button(): number {
    return this._button;
  }
}

/**
 * Key event class
 */
export class QKeyEvent extends QEvent {
  private _key: number;
  private _modifiers: number;
  private _text: string;
  
  constructor(type: QEventType, key: number, modifiers: number, text: string = '') {
    super(type);
    this._key = key;
    this._modifiers = modifiers;
    this._text = text;
  }
  
  /**
   * Returns the key code
   */
  key(): number {
    return this._key;
  }
  
  /**
   * Returns the modifiers
   */
  modifiers(): number {
    return this._modifiers;
  }
  
  /**
   * Returns the text of the key
   */
  text(): string {
    return this._text;
  }
}
