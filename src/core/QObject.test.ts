import { QObject } from './QObject';

describe('QObject', () => {
    let obj: QObject;

    beforeEach(() => {
        obj = new QObject();
    });

    test('should set and get object name', () => {
        obj.setObjectName('test');
        expect(obj.objectName()).toBe('test');
    });

    test('should handle parent-child relationships', () => {
        const parent = new QObject();
        const child = new QObject(parent);
        
        expect(child.getParent()).toBe(parent);
        expect(parent.getChildren()).toContain(child);
    });

    test('should emit and receive signals', () => {
        const handler = jest.fn();
        obj.connect('test', handler);
        obj.emit('test', 'data');
        expect(handler).toHaveBeenCalledWith('data');
    });

    test('should handle disconnecting signals', () => {
        const handler = jest.fn();
        obj.connect('test', handler);
        obj.disconnect('test', handler);
        obj.emit('test', 'data');
        expect(handler).not.toHaveBeenCalled();
    });
});
