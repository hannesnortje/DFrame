import { QObject } from '../QObject';
import { QWidget } from '../QWidget';
import { QCoreApplication } from '../QCoreApplication';
import { QApplication } from '../QApplication';
import { QPushButton } from '../../widgets/QPushButton';

describe('Inheritance Relationships', () => {
    beforeEach(() => {
        QApplication.__resetForTesting();
        QCoreApplication.__resetForTesting();
    });
    
    test('QWidget inherits from QObject', () => {
        const widget = new QWidget();
        expect(widget instanceof QObject).toBeTruthy();
        
        // Check method availability
        expect(typeof widget.connect).toBe('function');
        expect(typeof widget.disconnect).toBe('function');
        expect(typeof widget.event).toBe('function');
    });
    
    test('QApplication inherits from QCoreApplication', () => {
        const app = QApplication.getInstance();
        expect(app instanceof QCoreApplication).toBeTruthy();
        
        // Check QCoreApplication methods are available
        expect(typeof app.applicationName).toBe('function');
        expect(typeof app.arguments).toBe('function');
        expect(typeof app.exec).toBe('function');
        
        // Check QApplication-specific methods
        expect(typeof app.setStyleSheet).toBe('function');
        expect(typeof app.activeWindow).toBe('function');
    });
    
    test('QPushButton inherits from QWidget', () => {
        const button = new QPushButton();
        expect(button instanceof QWidget).toBeTruthy();
        expect(button instanceof QObject).toBeTruthy();
        
        // Check inherited and new methods
        expect(typeof button.setGeometry).toBe('function'); // From QWidget
        expect(typeof button.setText).toBe('function');     // From QPushButton
    });
    
    test('getInstance returns correct instance type', () => {
        // First create and then clear application instances
        QApplication.__resetForTesting();
        QCoreApplication.__resetForTesting();
        
        // Now create core app first
        const coreApp = QCoreApplication.getInstance();
        expect(coreApp instanceof QCoreApplication).toBeTruthy();
        
        // Reset again before creating QApplication
        QApplication.__resetForTesting();
        QCoreApplication.__resetForTesting();
        
        // Now test QApplication
        const app = QApplication.getInstance();
        expect(app instanceof QApplication).toBeTruthy();
    });
});
