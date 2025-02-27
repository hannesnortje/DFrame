import { Property, Signal } from './decorators';
import { QObject } from './QObject';

describe('Property decorator', () => {
    class TestClass {
        @Property
        testProperty: string = 'initial';
        
        emitCalled: boolean = false;
        emitArgs: any[] = [];
        
        emit(signal: string, data: any) {
            this.emitCalled = true;
            this.emitArgs = [signal, data];
        }
    }
    
    test('should create getters and setters', () => {
        const instance = new TestClass();
        
        expect(instance.testProperty).toBe('initial');
        
        instance.testProperty = 'updated';
        expect(instance.testProperty).toBe('updated');
    });
    
    test('should emit change signal when value changes', () => {
        const instance = new TestClass();
        
        instance.testProperty = 'updated';
        
        expect(instance.emitCalled).toBe(true);
        expect(instance.emitArgs[0]).toBe('testPropertyChanged');
        expect(instance.emitArgs[1]).toEqual({
            oldValue: 'initial',
            newValue: 'updated'
        });
    });
});

describe('Signal decorator', () => {
    class TestClass extends QObject {
        signalCalled: boolean = false;
        
        @Signal
        testSignal(value: string) {
            this.signalCalled = true;
            return value;
        }
    }
    
    test('should preserve original function behavior', () => {
        const instance = new TestClass();
        const result = instance.testSignal('test');
        
        expect(instance.signalCalled).toBe(true);
        expect(result).toBe('test');
    });
    
    test('should emit signal when method is called', () => {
        const instance = new TestClass();
        const signalHandler = jest.fn();
        
        instance.connect('testSignal', signalHandler);
        instance.testSignal('test');
        
        expect(signalHandler).toHaveBeenCalledWith('test');
    });
});
