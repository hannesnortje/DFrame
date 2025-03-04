// Export layout classes
export { QBoxLayout, QHBoxLayout, QVBoxLayout, QGridLayout, Direction } from './QBoxLayout';

// Export layout types and options
export interface LayoutOptions {
  spacing?: number;
  margin?: number;
  alignment?: 'left' | 'center' | 'right';
}

// Placeholder for future layout implementations
export const createLayout = (options?: LayoutOptions) => {
    return options;
};
