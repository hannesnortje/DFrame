import { QStyle } from '../core/QStyle';
import { QWidget } from '../widgets/QWidget';

export const applyDarkTheme = (app: QWidget) => {
    // Apply base dark styling to the application
    QStyle.applyStyle(app.getElement(), {
        backgroundColor: '#121212',
        color: '#e0e0e0'
    });
    
    // Override specific widget types
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        QStyle.applyStyle(button, {
            backgroundColor: '#333',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '4px'
        });
    });
    
    // You could also target specific widgets by class name or other attributes
};
