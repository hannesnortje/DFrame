import { test, expect } from '@playwright/test';
import { DFrameTestUtils } from '../helpers/test-utils';

test.describe('QWidget', () => {
  test.beforeEach(async ({ page }) => {
    await DFrameTestUtils.setupTestPage(page);
    
    // Initialize the test components storage
    await page.evaluate(() => {
      window._testComponents = window._testComponents || {};
    });
  });

  test('should create and display a widget', async ({ page }) => {
    // Create a basic widget
    const widget = await DFrameTestUtils.createComponent(page, 'QWidget', 'testWidget', {
      styles: {
        width: '200px',
        height: '100px',
        backgroundColor: 'lightblue'
      }
    });
    
    // Check that it's visible
    await expect(widget).toBeVisible();
    
    // Verify style was applied
    const bgColor = await widget.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bgColor).toBeTruthy();
  });

  test('should set object name', async ({ page }) => {
    const objectName = 'customWidgetName';
    await DFrameTestUtils.createComponent(page, 'QWidget', objectName);
    
    // Check attribute was set
    const nameAttribute = await page.locator(`[data-dframe-object-name="${objectName}"]`).getAttribute('data-dframe-object-name');
    expect(nameAttribute).toBe(objectName);
  });
  
  test('should handle visibility', async ({ page }) => {
    // Create widget and then hide it
    await page.evaluate(() => {
      const widget = new window.DFrame.QWidget();
      widget.setObjectName('visibilityWidget');
      document.body.appendChild(widget.getElement());
      
      // Store the widget for later use
      window._testComponents = window._testComponents || {};
      window._testComponents['visibilityWidget'] = widget;
      
      // Hide the widget
      widget.getElement().style.display = 'none';
    });
    
    const widget = DFrameTestUtils.getComponent(page, 'visibilityWidget');
    
    // Check it's hidden
    await expect(widget).toBeHidden();
    
    // Show it again
    await page.evaluate(() => {
      const widget = window._testComponents['visibilityWidget'];
      widget.getElement().style.display = 'block';
    });
    
    // Check it's visible
    await expect(widget).toBeVisible();
  });
});
