import { QPushButton } from './QPushButton';

export interface WidgetOptions {
    name?: string;
    visible?: boolean;
    enabled?: boolean;
}

export {
    QPushButton
};

export * from './QButton';

// Placeholder for future widget implementations
export const createWidget = (options?: WidgetOptions) => {
    return options;
};

export { QLabel } from './QLabel';
