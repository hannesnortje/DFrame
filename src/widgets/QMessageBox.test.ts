import { QMessageBox, StandardButton, Icon } from './QMessageBox';
import { QStyle } from '../core/QStyle';
import { QWidget } from './QWidget';
import { QPushButton } from './QPushButton';

describe('QMessageBox', () => {
    let messageBox: QMessageBox;
    
    // Setup fake timers for setTimeout
    beforeEach(() => {
        jest.useFakeTimers();
        
        // Create a mock element
        const mockElement = {
            style: {},
            classList: {
                add: jest.fn(),
                remove: jest.fn()
            },
            focus: jest.fn(),
            dispatchEvent: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            appendChild: jest.fn(),
            setAttribute: jest.fn(),
            textContent: ''
        };
        
        // Mock document functions
        document.createElement = jest.fn().mockReturnValue(mockElement);
        
        // Mock document.body
        Object.defineProperty(document, 'body', {
            value: {
                appendChild: jest.fn(),
                removeChild: jest.fn(),
                contains: jest.fn().mockReturnValue(true)
            },
            configurable: true
        });
        
        // Mock QStyle.applyStyle
        jest.spyOn(QStyle, 'applyStyle').mockImplementation((element) => element);
        
        messageBox = new QMessageBox();
        
        // Mock getElement method to return our mock element
        messageBox.getElement = jest.fn().mockReturnValue(mockElement);
    });
    
    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });
    
    test('should initialize with default properties', () => {
        expect(messageBox.text()).toBe('');
        expect(messageBox.informativeText()).toBe('');
        expect(messageBox.detailedText()).toBe('');
        expect(messageBox.icon()).toBe(Icon.NoIcon);
        expect(messageBox.standardButtons()).toBe(StandardButton.NoButton);
        expect(messageBox.clickedButton()).toBe(StandardButton.NoButton);
        expect(messageBox.isModal()).toBe(true);
    });
    
    test('should set and get text', () => {
        const testText = 'Test message';
        messageBox.setText(testText);
        expect(messageBox.text()).toBe(testText);
    });
    
    test('should set and get informative text', () => {
        const infoText = 'Additional information';
        messageBox.setInformativeText(infoText);
        expect(messageBox.informativeText()).toBe(infoText);
    });
    
    test('should set and get detailed text', () => {
        const detailText = 'Detailed error information...';
        messageBox.setDetailedText(detailText);
        expect(messageBox.detailedText()).toBe(detailText);
    });
    
    test('should set and get icon', () => {
        messageBox.setIcon(Icon.Information);
        expect(messageBox.icon()).toBe(Icon.Information);
        
        messageBox.setIcon(Icon.Warning);
        expect(messageBox.icon()).toBe(Icon.Warning);
        
        messageBox.setIcon(Icon.Critical);
        expect(messageBox.icon()).toBe(Icon.Critical);
        
        messageBox.setIcon(Icon.Question);
        expect(messageBox.icon()).toBe(Icon.Question);
    });
    
    test('should set standard buttons', () => {
        messageBox.setStandardButtons(StandardButton.Ok | StandardButton.Cancel);
        expect(messageBox.standardButtons()).toBe(StandardButton.Ok | StandardButton.Cancel);
    });
    
    test('should track clicked button', () => {
        // Create mock buttons
        const mockButtons = new Map();
        const mockOkButton = new QPushButton('OK');
        mockButtons.set(StandardButton.Ok, mockOkButton);
        messageBox['_buttons'] = mockButtons;
        
        // Simulate clicking the OK button
        messageBox['_clickedButton'] = StandardButton.Ok;
        expect(messageBox.clickedButton()).toBe(StandardButton.Ok);
    });
    
    test('should provide static information method', () => {
        const parent = new QWidget();
        
        // Mock the exec method
        const execSpy = jest.spyOn(QMessageBox.prototype, 'exec').mockImplementation(() => 1);
        
        // Mock the clickedButton method
        jest.spyOn(QMessageBox.prototype, 'clickedButton').mockReturnValue(StandardButton.Ok);
        
        const result = QMessageBox.information(parent, 'Info', 'Information message');
        
        expect(execSpy).toHaveBeenCalled();
        expect(result).toBe(StandardButton.Ok);
    });
    
    test('should provide static warning method', () => {
        const parent = new QWidget();
        
        // Mock the exec method
        const execSpy = jest.spyOn(QMessageBox.prototype, 'exec').mockImplementation(() => 1);
        
        // Mock the clickedButton method
        jest.spyOn(QMessageBox.prototype, 'clickedButton').mockReturnValue(StandardButton.Ok);
        
        const result = QMessageBox.warning(parent, 'Warning', 'Warning message');
        
        expect(execSpy).toHaveBeenCalled();
        expect(result).toBe(StandardButton.Ok);
    });
    
    test('should provide static critical method', () => {
        const parent = new QWidget();
        
        // Mock the exec method
        const execSpy = jest.spyOn(QMessageBox.prototype, 'exec').mockImplementation(() => 1);
        
        // Mock the clickedButton method
        jest.spyOn(QMessageBox.prototype, 'clickedButton').mockReturnValue(StandardButton.Ok);
        
        const result = QMessageBox.critical(parent, 'Error', 'Critical error message');
        
        expect(execSpy).toHaveBeenCalled();
        expect(result).toBe(StandardButton.Ok);
    });
    
    test('should provide static question method', () => {
        const parent = new QWidget();
        
        // Mock the exec method
        const execSpy = jest.spyOn(QMessageBox.prototype, 'exec').mockImplementation(() => 1);
        
        // Mock the clickedButton method
        jest.spyOn(QMessageBox.prototype, 'clickedButton').mockReturnValue(StandardButton.Yes);
        
        const result = QMessageBox.question(parent, 'Question', 'Are you sure?', StandardButton.Yes | StandardButton.No);
        
        expect(execSpy).toHaveBeenCalled();
        expect(result).toBe(StandardButton.Yes);
    });
    
    test('should set default button', () => {
        // Create a mock button
        const mockButton = new QPushButton('OK');
        mockButton.getElement = jest.fn().mockReturnValue({ focus: jest.fn() });
        
        // Add it to the message box's buttons map
        messageBox['_buttons'] = new Map();
        messageBox['_buttons'].set(StandardButton.Ok, mockButton);
        
        messageBox.setDefaultButton(StandardButton.Ok);
        
        // The focus should be called via setTimeout, so we need to fast-forward timers
        jest.runAllTimers();
        
        expect(mockButton.getElement().focus).toHaveBeenCalled();
    });
    
    test('should chain setter methods for fluent API', () => {
        const chainResult = messageBox
            .setText('Message')
            .setInformativeText('Info')
            .setDetailedText('Details')
            .setIcon(Icon.Warning)
            .setStandardButtons(StandardButton.Ok);
            
        expect(chainResult).toBe(messageBox);
    });
});
