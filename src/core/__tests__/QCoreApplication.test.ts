import { QCoreApplication } from '../QCoreApplication';
import { QObject } from '../QObject';
import { QEvent, EventType } from '../QEvent';

describe('QCoreApplication', () => {
    beforeEach(() => {
        // Reset singleton instance between tests
        QCoreApplication.__resetForTesting();
    });

    test('getInstance returns singleton instance', () => {
        const app = QCoreApplication.getInstance(['--test']);
        const app2 = QCoreApplication.getInstance();
        
        expect(app).toBeDefined();
        expect(app).toBe(app2);
    });

    test('stores and retrieves application name', () => {
        const app = QCoreApplication.getInstance();
        
        expect(app.applicationName()).toBe('');
        
        const listener = jest.fn();
        app.connect('applicationNameChanged', listener);
        
        app.setApplicationName('TestApp');
        expect(app.applicationName()).toBe('TestApp');
        expect(listener).toHaveBeenCalledWith('TestApp');
        
        // Setting same name should not emit signal
        listener.mockClear();
        app.setApplicationName('TestApp');
        expect(listener).not.toHaveBeenCalled();
    });

    test('stores and retrieves organization name', () => {
        const app = QCoreApplication.getInstance();
        
        expect(app.organizationName()).toBe('');
        
        const listener = jest.fn();
        app.connect('organizationNameChanged', listener);
        
        app.setOrganizationName('TestOrg');
        expect(app.organizationName()).toBe('TestOrg');
        expect(listener).toHaveBeenCalledWith('TestOrg');
    });

    test('stores and retrieves organization domain', () => {
        const app = QCoreApplication.getInstance();
        
        expect(app.organizationDomain()).toBe('');
        
        const listener = jest.fn();
        app.connect('organizationDomainChanged', listener);
        
        app.setOrganizationDomain('test.org');
        expect(app.organizationDomain()).toBe('test.org');
        expect(listener).toHaveBeenCalledWith('test.org');
    });

    test('stores and retrieves application version', () => {
        const app = QCoreApplication.getInstance();
        
        expect(app.applicationVersion()).toBe('');
        
        const listener = jest.fn();
        app.connect('applicationVersionChanged', listener);
        
        app.setApplicationVersion('1.0.0');
        expect(app.applicationVersion()).toBe('1.0.0');
        expect(listener).toHaveBeenCalledWith('1.0.0');
    });

    test('stores command line arguments', () => {
        const args = ['--test', '--verbose', '--output=file.txt'];
        const app = QCoreApplication.getInstance(args);
        
        expect(app.arguments()).toEqual(args);
        
        // Arguments should be a copy
        const appArgs = app.arguments();
        appArgs.push('--modified');
        expect(app.arguments()).toEqual(args);
    });

    test('exec starts the event loop', () => {
        const app = QCoreApplication.getInstance();
        const startedListener = jest.fn();
        
        app.connect('started', startedListener);
        
        expect(app.isRunning()).toBeFalsy();
        app.exec();
        expect(app.isRunning()).toBeTruthy();
        expect(startedListener).toHaveBeenCalled();
    });

    test('exit stops the event loop and emits aboutToQuit', () => {
        const app = QCoreApplication.getInstance();
        app.exec();
        
        const quitListener = jest.fn();
        app.connect('aboutToQuit', quitListener);
        
        expect(app.isRunning()).toBeTruthy();
        app.exit(1);
        expect(app.isRunning()).toBeFalsy();
        expect(quitListener).toHaveBeenCalled();
    });

    test('connectAboutToQuit registers quit handler', () => {
        const app = QCoreApplication.getInstance();
        const handler = jest.fn();
        
        QCoreApplication.connectAboutToQuit(handler);
        
        app.exit();
        expect(handler).toHaveBeenCalled();
    });

    test('disconnectAboutToQuit removes quit handler', () => {
        const app = QCoreApplication.getInstance();
        const handler = jest.fn();
        
        QCoreApplication.connectAboutToQuit(handler);
        QCoreApplication.disconnectAboutToQuit(handler);
        
        app.exit();
        expect(handler).not.toHaveBeenCalled();
    });

    test('postEvent adds events to queue', () => {
        const app = QCoreApplication.getInstance();
        const receiver = new QObject();
        const event = new QEvent(EventType.None);
        
        const postListener = jest.fn();
        app.connect('eventPosted', postListener);
        
        app.postApplicationEvent(receiver, event);
        
        expect(postListener).toHaveBeenCalledWith({ receiver, event });
    });

    test('processEvents processes queued events', () => {
        const app = QCoreApplication.getInstance();
        const receiver = new QObject();
        const event = new QEvent(EventType.None);
        
        const eventSpy = jest.spyOn(receiver, 'event');
        
        app.postApplicationEvent(receiver, event);
        
        const processListener = jest.fn();
        app.connect('eventProcessed', processListener);
        
        app.processEvents();
        
        expect(eventSpy).toHaveBeenCalledWith(event);
        expect(processListener).toHaveBeenCalledWith(event);
    });
});
