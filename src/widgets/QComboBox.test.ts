import { QComboBox } from './QComboBox';

describe('QComboBox', () => {
    let comboBox: QComboBox;
    
    beforeEach(() => {
        comboBox = new QComboBox();
        document.body.appendChild(comboBox.getElement());
    });
    
    afterEach(() => {
        comboBox.getElement().remove();
    });
    
    it('should add items correctly', () => {
        comboBox.addItem('Option 1');
        comboBox.addItem('Option 2');
        
        // Check select element has options
        const selectElement = comboBox.getElement().querySelector('select');
        expect(selectElement?.children.length).toBe(2);
    });
    
    it('should set current index correctly', () => {
        comboBox.addItem('Option 1');
        comboBox.addItem('Option 2');
        
        comboBox.setCurrentIndex(1);
        
        // Use the getter instead of accessing private property
        expect(comboBox.getCurrentIndex()).toBe(1);
    });
    
    it('should return correct current text', () => {
        comboBox.addItem('Option 1');
        comboBox.addItem('Option 2');
        
        comboBox.setCurrentIndex(1);
        
        expect(comboBox.currentText()).toBe('Option 2');
    });
    
    it('should emit events when selection changes', () => {
        const indexChangedSpy = jest.fn();
        const textChangedSpy = jest.fn();
        
        comboBox.addItem('Option 1');
        comboBox.addItem('Option 2');
        
        comboBox.connect('currentIndexChanged', indexChangedSpy);
        comboBox.connect('currentTextChanged', textChangedSpy);
        
        comboBox.setCurrentIndex(1);
        
        expect(indexChangedSpy).toHaveBeenCalledWith(1);
        expect(textChangedSpy).toHaveBeenCalledWith('Option 2');
    });
    
    it('should clear all items', () => {
        comboBox.addItem('Option 1');
        comboBox.addItem('Option 2');
        
        comboBox.clear();
        
        const selectElement = comboBox.getElement().querySelector('select');
        expect(selectElement?.children.length).toBe(0);
        expect(comboBox.getCurrentIndex()).toBe(-1);
    });
});
