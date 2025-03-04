import { QObject } from './QObject';
import { QEvent, QEventType } from './QEvent';

/**
 * Core application class that manages the event loop
 */
export class QCoreApplication extends QObject {
  protected static _instance: QCoreApplication | null = null;
  protected _args: string[];
  protected _eventQueue: { target: QObject; event: QEvent }[] = [];
  protected _running = false;
  protected _exitCode = 0;

  /**
   * Creates a new QCoreApplication
   */
  constructor(args: string[] = []) {
    super(null);
    this._args = args;
    
    // Single instance management
    if (QCoreApplication._instance) {
      console.warn('QCoreApplication is already instantiated');
      return QCoreApplication._instance;
    }
    
    QCoreApplication._instance = this;
    this._running = false; // Initialize as not running
  }

  /**
   * Returns the QCoreApplication instance
   */
  static instance(): QCoreApplication {
    if (!QCoreApplication._instance) {
      throw new Error('QCoreApplication is not instantiated');
    }
    return QCoreApplication._instance;
  }

  /**
   * Override postEvent to match QObject's signature 
   * with compatibility for both calling patterns
   */
  postEvent(event: QEvent): void;
  postEvent(receiver: QObject, event: QEvent): void;
  postEvent(arg1: QObject | QEvent, arg2?: QEvent): void {
    if (arg1 instanceof QEvent) {
      // Single arg version - post to self
      this._eventQueue.push({ target: this, event: arg1 });
    } else if (arg1 instanceof QObject && arg2 instanceof QEvent) {
      // Two arg version - post to another object
      this._eventQueue.push({ target: arg1, event: arg2 });
    }
  }

  /**
   * Sends an event immediately to the target
   */
  sendEventObject(target: QObject, event: QEvent): boolean {
    return target.event(event);
  }

  /**
   * Process events in the event queue
   */
  processEvents(): void {
    const queue = [...this._eventQueue];
    this._eventQueue = [];
    
    for (const { target, event } of queue) {
      target.event(event);
    }
  }

  /**
   * Executes the application's main event loop
   */
  exec(): number {
    if (this._running) {
      console.log('Application is already running');
      return this._exitCode;
    }

    this._running = true;
    console.log('Starting event loop');
    
    // If we're in a browser environment, set up the animation frame loop
    if (typeof window !== 'undefined') {
      const processEventsRecursive = () => {
        if (this._running) {
          this.processEvents();
          requestAnimationFrame(processEventsRecursive);
        }
      };
      
      requestAnimationFrame(processEventsRecursive);
    } else {
      // For Node.js or testing environments, process events once
      this.processEvents();
    }
    
    return this._exitCode;
  }

  /**
   * Exit the application
   */
  quit(exitCode: number = 0): void {
    this._running = false;
    this._exitCode = exitCode;
  }

  /**
   * Returns the command line arguments
   */
  arguments(): string[] {
    return [...this._args];
  }

  /**
   * Returns whether the application is still running
   */
  isRunning(): boolean {
    return this._running;
  }

  /**
   * Returns the exit code
   */
  exitCode(): number {
    return this._exitCode;
  }
}
