import { QTabWidget } from './QTabWidget';
import { QWidget } from './QWidget';
import { QStyle } from '../core/QStyle';

describe('QTabWidget', () => {
    let tabWidget: QTabWidget;
    
    // Mock elements for testing
    let mockTabButton: HTMLButtonElement;
    let mockElement: HTMLDivElement;
    let mockTabBar: HTMLDivElement;
    let mockTabContent: HTMLDivElement;
    
    beforeEach(() => {
        // Create mock elements
        mockTabButton = document.createElement('button') as HTMLButtonElement;
        mockElement = document.createElement('div') as HTMLDivElement;
        mockTabBar = document.createElement('div') as HTMLDivElement;
        mockTabContent = document.createElement('div') as HTMLDivElement;
        
        // Setup mock appendChild methods
        mockTabBar.appendChild = jest.fn();
        mockTabContent.appendChild = jest.fn();
        mockElement.appendChild = jest.fn().mockImplementation((el) => el);
        
        // Setup document.createElement mock
        document.createElement = jest.fn().mockImplementation((tag) => {
            if (tag === 'button') {
                return mockTabButton;
            }
            if (tag === 'div') {
                // Return specific mocks for first two div creation calls
                if ((document.createElement as jest.Mock).mock.calls.length === 1) {
                    return mockTabBar;
                }
                if ((document.createElement as jest.Mock).mock.calls.length === 2) {
                    return mockTabContent;
                }
                return mockElement;
            }
            // For any other tag, use actual implementation
            return document.createElement.bind(document)(tag);
        });
        
        // Mock event listeners
        mockTabButton.addEventListener = jest.fn();
        document.addEventListener = jest.fn();
        
        // Mock QStyle.applyStyle
        jest.spyOn(QStyle, 'applyStyle').mockImplementation((element) => element);
        
        // Create the tab widget
        tabWidget = new QTabWidget();
        
        // Set up the tab widget's private properties directly
        (tabWidget as any)._tabBar = mockTabBar;
        (tabWidget as any)._tabContent = mockTabContent;
    });
    
    afterEach(() => {
        jest.restoreAllMocks();
    });
    
    test('should initialize with no tabs', () => {
        expect(tabWidget.count()).toBe(0);
        expect(tabWidget.currentIndex()).toBe(-1);
    });
    
    test('should add a tab correctly', () => {
        const widget = new QWidget();
        widget.getElement = jest.fn().mockReturnValue(document.createElement('div'));
        
        const index = tabWidget.addTab('Tab 1', widget);
        
        expect(index).toBe(0);
        expect(tabWidget.count()).toBe(1);
        expect(tabWidget.currentIndex()).toBe(0);
        expect(tabWidget.tabText(0)).toBe('Tab 1');
        expect(tabWidget.widget(0)).toBe(widget);
        expect(mockTabBar.appendChild).toHaveBeenCalled();
        expect(mockTabContent.appendChild).toHaveBeenCalled();
    });
    
    test('should insert a tab at specific position', () => {
        // Set up mock insertBefore
        mockTabBar.insertBefore = jest.fn();
        
        const widget1 = new QWidget();
        const widget2 = new QWidget();
        const widget3 = new QWidget();
        
        widget1.getElement = jest.fn().mockReturnValue(document.createElement('div'));
        widget2.getElement = jest.fn().mockReturnValue(document.createElement('div'));
        widget3.getElement = jest.fn().mockReturnValue(document.createElement('div'));
        
        // Manually add tabs to the tabWidget's internal state
        (tabWidget as any).tabs = [
            { 
                title: 'Tab 1',
                widget: widget1,
                tabButton: document.createElement('button')
            },
            { 
                title: 'Tab 2',
                widget: widget2,
                tabButton: document.createElement('button')
            }
        ];
        
        // Call insertTab
        const index = tabWidget.insertTab(1, 'Tab 3', widget3);
        
        expect(index).toBe(1);
        expect(tabWidget.count()).toBe(3);
        expect(tabWidget.tabText(1)).toBe('Tab 3');
        expect(tabWidget.widget(1)).toBe(widget3);
        expect(mockTabBar.insertBefore).toHaveBeenCalled();
        expect(mockTabContent.appendChild).toHaveBeenCalled();
    });
    
    test('should remove a tab correctly', () => {
        const widget1 = new QWidget();
        const widget2 = new QWidget();
        
        widget1.getElement = jest.fn().mockReturnValue(document.createElement('div'));
        widget2.getElement = jest.fn().mockReturnValue(document.createElement('div'));
        
        // Mock removeChild method
        mockTabBar.removeChild = jest.fn();
        mockTabContent.removeChild = jest.fn();
        
        // Manually set up tabs array with mock tabButton objects
        (tabWidget as any).tabs = [
            { 
                title: 'Tab 1',
                widget: widget1,
                tabButton: document.createElement('button')
            },
            { 
                title: 'Tab 2',
                widget: widget2,
                tabButton: document.createElement('button')
            }
        ];
        
        // Manually set up the current index
        (tabWidget as any)._currentIndex = 0;
        
        // Set up emit mock
        (tabWidget as any).emit = jest.fn();
        
        tabWidget.removeTab(0);
        
        expect(tabWidget.count()).toBe(1);
        expect(tabWidget.tabText(0)).toBe('Tab 2');
        expect(mockTabBar.removeChild).toHaveBeenCalled();
        expect(mockTabContent.removeChild).toHaveBeenCalled();
    });
    
    test('should change the current index', () => {
        const widget1 = new QWidget();
        const widget2 = new QWidget();
        
        widget1.getElement = jest.fn().mockReturnValue(document.createElement('div'));
        widget2.getElement = jest.fn().mockReturnValue(document.createElement('div'));
        
        // Set up mock tabs and current index
        (tabWidget as any).tabs = [
            { 
                title: 'Tab 1',
                widget: widget1,
                tabButton: document.createElement('button')
            },
            { 
                title: 'Tab 2',
                widget: widget2,
                tabButton: document.createElement('button')
            }
        ];
        (tabWidget as any)._currentIndex = 0;
        
        // Set up emit mock
        (tabWidget as any).emit = jest.fn();
        
        tabWidget.setCurrentIndex(1);
        
        expect(tabWidget.currentIndex()).toBe(1);
        expect((tabWidget as any).emit).toHaveBeenCalledWith('currentChanged', { oldIndex: 0, newIndex: 1 });
    });
    
    test('should set and get tab text', () => {
        const widget = new QWidget();
        widget.getElement = jest.fn().mockReturnValue(document.createElement('div'));
        
        // Set up mock tab
        const mockTabButton = document.createElement('button');
        (tabWidget as any).tabs = [
            { 
                title: 'Tab 1',
                widget: widget,
                tabButton: mockTabButton
            }
        ];
        
        tabWidget.setTabText(0, 'New Tab Title');
        
        expect(tabWidget.tabText(0)).toBe('New Tab Title');
        expect(mockTabButton.textContent).toBe('New Tab Title');
    });
    
    test('should find index of a tab by widget', () => {
        const widget1 = new QWidget();
        const widget2 = new QWidget();
        const randomWidget = new QWidget();
        
        // Set up mock tabs
        (tabWidget as any).tabs = [
            { 
                title: 'Tab 1',
                widget: widget1,
                tabButton: document.createElement('button')
            },
            { 
                title: 'Tab 2',
                widget: widget2,
                tabButton: document.createElement('button')
            }
        ];
        
        expect(tabWidget.indexOf(widget2)).toBe(1);
        expect(tabWidget.indexOf(randomWidget)).toBe(-1);
    });
    
    test('should clean up document event listener on destroy', () => {
        document.removeEventListener = jest.fn();
        
        // Access the protected cleanup method
        (tabWidget as any).cleanup();
        
        expect(document.removeEventListener).toHaveBeenCalled();
    });
});
