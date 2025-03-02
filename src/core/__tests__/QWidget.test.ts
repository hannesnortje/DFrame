import { QWidget } from '../QWidget';
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
        const widget = new QWidget();
        const raiseMock = jest.fn();
        const lowerMock = jest.fn();
        const stackMock = jest.fn();

        widget.connect('raise', raiseMock);
        widget.connect('lower', lowerMock);
        widget.connect('stackUnder', stackMock);

        widget.raise();
        expect(raiseMock).toHaveBeenCalled();

        widget.lower();
        expect(lowerMock).toHaveBeenCalled();

        const other = new QWidget();
        widget.stackUnder(other);
        expect(stackMock).toHaveBeenCalledWith(other);
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
});
