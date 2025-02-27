import { QLineEdit } from './QLineEdit';

describe('QLineEdit', () => {
    let lineEdit: QLineEdit;

    beforeEach(() => {
        lineEdit = new QLineEdit();
    });

    test('should set and get text', () => {
        lineEdit.setText('test text');
        expect(lineEdit.text()).toBe('test text');
    });

    test('should handle placeholder text', () => {
        lineEdit.setPlaceholderText('placeholder');
        expect(lineEdit.placeholderText()).toBe('placeholder');
    });

    test('should handle max length', () => {
        lineEdit.setMaxLength(10);
        expect(lineEdit.maxLength()).toBe(10);
    });

    test('should handle read-only state', () => {
        lineEdit.setReadOnly(true);
        expect(lineEdit.isReadOnly()).toBe(true);
    });

    test('should emit textChanged signal', () => {
        const changeHandler = jest.fn();
        lineEdit.connect('textChanged', changeHandler);
        lineEdit.setText('new text');
        expect(changeHandler).toHaveBeenCalledWith('new text');
    });
});
