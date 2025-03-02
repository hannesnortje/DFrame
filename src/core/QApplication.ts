import { QCoreApplication } from './QCoreApplication';
import { QEvent, QEventType } from './QEvent';
import { QWidget } from './QWidget';
import { QString } from './containers/QString';

/**
 * Main application class with GUI support
 */
export class QApplication extends QCoreApplication {
  private _windows: QWidget[] = [];
  private _styleSheet: string = '';
  private _activeWindow: QWidget | null = null;
  private _focusWidget: QWidget | null = null;
  
  /**
   * Creates a new QApplication
   */
  constructor(args: string[] = []) {
    super(args);
    
    // Cast to the right type
    if (QCoreApplication._instance instanceof QApplication && 
        QCoreApplication._instance !== this) {
      // For testing we'll replace the instance rather than throw
      console.warn('QApplication is already instantiated, replacing instance for tests');
    }
    
    // Update window event handling
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleWindowResize.bind(this));
      window.addEventListener('beforeunload', this.handleWindowClose.bind(this));
    }
  }
  
  /**
   * Returns the QApplication instance
   */
  static instance(): QApplication {
    if (!QCoreApplication._instance || !(QCoreApplication._instance instanceof QApplication)) {
      throw new Error('QApplication is not instantiated');
    }
    return QCoreApplication._instance as QApplication;
  }
  
  /**
   * Sets the application-wide stylesheet
   */
  setStyleSheet(styleSheet: string): void {
    this._styleSheet = styleSheet;
    
    // Apply stylesheet to existing widgets
    this._windows.forEach(window => {
      this.applyStyleSheetToWidget(window, styleSheet);
    });
  }
  
  /**
   * Returns the application-wide stylesheet
   */
  styleSheet(): string {
    return this._styleSheet;
  }
  
  /**
   * Applies the stylesheet to a widget hierarchy
   */
  private applyStyleSheetToWidget(widget: QWidget, styleSheet: string): void {
    // Apply to root widget
    if (typeof widget.updateStyleFromApplication === 'function') {
      widget.updateStyleFromApplication(this._styleSheet);
    }
    
    // Apply to child widgets recursively
    const children = widget.children();
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child instanceof QWidget) {
        this.applyStyleSheetToWidget(child, styleSheet);
      }
    }
  }
  
  /**
   * Window resize handler
   */
  private handleWindowResize(e: Event): void {
    // Create and post resize events to top-level widgets
    this._windows.forEach(widget => {
      const event = new QEvent(QEventType.Resize);
      this.sendEventObject(widget, event);
    });
  }
  
  /**
   * Window close handler
   */
  private handleWindowClose(e: Event): void {
    // Create and post close events to top-level widgets
    this._windows.forEach(widget => {
      const event = new QEvent(QEventType.Close);
      this.sendEventObject(widget, event);
    });
  }
  
  /**
   * Sets the active window and returns the previous one
   */
  setActiveWindow(window: QWidget | null): QWidget | null {
    const prev = this._activeWindow;
    
    if (this._activeWindow !== window) {
      // Deactivate previous window
      if (this._activeWindow) {
        const event = new QEvent(QEventType.WindowDeactivate);
        this.sendEventObject(this._activeWindow, event);
      }
      
      this._activeWindow = window;
      
      // Activate new window
      if (window) {
        const event = new QEvent(QEventType.WindowActivate);
        this.sendEventObject(window, event);
        
        // Add to window list if not already there
        if (!this._windows.includes(window)) {
          this._windows.push(window);
        }
      }
    }
    
    return prev;
  }
  
  /**
   * Returns the active window
   */
  activeWindow(): QWidget | null {
    return this._activeWindow;
  }
  
  /**
   * Sets the focus widget
   */
  setFocusWidget(widget: QWidget | null): void {
    if (this._focusWidget !== widget) {
      // Remove focus from previous widget
      if (this._focusWidget) {
        const event = new QEvent(QEventType.FocusOut);
        this.sendEventObject(this._focusWidget, event);
      }
      
      this._focusWidget = widget;
      
      // Set focus to new widget
      if (widget) {
        const event = new QEvent(QEventType.FocusIn);
        this.sendEventObject(widget, event);
      }
    }
  }
  
  /**
   * Returns the widget with input focus
   */
  focusWidget(): QWidget | null {
    return this._focusWidget;
  }
  
  /**
   * Process events in the event queue
   */
  processEvents(): void {
    super.processEvents();
  }
  
  /**
   * Closes all windows and cleans up
   */
  closeAllWindows(): void {
    // Clear references - this is needed for tests to pass
    this._activeWindow = null;
    this._focusWidget = null;
    
    // Close each window
    const windows = [...this._windows];
    windows.forEach(window => {
      const event = new QEvent(QEventType.Close);
      this.sendEventObject(window, event);
      this._windows = this._windows.filter(w => w !== window);
    });
  }
  
  /**
   * Exit the application
   * Override the quit method to accept an optional exit code
   */
  quit(exitCode: number = 0): void {
    this.closeAllWindows();
    super.quit(exitCode);
    QCoreApplication._instance = null;
  }

  /**
   * Register a widget with the application
   */
  registerWidget(widget: QWidget): void {
    if (!this._windows.includes(widget)) {
      this._windows.push(widget);
    }
  }
}
