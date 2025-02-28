import { test, expect } from '@playwright/test';

/**
 * E2E tests for DFrame layouts
 */

test.describe('DFrame Layout Tests', () => {
  // Use the test page with mock objects for all tests
  test.beforeEach(async ({ page }) => {
    await page.goto('/test.html');
    await page.waitForSelector('#test-status');
  });

  test('QVBoxLayout should arrange widgets vertically', async ({ page }) => {
    // Create test layout using mock objects
    await page.evaluate(() => {
      const { QWidget, QLabel, QPushButton, QVBoxLayout } = window.DFrame;
      
      // Create test container
      const container = new QWidget();
      container.setObjectName('vboxContainer');
      document.body.appendChild(container.getElement());
      
      // Add styling
      container.getElement().style.width = '300px';
      container.getElement().style.height = '300px';
      container.getElement().style.border = '1px solid black';
      
      // Create vertical layout - QVBoxLayout will automatically stack widgets vertically
      const layout = new QVBoxLayout(container);
      
      // Add widgets
      const label = new QLabel('Top Widget');
      label.setObjectName('topLabel');
      label.getElement().style.backgroundColor = 'lightblue';
      
      const button = new QPushButton('Bottom Button');
      button.setObjectName('bottomButton');
      button.getElement().style.backgroundColor = 'lightgreen';
      
      // Add to layout
      layout.addWidget(label);
      layout.addWidget(button);
    });
    
    // Verify widgets were created and displayed
    await expect(page.locator('[data-dframe-object-name="vboxContainer"]')).toBeVisible();
    await expect(page.locator('[data-dframe-object-name="topLabel"]')).toBeVisible();
    await expect(page.locator('[data-dframe-object-name="bottomButton"]')).toBeVisible();
    
    // Take a screenshot for verification
    await page.screenshot({ path: 'test-results/vbox-layout.png' });
  });
});
