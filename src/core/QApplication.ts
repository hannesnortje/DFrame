import { QCoreApplication } from './QCoreApplication';
import { QEvent, QEventType } from './QEvent';
import { QWidget } from './QWidget';
import { defaultStyle } from '../style';  // Updated import

/**
 * Main application class with GUI support
 */
export class QApplication extends QCoreApplication {
  private _windows: QWidget[] = [];
  private _styleSheet: string = '';
  private _activeWindow: QWidget | null = null;
  private _focusWidget: QWidget | null = null;
  private _applicationName: string = '';
  private _rootElement: HTMLElement | null = null;
  
  /**
   * Creates a new QApplication
   */
  constructor(args: string[] = []) {
    super(args);
    console.log('QApplication: Initializing...');
    
    // Initialize style system
    const style = defaultStyle;
    
    // Create root element immediately
    if (typeof document !== 'undefined') {
      console.log('QApplication: Setting up DOM');
      this._rootElement = document.getElementById('qapp-root');
      if (!this._rootElement) {
        console.log('QApplication: Creating root element');
        this._rootElement = document.createElement('div');
        this._rootElement.id = 'qapp-root';
        this._rootElement.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background-color: #f0f0f0;
          z-index: 1;
          display: block;
          visibility: visible;
        `;
        document.body.appendChild(this._rootElement);
        console.log('QApplication: Root element created and mounted', this._rootElement);
      }
      
      // Reset document body styles
      document.body.style.cssText = `
        margin: 0;
        padding: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        position: fixed;
      `;
      
      // Apply default style
      this.setStyleSheet(style.styleSheet());
    }
    
    // Update window event handling
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleWindowResize.bind(this));
      window.addEventListener('beforeunload', this.handleWindowClose.bind(this));
    }
  }
  
  /**
   * Handle window resize events
   */
  private handleWindowResize(): void {
    this._windows.forEach(window => {
      const event = new QEvent(QEventType.Resize);
      this.sendEventObject(window, event);
    });
  }
  
  /**
   * Handle window close events
   */
  private handleWindowClose(): void {
    this._windows.forEach(window => {
      const event = new QEvent(QEventType.Close);
      this.sendEventObject(window, event);
    });
  }
  
  /**
   * Set the application name
   */
  setApplicationName(name: string): void {
    this._applicationName = name;
    this.emit('applicationNameChanged', name);
    
    if (typeof document !== 'undefined') {
      document.title = name;
    }
  }
  
  /**
   * Get the application name
   */
  applicationName(): string {
    return this._applicationName;
  }
  
  /**
   * Set the stylesheet for the application
   */
  setStyleSheet(styleSheet: string): void {
    this._styleSheet = styleSheet;
    this._windows.forEach(window => {
      this.applyStyleSheetToWidget(window, styleSheet);
    });
  }
  
  /**
   * Apply stylesheet to a widget and its children
   */
  private applyStyleSheetToWidget(widget: QWidget, styleSheet: string): void {
    widget.updateStyleFromApplication(styleSheet);
    widget.children().forEach(child => {
      if (child instanceof QWidget) {
        this.applyStyleSheetToWidget(child, styleSheet);
      }
    });
  }
  
  /**
   * Get the current stylesheet
   */
  styleSheet(): string {
    return this._styleSheet;
  }
  
  /**
   * Register a widget with the application
   */
  registerWidget(widget: QWidget): void {
    console.log('QApplication: Registering widget', widget);
    if (!this._windows.includes(widget)) {
      this._windows.push(widget);
      
      if (this._rootElement && widget.element) {
        console.log('QApplication: Mounting widget to DOM');
        
        // Set essential styles
        this._rootElement.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background-color: #f0f0f0;
          z-index: 1;
          display: block !important;
          visibility: visible !important;
        `;
        
        // Force immediate style update before mounting
        widget.element.style.cssText = `
          position: absolute;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          z-index: ${this._windows.length + 1};
          transform: translateZ(0);
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;
        
        // Mount to DOM
        this._rootElement.appendChild(widget.element);
        
        // Force a reflow and update
        widget.element.offsetHeight;
        widget.updateElement();
        
        console.log('QApplication: Widget mounted with styles:', {
          widget,
          rootStyles: window.getComputedStyle(this._rootElement),
          widgetStyles: window.getComputedStyle(widget.element)
        });
      }
      
      this.setActiveWindow(widget);
    }
  }
  
  /**
   * Close all windows
   */
  closeAllWindows(): void {
    this._activeWindow = null;
    this._focusWidget = null;
    
    [...this._windows].forEach(window => {
      const event = new QEvent(QEventType.Close);
      this.sendEventObject(window, event);
      this._windows = this._windows.filter(w => w !== window);
    });
  }
  
  /**
   * Set the active window
   */
  setActiveWindow(window: QWidget | null): QWidget | null {
    const prev = this._activeWindow;
    
    if (this._activeWindow !== window) {
      if (this._activeWindow) {
        const event = new QEvent(QEventType.WindowDeactivate);
        this.sendEventObject(this._activeWindow, event);
      }
      
      this._activeWindow = window;
      
      if (window) {
        const event = new QEvent(QEventType.WindowActivate);
        this.sendEventObject(window, event);
      }
    }
    
    return prev;
  }
  
  /**
   * Get the active window
   */
  activeWindow(): QWidget | null {
    return this._activeWindow;
  }
  
  /**
   * Set the widget with keyboard focus
   */
  setFocusWidget(widget: QWidget | null): void {
    if (this._focusWidget !== widget) {
      if (this._focusWidget) {
        const event = new QEvent(QEventType.FocusOut);
        this.sendEventObject(this._focusWidget, event);
      }
      
      this._focusWidget = widget;
      
      if (widget) {
        const event = new QEvent(QEventType.FocusIn);
        this.sendEventObject(widget, event);
      }
    }
  }
  
  /**
   * Get the widget with keyboard focus
   */
  focusWidget(): QWidget | null {
    return this._focusWidget;
  }
  
  /**
   * Override quit to cleanup resources
   */
  quit(exitCode: number = 0): void {
    this.closeAllWindows();
    super.quit(exitCode);
    QCoreApplication._instance = null;
  }
}
