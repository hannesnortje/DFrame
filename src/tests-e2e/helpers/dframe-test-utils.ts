import { Page, Locator, expect } from '@playwright/test';

/**
 * Utility functions for testing DFrame components with Playwright
 */
export class DFrameTestUtils {
  /**
   * Create a DFrame component in the browser context
   */
  static async createComponent(page: Page, code: string): Promise<void> {
    await page.evaluate(code);
  }
  
  /**
   * Find a DFrame widget by its object name
   */
  static async findWidgetByName(page: Page, objectName: string): Promise<Locator> {
    return page.locator(`[data-dframe-object-name="${objectName}"]`);
  }
  
  /**
   * Verify that a widget exists and is visible
   */
  static async expectWidgetVisible(page: Page, objectName: string): Promise<void> {
    const widget = await this.findWidgetByName(page, objectName);
    await expect(widget).toBeVisible();
  }
  
  /**
   * Check vertical layout arrangement
   */
  static async expectVerticalArrangement(page: Page, topWidgetName: string, bottomWidgetName: string): Promise<void> {
    const topWidget = await this.findWidgetByName(page, topWidgetName);
    const bottomWidget = await this.findWidgetByName(page, bottomWidgetName);
    
    const topBox = await topWidget.boundingBox();
    const bottomBox = await bottomWidget.boundingBox();
    
    // Check both boxes exist before comparing
    if (topBox && bottomBox) {
      expect(bottomBox.y).toBeGreaterThan(topBox.y + topBox.height - 1); // Allow 1px overlap for borders
    } else {
      throw new Error('Could not get bounding boxes for widgets');
    }
  }
  
  /**
   * Check horizontal layout arrangement
   */
  static async expectHorizontalArrangement(page: Page, leftWidgetName: string, rightWidgetName: string): Promise<void> {
    const leftWidget = await this.findWidgetByName(page, leftWidgetName);
    const rightWidget = await this.findWidgetByName(page, rightWidgetName);
    
    const leftBox = await leftWidget.boundingBox();
    const rightBox = await rightWidget.boundingBox();
    
    // Check both boxes exist before comparing
    if (leftBox && rightBox) {
      expect(rightBox.x).toBeGreaterThan(leftBox.x + leftBox.width - 1); // Allow 1px overlap for borders
    } else {
      throw new Error('Could not get bounding boxes for widgets');
    }
  }
  
  /**
   * Take a screenshot of a widget
   */
  static async screenshotWidget(page: Page, objectName: string, path: string): Promise<void> {
    const widget = await this.findWidgetByName(page, objectName);
    await widget.screenshot({ path });
  }
}
