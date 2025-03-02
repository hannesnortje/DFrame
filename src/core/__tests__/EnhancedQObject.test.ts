import { QObject } from '../QObject';
import { QProperty } from '../QProperty';

// Helper function to create simple objects without circular references for testing
function createTestObject(name: string): QObject {
  const obj = new QObject();
  obj.setObjectName(name);
  return obj;
}

describe('EnhancedQObject', () => {
  test('should support parent-child relationships', () => {
    const parent = createTestObject('parent');
    const child = new QObject();
    child.setObjectName('child');
    
    // Set parent after creation to avoid circular references in test environment
    child.setParent(parent);
    
    expect(child.getParent()).toBe(parent);
    expect(parent.findChild('child')).toBe(child);
  });
  
  test('should support custom relationships', () => {
    const object1 = createTestObject('object1');
    const object2 = createTestObject('object2');
    
    // Establish a relationship
    object1.addRelationship('dependsOn', object2);
    
    // Verify the relationship
    const related = object1.relatedObjects('dependsOn');
    expect(related.length).toBe(1);
    expect(related[0]).toBe(object2);
  });
  
  test('should emit signals for property changes', () => {
    const obj = createTestObject('testObject');
    const mockFn = jest.fn();
    
    obj.connect('propertyChanged', mockFn);
    obj.setProperty('testProp', 'value');
    
    expect(mockFn).toHaveBeenCalledWith({
      name: 'testProp',
      value: 'value'
    });
  });
  
  test('should support simple QProperty', () => {
    const obj = createTestObject('propertyObject');
    
    // Create a property with default value
    const textProp = new QProperty<string>(obj, 'text', {
      defaultValue: 'default'
    });
    
    expect(textProp.value).toBe('default');
    
    // Update via QProperty
    textProp.value = 'changed';
    expect(textProp.value).toBe('changed');
    
    // Access via object's property system
    expect(obj.property('text')).toBe('changed');
  });
});