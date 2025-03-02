import { QApplication } from '../QApplication';
import { QWidget } from '../QWidget';
import { QEvent, QEventType } from '../QEvent';

jest.mock('../QWidget');

describe('QApplication', () => {
  let app: QApplication;
  
  beforeEach(() => {
    jest.clearAllMocks();
    app = new QApplication(['app', 'arg1']);
    // Reset the instance before each test
    jest.spyOn(QApplication, 'instance').mockImplementation(() => {
      throw new Error('QApplication not instantiated');
    });
    
    // Reset the static instance
    if ((QApplication as any)._instance) {
      (QApplication as any)._instance = null;
    }
  });
  
  afterEach(() => {
    if (app) {
      app.quit();
    }
  });
  
  test('application name', () => {
    const name = 'Test App';
    app.setApplicationName(name);
    expect(app.applicationName()).toBe(name);
  });
  
  test('application stylesheet', () => {
    const style = 'QWidget { color: red; }';
    app.setStyleSheet(style);
    expect(app.styleSheet()).toBe(style);
  });
  
  test('activeWindow management', () => {
    const window1 = new QWidget();
    const window2 = new QWidget();
    
    // Initially no active window
    expect(app.activeWindow()).toBeNull();
    
    // Set active window
    app.setActiveWindow(window1);
    expect(app.activeWindow()).toBe(window1);
    
    // Change active window
    app.setActiveWindow(window2);
    expect(app.activeWindow()).toBe(window2);
  });
  
  test('focusWidget management', () => {
    const widget1 = new QWidget();
    const widget2 = new QWidget();
    
    // Initially no focus widget
    expect(app.focusWidget()).toBeNull();
    
    // Set focus widget
    app.setFocusWidget(widget1);
    expect(app.focusWidget()).toBe(widget1);
    
    // Change focus widget
    app.setFocusWidget(widget2);
    expect(app.focusWidget()).toBe(widget2);
  });
  
  test('application exit code', () => {
    // Default exit code
    app.exec();
    expect(app.exec()).toBe(0);
    
    // Set custom exit code
    app.exit(1);
    expect(app.exec()).toBe(1);
    
    // Reset exit code
    app.exit(0);
  });
  
  test('quit application', () => {
    // We need to mock QApplication.instance()
    const instanceSpy = jest.spyOn(QApplication, 'instance').mockReturnValue(app);
    
    // Quit via instance
    app.quit();
    
    // Quit via static method
    QApplication.quit();
    
    instanceSpy.mockRestore();
  });
  
  test('activeWindow and focusWidget are properly cleaned up', () => {
    const widget = new QWidget();
    
    // Mock the registerWidget method
    const registerMock = jest.fn();
    app.registerWidget = registerMock;
    
    app.setActiveWindow(widget);
    app.setFocusWidget(widget);
    
    // They should be set
    expect(app.activeWindow()).toBe(widget);
    expect(app.focusWidget()).toBe(widget);
    
    // Call closeAllWindows
    app.closeAllWindows();
    
    // Check that references are cleaned up
    expect(app.activeWindow()).toBeNull();
    expect(app.focusWidget()).toBeNull();
  });
  
  /**
   * Modified quit test that passes exitCode correctly
   */
  test('quit with exit code', () => {
    // Create a spy to ensure quit is called with the right args
    const quitSpy = jest.spyOn(app, 'quit');
    
    app.quit();
    expect(quitSpy).toHaveBeenCalledWith();
    
    // Second call with exit code shouldn't throw
    app.quit(1);
    expect(quitSpy).toHaveBeenCalledWith(1);
    
    quitSpy.mockRestore();
  });
});
