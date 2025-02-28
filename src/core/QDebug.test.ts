import { QDebug } from './QDebug';

describe('QDebug', () => {
    let panel: HTMLElement;

    beforeEach(() => {
        // Create a mock panel
        panel = document.createElement('div');
        panel.className = 'dframe-debug-panel';
        
        const content = document.createElement('div');
        content.className = 'dframe-debug-content';
        panel.appendChild(content);
        
        document.body.appendChild(panel);
        QDebug['panel'] = panel; // Set the private static panel property
    });

    afterEach(() => {
        // Clean up the mock panel
        document.body.removeChild(panel);
        QDebug['panel'] = null;
    });

    it('should not add log if panel is not set', () => {
        QDebug['panel'] = null;
        QDebug.addLogToPanel('Test message');
        expect(panel.querySelector('.dframe-debug-content')!.children.length).toBe(0);
    });

    it('should not add log if content is not found', () => {
        panel.removeChild(panel.querySelector('.dframe-debug-content')!);
        QDebug.addLogToPanel('Test message');
        expect(panel.children.length).toBe(0);
    });

    it('should add log entry to the panel', () => {
        QDebug.addLogToPanel('Test message');
        const content = panel.querySelector('.dframe-debug-content');
        expect(content!.children.length).toBe(1);
        const logEntry = content!.children[0];
        expect(logEntry.textContent).toContain('Test message');
    });

    it('should add timestamp to the log entry', () => {
        QDebug.addLogToPanel('Test message');
        const content = panel.querySelector('.dframe-debug-content');
        const logEntry = content!.children[0];
        const timestamp = logEntry.querySelector('span');
        expect(timestamp).not.toBeNull();
        expect(timestamp!.textContent).toMatch(/\d{1,2}:\d{2}:\d{2}/); // Matches time format like "12:34:56"
    });

    it('should scroll content to the bottom after adding log', () => {
        const content = panel.querySelector('.dframe-debug-content') as HTMLElement;
        content.style.height = '100px';
        content.style.overflow = 'auto';
        
        // Add multiple log entries to enable scrolling
        for (let i = 0; i < 20; i++) {
            QDebug.addLogToPanel(`Test message ${i}`);
        }
        
        expect(content.scrollTop).toBe(content.scrollHeight - content.clientHeight);
    });
});