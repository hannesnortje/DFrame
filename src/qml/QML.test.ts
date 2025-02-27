import { QMLComponent } from './QML';

describe('QMLComponent', () => {
    test('should store and render component function', () => {
        const mockElement = document.createElement('div');
        const mockComponentFn = jest.fn().mockReturnValue(mockElement);
        
        const component = new QMLComponent(mockComponentFn);
        const result = component.render();
        
        expect(mockComponentFn).toHaveBeenCalled();
        expect(result).toBe(mockElement);
    });
    
    test('should set and get properties', () => {
        const mockComponentFn = jest.fn().mockReturnValue(document.createElement('div'));
        const component = new QMLComponent(mockComponentFn);
        
        component.set('text', 'Hello World');
        component.set('width', 100);
        
        expect(component.get('text')).toBe('Hello World');
        expect(component.get('width')).toBe(100);
    });
    
    test('should pass properties to component function when rendering', () => {
        const mockComponentFn = jest.fn().mockReturnValue(document.createElement('div'));
        const component = new QMLComponent(mockComponentFn);
        
        component.set('text', 'Hello World');
        component.set('width', 100);
        
        component.render();
        
        expect(mockComponentFn).toHaveBeenCalledWith({
            text: 'Hello World',
            width: 100
        });
    });
    
    test('should emit propertyChanged signal when property changes', () => {
        const mockComponentFn = jest.fn().mockReturnValue(document.createElement('div'));
        const component = new QMLComponent(mockComponentFn);
        const changeHandler = jest.fn();
        
        component.connect('propertyChanged', changeHandler);
        component.set('text', 'Hello World');
        
        expect(changeHandler).toHaveBeenCalledWith({
            name: 'text',
            value: 'Hello World'
        });
    });
    
    test('should chain set methods', () => {
        const mockComponentFn = jest.fn().mockReturnValue(document.createElement('div'));
        const component = new QMLComponent(mockComponentFn);
        
        component.set('text', 'Hello').set('width', 100);
        
        expect(component.get('text')).toBe('Hello');
        expect(component.get('width')).toBe(100);
    });
});
