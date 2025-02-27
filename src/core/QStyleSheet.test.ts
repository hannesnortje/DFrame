import { QStyleSheet } from './QStyleSheet';

describe('QStyleSheet', () => {
    let styleSheet: QStyleSheet;
    let mockStyleElement: { textContent: string | null };
    let originalAppendChild: any;
    
    beforeEach(() => {
        // Save original appendChild
        originalAppendChild = document.head.appendChild;
        
        // Mock appendChild instead of trying to replace document.head
        document.head.appendChild = jest.fn();
        
        // Mock document.createElement
        mockStyleElement = { textContent: null };
        document.createElement = jest.fn().mockReturnValue(mockStyleElement);
        
        styleSheet = new QStyleSheet();
    });
    
    afterEach(() => {
        // Restore original appendChild
        document.head.appendChild = originalAppendChild;
    });
    
    test('should create a style element when initialized', () => {
        expect(document.createElement).toHaveBeenCalledWith('style');
        expect(document.head.appendChild).toHaveBeenCalledWith(mockStyleElement);
    });
    
    test('should add CSS rules', () => {
        styleSheet.addRule('body', {
            'background-color': 'white',
            'color': 'black'
        });
        
        expect(mockStyleElement.textContent).toContain('body {');
        expect(mockStyleElement.textContent).toContain('background-color: white;');
        expect(mockStyleElement.textContent).toContain('color: black;');
    });
    
    test('should update existing CSS rules', () => {
        styleSheet.addRule('body', { 'background-color': 'white' });
        styleSheet.addRule('body', { 'color': 'black' });
        
        // Should contain both properties for the same selector
        expect(mockStyleElement.textContent).toContain('background-color: white;');
        expect(mockStyleElement.textContent).toContain('color: black;');
    });
    
    test('should remove CSS rules', () => {
        styleSheet.addRule('body', { 'background-color': 'white' });
        styleSheet.addRule('h1', { 'font-size': '24px' });
        
        styleSheet.removeRule('body');
        
        expect(mockStyleElement.textContent).not.toContain('body {');
        expect(mockStyleElement.textContent).toContain('h1 {');
    });
});
