import { QLabel, TextAlignment, TextFormat } from '../QLabel';
import { QString } from '../../core/containers/QString';

describe('QLabel', () => {
  test('text handling with QString', () => {
    const label = new QLabel();
    
    // Set text using plain string
    label.setText('Hello');
    expect(label.text().toString()).toBe('Hello');
    
    // Set text using QString
    const qtext = new QString('World');
    label.setText(qtext);
    expect(label.text()).toBe(qtext);
    expect(label.plainText()).toBe('World');
    
    // Test text change event
    const mockFn = jest.fn();
    label.connect('textChanged', mockFn);
    label.setText('NewText');
    
    expect(mockFn).toHaveBeenCalled();
    const eventArg = mockFn.mock.calls[0][0];
    expect(eventArg).toBeInstanceOf(QString);
    expect(eventArg.toString()).toBe('NewText');
  });
  
  test('text format and alignment', () => {
    const label = new QLabel('Test');
    
    // Default format should be PlainText
    expect(label.textFormat()).toBe(TextFormat.PlainText);
    
    // Change format
    label.setTextFormat(TextFormat.RichText);
    expect(label.textFormat()).toBe(TextFormat.RichText);
    
    // Set alignment
    label.setAlignment(TextAlignment.Center);
    expect(label.alignment()).toBe(TextAlignment.Center);
    
    // Check style property
    const alignStyle = label.styleProperty('text-align');
    expect(alignStyle.toString()).toBe('center');
  });
  
  test('style properties using QMap', () => {
    const label = new QLabel();
    
    // Set style properties
    label.setStyleProperty('color', 'red');
    label.setStyleProperty('font-size', '16px');
    
    // Get style property
    const colorProp = label.styleProperty('color');
    expect(colorProp.value()).toBe('red');
    
    // Get all properties as QMap
    const properties = label.styleProperties();
    // The QLabel constructor sets padding, color, font-size, and text-align properties
    expect(properties.size()).toBe(5); // Now there are 5 including text-align and user-select
    expect(properties.keys()).toContain('color');
    expect(properties.keys()).toContain('font-size');
    expect(properties.keys()).toContain('padding');
    expect(properties.keys()).toContain('text-align');
    
    // Remove property
    label.removeStyleProperty('color');
    expect(label.styleProperty('color').value()).toBeNull();
  });
  
  test('html content', () => {
    const label = new QLabel();
    label.setHtml('<b>Bold</b> text');
    
    // Format should be RichText
    expect(label.textFormat()).toBe(TextFormat.RichText);
    
    // Text content should include the HTML tags
    expect(label.plainText()).toBe('<b>Bold</b> text');
    
    // DOM element should contain formatted HTML
    document.body.appendChild(label.element());
    expect(label.element().innerHTML).toContain('<b>Bold</b>');
    document.body.removeChild(label.element());
  });
});
