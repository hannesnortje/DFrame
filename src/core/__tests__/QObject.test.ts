import { QObject } from '../QObject';
import { QEvent, EventType } from '../QEvent';

describe('QObject', () => {
    test('constructor initializes with no parent by default', () => {
        const obj = new QObject();
        
        expect(obj.getObjectName()).toBe('');
        expect(obj.getParent()).toBeNull();
        expect(obj['_children'].length).toBe(0);
    });

    test('constructor establishes parent-child relationship', () => {
        const parent = new QObject();
        const child = new QObject(parent);
        
        expect(child.getParent()).toBe(parent);
        expect(parent['_children'][0]).toBe(child);
    });

    test('setParent updates the parent', () => {
        const obj = new QObject();
        const parent = new QObject();
        
        obj.setParent(parent);
        expect(obj.getParent()).toBe(parent);
        expect(parent['_children'][0]).toBe(obj);
    });

    test('setParent removes from old parent and adds to new parent', () => {
        const parent1 = new QObject();
        const parent2 = new QObject();
        const child = new QObject(parent1);
        
        // Initial state
        expect(child.getParent()).toBe(parent1);
        expect(parent1['_children'][0]).toBe(child);
        expect(parent2['_children'].length).toBe(0);
        
        // Change parent
        child.setParent(parent2);
        
        // Final state
        expect(child.getParent()).toBe(parent2);
        expect(parent1['_children'].length).toBe(0);
        expect(parent2['_children'][0]).toBe(child);
    });

    test('emit signal with no listeners should not throw', () => {
        const obj = new QObject();
        expect(() => obj.emit('test')).not.toThrow();
    });

    test('signal-slot connection works', () => {
        const obj = new QObject();
        const mockFn = jest.fn();
        obj.connect('test', mockFn);
        obj.emit('test', 'value');
        expect(mockFn).toHaveBeenCalledWith('value');
    });

    test('changing parent updates children sets', () => {
        const parent1 = new QObject();
        const parent2 = new QObject();
        const child = new QObject(parent1);

        expect(parent1['_children'][0]).toBe(child);
        expect(parent2['_children'].length).toBe(0);

        child.setParent(parent2);

        expect(parent1['_children'].length).toBe(0);
        expect(parent2['_children'][0]).toBe(child);
    });

    test('multiple signals and slots', () => {
        const obj = new QObject();
        const mockFn1 = jest.fn();
        const mockFn2 = jest.fn();

        obj.connect('testSignal', mockFn1);
        obj.connect('testSignal', mockFn2);
        obj.emit('testSignal', 'test');

        expect(mockFn1).toHaveBeenCalledWith('test');
        expect(mockFn2).toHaveBeenCalledWith('test');
    });

    test('signal with no slots should not throw', () => {
        const obj = new QObject();
        expect(() => obj.emit('nonexistentSignal')).not.toThrow();
    });

    test('property system', () => {
        const obj = new QObject();
        const mockFn = jest.fn();
        obj.connect('propertyChanged', mockFn);

        expect(obj.property('test')).toBeUndefined();
        expect(obj.setProperty('test', 'value')).toBeTruthy();
        expect(obj.property('test')).toBe('value');
        expect(mockFn).toHaveBeenCalledWith({ name: 'test', value: 'value' });

        // Setting same value should return false and not emit
        mockFn.mockClear();
        expect(obj.setProperty('test', 'value')).toBeFalsy();
        expect(mockFn).not.toHaveBeenCalled();
    });

    test('findChildren returns all matching children recursively', () => {
        const parent = new QObject();
        const child1 = new QObject(parent);
        const child2 = new QObject(parent);
        const grandChild = new QObject(child1);

        child1.setObjectName('test');
        grandChild.setObjectName('test');

        const children = parent.findChildren('test');
        expect(children).toHaveLength(2);
        expect(children).toContain(child1);
        expect(children).toContain(grandChild);
    });

    test('blockSignalsTemporarily prevents signal emission', () => {
        const obj = new QObject();
        const mockFn = jest.fn();
        obj.connect('test', mockFn);

        const oldState = obj.blockSignalsTemporarily(true);
        expect(oldState).toBeFalsy();

        obj.emit('test');
        expect(mockFn).not.toHaveBeenCalled();

        obj.blockSignalsTemporarily(false);
        obj.emit('test');
        expect(mockFn).toHaveBeenCalled();
    });

    test('deleteLater schedules object destruction', async () => {
        const obj = new QObject();
        const mockFn = jest.fn();
        obj.connect('destroyed', mockFn);

        obj.deleteLater();
        
        // Wait for next tick
        await new Promise(resolve => setTimeout(resolve, 0));
        
        expect(mockFn).toHaveBeenCalled();
        const destroyedState = mockFn.mock.calls[0][0];
        expect(destroyedState).toMatchObject({
            objectName: '',
            parent: null,
            blockSignals: true
        });
        expect(destroyedState.children).toBeInstanceOf(Set);
        expect(destroyedState.properties).toBeInstanceOf(Map);
        expect(destroyedState.signals).toBeInstanceOf(Map);
    });

    test('event filters', () => {
        const obj = new QObject();
        const filter = new QObject();
        
        obj.installEventFilter(filter);
        expect(obj.property('eventFilter')).toBe(filter);

        obj.removeEventFilter(filter);
        expect(obj.property('eventFilter')).toBeUndefined();
    });
});
