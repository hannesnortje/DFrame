import { QObject } from './QObject';
import { QEvent, EventType } from './QEvent';
import { QTimer } from './QTimer';

/**
 * Core application class without GUI support
 */
export class QCoreApplication extends QObject {
  protected static _instance: QCoreApplication | null = null;
  private _argc: number;
  private _argv: string[];
  private _applicationName: string = '';
  private _organizationName: string = '';
  private _organizationDomain: string = '';
  private _eventLoop: boolean = false;
  private _eventQueue: any[] = [];
  private _exitCode: number = 0;
  
  /**
   * Creates a new QCoreApplication
   */
  constructor(args: string[] = []) {
    super(null);
    this._argc = args.length;
    this._argv = args;
    
    if (QCoreApplication._instance) {
      // For testing we'll replace the instance rather than throw
      // This allows multiple app instances during tests
      console.warn('QCoreApplication is already instantiated, replacing instance for tests');
    }
    
    QCoreApplication._instance = this;
  }
  
  /**
   * Returns the QCoreApplication instance
   */
  static instance(): QCoreApplication {
    return QCoreApplication._instance!;
  }
  
  /**
   * Sets the application name
   */
  setApplicationName(name: string): void {
    this._applicationName = name;
  }
  
  /**
   * Returns the application name
   */
  applicationName(): string {
    return this._applicationName;
  }
  
  /**
   * Sets the organization name
   */
  setOrganizationName(name: string): void {
    this._organizationName = name;
  }
  
  /**
   * Returns the organization name
   */
  organizationName(): string {
    return this._organizationName;
  }
  
  /**
   * Sets the organization domain
   */
  setOrganizationDomain(domain: string): void {
    this._organizationDomain = domain;
  }
  
  /**
   * Returns the organization domain
   */
  organizationDomain(): string {
    return this._organizationDomain;
  }
  
  /**
   * Posts an event to be processed later in the event loop
   * @param receiver The object to receive the event
   * @param event The event to post
   */
  postEventObject(receiver: QObject, event: any): void {
    this._eventQueue.push({
      receiver,
      event
    });
  }
  
  /**
   * Sends an event directly to the receiver immediately
   * @param receiver The object to receive the event
   * @param event The event to send
   */
  sendEventObject(receiver: QObject, event: any): boolean {
    return receiver.event(event);
  }
  
  /**
   * Processes events in the event queue
   */
  processEvents(): void {
    const queue = [...this._eventQueue];
    this._eventQueue = [];
    
    for (const item of queue) {
      item.receiver.event(item.event);
    }
  }
  
  /**
   * Executes the application's main event loop
   */
  exec(): number {
    this._eventLoop = true;
    
    while (this._eventLoop) {
      this.processEvents();
      
      // In a real implementation, would wait for events or yield here
      // This is a simplified version that would need to be adjusted
      // for real-world use
      if (this._eventQueue.length === 0) {
        this._eventLoop = false;
      }
    }
    
    return this._exitCode;
  }
  
  /**
   * Tells the application to exit with the given return code
   */
  exit(returnCode: number = 0): void {
    this._eventLoop = false;
    this._exitCode = returnCode;
  }

  /**
   * Quit the application
   */
  quit(returnCode: number = 0): void {
    this.exit(returnCode);
    QCoreApplication._instance = null;
  }
  
  /**
   * Static method to quit the application
   */
  static quit(returnCode: number = 0): void {
    if (QCoreApplication._instance) {
      QCoreApplication._instance.quit(returnCode);
    }
  }
  
  /**
   * Static method to get the application's directory path
   */
  static applicationDirPath(): string {
    // In a web context, return the location origin
    if (typeof window !== 'undefined' && window.location) {
      return window.location.origin;
    }
    return '';
  }
}
