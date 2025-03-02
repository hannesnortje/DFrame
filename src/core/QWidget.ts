import { QObject } from './QObject';
import { QEvent, EventType } from './QEvent';
import { QRect } from './QRect';
import { QSize } from './QSize';
import { QPoint } from './QPoint';
import { QApplication } from './QApplication';

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Point {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export class QWidget extends QObject {
    private geometry: Rect = { x: 0, y: 0, width: 100, height: 100 };
    private visible: boolean = false;
    private enabled: boolean = true;
    private minimumSize: Size = { width: 0, height: 0 };
    private maximumSize: Size = { width: 16777215, height: 16777215 };
    private windowTitle: string = '';
    private focus: boolean = false;
    private sizePolicy: { horizontal: number; vertical: number } = { horizontal: 0, vertical: 0 };
    private palette: Map<string, string> = new Map();
    private font: string = '';
    private cursor: string = 'default';
    private contextMenuPolicy: number = 0;
    private layoutDirection: number = 0;
    private styleSheet: string = '';

    constructor(parent: QWidget | null = null) {
        super(parent);
    }

    setGeometry(rect: Rect): void {
        const oldGeometry = { ...this.geometry };
        this.geometry = { ...rect };
        if (JSON.stringify(oldGeometry) !== JSON.stringify(this.geometry)) {
            this.emit('geometryChanged', this.geometry);
        }
    }

    getGeometry(): Rect {
        return { ...this.geometry };
    }

    move(point: Point): void {
        this.setGeometry({ ...this.geometry, x: point.x, y: point.y });
    }

    resize(size: Size): void {
        this.setGeometry({ ...this.geometry, width: size.width, height: size.height });
    }

    show(): void {
        if (!this.visible) {
            this.visible = true;
            this.emit('visibilityChanged', true);
        }
    }

    hide(): void {
        if (this.visible) {
            this.visible = false;
            this.emit('visibilityChanged', false);
        }
    }

    isVisible(): boolean {
        return this.visible;
    }

    setEnabled(enabled: boolean): void {
        if (this.enabled !== enabled) {
            this.enabled = enabled;
            this.emit('enabledChanged', enabled);
        }
    }

    isEnabled(): boolean {
        return this.enabled;
    }

    setWindowTitle(title: string): void {
        if (this.windowTitle !== title) {
            this.windowTitle = title;
            this.emit('windowTitleChanged', title);
        }
    }

    getWindowTitle(): string {
        return this.windowTitle;
    }

    setMinimumSize(size: Size): void {
        this.minimumSize = { ...size };
        this.emit('minimumSizeChanged', size);
    }

    setMaximumSize(size: Size): void {
        this.maximumSize = { ...size };
        this.emit('maximumSizeChanged', size);
    }

    setFocus(): void {
        if (!this.focus) {
            this.focus = true;
            this.emit('focusChanged', true);
        }
    }

    hasFocus(): boolean {
        return this.focus;
    }

    update(): void {
        this.emit('update');
    }

    repaint(): void {
        this.emit('repaint');
    }

    setSizePolicy(horizontal: number, vertical: number): void {
        this.sizePolicy = { horizontal, vertical };
        this.emit('sizePolicyChanged', this.sizePolicy);
    }

    setPalette(role: string, color: string): void {
        this.palette.set(role, color);
        this.emit('paletteChanged', this.palette);
    }

    setFont(font: string): void {
        this.font = font;
        this.emit('fontChanged', font);
    }

    setCursor(cursor: string): void {
        this.cursor = cursor;
        this.emit('cursorChanged', cursor);
    }

    setContextMenuPolicy(policy: number): void {
        this.contextMenuPolicy = policy;
        this.emit('contextMenuPolicyChanged', policy);
    }

    setLayoutDirection(direction: number): void {
        this.layoutDirection = direction;
        this.emit('layoutDirectionChanged', direction);
    }

    setStyleSheet(styleSheet: string): void {
        this.styleSheet = styleSheet;
        this.emit('styleSheetChanged', styleSheet);
    }

    raise(): void {
        this.emit('raise');
    }

    lower(): void {
        this.emit('lower');
    }

    stackUnder(widget: QWidget): void {
        this.emit('stackUnder', widget);
    }

    /**
     * Updates the widget's style from the application style sheet.
     * @internal
     */
    updateStyleFromApplication(styleSheet: string): void {
        // In a real implementation, this would parse the styleSheet
        // and apply styling to the widget
        console.log(`Applying style to ${this.constructor.name}:`, styleSheet);
        
        // Emit styleChanged signal
        this.emit('styleChanged');
    }

    /**
     * Checks if this widget is a window (top-level widget).
     */
    isWindow(): boolean {
        // A widget is considered a window if it has no parent
        // or if its parent is not a widget
        const parent = this.getParent();
        return !parent || !(parent instanceof QWidget);
    }

    /**
     * Closes the widget.
     * Returns true if the widget was closed; otherwise returns false.
     */
    close(): boolean {
        if (!this.isVisible()) {
            return false;
        }
        
        // Send close event
        const closeEvent = new QEvent(EventType.Close);
        this.event(closeEvent);
        
        // Hide the widget
        this.hide();
        return true;
    }

    /**
     * Destroys the widget.
     * Overrides the QObject.destroy() method to clean up widget-specific resources.
     */
    override destroy(): void {
        // First, unregister from application
        const app = QApplication.getInstance();
        
        // Clean up active window and focus widget references
        if (app.activeWindow() === this) {
            app.setActiveWindow(null);
        }
        
        if (app.focusWidget() === this) {
            app.setFocusWidget(null);
        }
        
        // Unregister from application's widget tracking
        app.unregisterWidget(this);
        
        // Call base implementation
        super.destroy();
    }
}
