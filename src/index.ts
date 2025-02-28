// Import all components we need to use
import { QObject } from './core/QObject';
import { QStyle } from './core/QStyle';
import { Qt } from './core/Qt';
import { QDebug } from './core/QDebug';
import { QWidget } from './widgets/QWidget';
import { QLabel } from './widgets/QLabel';
import { QPushButton } from './widgets/QPushButton';
import { QLineEdit } from './widgets/QLineEdit';
import { QTextEdit } from './widgets/QTextEdit';
import { QComboBox } from './widgets/QComboBox';
import { QLayout } from './layouts/QLayout';
import { QVBoxLayout } from './layouts/QVBoxLayout';
import { QHBoxLayout } from './layouts/QHBoxLayout';
import { 
  isHTMLElement,
  applyStyles,
  setStyle,
  getComputedStyle, 
  scrollElement
} from './core/DOMUtils';

// Re-export all components
export { 
  QObject, QStyle, Qt, QDebug,
  QWidget, QLabel, QPushButton, QLineEdit, QTextEdit, QComboBox,
  QLayout, QVBoxLayout, QHBoxLayout,
  // DOM utilities
  isHTMLElement, applyStyles, setStyle, getComputedStyle, scrollElement
};

// For legacy support and browser script tag usage, add to window scope
if (typeof window !== 'undefined') {
  const components = {
    QObject, QStyle, Qt, QDebug,
    QWidget, QLabel, QPushButton, QLineEdit, QTextEdit, QComboBox,
    QLayout, QVBoxLayout, QHBoxLayout
  };
  
  (window as any).DFrame = components;
  
  // Add a deprecation warning when accessing through window.DFrame in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      'Using window.DFrame is deprecated and will be removed in a future version. ' +
      'Please use import statements instead: import { QWidget } from "dframe";'
    );
  }
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Keep debug mode enabled for better visibility
    QDebug.setEnabled(false);
    
    const rootElement = document.getElementById('root');
    if (!rootElement) {
        console.error('Root element not found');
        return;
    }
    
    // Style the root element
    rootElement.style.width = '100%';
    rootElement.style.height = '100vh';
    rootElement.style.display = 'block';
    rootElement.style.overflow = 'auto';
    
    // -----------------------------------------------------
    // Step 1: Create the main application window
    // -----------------------------------------------------
    const mainWindow = new QWidget(null);
    mainWindow.setObjectName("mainWindow");
    mainWindow.setWindowTitle('DFrame Widget Showcase - Basic');
    QStyle.applyStyle(mainWindow.getElement(), {
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        boxSizing: 'border-box'
    });

    // -----------------------------------------------------
    // Step 2: Add a centered heading label
    // -----------------------------------------------------
    const titleLabel = new QLabel('Welcome to DFrame');
    titleLabel.setObjectName("titleLabel");
    QStyle.applyStyle(titleLabel.getElement(), {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: '20px',
        width: '100%',
        display: 'block'
    });
    mainWindow.getElement().appendChild(titleLabel.getElement());

    // -----------------------------------------------------
    // Step 3: Add a simple description label
    // -----------------------------------------------------
    const descriptionLabel = new QLabel('This is a simple showcase of DFrame widgets. We\'ll start with the basics and add more as we go.');
    descriptionLabel.setObjectName("descriptionLabel");
    QStyle.applyStyle(descriptionLabel.getElement(), {
        fontSize: '16px',
        color: '#666',
        textAlign: 'center',
        marginBottom: '40px',
        width: '100%',
        display: 'block'
    });
    mainWindow.getElement().appendChild(descriptionLabel.getElement());

    // -----------------------------------------------------
    // Step 4: Add a button with an action
    // -----------------------------------------------------
    // Create a container div for centering the button
    const buttonContainer = document.createElement('div');
    QStyle.applyStyle(buttonContainer, {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        marginBottom: '20px'
    });
    
    const actionButton = new QPushButton('Click Me!');
    actionButton.setObjectName("actionButton");
    QStyle.applyStyle(actionButton.getElement(), {
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        minWidth: '120px',
        height: '44px',
        boxSizing: 'border-box',
        textAlign: 'center',
        lineHeight: '24px'
    });
    
    buttonContainer.appendChild(actionButton.getElement());
    mainWindow.getElement().appendChild(buttonContainer);

    // Using mouseenter/mouseleave event handlers
    actionButton.on('mouseenter', () => {
        actionButton.getElement().style.backgroundColor = '#0069d9';
    });

    actionButton.on('mouseleave', () => {
        actionButton.getElement().style.backgroundColor = '#007bff';
    });

    // Add click handler using DFrame's signal/slot system
    let clickCount = 0;
    const feedbackLabel = new QLabel('Click the button to see what happens!');
    feedbackLabel.setObjectName("feedbackLabel");
    QStyle.applyStyle(feedbackLabel.getElement(), {
        marginTop: '10px',
        fontSize: '14px',
        color: '#666',
        textAlign: 'center',
        width: '100%',
        display: 'block'
    });
    mainWindow.getElement().appendChild(feedbackLabel.getElement());

    actionButton.connect('clicked', () => {
        clickCount++;
        feedbackLabel.setText(`Button clicked ${clickCount} time${clickCount === 1 ? '' : 's'}!`);

        // Add a little animation effect
        QStyle.applyStyle(feedbackLabel.getElement(), {
            color: '#28a745',
            fontWeight: 'bold'
        });

        // Reset the style after a moment
        setTimeout(() => {
            QStyle.applyStyle(feedbackLabel.getElement(), {
                color: '#666',
                fontWeight: 'normal'
            });
        }, 300);
    });

    // -----------------------------------------------------
    // Step 5: Add a form section with input fields
    // -----------------------------------------------------
    const formSection = document.createElement('div');
    QStyle.applyStyle(formSection, {
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        width: '100%',
        boxSizing: 'border-box'
    });
    
    // Add a form title
    const formTitle = new QLabel('User Information Form');
    formTitle.setObjectName("formTitle");
    QStyle.applyStyle(formTitle.getElement(), {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '15px',
        color: '#495057',
        display: 'block'
    });
    formSection.appendChild(formTitle.getElement());
    
    // Create a name input field with label
    const nameContainer = document.createElement('div');
    QStyle.applyStyle(nameContainer, {
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center'
    });
    
    const nameLabel = new QLabel('Name:');
    QStyle.applyStyle(nameLabel.getElement(), {
        width: '80px',
        fontSize: '14px',
        color: '#495057'
    });
    
    const nameInput = new QLineEdit();
    nameInput.setObjectName("nameInput");
    nameInput.setPlaceholder('Enter your name');
    QStyle.applyStyle(nameInput.getElement(), {
        flex: 1
    });
    
    nameContainer.appendChild(nameLabel.getElement());
    nameContainer.appendChild(nameInput.getElement());
    formSection.appendChild(nameContainer);
    
    // Create a country selection dropdown with label
    const countryContainer = document.createElement('div');
    QStyle.applyStyle(countryContainer, {
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center'
    });
    
    const countryLabel = new QLabel('Country:');
    QStyle.applyStyle(countryLabel.getElement(), {
        width: '80px',
        fontSize: '14px',
        color: '#495057'
    });
    
    const countryComboBox = new QComboBox();
    countryComboBox.setObjectName("countryComboBox");
    countryComboBox.addItems([
        'United States', 'Canada', 'United Kingdom', 
        'Germany', 'France', 'Australia', 'Japan'
    ]);
    QStyle.applyStyle(countryComboBox.getElement(), {
        flex: 1
    });
    
    countryContainer.appendChild(countryLabel.getElement());
    countryContainer.appendChild(countryComboBox.getElement());
    formSection.appendChild(countryContainer);
    
    // Add a comments section with a text area
    const commentsContainer = document.createElement('div');
    QStyle.applyStyle(commentsContainer, {
        marginBottom: '15px'
    });
    
    const commentsLabel = new QLabel('Comments:');
    QStyle.applyStyle(commentsLabel.getElement(), {
        display: 'block',
        marginBottom: '5px',
        fontSize: '14px',
        color: '#495057'
    });
    
    const commentsTextEdit = new QTextEdit();
    commentsTextEdit.setObjectName("commentsTextEdit");
    // Clear text and use proper placeholder method or attribute
    commentsTextEdit.setText(''); // Clear any default text

    // If QTextEdit has a setPlaceholder method, use that
    if (typeof commentsTextEdit.setPlaceholder === 'function') {
        commentsTextEdit.setPlaceholder('Please share your feedback about DFrame...');
    } 
    // Otherwise, add a placeholder attribute to the underlying element
    else {
        const textareaElement = commentsTextEdit.getElement().querySelector('textarea');
        if (textareaElement) {
            textareaElement.setAttribute('placeholder', 'Please share your feedback about DFrame...');
        }
    }

    QStyle.applyStyle(commentsTextEdit.getElement(), {
        width: '100%',
        minHeight: '80px'
    });
    
    commentsContainer.appendChild(commentsLabel.getElement());
    commentsContainer.appendChild(commentsTextEdit.getElement());
    formSection.appendChild(commentsContainer);
    
    // Add a submit button
    const submitButton = new QPushButton('Submit Form');
    submitButton.setObjectName("submitButton");
    QStyle.applyStyle(submitButton.getElement(), {
        padding: '8px 16px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        display: 'block',
        margin: '0 auto'
    });
    
    // Add submit button event
    submitButton.connect('clicked', () => {
        const name = nameInput.text();
        const country = countryComboBox.currentText();
        const comments = commentsTextEdit.getText();
        
        alert(`Form submitted!\n\nName: ${name}\nCountry: ${country}\nComments: ${comments}`);
    });
    
    formSection.appendChild(submitButton.getElement());
    mainWindow.getElement().appendChild(formSection);
    
    // -----------------------------------------------------
    // Final Step: Add to DOM
    // -----------------------------------------------------
    rootElement.appendChild(mainWindow.getElement());
    
    // Keep the debug panel for inspection
    const debugPanel = QDebug.addDebugPanel();
    QStyle.applyStyle(debugPanel, {
        zIndex: '9999'
    });
});
