import { Page, Locator, expect } from '@playwright/test';

/**
 * Common utilities for DFrame component testing with Playwright
 */
export class DFrameTestUtils {
  /**
   * Setup the test page with required mocks and wait until ready
   */
  static async setupTestPage(page: Page): Promise<void> {
    await page.goto('/test.html');
    await page.waitForSelector('#test-status');
    
    // Initialize the test components storage
    await page.evaluate(() => {
      window._testComponents = window._testComponents || {};
    });
  }

  /**
   * Create a component and return its locator
   * @param page Playwright page
   * @param componentType Type of component to create ('QWidget', 'QLabel', etc.)
   * @param objectName Object name to assign for selecting
   * @param options Additional creation options
   */
  static async createComponent(
    page: Page, 
    componentType: string, 
    objectName: string, 
    options: any = {}
  ): Promise<Locator> {
    // Create the component
    await page.evaluate(({ componentType, objectName, options }) => {
      const component = new window.DFrame[componentType](options.text || '');
      component.setObjectName(objectName);
      
      // Apply styles if provided
      if (options.styles) {
        const element = component.getElement();
        Object.assign(element.style, options.styles);
      }
      
      // Add to DOM
      if (options.addToBody !== false) {
        document.body.appendChild(component.getElement());
      }
      
      // Add to parent if specified
      if (options.parent) {
        const parentElement = document.querySelector(`[data-dframe-object-name="${options.parent}"]`);
        if (parentElement) {
          parentElement.appendChild(component.getElement());
        }
      }
      
      // Store for later access
      window._testComponents = window._testComponents || {};
      window._testComponents[objectName] = component;
      
      return objectName;
    }, { componentType, objectName, options });
    
    // Return the locator for the created component
    return page.locator(`[data-dframe-object-name="${objectName}"]`);
  }
  
  /**
   * Get a component by its object name
   */
  static getComponent(page: Page, objectName: string): Locator {
    return page.locator(`[data-dframe-object-name="${objectName}"]`);
  }
  
  /**
   * Create a simple test container with layout
   */
  static async createTestContainer(
    page: Page,
    objectName: string = 'testContainer',
    layoutType: 'QVBoxLayout' | 'QHBoxLayout' = 'QVBoxLayout'
  ): Promise<{ container: Locator, layoutObjectName: string }> {
    const layoutObjectName = `${objectName}Layout`;
    
    await page.evaluate(({ objectName, layoutType, layoutObjectName }) => {
      const { QWidget } = window.DFrame;
      
      // Create container
      const container = new QWidget();
      container.setObjectName(objectName);
      container.getElement().style.width = '400px';
      container.getElement().style.height = '300px';
      container.getElement().style.border = '1px solid #ccc';
      document.body.appendChild(container.getElement());
      
      // Create layout
      const layout = new window.DFrame[layoutType](container);
      
      // Store references
      window._testComponents = window._testComponents || {};
      window._testComponents[objectName] = container;
      window._testComponents[layoutObjectName] = layout;
    }, { objectName, layoutType, layoutObjectName });
    
    return { 
      container: page.locator(`[data-dframe-object-name="${objectName}"]`),
      layoutObjectName
    };
  }
}
