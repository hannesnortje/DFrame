import { QObject } from '../QObject';
import { QProperty } from '../QProperty';

describe('Enhanced QObject', () => {
  test('advanced parent-child relationships', () => {
    const parent = new QObject();
    const child1 = new QObject(parent);
    child1.setObjectName('child1');
    
    const child2 = new QObject(parent);
    child2.setObjectName('child2');
    
    const grandchild = new QObject(child1);
    grandchild.setObjectName('grandchild');
    
    // FindChild should use optimized name index
    expect(parent.findChild('child1')).toBe(child1);
    expect(parent.findChild('child2')).toBe(child2);
    expect(child1.findChild('grandchild')).toBe(grandchild);
    expect(parent.findChild('grandchild')).toBe(grandchild);
  });
  
  test('relationship management', () => {
    const obj1 = new QObject();
    const obj2 = new QObject();
    
    obj1.addRelationship('dependsOn', obj2);
    
    // Test relationship exists
    const relatedObjects = obj1.relatedObjects('dependsOn');
    expect(relatedObjects.length).toBe(1);
    expect(relatedObjects[0]).toBe(obj2);
    
    // Test removing relationship
    obj1.removeRelationship('dependsOn', obj2);
    expect(obj1.relatedObjects('dependsOn').length).toBe(0);
  });
  
  test('emits relationship change signals', () => {
    const obj1 = new QObject();
    const obj2 = new QObject();
    
    const addedMock = jest.fn();
    const removedMock = jest.fn();
    
    obj1.connect('relationshipAdded', addedMock);
    obj1.connect('relationshipRemoved', removedMock);
    
    obj1.addRelationship('depends', obj2);
    expect(addedMock).toHaveBeenCalledWith({ type: 'depends', object: obj2 });
    
    obj1.removeRelationship('depends', obj2);
    expect(removedMock).toHaveBeenCalledWith({ type: 'depends', object: obj2 });
  });
  
  test('enhanced property system integration', () => {
    const obj = new QObject();
    
    // Create a QProperty and register it with the object
    const qprop = new QProperty<string>(obj, 'test', {
      defaultValue: 'value'
    });
    
    // Properties should be accessible through the standard property interface
    expect(obj.property('test')).toBe('value');
    
    // And through propertyObject for QProperty objects
    const prop = obj.propertyObject('test');
    expect(prop).toBeDefined();
    expect(prop).toBe(qprop);
  });
});