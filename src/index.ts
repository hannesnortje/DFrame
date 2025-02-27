import { QWidget, QLabel, QPushButton, QComboBox, QLineEdit, QTextEdit, QSpacer, QDialog } from './widgets';
import { QVBoxLayout, QHBoxLayout } from './layouts';
import { QStyle } from './core';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
        console.error('Root element not found');
        return;
    }

    // Create main window
    const mainWindow = new QWidget(null);
    mainWindow.setWindowTitle('DFrame Demo');
    mainWindow.setGeometry(0, 0, 800, 800); // Increased height
    QStyle.applyStyle(mainWindow.getElement(), {
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        minHeight: '300px',    // Reduced from 750px to 300px
        height: 'auto',        // Will expand to fit content
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'      // Add scroll if needed
    });

    // Create main layout
    const mainLayout = new QVBoxLayout(mainWindow);
    mainLayout.setSpacing(30); // Increased spacing

    // Add title
    const titleLabel = new QLabel('DFrame Widget Showcase');
    QStyle.applyStyle(titleLabel.getElement(), {
        fontSize: 24,           // Will be converted to 1.5rem
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20        // Will be converted to 1.25rem
    });
    mainLayout.addWidget(titleLabel);

    // Create a horizontal layout for buttons with spacers
    const buttonLayout = new QHBoxLayout();
    mainLayout.addLayout(buttonLayout);
    
    // Left button
    const leftButton = new QPushButton('Left Button');
    QStyle.applyStyle(leftButton.getElement(), {
        padding: '0.625rem 1.25rem', // You can still use rem directly if you prefer
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: 4,        // Will be converted to 0.25rem
        cursor: 'pointer'
    });
    
    // Center button
    const centerButton = new QPushButton('Center Button');
    QStyle.applyStyle(centerButton.getElement(), {
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    });
    
    // Right button
    const rightButton = new QPushButton('Right Button');
    QStyle.applyStyle(rightButton.getElement(), {
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    });
    
    // Add buttons with spacers for even distribution
    buttonLayout.addWidget(leftButton);
    buttonLayout.addWidget(QSpacer.createHorizontal(20)); // Fixed width spacer
    buttonLayout.addWidget(centerButton);
    buttonLayout.addWidget(QSpacer.createHorizontal(20)); // Fixed width spacer
    buttonLayout.addWidget(rightButton);

    // Add vertical spacer
    mainLayout.addWidget(QSpacer.createVertical(10)); // Increased vertical space

    // Create a horizontal layout for form elements
    const formLayout = new QHBoxLayout();
    mainLayout.addLayout(formLayout);
    
    // Form items container
    const formItemsContainer = new QWidget();
    const formItemsLayout = new QVBoxLayout(formItemsContainer);
    formItemsLayout.setSpacing(10);
    
    // Add form elements
    // Add combo box
    const comboLabel = new QLabel('Select an option:');
    formItemsLayout.addWidget(comboLabel);
    
    const combo = new QComboBox();
    ['Option 1', 'Option 2', 'Option 3'].forEach(item => combo.addItem(item));
    formItemsLayout.addWidget(combo);
    
    // Add line edit
    const lineEditLabel = new QLabel('Enter text:');
    formItemsLayout.addWidget(lineEditLabel);
    
    const lineEdit = new QLineEdit();
    lineEdit.setPlaceholderText('Type something here...');
    formItemsLayout.addWidget(lineEdit);
    
    // Add form container to form layout with flexible spacers on both sides
    formLayout.addWidget(QSpacer.createHorizontal()); // Flexible space
    formLayout.addWidget(formItemsContainer);
    formLayout.addWidget(QSpacer.createHorizontal()); // Flexible space

    QStyle.applyStyle(formItemsContainer.getElement(), {
        minHeight: '300px',    // Set a more reasonable min-height
    });

    // Add vertical spacer
    mainLayout.addWidget(QSpacer.createVertical(10)); // Increased vertical space
    
    // Text area section
    const textEditLabel = new QLabel('Notes:');
    mainLayout.addWidget(textEditLabel);
    
    const textEdit = new QTextEdit();
    textEdit.setPlaceholderText('Multi-line text editor...');
    mainLayout.addWidget(textEdit);
    
    // Add dialog showcase section
    const dialogSectionLabel = new QLabel('QDialog Showcase:');
    QStyle.applyStyle(dialogSectionLabel.getElement(), {
        fontSize: '18px',
        fontWeight: 'bold',
        marginTop: '20px'
    });
    mainLayout.addWidget(dialogSectionLabel);
    
    // Dialog buttons horizontal layout
    const dialogButtonsLayout = new QHBoxLayout();
    mainLayout.addLayout(dialogButtonsLayout);
    
    // Create dialog buttons
    const openModalDialogButton = new QPushButton('Open Modal Dialog');
    QStyle.applyStyle(openModalDialogButton.getElement(), {
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '10px'
    });
    dialogButtonsLayout.addWidget(openModalDialogButton);
    
    const openNonModalDialogButton = new QPushButton('Open Non-Modal Dialog');
    QStyle.applyStyle(openNonModalDialogButton.getElement(), {
        padding: '10px 20px',
        backgroundColor: '#17a2b8',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    });
    dialogButtonsLayout.addWidget(openNonModalDialogButton);
    
    // Create the dialogs
    // Modal dialog with content
    const modalDialog = new QDialog();
    modalDialog.setWindowTitle('Modal Dialog');
    const modalDialogLayout = new QVBoxLayout(modalDialog);
    
    const modalDialogLabel = new QLabel('This is a modal dialog.');
    QStyle.applyStyle(modalDialogLabel.getElement(), {
        marginBottom: '20px',
        textAlign: 'center'
    });
    modalDialogLayout.addWidget(modalDialogLabel);
    
    const modalDialogContent = new QLabel('Modal dialogs block interaction with the parent window until closed.');
    QStyle.applyStyle(modalDialogContent.getElement(), {
        marginBottom: '20px',
        maxWidth: '400px',
        lineHeight: '1.5'
    });
    modalDialogLayout.addWidget(modalDialogContent);
    
    // Dialog buttons
    const modalDialogButtonsLayout = new QHBoxLayout();
    modalDialogLayout.addLayout(modalDialogButtonsLayout);
    
    modalDialogButtonsLayout.addWidget(QSpacer.createHorizontal()); // Push buttons to the right
    
    const acceptButton = new QPushButton('Accept');
    QStyle.applyStyle(acceptButton.getElement(), {
        padding: '8px 16px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '10px'
    });
    modalDialogButtonsLayout.addWidget(acceptButton);
    
    const rejectButton = new QPushButton('Reject');
    QStyle.applyStyle(rejectButton.getElement(), {
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    });
    modalDialogButtonsLayout.addWidget(rejectButton);
    
    // Connect dialog buttons
    acceptButton.connect('clicked', () => {
        modalDialog.accept();
    });
    
    rejectButton.connect('clicked', () => {
        modalDialog.reject();
    });
    
    // Non-modal dialog
    const nonModalDialog = new QDialog();
    nonModalDialog.setWindowTitle('Non-Modal Dialog');
    const nonModalDialogLayout = new QVBoxLayout(nonModalDialog);
    
    const nonModalDialogLabel = new QLabel('This is a non-modal dialog.');
    QStyle.applyStyle(nonModalDialogLabel.getElement(), {
        marginBottom: '20px',
        textAlign: 'center'
    });
    nonModalDialogLayout.addWidget(nonModalDialogLabel);
    
    const nonModalDialogContent = new QLabel('Non-modal dialogs allow interaction with the parent window while open.');
    QStyle.applyStyle(nonModalDialogContent.getElement(), {
        marginBottom: '20px',
        maxWidth: '400px',
        lineHeight: '1.5'
    });
    nonModalDialogLayout.addWidget(nonModalDialogContent);
    
    // Close button
    const closeButton = new QPushButton('Close');
    QStyle.applyStyle(closeButton.getElement(), {
        padding: '8px 16px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        margin: '0 auto',
        display: 'block'
    });
    nonModalDialogLayout.addWidget(closeButton);
    
    closeButton.connect('clicked', () => {
        nonModalDialog.close();
    });
    
    // Connect the dialog open buttons
    openModalDialogButton.connect('clicked', () => {
        modalDialog.setModal(true);
        modalDialog.exec();
    });
    
    openNonModalDialogButton.connect('clicked', () => {
        nonModalDialog.setModal(false);
        nonModalDialog.open();
    });
    
    // Connect dialog signals to status updates
    modalDialog.connect('accepted', () => {
        statusLabel.setText('Modal dialog was accepted');
    });
    
    modalDialog.connect('rejected', () => {
        statusLabel.setText('Modal dialog was rejected');
    });
    
    nonModalDialog.connect('closed', () => {
        statusLabel.setText('Non-modal dialog was closed');
    });
    
    // Add flexible vertical spacer to push status to bottom
    mainLayout.addWidget(QSpacer.createVertical(10));
    
    // Status section with horizontal layout
    const statusLayout = new QHBoxLayout();
    mainLayout.addLayout(statusLayout);
    
    const statusLabel = new QLabel('Status: Ready');
    QStyle.applyStyle(statusLabel.getElement(), {
        fontStyle: 'italic',
        color: '#6c757d'
    });
    
    statusLayout.addWidget(statusLabel);
    statusLayout.addWidget(QSpacer.createHorizontal()); // Push status to the left

    // Connect signals for other widgets
    leftButton.connect('clicked', () => {
        statusLabel.setText('Left button clicked!');
    });
    
    centerButton.connect('clicked', () => {
        statusLabel.setText('Center button clicked!');
    });
    
    rightButton.connect('clicked', () => {
        statusLabel.setText('Right button clicked!');
    });

    combo.connect('currentIndexChanged', (index: number) => {
        statusLabel.setText(`Selected option ${index + 1}`);
    });

    lineEdit.connect('textChanged', (text: string) => {
        statusLabel.setText(`Text changed: ${text}`);
    });

    textEdit.connect('textChanged', () => {
        statusLabel.setText('Text edit content changed');
    });

    // Add to document
    rootElement.appendChild(mainWindow.getElement());
});
