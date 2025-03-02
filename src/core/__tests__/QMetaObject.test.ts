import { QMetaObject } from '../QMetaObject';
import { QObject } from '../QObject';

// Define test classes
class TestBaseObject extends QObject {
    baseMethod(): string {
        return 'base';
    }
}

class TestDerivedObject extends TestBaseObject {
    derivedMethod(): string {
        return 'derived';
    }
}

describe('QMetaObject', () => {
    beforeEach(() => {
        // Make test classes available globally for newInstance tests
        (window as any).TestBaseObject = TestBaseObject;
        (window as any).TestDerivedObject = TestDerivedObject;
    });

    test('registers and retrieves meta objects', () => {
        const baseMeta = QMetaObject.registerMetaObject('TestBaseObject');
        const derivedMeta = QMetaObject.registerMetaObject('TestDerivedObject', 'TestBaseObject');
        
        expect(baseMeta).toBeDefined();
        expect(derivedMeta).toBeDefined();
        
        expect(QMetaObject.forType('TestBaseObject')).toBe(baseMeta);
        expect(QMetaObject.forType('TestDerivedObject')).toBe(derivedMeta);
    });

    test('maintains class hierarchy', () => {
        const baseMeta = QMetaObject.registerMetaObject('TestBaseObject');
        const derivedMeta = QMetaObject.registerMetaObject('TestDerivedObject', 'TestBaseObject');
        
        expect(derivedMeta.getSuperClass()).toBe(baseMeta);
        expect(derivedMeta.inherits('TestBaseObject')).toBeTruthy();
        expect(baseMeta.inherits('TestDerivedObject')).toBeFalsy();
    });

    test('creates instances of registered classes', () => {
        const baseMeta = QMetaObject.registerMetaObject('TestBaseObject');
        const derivedMeta = QMetaObject.registerMetaObject('TestDerivedObject', 'TestBaseObject');
        
        const baseInstance = baseMeta.newInstance();
        const derivedInstance = derivedMeta.newInstance();
        
        expect(baseInstance).toBeInstanceOf(TestBaseObject);
        expect(derivedInstance).toBeInstanceOf(TestDerivedObject);
        expect(derivedInstance).toBeInstanceOf(TestBaseObject);
    });

    test('retrieves meta object from instances', () => {
        const baseMeta = QMetaObject.registerMetaObject('TestBaseObject');
        const derivedMeta = QMetaObject.registerMetaObject('TestDerivedObject', 'TestBaseObject');
        
        const baseInstance = new TestBaseObject();
        const derivedInstance = new TestDerivedObject();
        
        expect(QMetaObject.fromObject(baseInstance)).toBe(baseMeta);
        expect(QMetaObject.fromObject(derivedInstance)).toBe(derivedMeta);
    });

    test('manages properties', () => {
        const meta = QMetaObject.registerMetaObject('TestObject');
        
        meta.addProperty({
            name: 'testProperty',
            type: 'string',
            readable: true,
            writable: true,
            resettable: false,
            designable: true,
            scriptable: true,
            stored: true,
            user: false,
            constant: false,
            final: false,
            notify: 'propertyChanged'
        });
        
        const prop = meta.getProperty('testProperty');
        expect(prop).toBeDefined();
        expect(prop?.name).toBe('testProperty');
        expect(prop?.type).toBe('string');
        expect(prop?.readable).toBeTruthy();
        expect(prop?.notify).toBe('propertyChanged');
    });

    test('manages methods', () => {
        const meta = QMetaObject.registerMetaObject('TestObject');
        
        meta.addMethod({
            name: 'testMethod',
            returnType: 'string',
            parameterTypes: ['number', 'string'],
            parameterNames: ['id', 'name'],
            methodType: 'method'
        });
        
        const method = meta.getMethod('testMethod');
        expect(method).toBeDefined();
        expect(method?.name).toBe('testMethod');
        expect(method?.returnType).toBe('string');
        expect(method?.parameterTypes).toEqual(['number', 'string']);
        expect(method?.methodType).toBe('method');
    });

    test('manages enumerators', () => {
        const meta = QMetaObject.registerMetaObject('TestObject');
        
        meta.addEnumerator('Alignment', {
            Left: 1,
            Center: 2,
            Right: 3
        });
        
        expect(meta.getEnumerator('Alignment', 'Left')).toBe(1);
        expect(meta.getEnumerator('Alignment', 'Center')).toBe(2);
        expect(meta.getEnumerator('Alignment', 'Right')).toBe(3);
        expect(meta.getEnumerator('Alignment', 'Invalid')).toBeNull();
    });

    test('manages class info', () => {
        const meta = QMetaObject.registerMetaObject('TestObject');
        
        meta.addClassInfo('author', 'Test Author');
        meta.addClassInfo('version', '1.0.0');
        
        expect(meta.getClassInfo('author')).toBe('Test Author');
        expect(meta.getClassInfo('version')).toBe('1.0.0');
        expect(meta.getClassInfo('invalid')).toBeNull();
    });

    test('invokes methods on objects', () => {
        const baseMeta = QMetaObject.registerMetaObject('TestBaseObject');
        const derivedMeta = QMetaObject.registerMetaObject('TestDerivedObject', 'TestBaseObject');
        
        const baseInstance = new TestBaseObject();
        const derivedInstance = new TestDerivedObject();
        
        expect(baseMeta.invokeMethod(baseInstance, 'baseMethod')).toBe('base');
        expect(derivedMeta.invokeMethod(derivedInstance, 'baseMethod')).toBe('base');
        expect(derivedMeta.invokeMethod(derivedInstance, 'derivedMethod')).toBe('derived');
        expect(baseMeta.invokeMethod(baseInstance, 'derivedMethod')).toBeUndefined();
    });

    test('gets and sets property values', () => {
        const obj = new QObject();
        const meta = QMetaObject.registerMetaObject('QObject');
        
        obj.setProperty('testProp', 'testValue');
        expect(meta.getPropertyValue(obj, 'testProp')).toBe('testValue');
        
        meta.setPropertyValue(obj, 'newProp', 42);
        expect(obj.property('newProp')).toBe(42);
    });

    test('inherits properties and methods from superclass', () => {
        const baseMeta = QMetaObject.registerMetaObject('TestBaseObject');
        const derivedMeta = QMetaObject.registerMetaObject('TestDerivedObject', 'TestBaseObject');
        
        baseMeta.addProperty({
            name: 'baseProperty',
            type: 'string',
            readable: true,
            writable: true,
            resettable: false,
            designable: true,
            scriptable: true,
            stored: true,
            user: false,
            constant: false,
            final: false,
            notify: null
        });
        
        derivedMeta.addProperty({
            name: 'derivedProperty',
            type: 'number',
            readable: true,
            writable: true,
            resettable: false,
            designable: true,
            scriptable: true,
            stored: true,
            user: false,
            constant: false,
            final: false,
            notify: null
        });
        
        expect(derivedMeta.getProperty('baseProperty')).toBeDefined();
        expect(derivedMeta.getProperty('derivedProperty')).toBeDefined();
        expect(baseMeta.getProperty('derivedProperty')).toBeNull();
        
        const allProperties = derivedMeta.getProperties();
        expect(allProperties.length).toBe(2);
        expect(allProperties.find(p => p.name === 'baseProperty')).toBeDefined();
        expect(allProperties.find(p => p.name === 'derivedProperty')).toBeDefined();
    });
});
