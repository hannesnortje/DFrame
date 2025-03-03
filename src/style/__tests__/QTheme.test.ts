import { QTheme, QStyle } from '../';

describe('QTheme', () => {
  let theme: QTheme;

  beforeEach(() => {
    theme = new QTheme({ fontFamily: 'Arial', fontSize: 12 });
  });

  test('should provide default style for components', () => {
    const style = theme.getStyle('Button');
    
    expect(style.get('fontFamily')).toBe('Arial');
    expect(style.get('fontSize')).toBe(12);
  });

  test('should merge component style with default style', () => {
    const buttonStyle = new QStyle({ color: 'blue', fontSize: 14 });
    theme.registerStyle('Button', buttonStyle);
    
    const style = theme.getStyle('Button');
    
    expect(style.get('fontFamily')).toBe('Arial'); // From default
    expect(style.get('fontSize')).toBe(14); // Overridden by button style
    expect(style.get('color')).toBe('blue'); // From button style
  });

  test('should allow changing default style', () => {
    const newDefaultStyle = new QStyle({ 
      fontFamily: 'Roboto', 
      fontSize: 16,
      color: 'black' 
    });
    
    theme.setDefaultStyle(newDefaultStyle);
    
    const style = theme.getStyle('TextField');
    
    expect(style.get('fontFamily')).toBe('Roboto');
    expect(style.get('fontSize')).toBe(16);
    expect(style.get('color')).toBe('black');
  });
});
