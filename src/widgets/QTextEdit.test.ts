import { QTextEdit } from './QTextEdit';

describe('QTextEdit', () => {
    let textEdit: QTextEdit;
    
    beforeEach(() => {
        textEdit = new QTextEdit();
        document.body.appendChild(textEdit.getElement());
    });
    
    afterEach(() => {
        textEdit.getElement().remove();
    });
    
    it('should set and get text correctly', () => {
        const testText = 'Hello World';
        
        textEdit.setText(testText);
        
        expect(textEdit.getText()).toBe(testText);
    });
    
    it('should emit textChanged event when text changes', () => {
        const textChangedSpy = jest.fn();
        const testText = 'Hello World';
        
        // Fix: make sure the callback accepts any arguments
        textEdit.connect('textChanged', textChangedSpy);
        
        textEdit.setText(testText);
        
        expect(textChangedSpy).toHaveBeenCalledWith(testText);
    });
    
    it('should append text correctly', () => {
        textEdit.setText('Hello');
        textEdit.append(' World');
        
        expect(textEdit.getText()).toBe('Hello World');
    });
    
    it('should clear text correctly', () => {
        textEdit.setText('Hello World');
        textEdit.clear();
        
        expect(textEdit.getText()).toBe('');
    });
    
    it('should set read-only state correctly', () => {
        textEdit.setReadOnly(true);
        expect(textEdit.isReadOnly()).toBe(true);
        
        textEdit.setReadOnly(false);
        expect(textEdit.isReadOnly()).toBe(false);
    });
});
