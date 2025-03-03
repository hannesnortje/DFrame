import { QFont, FontWeight, FontStyle, TextDecoration, FontStretch } from '../QFont';

describe('QFont', () => {
  let font: QFont;
  
  beforeEach(() => {
    font = new QFont();
  });
  
  test('should have default values when created without parameters', () => {
    expect(font.family()).toEqual(['Arial', 'sans-serif']);
    expect(font.size()).toBe(14);
    expect(font.weight()).toBe(FontWeight.Normal);
    expect(font.style()).toBe(FontStyle.Normal);
    expect(font.decoration()).toBe(TextDecoration.None);
    expect(font.stretch()).toBe(FontStretch.Normal);
    expect(font.letterSpacing()).toBe('normal');
    expect(font.lineHeight()).toBe('normal');
  });
  
  test('should set properties through constructor options', () => {
    const customFont = new QFont({
      family: ['Roboto', 'sans-serif'],
      size: 16,
      weight: FontWeight.Bold,
      style: FontStyle.Italic,
      decoration: TextDecoration.Underline,
      stretch: FontStretch.Condensed,
      letterSpacing: 2,
      lineHeight: 1.5
    });
    
    expect(customFont.family()).toEqual(['Roboto', 'sans-serif']);
    expect(customFont.size()).toBe(16);
    expect(customFont.weight()).toBe(FontWeight.Bold);
    expect(customFont.style()).toBe(FontStyle.Italic);
    expect(customFont.decoration()).toBe(TextDecoration.Underline);
    expect(customFont.stretch()).toBe(FontStretch.Condensed);
    expect(customFont.letterSpacing()).toBe('2px');
    expect(customFont.lineHeight()).toBe('1.5');
  });
  
  test('should allow chaining of methods', () => {
    font
      .setFamily('Helvetica')
      .setSize(18)
      .setWeight(FontWeight.W700)
      .setStyle(FontStyle.Italic);
    
    expect(font.family()).toEqual(['Helvetica']);
    expect(font.size()).toBe(18);
    expect(font.weight()).toBe(FontWeight.W700);
    expect(font.style()).toBe(FontStyle.Italic);
  });
  
  test('should set family from string or array', () => {
    // Set from string
    font.setFamily('Arial, Helvetica');
    expect(font.family()).toEqual(['Arial', 'Helvetica']);
    
    // Set from array
    font.setFamily(['Roboto', 'sans-serif']);
    expect(font.family()).toEqual(['Roboto', 'sans-serif']);
  });
  
  test('should convert font to string representation', () => {
    font
      .setFamily(['Roboto', 'sans-serif'])
      .setSize(16)
      .setWeight(FontWeight.Bold)
      .setStyle(FontStyle.Italic);
    
    expect(font.toString()).toBe('italic bold 16px Roboto, sans-serif');
  });
  
  test('should parse a font string properly', () => {
    font.fromString('italic bold 16px "Roboto Condensed", sans-serif');
    
    expect(font.style()).toBe(FontStyle.Italic);
    expect(font.weight()).toBe('bold');
    expect(font.size()).toBe(16);
    expect(font.family()).toEqual(['Roboto Condensed', 'sans-serif']);
  });
  
  test('should create clone with same properties', () => {
    font
      .setFamily('Helvetica')
      .setSize(18)
      .setWeight(FontWeight.Bold);
    
    const clone = font.clone();
    
    expect(clone.family()).toEqual(['Helvetica']);
    expect(clone.size()).toBe(18);
    expect(clone.weight()).toBe(FontWeight.Bold);
    
    // Verify clone is independent
    clone.setSize(24);
    expect(clone.size()).toBe(24);
    expect(font.size()).toBe(18);
  });
  
  test('should apply font to DOM element', () => {
    const element = document.createElement('div');
    
    font
      .setFamily('Helvetica')
      .setSize(18)
      .setWeight(FontWeight.Bold)
      .setStyle(FontStyle.Italic)
      .setDecoration(TextDecoration.Underline);
    
    font.applyToElement(element);
    
    expect(element.style.fontFamily).toBe('Helvetica');
    expect(element.style.fontSize).toBe('18px');
    expect(element.style.fontWeight).toBe('bold');
    expect(element.style.fontStyle).toBe('italic');
    expect(element.style.textDecoration).toBe('underline');
  });
  
  test('should convert to CSS properties object', () => {
    font
      .setFamily(['Roboto', 'Arial'])
      .setSize(16)
      .setWeight(FontWeight.Bold);
    
    const cssProps = font.toCssProperties();
    
    expect(cssProps['font-family']).toBe('Roboto, Arial');
    expect(cssProps['font-size']).toBe('16px');
    expect(cssProps['font-weight']).toBe('bold');
  });
});
