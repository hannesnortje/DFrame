import { QObject } from './QObject';
import { QEvent, EventType } from './QEvent';
import { QTimer } from './QTimer';

/**
 * QCoreApplication provides the event loop for console applications.
 * It's also the base class for QApplication.
 */
export class QCoreApplication extends QObject {
    private static _instance: QCoreApplication | null = null;
    private static aboutToQuitHandlers: Array<() => void> = [];
    
    private _applicationName: string = '';
    private _organizationName: string = '';
    private _organizationDomain: string = '';
    private _applicationVersion: string = '';
    private _arguments: string[] = [];
    private eventLoopRunning: boolean = false;
    private exitCode: number = 0;
    private eventQueue: Array<{ receiver: QObject, event: QEvent }> = [];
    private processEventsTimer: QTimer | null = null;
    
    protected constructor(args: string[] = []) {
        if (QCoreApplication._instance) {
            throw new Error('QCoreApplication already exists');
        }
        super(null); // No parent for application
        this._arguments = [...args];
    }

    /**
     * Gets the application instance (singleton).
     */
    static getInstance(args: string[] = []): QCoreApplication {
        if (!this._instance) {
            this._instance = new this(args);
        }
        return this._instance;
    }

    /**
     * Sets the application name.
     */
    setApplicationName(name: string): void {
        if (this._applicationName !== name) {
            this._applicationName = name;
            this.emit('applicationNameChanged', name);
        }
    }

    /**
     * Gets the application name.
     */
    applicationName(): string {
        return this._applicationName;
    }

    /**
     * Sets the organization name.
     */
    setOrganizationName(name: string): void {
        if (this._organizationName !== name) {
            this._organizationName = name;
            this.emit('organizationNameChanged', name);
        }
    }

    /**
     * Gets the organization name.
     */
    organizationName(): string {
        return this._organizationName;
    }

    /**
     * Sets the organization domain.
     */
    setOrganizationDomain(domain: string): void {
        if (this._organizationDomain !== domain) {
            this._organizationDomain = domain;
            this.emit('organizationDomainChanged', domain);
        }
    }

    /**
     * Gets the organization domain.
     */
    organizationDomain(): string {
        return this._organizationDomain;
    }

    /**
     * Sets the application version.
     */
    setApplicationVersion(version: string): void {
        if (this._applicationVersion !== version) {
            this._applicationVersion = version;
            this.emit('applicationVersionChanged', version);
        }
    }

    /**
     * Gets the application version.
     */
    applicationVersion(): string {
        return this._applicationVersion;
    }

    /**
     * Gets command line arguments.
     */
    arguments(): string[] {
        return [...this._arguments];
    }

    /**
     * Starts the event loop.
     * @returns The exit code when the event loop exits.
     */
    exec(): number {
        if (this.eventLoopRunning) {
            throw new Error('Event loop already running');
        }
        
        this.eventLoopRunning = true;
        this.emit('started');
        
        // Create a timer to process events
        this.processEventsTimer = new QTimer();
        this.processEventsTimer.setInterval(10);
        this.processEventsTimer.connect('timeout', () => this.processEvents());
        this.processEventsTimer.start();
        
        // This is a simulated event loop - in a real app, we'd block here
        // until the event loop is exited. In the browser, we just return.
        return 0;
    }

    /**
     * Posts an event to the application.
     * 
     * This overrides QObject.postEvent but with different parameters.
     */
    postApplicationEvent(receiver: QObject, event: QEvent): void {
        this.eventQueue.push({ receiver, event });
        this.emit('eventPosted', { receiver, event });
    }

    /**
     * Process all pending events.
     */
    processEvents(): void {
        const events = [...this.eventQueue];
        this.eventQueue = [];
        
        events.forEach(({ receiver, event }) => {
            receiver.event(event);
            this.emit('eventProcessed', event);
        });
    }

    /**
     * Exits the application with a return code.
     */
    exit(returnCode: number = 0): void {
        this.exitCode = returnCode;
        this.eventLoopRunning = false;
        
        // Notify handlers about quit
        QCoreApplication.aboutToQuitHandlers.forEach(handler => {
            try {
                handler();
            } catch (e) {
                console.error('Error in aboutToQuit handler:', e);
            }
        });
        
        // Stop the event processing timer
        if (this.processEventsTimer) {
            this.processEventsTimer.stop();
            this.processEventsTimer = null;
        }
        
        this.emit('aboutToQuit');
        QCoreApplication._instance = null;
    }

    /**
     * Returns true if the event loop is running.
     */
    isRunning(): boolean {
        return this.eventLoopRunning;
    }

    /**
     * Register a handler to be called when the application is about to quit.
     */
    static connectAboutToQuit(handler: () => void): void {
        this.aboutToQuitHandlers.push(handler);
    }

    /**
     * Remove a previously registered aboutToQuit handler.
     */
    static disconnectAboutToQuit(handler: () => void): void {
        const index = this.aboutToQuitHandlers.indexOf(handler);
        if (index !== -1) {
            this.aboutToQuitHandlers.splice(index, 1);
        }
    }

    /**
     * Get the application instance.
     */
    static getApplicationInstance(): QCoreApplication | null {
        return this._instance;
    }

    /**
     * Cleans up for testing purposes.
     */
    static __resetForTesting(): void {
        if (this._instance) {
            this._instance.exit();
        }
        this._instance = null;
        this.aboutToQuitHandlers = [];
    }
}
