import { QGroupBox } from './QGroupBox';
import { QLabel } from './QLabel';

describe('QGroupBox', () => {
    let groupBox: QGroupBox;
    
    beforeEach(() => {
        groupBox = new QGroupBox('Test Group');
        document.body.appendChild(groupBox.getElement());
    });
    
    afterEach(() => {
        groupBox.getElement().remove();
    });
    
    it('should create a group box with the specified title', () => {
        expect(groupBox.title()).toBe('Test Group');
        expect(groupBox.getElement().textContent).toContain('Test Group');
    });
    
    it('should set and get title correctly', () => {
        groupBox.setTitle('New Title');
        expect(groupBox.title()).toBe('New Title');
        expect(groupBox.getElement().textContent).toContain('New Title');
    });
    
    it('should not be checkable by default', () => {
        expect(groupBox.isCheckable()).toBeFalsy();
        expect(groupBox.getElement().querySelector('input[type="checkbox"]')).toBeNull();
    });
    
    it('should make the group box checkable', () => {
        groupBox.setCheckable(true);
        expect(groupBox.isCheckable()).toBeTruthy();
        
        const checkbox = groupBox.getElement().querySelector('input[type="checkbox"]');
        expect(checkbox).not.toBeNull();
    });
    
    it('should handle checked state when checkable', () => {
        groupBox.setCheckable(true);
        expect(groupBox.isChecked()).toBeFalsy();
        
        groupBox.setChecked(true);
        expect(groupBox.isChecked()).toBeTruthy();
        
        const checkbox = groupBox.getElement().querySelector('input[type="checkbox"]') as HTMLInputElement;
        expect(checkbox.checked).toBeTruthy();
    });
    
    it('should emit toggled signal when checked state changes', () => {
        const toggleHandler = jest.fn();
        groupBox.connect('toggled', toggleHandler);
        
        groupBox.setCheckable(true);
        groupBox.setChecked(true);
        
        expect(toggleHandler).toHaveBeenCalledWith(true);
    });
    
    it('should show/hide content based on checked state', () => {
        // Add a widget to the group box
        const label = new QLabel('Content');
        groupBox.addWidget(label);
        
        // Make checkable and uncheck
        groupBox.setCheckable(true);
        groupBox.setChecked(false);
        
        // Get content container
        const content = groupBox.getElement().children[1] as HTMLElement;
        expect(content.style.display).toBe('none');
        
        // Check and verify content is visible
        groupBox.setChecked(true);
        expect(content.style.display).toBe('block');
    });
    
    it('should add widgets to its content area', () => {
        const label = new QLabel('Test Label');
        groupBox.addWidget(label);
        
        expect(groupBox.getElement().contains(label.getElement())).toBeTruthy();
        expect(groupBox.getElement().textContent).toContain('Test Label');
    });
});
