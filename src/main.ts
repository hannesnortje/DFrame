import { WidgetShowcase } from './examples/WidgetShowcase';

// Use a single consistent declaration
declare global {
  var showcase: WidgetShowcase | undefined;
  interface globalThis {
    showcase: WidgetShowcase | undefined;
  }
}

function initApp() {
  console.log('Main: Starting application');
  const app = new WidgetShowcase();
  globalThis.showcase = app;
  app.run();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  Promise.resolve().then(initApp);
}
