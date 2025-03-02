import { QCoreApplication } from './QCoreApplication';
import { QWidget } from './QWidget';
import { QEvent, EventType } from './QEvent';
import { QObject } from './QObject';

/**
 * QApplication extends QCoreApplication with GUI-specific functionality.
 */
export class QApplication extends QCoreApplication {
    private static _appInstance: QApplication | null = null;
    
    private _styleSheet: string = '';
    private _activeWindow: QWidget | null = null;
    private _focusWidget: QWidget | null = null;
    private _widgets: Set<QWidget> = new Set<QWidget>();

    protected constructor(args: string[] = []) {
        super(args);
    }

    /**
     * Gets the application instance (singleton).
     * Overrides QCoreApplication.getInstance() to return QApplication instance.
     */
    static getInstance(args: string[] = []): QApplication {
        if (!this._appInstance) {
            this._appInstance = new this(args);
        }
        return this._appInstance;
    }

    /**
     * Get the application instance.
     */
    static getApplicationInstance(): QApplication | null {
        return this._appInstance;
    }

    /**
     * Sets the application style sheet.
     */
    setStyleSheet(styleSheet: string): void {
        if (this._styleSheet !== styleSheet) {
            this._styleSheet = styleSheet;
            this.emit('styleSheetChanged', styleSheet);
            this.updateWidgetStyles();
        }
    }

    /**
     * Gets the application style sheet.
     */
    styleSheet(): string {
        return this._styleSheet;
    }

    /**
     * Sets the active window.
     */
    setActiveWindow(window: QWidget | null): void {
        if (this._activeWindow !== window) {
            this._activeWindow = window;
            this.emit('activeWindowChanged', window);
        }
    }

    /**
     * Gets the active window.
     */
    activeWindow(): QWidget | null {
        return this._activeWindow;
    }

    /**
     * Sets the focus widget.
     */
    setFocusWidget(widget: QWidget | null): void {
        if (this._focusWidget !== widget) {
            const oldFocus = this._focusWidget;
            this._focusWidget = widget;
            
            if (oldFocus) {
                const focusOutEvent = new QEvent(EventType.FocusOut);
                oldFocus.event(focusOutEvent);
            }
            
            if (widget) {
                const focusInEvent = new QEvent(EventType.FocusIn);
                widget.event(focusInEvent);
            }
            
            this.emit('focusWidgetChanged', widget);
        }
    }

    /**
     * Gets the focus widget.
     */
    focusWidget(): QWidget | null {
        return this._focusWidget;
    }

    /**
     * Registers a widget with the application.
     * Internal method called by QWidget constructor.
     */
    registerWidget(widget: QWidget): void {
        this._widgets.add(widget);
    }

    /**
     * Unregisters a widget from the application.
     * Internal method called by QWidget destructor.
     */
    unregisterWidget(widget: QWidget): void {
        // Remove from widgets set
        this._widgets.delete(widget);
        
        // Clean up references
        if (this._activeWindow === widget) {
            this._activeWindow = null;
        }
        
        if (this._focusWidget === widget) {
            this._focusWidget = null;
        }
    }

    /**
     * Gets all registered widgets.
     */
    allWidgets(): QWidget[] {
        return Array.from(this._widgets);
    }

    /**
     * Updates styles for all widgets.
     */
    private updateWidgetStyles(): void {
        this._widgets.forEach(widget => {
            // Call a method that updates the widget's style
            // We'll assume QWidget has an updateStyleFromApplication method
            if (typeof widget.updateStyleFromApplication === 'function') {
                widget.updateStyleFromApplication(this._styleSheet);
            }
        });
    }

    /**
     * Overrides postApplicationEvent to handle widget-specific events.
     */
    postApplicationEvent(receiver: QObject, event: QEvent): void {
        // Special handling for widget events
        if (receiver instanceof QWidget) {
            if (event.getType() === EventType.WindowActivate) {
                this.setActiveWindow(receiver);
            }
        }
        
        // Call parent implementation
        super.postApplicationEvent(receiver, event);
    }

    /**
     * Alias for exit for compatibility with Qt's QApplication
     */
    quit(returnCode: number = 0): void {
        this.exit(returnCode);
    }

    /**
     * Overrides exit to clean up widget resources.
     */
    exit(returnCode: number = 0): void {
        // Clean up widget resources before exiting
        const widgets = Array.from(this._widgets);
        widgets.forEach(widget => {
            // Check if widget is a window and has a close method
            if (typeof widget.isVisible === 'function' && widget.isVisible() &&
                typeof widget.hide === 'function') {
                widget.hide();
            }
        });
        
        // Call parent implementation
        super.exit(returnCode);
        QApplication._appInstance = null;
    }

    /**
     * Cleans up for testing purposes.
     */
    static __resetForTesting(): void {
        if (this._appInstance) {
            this._appInstance.exit();
        }
        
        this._appInstance = null;
        super.__resetForTesting();
    }
}
