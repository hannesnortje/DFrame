import { QBoxLayout, Direction } from './QBoxLayout';

export interface LayoutOptions {
    spacing?: number;
    margin?: number;
    alignment?: 'left' | 'center' | 'right';
}

export {
    QBoxLayout,
    Direction
};

// Placeholder for future layout implementations
export const createLayout = (options?: LayoutOptions) => {
    return options;
};
