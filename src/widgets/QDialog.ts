import { QWidget } from './QWidget';
import { QObject } from '../core/QObject';
import { Qt } from '../core/Qt';
import { QStyle } from '../core/QStyle';

export enum DialogCode {
    Rejected = 0,
    Accepted = 1
}

/**
 * QDialog class provides a top-level window primarily used for short-term tasks and brief communications with the user.
 */
export class QDialog extends QWidget {
    private _modal: boolean = false;
    private _result: DialogCode = DialogCode.Rejected;
    private _overlay: HTMLDivElement | null = null;
    
    constructor(parent?: QWidget | null) {
        super(parent);
        
        // Style the dialog
        QStyle.applyStyle(this.getElement(), {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#ffffff',
            borderRadius: 6,        // Will be converted to 0.375rem
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
            padding: 20,            // Will be converted to 1.25rem
            minWidth: 300,          // Will be converted to 18.75rem
            display: 'none', // Initially hidden
            zIndex: '1001' // Above the overlay
        });
    }
    
    /**
     * Set whether the dialog is modal
     */
    setModal(modal: boolean): void {
        this._modal = modal;
    }
    
    /**
     * Check if the dialog is modal
     */
    isModal(): boolean {
        return this._modal;
    }
    
    /**
     * Set the result code for the dialog
     */
    setResult(result: DialogCode): void {
        this._result = result;
    }
    
    /**
     * Get the result code of the dialog
     */
    result(): DialogCode {
        return this._result;
    }
    
    /**
     * Accept the dialog (similar to clicking OK)
     */
    accept(): void {
        this.setResult(DialogCode.Accepted);
        this.emit('accepted', null);
        this.close();
    }
    
    /**
     * Reject the dialog (similar to clicking Cancel)
     */
    reject(): void {
        this.setResult(DialogCode.Rejected);
        this.emit('rejected', null);
        this.close();
    }
    
    /**
     * Open the dialog non-modally
     */
    open(): void {
        this._show();
        this.emit('opened', null);
    }
    
    /**
     * Execute the dialog modally
     */
    exec(): DialogCode {
        this.setModal(true);
        this._show();
        this.emit('opened', null);
        // In a real implementation, we would block until the dialog is closed
        // but for a web framework, we return immediately and leave control flow to event handlers
        return this._result;
    }
    
    /**
     * Close the dialog
     */
    close(): void {
        this._hide();
        this.emit('closed', null);
    }
    
    /**
     * Show the dialog
     */
    private _show(): void {
        // Create overlay if modal
        if (this._modal && !this._overlay) {
            this._overlay = document.createElement('div');
            QStyle.applyStyle(this._overlay, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: '1000'
            });
            
            // Close dialog on overlay click if not explicitly prevented
            this._overlay.addEventListener('click', () => {
                this.reject();
            });
            
            document.body.appendChild(this._overlay);
        }
        
        // Show the dialog
        QStyle.applyStyle(this.getElement(), {
            display: 'block'
        });
        
        // Ensure dialog is in the DOM
        if (!document.body.contains(this.getElement())) {
            document.body.appendChild(this.getElement());
        }
    }
    
    /**
     * Hide the dialog
     */
    private _hide(): void {
        // Hide the dialog
        QStyle.applyStyle(this.getElement(), {
            display: 'none'
        });
        
        // Remove overlay if exists
        if (this._overlay && document.body.contains(this._overlay)) {
            document.body.removeChild(this._overlay);
            this._overlay = null;
        }
    }
}
