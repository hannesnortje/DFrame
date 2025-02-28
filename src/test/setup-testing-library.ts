/**
 * DFrame Testing Library
 * 
 * Provides utilities for testing UI components in a way that resembles 
 * how users interact with your app.
 */

// Use a conditional import to make TypeScript happy
let fireEvent: any = {};
try {
  // This will work at runtime but not during TypeScript compilation
  const testingLib = require('@testing-library/dom');
  fireEvent = testingLib.fireEvent;
} catch (e) {
  console.warn('Could not load @testing-library/dom. Some testing features may be limited.');
}

export class WidgetTester {
  // Render a widget into a test container
  static render(widget: any) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    if (widget.getElement) {
      container.appendChild(widget.getElement());
    }
    
    return {
      container,
      widget,
      // Helper to find elements within the rendered widget
      findByText: (text: string) => container.querySelector(`*:contains("${text}")`)
    };
  }
  
  // Simulate user events
  static fireEvent = fireEvent;
}
