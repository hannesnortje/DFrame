import { QCheckBox } from './QCheckBox';

describe('QCheckBox', () => {
    let checkbox: QCheckBox;
    
    beforeEach(() => {
        checkbox = new QCheckBox('Test Checkbox');
        document.body.appendChild(checkbox.getElement());
    });
    
    afterEach(() => {
        checkbox.getElement().remove();
    });
    
    it('should create a checkbox with the specified text', () => {
        expect(checkbox.text()).toBe('Test Checkbox');
        expect(checkbox.getElement().textContent).toContain('Test Checkbox');
    });
    
    it('should have a real checkbox input element', () => {
        const inputElement = checkbox.getElement().querySelector('input[type="checkbox"]');
        expect(inputElement).not.toBeNull();
    });
    
    it('should be checkable by default', () => {
        expect(checkbox.isCheckable()).toBeTruthy();
    });
    
    it('should set and get checked state correctly', () => {
        expect(checkbox.isChecked()).toBeFalsy();
        
        checkbox.setChecked(true);
        expect(checkbox.isChecked()).toBeTruthy();
        
        const inputElement = checkbox.getElement().querySelector('input[type="checkbox"]') as HTMLInputElement;
        expect(inputElement.checked).toBeTruthy();
        
        checkbox.setChecked(false);
        expect(checkbox.isChecked()).toBeFalsy();
        expect(inputElement.checked).toBeFalsy();
    });
    
    it('should emit toggled signal when checked state changes', () => {
        const toggleHandler = jest.fn();
        checkbox.connect('toggled', toggleHandler);
        
        checkbox.setChecked(true);
        expect(toggleHandler).toHaveBeenCalledWith(true);
        
        toggleHandler.mockClear();
        checkbox.setChecked(false);
        expect(toggleHandler).toHaveBeenCalledWith(false);
    });
    
    it('should emit clicked signal when checkbox is clicked', () => {
        const clickHandler = jest.fn();
        checkbox.connect('clicked', clickHandler);
        
        const inputElement = checkbox.getElement().querySelector('input[type="checkbox"]') as HTMLInputElement;
        
        // Simulate change event
        inputElement.checked = true;
        inputElement.dispatchEvent(new Event('change'));
        
        expect(clickHandler).toHaveBeenCalled();
    });
    
    it('should handle disabled state', () => {
        checkbox.setEnabled(false);
        expect(checkbox.isEnabled()).toBeFalsy();
        
        const inputElement = checkbox.getElement().querySelector('input[type="checkbox"]') as HTMLInputElement;
        expect(inputElement.disabled).toBeTruthy();
        
        checkbox.setEnabled(true);
        expect(checkbox.isEnabled()).toBeTruthy();
        expect(inputElement.disabled).toBeFalsy();
    });
});
