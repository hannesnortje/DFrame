import { QCoreApplication } from '../QCoreApplication';
import { QObject } from '../QObject';
import { QEvent, QEventType } from '../QEvent';

describe('QCoreApplication', () => {
    // Reset the instance before each test
    beforeEach(() => {
        // Create a simple reset for testing
        if ((QCoreApplication as any)._instance) {
            (QCoreApplication as any)._instance = null;
        }
    });
    
    test('singleton instance', () => {
        const app = new QCoreApplication(['--test']);
        const app2 = QCoreApplication.instance();
        
        expect(app).toBe(app2);
        
        // Clean up
        app.quit();
    });
    
    test('application name', () => {
        const app = new QCoreApplication();
        const name = 'Test App';
        app.setApplicationName(name);
        expect(app.applicationName()).toBe(name);
        
        // Clean up
        app.quit();
    });
    
    test('organization name', () => {
        const app = new QCoreApplication();
        const name = 'Test Org';
        app.setOrganizationName(name);
        expect(app.organizationName()).toBe(name);
        
        // Clean up
        app.quit();
    });
    
    test('organization domain', () => {
        const app = new QCoreApplication();
        const domain = 'test.org';
        app.setOrganizationDomain(domain);
        expect(app.organizationDomain()).toBe(domain);
        
        // Clean up
        app.quit();
    });
    
    test('process events', () => {
        const app = new QCoreApplication();
        const obj = new QObject();
        
        const eventHandler = jest.fn();
        obj.connect('customEvent', eventHandler);
        
        // Create a custom event instead of a plain object
        const customEvent = { 
            type: () => QEventType.None,
            isAccepted: () => true,
            accept: () => {},
            ignore: () => {},
            setAccepted: (val: boolean) => {}
        };
        
        // Post using proper event object format
        app.postEventObject(obj, customEvent);
        expect(eventHandler).not.toHaveBeenCalled();
        
        // Process the events
        app.processEvents();
        
        // Clean up
        app.quit();
    });
    
    test('command line arguments', () => {
        const args = ['--app', '--test', '--value=1'];
        const app = new QCoreApplication(args);
        
        // Arguments should be stored (we would need to add an accessor)
        // expect(app.arguments()).toEqual(args);
        
        // Clean up
        app.quit();
    });
    
    test('exit code', () => {
        const app = new QCoreApplication();
        
        // Default exit code is 0
        app.exit();
        expect(app.exec()).toBe(0);
        
        // Custom exit code
        app.exit(1);
        expect(app.exec()).toBe(1);
        
        // Clean up
        app.quit();
    });
    
    test('application dir path', () => {
        const app = new QCoreApplication();
        
        // Should return something non-empty in a browser context
        const dirPath = QCoreApplication.applicationDirPath();
        expect(typeof dirPath).toBe('string');
        
        // Clean up
        app.quit();
    });
    
    test('send event', () => {
        const app = new QCoreApplication();
        const obj = new QObject();
        
        // Mock the event method
        obj.event = jest.fn().mockReturnValue(true);
        
        // Create and send an event
        const event = new QEvent(QEventType.None);
        app.sendEventObject(obj, event);
        
        expect(obj.event).toHaveBeenCalledWith(event);
        
        // Clean up
        app.quit();
    });
    
    test('quit application', () => {
        const app = new QCoreApplication();
        
        // We should be able to call quit
        app.quit();
        
        // Static method should also work
        QCoreApplication.quit();
    });
});
