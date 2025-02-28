import { QAbstractButton } from './QAbstractButton';
import { QWidget } from './QWidget';

// Create a concrete implementation of the abstract class for testing
class TestButton extends QAbstractButton {
    constructor(text?: string, parent?: QWidget) {
        super(text, parent);
    }
}

describe('QAbstractButton', () => {
    let button: TestButton;
    
    beforeEach(() => {
        button = new TestButton('Test Button');
        document.body.appendChild(button.getElement());
    });
    
    afterEach(() => {
        button.getElement().remove();
    });
    
    it('should set and get text correctly', () => {
        expect(button.text()).toBe('Test Button');
        
        button.setText('New Text');
        expect(button.text()).toBe('New Text');
        expect(button.getElement().textContent).toContain('New Text');
    });
    
    it('should handle checkable state', () => {
        expect(button.isCheckable()).toBeFalsy();
        
        button.setCheckable(true);
        expect(button.isCheckable()).toBeTruthy();
        
        button.setCheckable(false);
        expect(button.isCheckable()).toBeFalsy();
    });
    
    it('should toggle checked state when checkable', () => {
        button.setCheckable(true);
        expect(button.isChecked()).toBeFalsy();
        
        button.toggle();
        expect(button.isChecked()).toBeTruthy();
        
        button.toggle();
        expect(button.isChecked()).toBeFalsy();
    });
    
    it('should not toggle checked state when not checkable', () => {
        expect(button.isCheckable()).toBeFalsy();
        
        button.toggle();
        expect(button.isChecked()).toBeFalsy();
    });
    
    it('should emit clicked signal when clicked', () => {
        const clickHandler = jest.fn();
        button.connect('clicked', clickHandler);
        
        // Simulate click
        const mouseDownEvent = new MouseEvent('mousedown');
        const mouseUpEvent = new MouseEvent('mouseup');
        
        button.getElement().querySelector('button')?.dispatchEvent(mouseDownEvent);
        button.getElement().querySelector('button')?.dispatchEvent(mouseUpEvent);
        
        expect(clickHandler).toHaveBeenCalled();
    });
    
    it('should emit toggled signal when checked state changes', () => {
        const toggleHandler = jest.fn();
        button.connect('toggled', toggleHandler);
        
        button.setCheckable(true);
        button.setChecked(true);
        
        expect(toggleHandler).toHaveBeenCalledWith(true);
        
        button.setChecked(false);
        expect(toggleHandler).toHaveBeenCalledWith(false);
    });
    
    it('should handle disabled state', () => {
        button.setEnabled(false);
        expect(button.isEnabled()).toBeFalsy();
        
        const buttonElement = button.getElement().querySelector('button') as HTMLButtonElement;
        expect(buttonElement.disabled).toBeTruthy();
        
        button.setEnabled(true);
        expect(button.isEnabled()).toBeTruthy();
        expect(buttonElement.disabled).toBeFalsy();
    });
    
    it('should handle icon setting', () => {
        const iconUrl = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M8%2016A8%208%200%20108%200a8%208%200%20000%2016z%22%2F%3E%3C%2Fsvg%3E';
        expect(button.icon()).toBeNull();
        
        button.setIcon(iconUrl);
        expect(button.icon()).toBe(iconUrl);
        
        // Check if img element was created
        const imgElement = button.getElement().querySelector('img');
        expect(imgElement).not.toBeNull();
        expect(imgElement?.getAttribute('src')).toBe(iconUrl);
        
        // Test removing the icon
        button.setIcon(null);
        expect(button.icon()).toBeNull();
        expect(button.getElement().querySelector('img')).toBeNull();
    });
});