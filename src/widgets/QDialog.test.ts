import { QDialog, DialogCode } from './QDialog';
import { QStyle } from '../core/QStyle';

describe('QDialog', () => {
    let dialog: QDialog;
    
    beforeEach(() => {
        // Create mocks for DOM elements and methods
        const mockElement = {
            style: { display: 'none' },
            addEventListener: jest.fn(),
            appendChild: jest.fn(),
            contains: jest.fn().mockReturnValue(true)
        };
        
        // Mock document.createElement to return our mock element
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
        jest.spyOn(QStyle, 'applyStyle').mockImplementation((element, styles) => {
            if (styles && styles.display) {
                element.style.display = styles.display;
            }
            return element;
        });
        
        // Create the dialog instance with mocked elements
        dialog = new QDialog();
        
        // Override getElement to return our mock
        dialog.getElement = jest.fn().mockReturnValue(mockElement);
    });
    
    afterEach(() => {
        jest.restoreAllMocks();
    });
    
    test('should initialize with default properties', () => {
        expect(dialog.isModal()).toBe(false);
        expect(dialog.result()).toBe(DialogCode.Rejected);
    });
    
    test('should set modal state', () => {
        dialog.setModal(true);
        expect(dialog.isModal()).toBe(true);
        
        dialog.setModal(false);
        expect(dialog.isModal()).toBe(false);
    });
    
    test('should set and get result code', () => {
        dialog.setResult(DialogCode.Accepted);
        expect(dialog.result()).toBe(DialogCode.Accepted);
        
        dialog.setResult(DialogCode.Rejected);
        expect(dialog.result()).toBe(DialogCode.Rejected);
    });
    
    test('should handle accept', () => {
        const acceptHandler = jest.fn();
        dialog.connect('accepted', acceptHandler);
        
        dialog.accept();
        
        expect(dialog.result()).toBe(DialogCode.Accepted);
        expect(acceptHandler).toHaveBeenCalled();
    });
    
    test('should handle reject', () => {
        const rejectHandler = jest.fn();
        dialog.connect('rejected', rejectHandler);
        
        dialog.reject();
        
        expect(dialog.result()).toBe(DialogCode.Rejected);
        expect(rejectHandler).toHaveBeenCalled();
    });
    
    test('should emit opened signal on open', () => {
        const openHandler = jest.fn();
        dialog.connect('opened', openHandler);
        
        dialog.open();
        
        expect(openHandler).toHaveBeenCalled();
    });
    
    test('should emit closed signal on close', () => {
        const closeHandler = jest.fn();
        dialog.connect('closed', closeHandler);
        
        dialog.open(); // Open first
        dialog.close();
        
        expect(closeHandler).toHaveBeenCalled();
    });
    
    test('should set display to block when shown', () => {
        dialog.open();
        expect(QStyle.applyStyle).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ 
            display: 'block' 
        }));
    });
    
    test('should create an overlay when showing modal dialog', () => {
        dialog.setModal(true);
        dialog.open();
        
        // Check if document.createElement was called to create the overlay
        expect(document.createElement).toHaveBeenCalledWith('div');
        
        // Check if the overlay was added to the body
        expect(document.body.appendChild).toHaveBeenCalled();
    });
    
    test('should remove overlay when closing modal dialog', () => {
        // Set up a spy for document.body.removeChild
        dialog.setModal(true);
        dialog.open();
        dialog.close();
        
        // Check if the overlay was removed from the body
        expect(document.body.removeChild).toHaveBeenCalled();
    });
});
