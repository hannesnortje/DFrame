import { WidgetShowcase } from '../examples/WidgetShowcase';

declare global {
  var showcase: WidgetShowcase | undefined;
  interface Window {
    showcase: WidgetShowcase | undefined;
  }
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

interface Window {
  // Add any custom window properties here
}

export {};
