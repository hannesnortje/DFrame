/**
 * TypeScript declarations for global objects used in tests
 */

interface Window {
  /**
   * DFrame global object for testing
   */
  DFrame: {
    // Core components
    QObject: any;
    QStyle: {
      applyStyle: (element: any, styles: Record<string, any>) => any;
    };
    Qt: {
      AlignmentFlag: Record<string, number>;
    };
    
    // Widgets
    QWidget: new (parent?: any) => {
      setObjectName: (name: string) => any;
      getElement: () => HTMLElement;
      getParentWidget: () => any | null;
      constructor: { name: string };
    };
    QLabel: new (text: string) => {
      setObjectName: (name: string) => any;
      getElement: () => HTMLElement;
      setText: (text: string) => void;
      getText: () => string;
      constructor: { name: string };
    };
    QPushButton: new (text: string) => {
      setObjectName: (name: string) => any;
      getElement: () => HTMLElement;
      setText: (text: string) => void;
      getText: () => string;
      connect: (event: string, handler: Function) => any;
      constructor: { name: string };
    };
    
    // Layouts
    QVBoxLayout: new (parent?: any) => {
      addWidget: (widget: any, options?: any) => any;
      getWidgets: () => any[];
      setContentsMargins: (...margins: number[]) => any;
      setSpacing: (spacing: number) => any;
      getSpacing: () => number;
      constructor: { name: string };
    };
    QHBoxLayout: new (parent?: any) => {
      addWidget: (widget: any, options?: any) => any;
      getWidgets: () => any[];
      setContentsMargins: (...margins: number[]) => any;
      setSpacing: (spacing: number) => any;
      getSpacing: () => number;
      constructor: { name: string };
    };
    
    // Additional components as needed
    [key: string]: any;
  };
  
  /**
   * Storage for components created in tests
   */
  _testComponents: Record<string, any>;
  
  /**
   * Test state variables
   */
  clickCount?: number;
}

// Add null-checking for Playwright's boundingBox method result
declare namespace Playwright {
  interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
  }
}
