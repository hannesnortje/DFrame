import { QThemeManager } from '../QThemeManager';
import { QTheme, QStyle, globalTheme } from '../index';

describe('QThemeManager', () => {
  let themeManager: QThemeManager;
  
  beforeEach(() => {
    themeManager = new QThemeManager();
    
    // Reset global theme between tests
    globalTheme.setDefaultStyle(new QStyle());
  });
  
  test('should register and retrieve themes', () => {
    const lightTheme = new QTheme({ backgroundColor: '#fff', color: '#333' });
    const darkTheme = new QTheme({ backgroundColor: '#333', color: '#fff' });
    
    themeManager.registerTheme('light', lightTheme);
    themeManager.registerTheme('dark', darkTheme);
    
    expect(themeManager.getTheme('light')).toBe(lightTheme);
    expect(themeManager.getTheme('dark')).toBe(darkTheme);
    expect(themeManager.getTheme('nonexistent')).toBeUndefined();
  });
  
  test('should set active theme', () => {
    const lightTheme = new QTheme({ backgroundColor: '#fff', color: '#333' });
    const darkTheme = new QTheme({ backgroundColor: '#333', color: '#fff' });
    
    themeManager.registerTheme('light', lightTheme);
    themeManager.registerTheme('dark', darkTheme);
    
    // Set light theme
    const result1 = themeManager.setTheme('light');
    expect(result1).toBe(true);
    expect(themeManager.getCurrentTheme()).toBe('light');
    
    // Set dark theme
    const result2 = themeManager.setTheme('dark');
    expect(result2).toBe(true);
    expect(themeManager.getCurrentTheme()).toBe('dark');
    
    // Try to set non-existent theme
    const result3 = themeManager.setTheme('nonexistent');
    expect(result3).toBe(false);
    expect(themeManager.getCurrentTheme()).toBe('dark'); // Still dark
  });
  
  test('should setup default themes', () => {
    themeManager.setupDefaultThemes();
    
    expect(themeManager.getTheme('light')).toBeDefined();
    expect(themeManager.getTheme('dark')).toBeDefined();
    
    const lightTheme = themeManager.getTheme('light');
    const darkTheme = themeManager.getTheme('dark');
    
    if (lightTheme && darkTheme) {
      // Verify light theme properties
      const lightButtonStyle = lightTheme.getStyle('Button');
      expect(lightButtonStyle.get('backgroundColor')).toBe('#4285f4');
      
      // Verify dark theme properties
      const darkButtonStyle = darkTheme.getStyle('Button');
      expect(darkButtonStyle.get('backgroundColor')).toBe('#3367d6');
    }
  });
  
  test('should emit themeChanged event when theme changes', () => {
    const mockCallback = jest.fn();
    themeManager.connect('themeChanged', mockCallback);
    
    // Setup and change theme
    themeManager.setupDefaultThemes();
    themeManager.setTheme('dark');
    
    expect(mockCallback).toHaveBeenCalledWith('dark');
    
    themeManager.setTheme('light');
    expect(mockCallback).toHaveBeenCalledWith('light');
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });
});
