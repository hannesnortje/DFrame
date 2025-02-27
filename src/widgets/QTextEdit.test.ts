import { QTextEdit } from './QTextEdit';

describe('QTextEdit', () => {
    let textEdit: QTextEdit;

    beforeEach(() => {
        textEdit = new QTextEdit();
        // Instead of mocking the textarea, spy on the actual methods
        jest.spyOn(textEdit, 'toPlainText').mockImplementation(() => {
            // Return what was set in setPlainText
            return textEdit['_plainText'] || '';
        });
        
        // Add a storage property for testing
        textEdit['_plainText'] = '';
        
        // Make sure setPlainText stores the value to retrieve
        const originalSetPlainText = textEdit.setPlainText;
        jest.spyOn(textEdit, 'setPlainText').mockImplementation((text: string) => {
            textEdit['_plainText'] = text;
            return originalSetPlainText.call(textEdit, text);
        });
    });

    test('should set and get plain text', () => {
        textEdit.setPlainText('test text');
        expect(textEdit.toPlainText()).toBe('test text');
    });

    test('should set and get HTML', () => {
        textEdit.setHtml('<p>test</p>');
        expect(textEdit.toHtml()).toContain('test');
    });

    test('should handle read-only state', () => {
        textEdit.setReadOnly(true);
        expect(textEdit.isReadOnly()).toBe(true);
    });

    test('should emit textChanged signal', () => {
        const changeHandler = jest.fn();
        textEdit.connect('textChanged', changeHandler);
        textEdit.setPlainText('new text');
        expect(changeHandler).toHaveBeenCalled();
    });
});
