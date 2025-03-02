import { QPushButton } from '../QPushButton';
import { QWidget } from '../../core/QWidget';

describe('QPushButton', () => {
    let button: QPushButton;

    beforeEach(() => {
        button = new QPushButton();
    });

    test('constructor initializes with default values', () => {
        expect(button.getText()).toBe('');
        expect(button.getIcon()).toBeNull();
        expect(button.isCheckable()).toBeFalsy();
        expect(button.isChecked()).toBeFalsy();
        expect(button.isFlat()).toBeFalsy();
    });

    test('text management', () => {
        const mockFn = jest.fn();
        button.connect('textChanged', mockFn);
        
        button.setText('Click me');
        expect(button.getText()).toBe('Click me');
        expect(mockFn).toHaveBeenCalledWith('Click me');
        
        // Setting same text should not emit
        mockFn.mockClear();
        button.setText('Click me');
        expect(mockFn).not.toHaveBeenCalled();
    });

    test('icon management', () => {
        const mockFn = jest.fn();
        button.connect('iconChanged', mockFn);
        
        const iconUrl = 'path/to/icon.png';
        button.setIcon(iconUrl);
        expect(button.getIcon()).toBe(iconUrl);
        expect(mockFn).toHaveBeenCalledWith(iconUrl);
    });

    test('checkable state management', () => {
        const checkableMock = jest.fn();
        const toggledMock = jest.fn();
        
        button.connect('checkableChanged', checkableMock);
        button.connect('toggled', toggledMock);
        
        button.setCheckable(true);
        expect(button.isCheckable()).toBeTruthy();
        expect(checkableMock).toHaveBeenCalledWith(true);
        
        button.setChecked(true);
        expect(button.isChecked()).toBeTruthy();
        expect(toggledMock).toHaveBeenCalledWith(true);
        
        // Should not toggle if not checkable
        button.setCheckable(false);
        button.setChecked(true);
        expect(button.isChecked()).toBeFalsy();
    });

    test('auto-repeat functionality', () => {
        const mockFn = jest.fn();
        button.connect('autoRepeatChanged', mockFn);
        
        button.setAutoRepeat(true);
        expect(mockFn).toHaveBeenCalledWith(true);
    });

    test('flat style management', () => {
        const mockFn = jest.fn();
        button.connect('flatChanged', mockFn);
        
        button.setFlat(true);
        expect(button.isFlat()).toBeTruthy();
        expect(mockFn).toHaveBeenCalledWith(true);
    });

    test('click event handling', () => {
        const clickedMock = jest.fn();
        const toggledMock = jest.fn();
        
        button.connect('clicked', clickedMock);
        button.connect('toggled', toggledMock);
        
        button.setCheckable(true);
        button.click();
        
        expect(clickedMock).toHaveBeenCalled();
        expect(toggledMock).toHaveBeenCalledWith(true);
        
        // Disabled button should not emit click
        button.setEnabled(false);
        clickedMock.mockClear();
        button.click();
        expect(clickedMock).not.toHaveBeenCalled();
    });
});
