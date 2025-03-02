import { QObject } from '../QObject';
import { QCoreApplication } from '../QCoreApplication';
import { QApplication } from '../QApplication';
import { QWidget } from '../QWidget';

describe('Inheritance', () => {
  beforeEach(() => {
    // Reset the static instance for each test
    if ((QCoreApplication as any)._instance) {
      (QCoreApplication as any)._instance = null;
    }
  });

  test('QObject hierarchy', () => {
    const obj1 = new QObject();
    const obj2 = new QObject(obj1);
    const obj3 = new QObject(obj2);
    
    expect(obj1.parent()).toBeNull();
    expect(obj2.parent()).toBe(obj1);
    expect(obj3.parent()).toBe(obj2);
    
    expect(obj1.children().length).toBe(1);
    expect(obj1.children()[0]).toBe(obj2);
    expect(obj2.children().length).toBe(1);
    expect(obj2.children()[0]).toBe(obj3);
    expect(obj3.children().length).toBe(0);
  });
  
  test('QApplication extends QCoreApplication', () => {
    // Ensure static instance is reset
    if ((QCoreApplication as any)._instance) {
      (QCoreApplication as any)._instance = null;
    }
    
    const app = new QApplication(['app']);
    
    // Ensure app is a QCoreApplication
    expect(app).toBeInstanceOf(QCoreApplication);
    
    // Check that QApplication has QCoreApplication methods
    expect(typeof app.setApplicationName).toBe('function');
    expect(typeof app.applicationName).toBe('function');
    
    // Check that QApplication has its own methods
    expect(typeof app.setStyleSheet).toBe('function');
    expect(typeof app.activeWindow).toBe('function');
    
    // Clean up
    app.quit();
  });
  
  test('QWidget extends QObject', () => {
    const widget = new QWidget();
    
    // Ensure widget is a QObject
    expect(widget).toBeInstanceOf(QObject);
    
    // Check that QWidget has QObject methods
    expect(typeof widget.setObjectName).toBe('function');
    expect(typeof widget.objectName).toBe('function');
    
    // Check that QWidget has its own methods
    expect(typeof widget.resize).toBe('function');
    expect(typeof widget.show).toBe('function');
    expect(typeof widget.hide).toBe('function');
  });
  
  test('QWidget parent-child relationship', () => {
    const parent = new QWidget();
    const child1 = new QWidget(parent);
    const child2 = new QWidget(parent);
    
    // QWidget parent-child relationship should match QObject
    expect(child1.parent()).toBe(parent);
    expect(child2.parent()).toBe(parent);
    expect(parent.children().length).toBe(2);
    expect(parent.children()).toContain(child1);
    expect(parent.children()).toContain(child2);
  });
});
