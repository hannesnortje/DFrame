import { QObject } from '../QObject';
import { QProperty } from '../QProperty';
import { QString } from '../containers/QString';
import { QVariant } from '../containers/QVariant';

describe('QObject with Container Integration', () => {
  test('should handle QString in property names', () => {
    const obj = new QObject();
    
    obj.setProperty('stringKey', 'value');
    obj.setProperty(new QString('qstringKey').toString(), 'qvalue');
    
    expect(obj.property('stringKey')).toBe('value');
    expect(obj.property('qstringKey')).toBe('qvalue');
  });
  
  test('should store properties in QMap', () => {
    const obj = new QObject();
    
    // Set multiple properties
    obj.setProperty('prop1', 'value1');
    obj.setProperty('prop2', 'value2');
    obj.setProperty('prop3', 'value3');
    
    // Values should be retrievable
    expect(obj.property('prop1')).toBe('value1');
    expect(obj.property('prop2')).toBe('value2');
    expect(obj.property('prop3')).toBe('value3');
    
    // Overwrite one property
    obj.setProperty('prop2', 'updated');
    expect(obj.property('prop2')).toBe('updated');
  });
  
  test('should properly integrate QProperty with property system', () => {
    const obj = new QObject();
    
    // Create QProperty using enhanced property system
    const textProp = new QProperty<string>(obj, 'text', {
      defaultValue: 'default'
    });
    
    // Should be accessible via both interfaces
    expect(obj.property('text')).toBe('default');
    expect(obj.propertyObject('text')).toBe(textProp);
    
    // Changes via QProperty should be reflected in property() access
    textProp.value = 'changed';
    expect(obj.property('text')).toBe('changed');
    
    // Dynamic property and QProperty should be separate
    obj.setProperty('otherText', 'dynamic');
    expect(obj.property('otherText')).toBe('dynamic');
    expect(obj.propertyObject('otherText')).toBeUndefined();
  });
  
  test('objectName should use QString for normalization', () => {
    const obj = new QObject();
    
    const nameStr = new QString('MyObject');
    obj.setObjectName(nameStr.toString());
    
    expect(obj.getObjectName()).toBe('MyObject');
    
    // Test signal emission with QString
    const nameChangedSpy = jest.fn();
    obj.connect('objectNameChanged', nameChangedSpy);
    
    obj.setObjectName('NewName');
    expect(nameChangedSpy).toHaveBeenCalledWith('NewName');
  });
});
