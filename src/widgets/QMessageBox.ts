import { QDialog, DialogCode } from './QDialog';
import { QWidget } from './QWidget';
import { QVBoxLayout, QHBoxLayout } from '../layouts';
import { QLabel } from './QLabel';
import { QPushButton } from './QPushButton';
import { QSpacer } from './QSpacer';
import { QStyle } from '../core/QStyle';

/**
 * Standard buttons used in message boxes
 */
export enum StandardButton {
    NoButton = 0x00000000,
    Ok = 0x00000400,
    Cancel = 0x00000800,
    Yes = 0x00004000,
    No = 0x00010000,
    Abort = 0x00040000,
    Retry = 0x00080000,
    Ignore = 0x00100000,
    Close = 0x00200000,
    Help = 0x02000000,
    Apply = 0x08000000,
    Reset = 0x40000000
}

/**
 * Icon types for message boxes
 */
export enum Icon {
    NoIcon = 0,
    Information = 1,
    Warning = 2,
    Critical = 3,
    Question = 4
}

/**
 * QMessageBox provides a modal dialog for informing the user or asking the user a question
 */
export class QMessageBox extends QDialog {
    private _standardButtons: StandardButton = StandardButton.NoButton;
    private _clickedButton: StandardButton = StandardButton.NoButton;
    private _iconType: Icon = Icon.NoIcon;
    private _text: string = '';
    private _informativeText: string = '';
    private _detailedText: string = '';

    // Layout elements
    private _contentLayout: QVBoxLayout;
    private _buttonLayout: QHBoxLayout;
    private _iconLabel: QLabel;
    private _textLabel: QLabel;
    private _informativeTextLabel: QLabel;
    private _detailedTextLabel: QLabel;
    private _buttons: Map<StandardButton, QPushButton> = new Map();

    constructor(parent?: QWidget | null) {
        super(parent);
        this.setWindowTitle('Message');
        this.setModal(true);
        
        // Set styles specific to message box
        QStyle.applyStyle(this.getElement(), {
            minWidth: 400,
            maxWidth: 600,
            minHeight: 150,
            padding: 20,
            backgroundColor: '#ffffff',
            borderRadius: 8,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
        });
        
        // Create layout with more spacing for better appearance
        this._contentLayout = new QVBoxLayout(this);
        this._contentLayout.setSpacing(15);
        
        // Create message area with icon + text
        const messageLayout = new QHBoxLayout();
        messageLayout.setSpacing(15); // Add more horizontal spacing
        this._contentLayout.addLayout(messageLayout);
        
        // Icon label with larger size
        this._iconLabel = new QLabel('');
        QStyle.applyStyle(this._iconLabel.getElement(), {
            fontSize: 40, // Larger icon
            width: 60,
            textAlign: 'center',
            marginRight: 10
        });
        messageLayout.addWidget(this._iconLabel);
        
        // Text labels container
        const textContainer = new QVBoxLayout();
        messageLayout.addLayout(textContainer);
        
        // Main text with larger font
        this._textLabel = new QLabel('');
        QStyle.applyStyle(this._textLabel.getElement(), {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            color: '#333'
        });
        textContainer.addWidget(this._textLabel);
        
        // Informative text
        this._informativeTextLabel = new QLabel('');
        QStyle.applyStyle(this._informativeTextLabel.getElement(), {
            fontSize: 14,
            lineHeight: '1.5',
            color: '#555'
        });
        textContainer.addWidget(this._informativeTextLabel);
        
        // Detailed text (initially hidden) with better styling
        this._detailedTextLabel = new QLabel('');
        QStyle.applyStyle(this._detailedTextLabel.getElement(), {
            display: 'none',
            marginTop: 15,
            padding: 15,
            backgroundColor: '#f8f9fa',
            border: '1px solid #eaeaea',
            borderRadius: 4,
            whiteSpace: 'pre-wrap',
            fontSize: 13,
            lineHeight: '1.6',
            maxHeight: 200,
            overflowY: 'auto'
        });
        this._contentLayout.addWidget(this._detailedTextLabel);
        
        // Add a separator before buttons
        const separatorWidget = new QWidget();
        QStyle.applyStyle(separatorWidget.getElement(), {
            height: 1,
            backgroundColor: '#eaeaea',
            marginTop: 10,
            marginBottom: 10
        });
        this._contentLayout.addWidget(separatorWidget);
        
        // Button area with better layout
        this._buttonLayout = new QHBoxLayout();
        this._contentLayout.addLayout(this._buttonLayout);
        
        // Add spacer to push buttons to the right
        this._buttonLayout.addWidget(QSpacer.createHorizontal());
    }
    
    /**
     * Set the text to display in the message box
     */
    setText(text: string): QMessageBox {
        this._text = text;
        this._textLabel.setText(text);
        return this;
    }
    
    /**
     * Get the message box text
     */
    text(): string {
        return this._text;
    }
    
    /**
     * Set additional informative text
     */
    setInformativeText(text: string): QMessageBox {
        this._informativeText = text;
        this._informativeTextLabel.setText(text);
        return this;
    }
    
    /**
     * Get the informative text
     */
    informativeText(): string {
        return this._informativeText;
    }
    
    /**
     * Set detailed text (typically shown when expanded)
     */
    setDetailedText(text: string): QMessageBox {
        this._detailedText = text;
        if (text) {
            this._detailedTextLabel.setText(text);
            QStyle.applyStyle(this._detailedTextLabel.getElement(), {
                display: 'block'
            });
        } else {
            QStyle.applyStyle(this._detailedTextLabel.getElement(), {
                display: 'none'
            });
        }
        return this;
    }
    
    /**
     * Get the detailed text
     */
    detailedText(): string {
        return this._detailedText;
    }
    
    /**
     * Set the icon displayed in the message box
     */
    setIcon(icon: Icon): QMessageBox {
        this._iconType = icon;
        
        switch (icon) {
            case Icon.Information:
                this._iconLabel.setText('ℹ️');
                break;
            case Icon.Warning:
                this._iconLabel.setText('⚠️');
                break;
            case Icon.Critical:
                this._iconLabel.setText('🛑');
                break;
            case Icon.Question:
                this._iconLabel.setText('❓');
                break;
            case Icon.NoIcon:
            default:
                this._iconLabel.setText('');
                break;
        }
        return this;
    }
    
    /**
     * Get the current icon type
     */
    icon(): Icon {
        return this._iconType;
    }
    
    /**
     * Set the standard buttons to display
     */
    setStandardButtons(buttons: StandardButton): QMessageBox {
        this._standardButtons = buttons;
        this.updateButtons();
        return this;
    }
    
    /**
     * Get the standard buttons currently set
     */
    standardButtons(): StandardButton {
        return this._standardButtons;
    }
    
    /**
     * Get the StandardButton that was clicked
     */
    clickedButton(): StandardButton {
        return this._clickedButton;
    }
    
    /**
     * Static convenience method to show an information message
     */
    static information(
        parent: QWidget | null, 
        title: string, 
        text: string, 
        buttons: StandardButton = StandardButton.Ok,
        defaultButton: StandardButton = StandardButton.Ok
    ): StandardButton {
        const msgBox = new QMessageBox(parent);
        msgBox.setIcon(Icon.Information);
        msgBox.setText(text);
        msgBox.setWindowTitle(title);
        msgBox.setStandardButtons(buttons);
        msgBox.setDefaultButton(defaultButton);
        msgBox.exec();
        return msgBox.clickedButton();
    }
    
    /**
     * Static convenience method to show a warning message
     */
    static warning(
        parent: QWidget | null, 
        title: string, 
        text: string, 
        buttons: StandardButton = StandardButton.Ok,
        defaultButton: StandardButton = StandardButton.Ok
    ): StandardButton {
        const msgBox = new QMessageBox(parent);
        msgBox.setIcon(Icon.Warning);
        msgBox.setText(text);
        msgBox.setWindowTitle(title);
        msgBox.setStandardButtons(buttons);
        msgBox.setDefaultButton(defaultButton);
        msgBox.exec();
        return msgBox.clickedButton();
    }
    
    /**
     * Static convenience method to show a critical error message
     */
    static critical(
        parent: QWidget | null, 
        title: string, 
        text: string, 
        buttons: StandardButton = StandardButton.Ok,
        defaultButton: StandardButton = StandardButton.Ok
    ): StandardButton {
        const msgBox = new QMessageBox(parent);
        msgBox.setIcon(Icon.Critical);
        msgBox.setText(text);
        msgBox.setWindowTitle(title);
        msgBox.setStandardButtons(buttons);
        msgBox.setDefaultButton(defaultButton);
        msgBox.exec();
        return msgBox.clickedButton();
    }
    
    /**
     * Static convenience method to ask a question
     */
    static question(
        parent: QWidget | null, 
        title: string, 
        text: string, 
        buttons: StandardButton = StandardButton.Yes | StandardButton.No,
        defaultButton: StandardButton = StandardButton.Yes
    ): StandardButton {
        const msgBox = new QMessageBox(parent);
        msgBox.setIcon(Icon.Question);
        msgBox.setText(text);
        msgBox.setWindowTitle(title);
        msgBox.setStandardButtons(buttons);
        msgBox.setDefaultButton(defaultButton);
        msgBox.exec();
        return msgBox.clickedButton();
    }
    
    /**
     * Set the default button (the one that's highlighted)
     */
    setDefaultButton(button: StandardButton): QMessageBox {
        const btn = this._buttons.get(button);
        if (btn) {
            // Add default styling
            QStyle.applyStyle(btn.getElement(), {
                fontWeight: 'bold',
                boxShadow: '0 0 0 2px rgba(0,123,255,.25)'
            });
            
            // Focus this button
            setTimeout(() => {
                btn.getElement().focus();
            }, 0);
        }
        return this;
    }
    
    private updateButtons(): void {
        // Clear existing buttons
        this._buttons.forEach(button => {
            this._buttonLayout.removeWidget(button);
        });
        this._buttons.clear();
        
        // Add buttons based on StandardButton flags
        const buttonTexts: [StandardButton, string][] = [
            [StandardButton.Ok, 'OK'],
            [StandardButton.Cancel, 'Cancel'],
            [StandardButton.Yes, 'Yes'],
            [StandardButton.No, 'No'],
            [StandardButton.Abort, 'Abort'],
            [StandardButton.Retry, 'Retry'],
            [StandardButton.Ignore, 'Ignore'],
            [StandardButton.Close, 'Close'],
            [StandardButton.Help, 'Help'],
            [StandardButton.Apply, 'Apply'],
            [StandardButton.Reset, 'Reset']
        ];
        
        // Create and add buttons in the right order
        buttonTexts.forEach(([buttonType, text]) => {
            if (this._standardButtons & buttonType) {
                const button = new QPushButton(text);
                
                // Apply base button styling for all buttons
                QStyle.applyStyle(button.getElement(), {
                    padding: '10px 20px', // Larger padding for bigger buttons
                    fontSize: '14px',
                    fontWeight: 'normal',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    margin: '0 5px',
                    minWidth: '80px', // Ensure minimum width for consistency
                    textAlign: 'center',
                    border: 'none',
                    transition: 'background-color 0.2s'
                });
                
                // Style the button appropriately based on type
                if (buttonType === StandardButton.Ok || buttonType === StandardButton.Yes || 
                    buttonType === StandardButton.Apply) {
                    QStyle.applyStyle(button.getElement(), {
                        backgroundColor: '#28a745',
                        color: 'white'
                    });
                } else if (buttonType === StandardButton.Cancel || buttonType === StandardButton.No || 
                           buttonType === StandardButton.Abort || buttonType === StandardButton.Close) {
                    QStyle.applyStyle(button.getElement(), {
                        backgroundColor: '#dc3545',
                        color: 'white'
                    });
                } else if (buttonType === StandardButton.Help) {
                    QStyle.applyStyle(button.getElement(), {
                        backgroundColor: '#17a2b8',
                        color: 'white'
                    });
                } else {
                    QStyle.applyStyle(button.getElement(), {
                        backgroundColor: '#6c757d',
                        color: 'white'
                    });
                }
                
                button.connect('clicked', () => {
                    this._clickedButton = buttonType;
                    if (buttonType === StandardButton.Ok || buttonType === StandardButton.Yes || 
                        buttonType === StandardButton.Apply) {
                        this.accept();
                    } else {
                        this.reject();
                    }
                });
                
                this._buttons.set(buttonType, button);
                this._buttonLayout.addWidget(button);
            }
        });
    }
}
