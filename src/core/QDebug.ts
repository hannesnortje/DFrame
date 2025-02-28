import { QWidget } from '../widgets/QWidget';
import { isHTMLElement, scrollElement } from './DOMUtils';

/**
 * Utility class for debugging DFrame applications
 */
export class QDebug {
    private static _enabled: boolean = false;
    private static _highlightColor: string = 'rgba(255, 0, 0, 0.2)';
    private static panel: HTMLElement | null = null;
    
    /**
     * Enable or disable debug mode
     */
    static setEnabled(enabled: boolean): void {
        QDebug._enabled = enabled;
        
        if (enabled) {
            console.info('DFrame Debug Mode Enabled');
            QDebug.applyDebugAttributes();
        } else {
            console.info('DFrame Debug Mode Disabled');
            QDebug.removeDebugAttributes();
        }

        // Update panel visibility if it exists
        if (QDebug.panel) {
            QDebug.panel.style.display = enabled ? 'block' : 'none';
        }
    }
    
    /**
     * Check if debug mode is enabled
     */
    static isEnabled(): boolean {
        return QDebug._enabled;
    }
    
    /**
     * Add debug attributes to all DFrame widgets in the DOM
     */
    static applyDebugAttributes(): void {
        const elements = document.querySelectorAll('[data-dframe-widget]');
        
        elements.forEach(element => {
            element.classList.add('dframe-debug');
        });
        
        // Add debug stylesheet
        if (!document.getElementById('dframe-debug-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'dframe-debug-styles';
            styleSheet.textContent = `
                .dframe-debug {
                    outline: 1px dashed #999 !important;
                }
                .dframe-debug:hover {
                    outline: 2px solid #007bff !important;
                    background-color: ${QDebug._highlightColor} !important;
                }
                .dframe-debug::before {
                    content: attr(data-dframe-widget);
                    position: absolute;
                    top: 0;
                    left: 0;
                    font-size: 10px;
                    background-color: #007bff;
                    color: white;
                    padding: 2px 4px;
                    z-index: 9999;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .dframe-debug:hover::before {
                    opacity: 1;
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }
    
    /**
     * Remove debug attributes from all DFrame widgets in the DOM
     */
    static removeDebugAttributes(): void {
        const elements = document.querySelectorAll('.dframe-debug');
        
        elements.forEach(element => {
            element.classList.remove('dframe-debug');
        });
        
        // Remove debug stylesheet
        const styleSheet = document.getElementById('dframe-debug-styles');
        if (styleSheet) {
            document.head.removeChild(styleSheet);
        }
    }
    
    /**
     * Add a debug panel to the document
     */
    static addDebugPanel(): HTMLElement {
        if (!QDebug.panel) {
            QDebug.panel = document.createElement('div');
            QDebug.panel.className = 'dframe-debug-panel';
            
            // Style the panel
            Object.assign(QDebug.panel.style, {
                position: 'fixed',
                top: '10px',
                right: '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '12px',
                fontFamily: 'monospace',
                zIndex: '9999',
                maxWidth: '300px',
                maxHeight: '400px',
                overflow: 'auto',
                display: QDebug._enabled ? 'block' : 'none'
            });
            
            // Add title
            const title = document.createElement('div');
            title.textContent = 'DFrame Debug Panel';
            title.style.fontWeight = 'bold';
            title.style.marginBottom = '5px';
            title.style.borderBottom = '1px solid #aaa';
            title.style.paddingBottom = '3px';
            QDebug.panel.appendChild(title);
            
            // Add content container
            const content = document.createElement('div');
            content.className = 'dframe-debug-content';
            QDebug.panel.appendChild(content);
            
            // Add to document
            document.body.appendChild(QDebug.panel);
            
            // Log initial message
            QDebug.addLogToPanel('Debug panel initialized');
            
            // Add show/hide toggle button
            const toggleBtn = document.createElement('button');
            toggleBtn.textContent = 'Hide';
            toggleBtn.style.position = 'absolute';
            toggleBtn.style.top = '5px';
            toggleBtn.style.right = '5px';
            toggleBtn.style.fontSize = '10px';
            toggleBtn.style.padding = '2px 5px';
            toggleBtn.style.backgroundColor = '#444';
            toggleBtn.style.border = 'none';
            toggleBtn.style.color = 'white';
            toggleBtn.style.cursor = 'pointer';
            
            toggleBtn.onclick = () => {
                const content = QDebug.panel!.querySelector('.dframe-debug-content');
                if (content && content instanceof HTMLElement) {
                    if (content.style.display === 'none') {
                        content.style.display = 'block';
                        toggleBtn.textContent = 'Hide';
                    } else {
                        content.style.display = 'none';
                        toggleBtn.textContent = 'Show';
                    }
                }
            };
            
            QDebug.panel.appendChild(toggleBtn);
        }
        
        return QDebug.panel;
    }
    
    /**
     * Refresh the debug panel with current widget tree
     */
    private static refreshDebugPanel(treeContainer: HTMLElement): void {
        // Generate widget tree
        const widgetElements = document.querySelectorAll('[data-dframe-widget]');
        let treeText = '';
        
        const buildTree = (element: Element, depth = 0): void => {
            const indent = '  '.repeat(depth);
            const widgetType = element.getAttribute('data-dframe-widget') || 'Unknown';
            const widgetId = element.getAttribute('id') || '';
            const widgetClasses = Array.from(element.classList).join(' ');
            
            treeText += `${indent}├ ${widgetType}${widgetId ? ' #' + widgetId : ''}${widgetClasses ? ' .' + widgetClasses.replace(/\s+/g, ' .') : ''}\n`;
            
            // Use proper type casting for HTMLElement
            const childWidgets = Array.from(element.children).filter(el => 
                el.hasAttribute && el.hasAttribute('data-dframe-widget')
            );
            
            childWidgets.forEach(child => buildTree(child, depth + 1));
        };
        
        // Find top-level widgets (those with no widget parent)
        const topLevelWidgets = Array.from(widgetElements).filter(el => {
            let parent = el.parentElement;
            while (parent) {
                // Cast to HTMLElement to access properties safely
                if (parent.hasAttribute && parent.hasAttribute('data-dframe-widget')) {
                    return false;
                }
                parent = parent.parentElement;
            }
            return true;
        });
        
        if (topLevelWidgets.length === 0) {
            treeText = 'No DFrame widgets found';
        } else {
            topLevelWidgets.forEach(widget => buildTree(widget));
        }
        
        treeContainer.textContent = treeText;
    }
    
    /**
     * Apply debug attributes to a specific widget
     */
    static applyToWidget(widget: QWidget): void {
        if (!widget || !widget.getElement) return;
        
        const element = widget.getElement();
        if (!element) return;
        
        const widgetName = widget.constructor.name;
        const objectName = widget.objectName();
        
        // Check if the element has setAttribute before calling it
        if (element && typeof element.setAttribute === 'function') {
            element.setAttribute('data-dframe-widget', widgetName);
            if (objectName) {
                element.setAttribute('data-dframe-object-name', objectName);
            }
            
            if (QDebug.isEnabled()) {
                element.classList.add('dframe-debug');
            }
        }
    }

    /**
     * Log a debug message
     */
    static log(message: string, ...args: any[]): void {
        if (QDebug._enabled) {
            console.log(`[DFrame Debug] ${message}`, ...args);
        }
    }

    /**
     * Add a log entry to the debug panel
     */
    static addLogToPanel(message: string): void {
        if (!QDebug.panel) {
            return;
        }
        
        const content = QDebug.panel.querySelector('.dframe-debug-content');
        if (!content) {
            return;
        }
        
        const logEntry = document.createElement('div');
        logEntry.style.borderBottom = '1px solid #555';
        logEntry.style.paddingBottom = '3px';
        logEntry.style.marginBottom = '3px';
        
        const timestamp = document.createElement('span');
        timestamp.textContent = new Date().toLocaleTimeString();
        timestamp.style.color = '#aaa';
        timestamp.style.marginRight = '5px';
        logEntry.appendChild(timestamp);
        
        const messageElem = document.createElement('span');
        messageElem.textContent = message;
        logEntry.appendChild(messageElem);
        
        // Append to the content
        content.appendChild(logEntry);
        
        // Handle scrolling for HTMLElement
        if (content instanceof HTMLElement) {
            content.scrollTop = content.scrollHeight;
        }
    }
}
