import { QObject } from '../core/QObject';
import { Qt, QSizePolicy } from '../core/Qt';
import { QDebug } from '../core/QDebug';

export class QWidget extends QObject {
    [key: string]: any;  // Add index signature for dynamic property access

    protected element: HTMLElement;
    protected _visible: boolean = true;
    protected _enabled: boolean = true;
    protected _windowTitle: string = '';
    protected _sizePolicy: QSizePolicy;
    protected _minimumSize = { width: 0, height: 0 };
    protected _maximumSize = { width: 16777215, height: 0 };

    constructor(parent: QWidget | null = null) {
        super(parent);
        this.element = document.createElement('div');
        this.element.style.position = 'relative';
        this.element.style.boxSizing = 'border-box';
        this.element.style.width = '100%';
        this.element.style.minHeight = '50px';
        this.element.style.height = 'auto';
        this.element.style.display = 'block';  // Default to block display
        this.element.style.visibility = 'visible';  // Explicitly make it visible
        this._sizePolicy = Qt.SizePolicy.create(Qt.SizePolicy.Fixed, Qt.SizePolicy.Fixed);
        this.setFocusPolicy(Qt.FocusPolicy.NoFocus);
        
        // Add debug attributes
        QDebug.applyToWidget(this);
    }

    setVisible(visible: boolean) {
        this._visible = visible;
        if (visible) {
            this.element.style.display = 'block';
            this.element.style.visibility = 'visible';
        } else {
            this.element.style.display = 'none';
        }
    }

    isVisible(): boolean {
        return this._visible;
    }

    getElement(): HTMLElement {
        return this.element;
    }

    setGeometry(x: number, y: number, width: number, height: number) {
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
        this.element.style.width = `${width}px`;
        this.element.style.height = `${height}px`;
    }

    setWindowTitle(title: string) {
        this._windowTitle = title;
        if (this.parent === null) {
            document.title = title;
        }
    }

    windowTitle(): string {
        return this._windowTitle;
    }

    setStyle(style: Partial<CSSStyleDeclaration>) {
        Object.assign(this.element.style, style);
    }

    on(event: string, handler: EventListener) {
        this.element.addEventListener(event, handler);
    }

    off(event: string, handler: EventListener) {
        this.element.removeEventListener(event, handler);
    }

    setEnabled(enabled: boolean) {
        this._enabled = enabled;
        this.element.style.pointerEvents = enabled ? 'auto' : 'none';
        this.element.style.opacity = enabled ? '1' : '0.5';
    }

    isEnabled(): boolean {
        return this._enabled;
    }

    setSizePolicy(horizontal: number, vertical: number) {
        this._sizePolicy = Qt.SizePolicy.create(horizontal, vertical);
        this.updateGeometry();
    }

    setMinimumSize(width: number, height: number) {
        this._minimumSize = { width, height };
        this.element.style.minWidth = `${width}px`;
        this.element.style.minHeight = `${height}px`;
    }

    setMaximumSize(width: number, height: number) {
        this._maximumSize = { width, height };
        this.element.style.maxWidth = `${width}px`;
        this.element.style.maxHeight = `${height}px`;
    }

    setFocusPolicy(policy: number) {
        this.element.tabIndex = policy === Qt.FocusPolicy.NoFocus ? -1 : 0;
    }

    update() {
        this.element.style.display = 'none';
        this.element.offsetHeight;
        this.element.style.display = this._visible ? 'block' : 'none';
    }

    setProperty(name: string, value: any) {
        const setter = `set${name[0].toUpperCase()}${name.slice(1)}` as keyof this;
        if (typeof this[setter] === 'function') {
            (this[setter] as Function).call(this, value);
        } else {
            switch (name) {
                case 'width':
                    this.element.style.width = `${value}px`;
                    break;
                case 'height':
                    this.element.style.height = `${value}px`;
                    break;
                case 'color':
                case 'backgroundColor':
                    this.element.style.backgroundColor = value;
                    break;
                case 'text':
                    if ('textContent' in this.element) {
                        this.element.textContent = value;
                    }
                    break;
                case 'visible':
                    this.setVisible(value);
                    break;
                default:
                    this[name] = value;
            }
        }
    }

    setDebugId(id: string): void {
        this.getElement().setAttribute('data-debug-id', id);
        console.log(`Widget ${id} has element:`, this.getElement());
    }

    setObjectName(name: string) {
        super.setObjectName(name);
        this.element.setAttribute('data-dframe-object-name', name);
        return this;
    }

    protected updateGeometry() {
        // Implement size policy behavior
    }

    /**
     * Protected method for cleanup in derived classes
     */
    protected cleanup(): void {
        // Base implementation does nothing
    }

    /**
     * Emit an event with optional parameters
     */
    emit(eventName: string, ...args: unknown[]): void {
        const event = new CustomEvent(eventName, { detail: args });
        this.element.dispatchEvent(event);
    }
    
    /**
     * Connect to an event with a callback
     */
    connect(eventName: string, callback: (...args: unknown[]) => any): void {
        this.element.addEventListener(eventName, (event: Event) => {
            if (event instanceof CustomEvent) {
                callback(...(event.detail || []));
            } else {
                callback(event);
            }
        });
    }
}
