import { WidgetShowcase } from '../examples/WidgetShowcase';

declare global {
  var showcase: WidgetShowcase | undefined;
  interface Window {
    showcase: WidgetShowcase | undefined;
  }
}
