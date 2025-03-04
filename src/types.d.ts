import { WidgetShowcase } from './examples/WidgetShowcase';

declare global {
  interface Window {
    showcase?: WidgetShowcase;
  }
}
