import { QWidget } from './QWidget';
import { QStyle } from '../core/QStyle';
import { QVBoxLayout } from '../layouts';
import { QObject } from '../core/QObject';

/**
 * QTabWidget provides a stack of tabbed widgets
 */
export class QTabWidget extends QWidget {
    private tabs: Array<{
        title: string,
        widget: QWidget,
        tabButton: HTMLButtonElement
    }> = [];
    
    private _currentIndex: number = -1;
    private _tabBar: HTMLDivElement;
    private _tabContent: HTMLDivElement;
    private _tabsLayout: QVBoxLayout;
    private _documentClickHandler: (e: MouseEvent) => void;
    
    constructor(parent?: QWidget | null) {
        super(parent);
        
        // Set up the main container
        QStyle.applyStyle(this.getElement(), {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            borderRadius: 4
        });
        
        // Create tab bar
        this._tabBar = document.createElement('div');
        QStyle.applyStyle(this._tabBar, {
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #ddd',
            overflowX: 'auto',
            overflowY: 'hidden',
            whiteSpace: 'nowrap'
        });
        this.getElement().appendChild(this._tabBar);
        
        // Create tab content area
        this._tabContent = document.createElement('div');
        QStyle.applyStyle(this._tabContent, {
            flex: '1',
            position: 'relative',
            overflow: 'auto'
        });
        this.getElement().appendChild(this._tabContent);
        
        // Set up layout for tab content
        this._tabsLayout = new QVBoxLayout();
        
        // Set up document click handler for closing context menus
        this._documentClickHandler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!this._tabBar.contains(target)) {
                // Close any open context menus
                const menus = document.querySelectorAll('.tab-context-menu');
                menus.forEach(menu => {
                    if (menu.parentNode) {
                        menu.parentNode.removeChild(menu);
                    }
                });
            }
        };
        
        document.addEventListener('click', this._documentClickHandler);
    }
    
    /**
     * Add a new tab with the given title and widget
     * @param title Title text for the tab
     * @param widget Widget to display in the tab
     * @returns Index of the added tab
     */
    addTab(title: string, widget: QWidget): number {
        // Create tab button
        const tabButton = document.createElement('button');
        QStyle.applyStyle(tabButton, {
            padding: '10px 16px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRight: '1px solid #ddd',
            cursor: 'pointer',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: '14px',
            fontWeight: 'normal',
            color: '#333',
            position: 'relative',
            transition: 'background-color 0.2s'
        });
        tabButton.textContent = title;
        
        // Add tab button to tab bar
        this._tabBar.appendChild(tabButton);
        
        // Add click handler to select tab
        tabButton.addEventListener('click', () => {
            const index = this.tabs.findIndex(tab => tab.tabButton === tabButton);
            if (index !== -1) {
                this.setCurrentIndex(index);
            }
        });
        
        // Add context menu handler for right-click
        tabButton.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showTabContextMenu(e, this.tabs.length);
        });
        
        // Add hover effect
        tabButton.addEventListener('mouseenter', () => {
            if (this._currentIndex !== this.tabs.length) {
                QStyle.applyStyle(tabButton, { backgroundColor: '#e9e9e9' });
            }
        });
        
        tabButton.addEventListener('mouseleave', () => {
            if (this._currentIndex !== this.tabs.length) {
                QStyle.applyStyle(tabButton, { backgroundColor: 'transparent' });
            }
        });
        
        // Initially hide the widget
        QStyle.applyStyle(widget.getElement(), {
            display: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
        });
        
        // Add widget to content area
        this._tabContent.appendChild(widget.getElement());
        
        // Store tab information
        this.tabs.push({ title, widget, tabButton });
        
        // If this is the first tab, select it
        if (this.tabs.length === 1) {
            this.setCurrentIndex(0);
        }
        
        return this.tabs.length - 1;
    }
    
    /**
     * Insert a tab at the specified position
     * @param index Position at which to insert the tab
     * @param title Title text for the tab
     * @param widget Widget to display in the tab
     * @returns Index where the tab was inserted
     */
    insertTab(index: number, title: string, widget: QWidget): number {
        if (index < 0 || index > this.tabs.length) {
            return this.addTab(title, widget);
        }
        
        // Create the new tab
        const tabButton = document.createElement('button');
        QStyle.applyStyle(tabButton, {
            padding: '10px 16px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRight: '1px solid #ddd',
            cursor: 'pointer',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: '14px',
            fontWeight: 'normal',
            color: '#333',
            transition: 'background-color 0.2s'
        });
        tabButton.textContent = title;
        
        // Insert tab button at the correct position in the tab bar
        if (index < this.tabs.length) {
            this._tabBar.insertBefore(tabButton, this.tabs[index].tabButton);
        } else {
            this._tabBar.appendChild(tabButton);
        }
        
        // Add click handler to select tab
        tabButton.addEventListener('click', () => {
            const idx = this.tabs.findIndex(tab => tab.tabButton === tabButton);
            if (idx !== -1) {
                this.setCurrentIndex(idx);
            }
        });
        
        // Add context menu handler for right-click
        tabButton.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showTabContextMenu(e, index);
        });
        
        // Add hover effect
        tabButton.addEventListener('mouseenter', () => {
            if (this._currentIndex !== index) {
                QStyle.applyStyle(tabButton, { backgroundColor: '#e9e9e9' });
            }
        });
        
        tabButton.addEventListener('mouseleave', () => {
            if (this._currentIndex !== index) {
                QStyle.applyStyle(tabButton, { backgroundColor: 'transparent' });
            }
        });
        
        // Initially hide the widget
        QStyle.applyStyle(widget.getElement(), {
            display: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
        });
        
        // Add widget to content area
        this._tabContent.appendChild(widget.getElement());
        
        // Insert tab at the specified index
        this.tabs.splice(index, 0, { title, widget, tabButton });
        
        // If this is the first tab, select it
        if (this.tabs.length === 1) {
            this.setCurrentIndex(0);
        }
        
        // If the current tab is after the insertion point, update the current index
        else if (this._currentIndex >= index) {
            this._currentIndex++;
            this.setCurrentIndex(this._currentIndex);
        }
        
        return index;
    }
    
    /**
     * Remove a tab at the given index
     * @param index Index of the tab to remove
     */
    removeTab(index: number): void {
        if (index < 0 || index >= this.tabs.length) {
            return;
        }
        
        const tab = this.tabs[index];
        
        // Remove tab button from DOM
        this._tabBar.removeChild(tab.tabButton);
        
        // Remove widget from DOM
        this._tabContent.removeChild(tab.widget.getElement());
        
        // Remove from tabs array
        this.tabs.splice(index, 1);
        
        // Update current index if needed
        if (this.tabs.length === 0) {
            this._currentIndex = -1;
            this.emit('currentChanged', this._currentIndex);
        } else if (this._currentIndex === index) {
            // If we removed the current tab, select a new one
            this.setCurrentIndex(Math.min(index, this.tabs.length - 1));
        } else if (this._currentIndex > index) {
            // If we removed a tab before the current one, decrement the current index
            this._currentIndex--;
            this.emit('currentChanged', this._currentIndex);
        }
    }
    
    /**
     * Set the current tab index
     * @param index Index of the tab to select
     */
    setCurrentIndex(index: number): void {
        if (index < 0 || index >= this.tabs.length || index === this._currentIndex) {
            return;
        }
        
        // Update styles and visibility for previous tab if exists
        if (this._currentIndex !== -1 && this._currentIndex < this.tabs.length) {
            const prevTab = this.tabs[this._currentIndex];
            QStyle.applyStyle(prevTab.tabButton, {
                backgroundColor: 'transparent',
                fontWeight: 'normal',
                color: '#333',
                borderBottom: 'none'
            });
            QStyle.applyStyle(prevTab.widget.getElement(), { display: 'none' });
        }
        
        // Update styles and visibility for new tab
        const newTab = this.tabs[index];
        QStyle.applyStyle(newTab.tabButton, {
            backgroundColor: '#ffffff',
            fontWeight: 'bold',
            color: '#007bff',
            borderBottom: '2px solid #007bff'
        });
        QStyle.applyStyle(newTab.widget.getElement(), { display: 'block' });
        
        // Update current index and emit signal
        const oldIndex = this._currentIndex;
        this._currentIndex = index;
        this.emit('currentChanged', { oldIndex, newIndex: index });
    }
    
    /**
     * Get the current tab index
     * @returns Current tab index (-1 if no tabs)
     */
    currentIndex(): number {
        return this._currentIndex;
    }
    
    /**
     * Get the tab count
     * @returns Number of tabs
     */
    count(): number {
        return this.tabs.length;
    }
    
    /**
     * Set the title of a tab
     * @param index Index of the tab
     * @param title New title
     */
    setTabText(index: number, title: string): void {
        if (index >= 0 && index < this.tabs.length) {
            this.tabs[index].title = title;
            this.tabs[index].tabButton.textContent = title;
        }
    }
    
    /**
     * Get the title of a tab
     * @param index Index of the tab
     * @returns Tab title or empty string if index is invalid
     */
    tabText(index: number): string {
        if (index >= 0 && index < this.tabs.length) {
            return this.tabs[index].title;
        }
        return '';
    }
    
    /**
     * Get the widget at the specified tab
     * @param index Tab index
     * @returns The widget at the specified tab or undefined if index is invalid
     */
    widget(index: number): QWidget | undefined {
        if (index >= 0 && index < this.tabs.length) {
            return this.tabs[index].widget;
        }
        return undefined;
    }
    
    /**
     * Find the index of the tab containing the given widget
     * @param widget Widget to search for
     * @returns Index of the tab containing the widget, or -1 if not found
     */
    indexOf(widget: QWidget): number {
        return this.tabs.findIndex(tab => tab.widget === widget);
    }
    
    /**
     * Clean up resources when widget is destroyed
     */
    protected cleanup(): void {
        // Remove document click handler
        document.removeEventListener('click', this._documentClickHandler);
        
        // Call parent's cleanup method
        super.cleanup();
    }
    
    /**
     * Show context menu for tab operations
     */
    private showTabContextMenu(e: MouseEvent, tabIndex: number): void {
        // Remove any existing context menus
        const existingMenus = document.querySelectorAll('.tab-context-menu');
        existingMenus.forEach(menu => {
            if (menu.parentNode) {
                menu.parentNode.removeChild(menu);
            }
        });
        
        // Create context menu
        const menu = document.createElement('div');
        menu.className = 'tab-context-menu';
        QStyle.applyStyle(menu, {
            position: 'absolute',
            top: `${e.clientY}px`,
            left: `${e.clientX}px`,
            backgroundColor: '#ffffff',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: '1000',
            minWidth: '120px'
        });
        
        // Add menu items
        const closeItem = document.createElement('div');
        QStyle.applyStyle(closeItem, {
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#333',
            borderBottom: '1px solid #eee'
        });
        closeItem.textContent = 'Close Tab';
        closeItem.addEventListener('click', () => {
            this.removeTab(tabIndex);
            document.body.removeChild(menu);
        });
        
        const closeAllItem = document.createElement('div');
        QStyle.applyStyle(closeAllItem, {
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#333',
            borderBottom: '1px solid #eee'
        });
        closeAllItem.textContent = 'Close All Tabs';
        closeAllItem.addEventListener('click', () => {
            while (this.tabs.length > 0) {
                this.removeTab(0);
            }
            document.body.removeChild(menu);
        });
        
        const closeOthersItem = document.createElement('div');
        QStyle.applyStyle(closeOthersItem, {
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#333'
        });
        closeOthersItem.textContent = 'Close Others';
        closeOthersItem.addEventListener('click', () => {
            // Close all tabs except this one
            // We need to do this in reverse order to preserve indices
            for (let i = this.tabs.length - 1; i >= 0; i--) {
                if (i !== tabIndex) {
                    this.removeTab(i);
                }
            }
            document.body.removeChild(menu);
        });
        
        menu.appendChild(closeItem);
        menu.appendChild(closeAllItem);
        menu.appendChild(closeOthersItem);
        
        // Add menu to the document
        document.body.appendChild(menu);
        
        // Close menu on any click
        menu.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }
    
    /**
     * Update tab bar styles based on current state
     */
    updateTabBarStyles(): void {
        this.tabs.forEach((tab, index) => {
            if (index === this._currentIndex) {
                QStyle.applyStyle(tab.tabButton, {
                    backgroundColor: '#ffffff',
                    fontWeight: 'bold',
                    color: '#007bff',
                    borderBottom: '2px solid #007bff'
                });
            } else {
                QStyle.applyStyle(tab.tabButton, {
                    backgroundColor: 'transparent',
                    fontWeight: 'normal',
                    color: '#333',
                    borderBottom: 'none'
                });
            }
        });
    }
}
