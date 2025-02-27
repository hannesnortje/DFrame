import { QReactiveProperty } from './QReactiveProperty';

describe('QReactiveProperty', () => {
    test('should store and retrieve value', () => {
        const property = new QReactiveProperty<number>(42);
        expect(property.value).toBe(42);
    });

    test('should emit changed signal when value changes', () => {
        const property = new QReactiveProperty<string>('initial');
        const changeHandler = jest.fn();
        
        property.connect('changed', changeHandler);
        property.value = 'updated';
        
        expect(changeHandler).toHaveBeenCalledWith({
            oldValue: 'initial',
            newValue: 'updated'
        });
    });

    test('should not emit changed signal when value is the same', () => {
        const property = new QReactiveProperty<number>(42);
        const changeHandler = jest.fn();
        
        property.connect('changed', changeHandler);
        property.value = 42; // Same value
        
        expect(changeHandler).not.toHaveBeenCalled();
    });

    test('should bind to source property', () => {
        const source = new QReactiveProperty<number>(100);
        const target = new QReactiveProperty<number>(0);
        
        target.bind(source);
        source.value = 200;
        
        expect(target.value).toBe(200);
    });

    test('should map to a new property type', () => {
        const numberProp = new QReactiveProperty<number>(10);
        const stringProp = numberProp.map(num => `Number: ${num}`);
        
        expect(stringProp.value).toBe('Number: 10');
        
        numberProp.value = 20;
        expect(stringProp.value).toBe('Number: 20');
    });
});
