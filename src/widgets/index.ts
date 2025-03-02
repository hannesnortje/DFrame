import { QPushButton } from './QPushButton';

export interface WidgetOptions {
    name?: string;
    visible?: boolean;
    enabled?: boolean;
}

export {
    QPushButton
};

// Placeholder for future widget implementations
export const createWidget = (options?: WidgetOptions) => {
    return options;
};
