import { QObject } from './QObject';

/**
 * Event type enumeration
 */
export enum QEventType {
  None = 0,
  Close = 1,
  Show = 2,
  Hide = 3,
  Resize = 4,
  MouseMove = 5,
  FocusIn = 6,
  FocusOut = 7,
  MouseEnter = 8,
  MouseLeave = 9,
  EnabledChanged = 10,
  WindowActivate = 11,
  WindowDeactivate = 12,
  MouseButtonPress = 13,
  MouseButtonRelease = 14,
  KeyPress = 15,
  KeyRelease = 16,
  Paint = 17,
  Timer = 18,
  User = 1000
}

export { QEventType as EventType };

/**
 * Base class for all events in the framework
 */
export class QEvent {
  private _type: QEventType;
  private _accepted: boolean = true;
  private _timestamp: number;

  /**
   * Creates a new QEvent
   * @param type The event type
   */
  constructor(type: QEventType) {
    this._type = type;
    this._timestamp = Date.now();
  }

  /**
   * Gets the event type
   */
  type(): QEventType {
    return this._type;
  }

  /**
   * Checks if the event is accepted
   */
  isAccepted(): boolean {
    return this._accepted;
  }

  /**
   * Sets whether the event is accepted
   * @param accepted True to accept, false to ignore
   */
  setAccepted(accepted: boolean): void {
    this._accepted = accepted;
  }

  /**
   * Accept this event
   */
  accept(): void {
    this._accepted = true;
  }

  /**
   * Ignore this event
   */
  ignore(): void {
    this._accepted = false;
  }

  /**
   * Gets the timestamp when this event was created
   */
  timestamp(): number {
    return this._timestamp;
  }
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
