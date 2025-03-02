import { QApplication } from '../QApplication';
import { QWidget } from '../QWidget';
import { QEvent, EventType } from '../QEvent';

describe('QApplication', () => {
    beforeEach(() => {
        // Reset singleton instance between tests
        QApplication.__resetForTesting();
    });

    test('getInstance returns singleton instance', () => {
        const app1 = QApplication.getInstance();
        const app2 = QApplication.getInstance();
        expect(app1).toBe(app2);
    });

    test('setApplicationName emits signal', () => {
        const app = QApplication.getInstance();
        const mockFn = jest.fn();
        app.connect('applicationNameChanged', mockFn);

        app.setApplicationName('TestApp');
        expect(mockFn).toHaveBeenCalledWith('TestApp');
    });

    test('setStyleSheet emits signal', () => {
        const app = QApplication.getInstance();
        const mockFn = jest.fn();
        app.connect('styleSheetChanged', mockFn);

        const style = 'QWidget { color: red; }';
        app.setStyleSheet(style);
        expect(mockFn).toHaveBeenCalledWith(style);
    });

    test('window activation management', () => {
        const app = QApplication.getInstance();
        const window1 = new QWidget();
        const window2 = new QWidget();
        const mockChanged = jest.fn();
        
        app.connect('activeWindowChanged', mockChanged);
        
        app.setActiveWindow(window1);
        expect(mockChanged).toHaveBeenCalledWith(window1);
        
        app.setActiveWindow(window2);
        expect(mockChanged).toHaveBeenCalledWith(window2);
    });

    test('focus widget management', () => {
        const app = QApplication.getInstance();
        const widget1 = new QWidget();
        const widget2 = new QWidget();
        const mockChanged = jest.fn();
        
        app.connect('focusWidgetChanged', mockChanged);
        
        app.setFocusWidget(widget1);
        expect(mockChanged).toHaveBeenCalledWith(widget1);
        
        app.setFocusWidget(widget2);
        expect(mockChanged).toHaveBeenCalledWith(widget2);
    });

    test('application lifecycle', () => {
        const app = QApplication.getInstance();
        const mockStarted = jest.fn();
        const mockQuit = jest.fn();
        
        app.connect('started', mockStarted);
        app.connect('aboutToQuit', mockQuit);
        
        app.exec();
        expect(app.isRunning()).toBeTruthy();
        
        app.quit();
        expect(mockQuit).toHaveBeenCalled();
        expect(app.isRunning()).toBeFalsy();
    });

    test('getInstance preserves command line arguments', () => {
        const args = ['--debug', '--port=8080'];
        const app = QApplication.getInstance(args);
        expect(app.arguments()).toEqual(args);
    });

    test('activeWindow and focusWidget are properly cleaned up', () => {
        const app = QApplication.getInstance();
        const widget = new QWidget();
        
        // Register widget with application
        app.registerWidget(widget);
        
        app.setActiveWindow(widget);
        app.setFocusWidget(widget);
        
        // Verify initial state
        expect(app.activeWindow()).toBe(widget);
        expect(app.focusWidget()).toBe(widget);
        
        // Destroy the widget
        widget.destroy();
        
        // Check that references are cleaned up
        expect(app.activeWindow()).toBeNull();
        expect(app.focusWidget()).toBeNull();
    });

    test('quit is an alias for exit', () => {
        const app = QApplication.getInstance();
        const exitSpy = jest.spyOn(app, 'exit');
        
        app.quit();
        expect(exitSpy).toHaveBeenCalledWith(0);
        
        app.quit(1);
        expect(exitSpy).toHaveBeenCalledWith(1);
    });
});
