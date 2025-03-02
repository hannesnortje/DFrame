import { QWidget, WidgetState } from '../QWidget';
import { QString } from '../containers/QString';
import { QRect } from '../QRect';
import { QPoint } from '../QPoint';
import { QSize } from '../QSize';
import { QEvent, QEventType } from '../QEvent';
import { QVariant } from '../containers/QVariant';
import { QObject } from '../QObject';

describe('QWidget', () => {
    let widget: QWidget;

    beforeEach(() => {
        widget = new QWidget();
    });

    test('widget geometry can be set and emits signal', () => {
        const mockFn = jest.fn();
        const newGeometry = { x: 10, y: 20, width: 100, height: 50 };
        
        widget.connect('geometryChanged', mockFn);
        widget.setGeometry(newGeometry);
        
        expect(mockFn).toHaveBeenCalledWith(newGeometry);
    });

    test('show/hide emits visibility signals', () => {
        const mockFn = jest.fn();
        widget.connect('visibilityChanged', mockFn);
        
        widget.show();
        expect(mockFn).toHaveBeenCalledWith(true);
        
        widget.hide();
        expect(mockFn).toHaveBeenCalledWith(false);
    });

    test('widget inherits from QObject', () => {
        expect(widget).toBeInstanceOf(QWidget);
        expect(widget).toBeInstanceOf(QObject);
    });

    test('size policy management', () => {
        const widget = new QWidget();
        const mockFn = jest.fn();
        widget.connect('sizePolicyChanged', mockFn);

        widget.setSizePolicy(1, 2);
        expect(mockFn).toHaveBeenCalledWith({ horizontal: 1, vertical: 2 });
    });

    test('palette management', () => {
        const widget = new QWidget();
        const mockFn = jest.fn();
        widget.connect('paletteChanged', mockFn);

        widget.setPalette('button', '#ff0000');
        const expectedPalette = new Map([['button', '#ff0000']]);
        expect(mockFn).toHaveBeenCalledWith(expectedPalette);
    });

    test('font management', () => {
        const widget = new QWidget();
        const mockFn = jest.fn();
        widget.connect('fontChanged', mockFn);

        widget.setFont('Arial, 12px');
        expect(mockFn).toHaveBeenCalledWith('Arial, 12px');
    });

    test('cursor management', () => {
        const widget = new QWidget();
        const mockFn = jest.fn();
        widget.connect('cursorChanged', mockFn);

        widget.setCursor('pointer');
        expect(mockFn).toHaveBeenCalledWith('pointer');
    });

    test('style sheet management', () => {
        const widget = new QWidget();
        const mockFn = jest.fn();
        widget.connect('styleSheetChanged', mockFn);

        widget.setStyleSheet('background: red;');
        expect(mockFn).toHaveBeenCalledWith('background: red;');
    });

    test('stacking order signals', () => {
        // Create a parent widget that will actually receive the signals
        const parentWidget = new QWidget();
        const widget = new QWidget(parentWidget);
        
        // Add tracking arrays instead of mocks
        let raiseEmitted = false;
        let lowerEmitted = false;
        let stackEmitted = false;
        
        // Connect to signals
        widget.connect('raise', () => { raiseEmitted = true; });
        widget.connect('lower', () => { lowerEmitted = true; });
        widget.connect('stackUnder', () => { stackEmitted = true; });
        
        // Call the methods directly
        widget.raise();
        expect(raiseEmitted).toBe(true);
        
        widget.lower();
        expect(lowerEmitted).toBe(true);
        
        // Mock another widget for stackUnder
        const otherWidget = new QWidget(parentWidget);
        widget.stackUnder(otherWidget);
        expect(stackEmitted).toBe(true);
    });

    test('minimum and maximum size constraints', () => {
        const widget = new QWidget();
        const minMock = jest.fn();
        const maxMock = jest.fn();

        widget.connect('minimumSizeChanged', minMock);
        widget.connect('maximumSizeChanged', maxMock);

        const minSize = { width: 100, height: 100 };
        const maxSize = { width: 500, height: 500 };

        widget.setMinimumSize(minSize);
        widget.setMaximumSize(maxSize);

        expect(minMock).toHaveBeenCalledWith(minSize);
        expect(maxMock).toHaveBeenCalledWith(maxSize);
    });

    test('text handling with QString', () => {
        const widget = new QWidget();
        
        // Set text using plain string
        widget.setText('Hello');
        expect(widget.text().toString()).toBe('Hello');
        
        // Set text using QString
        const qtext = new QString('World');
        widget.setText(qtext);
        expect(widget.text()).toBe(qtext);
        expect(widget.plainText()).toBe('World');
        
        // Test text change event
        const mockFn = jest.fn();
        widget.connect('textChanged', mockFn);
        widget.setText('NewText');
        
        expect(mockFn).toHaveBeenCalled();
        const eventArg = mockFn.mock.calls[0][0];
        expect(eventArg).toBeInstanceOf(QString);
        expect(eventArg.toString()).toBe('NewText');
    });
    
    test('style properties using QMap and QVariant', () => {
        const widget = new QWidget();
        
        // Set style properties
        widget.setStyleProperty('color', 'blue');
        widget.setStyleProperty('margin', 10);
        
        // Get individual properties
        const colorProp = widget.styleProperty('color');
        expect(colorProp.isValid()).toBe(true);
        expect(colorProp.toString()).toBe('blue');
        
        const marginProp = widget.styleProperty('margin');
        expect(marginProp.isValid()).toBe(true);
        expect(marginProp.toInt()).toBe(10);
        
        // Get non-existent property
        const nonExistent = widget.styleProperty('non-existent');
        expect(nonExistent.isValid()).toBe(false);
        
        // Remove a property
        widget.removeStyleProperty('color');
        expect(widget.styleProperty('color').isValid()).toBe(false);
        
        // Get all properties as QMap
        const allProps = widget.styleProperties();
        expect(allProps.size()).toBe(1); // Only margin left
        expect(allProps.contains('margin')).toBe(true);
    });
    
    test('geometry and positioning', () => {
        const widget = new QWidget();
        const rect = new QRect(10, 20, 100, 50);
        
        widget.setGeometry(rect);
        expect(widget.geometry().equals(rect)).toBe(true);
        
        // Test move
        const mockMove = jest.fn();
        widget.connect('moved', mockMove);
        widget.move(30, 40);
        
        expect(mockMove).toHaveBeenCalled();
        expect(widget.geometry().x()).toBe(30);
        expect(widget.geometry().y()).toBe(40);
        expect(widget.geometry().width()).toBe(100);
        expect(widget.geometry().height()).toBe(50);
        
        // Test resize
        const mockResize = jest.fn();
        widget.connect('resized', mockResize);
        widget.resize(200, 150);
        
        expect(mockResize).toHaveBeenCalled();
        expect(widget.geometry().width()).toBe(200);
        expect(widget.geometry().height()).toBe(150);
    });
    
    test('element creation and style application', () => {
        const widget = new QWidget();
        widget.setText('Test Widget');
        widget.setStyleProperty('color', 'red');
        widget.setGeometry(new QRect(10, 20, 100, 50));
        
        // Create the element
        const element = widget.element();
        
        // Check element properties
        expect(element).toBeInstanceOf(HTMLElement);
        expect(element.textContent).toBe('Test Widget');
        expect(element.style.color).toBe('red');
        expect(element.style.left).toBe('10px');
        expect(element.style.top).toBe('20px');
        expect(element.style.width).toBe('100px');
        expect(element.style.height).toBe('50px');
        
        // Check className and data attributes
        expect(element.className).toContain('qwidget');
        expect(element.dataset.qtype).toBe('QWidget');
    });
    
    test('visibility and enabled state', () => {
        const widget = new QWidget();
        
        expect(widget.isVisible()).toBe(true);
        expect(widget.isEnabled()).toBe(true);
        
        const mockHidden = jest.fn();
        widget.connect('hidden', mockHidden);
        widget.hide();
        
        expect(mockHidden).toHaveBeenCalled();
        expect(widget.isVisible()).toBe(false);
        expect(widget.element().style.display).toBe('none');
        
        const mockShown = jest.fn();
        widget.connect('shown', mockShown);
        widget.show();
        
        expect(mockShown).toHaveBeenCalled();
        expect(widget.isVisible()).toBe(true);
        expect(widget.element().style.display).toBe('block');
        
        const mockEnabled = jest.fn();
        widget.connect('enabledChanged', mockEnabled);
        widget.setEnabled(false);
        
        expect(mockEnabled).toHaveBeenCalledWith(false);
        expect(widget.isEnabled()).toBe(false);
        expect(widget.element().classList.contains('disabled')).toBe(true);
    });
});
