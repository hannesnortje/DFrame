import { test, expect } from '@playwright/test';

/**
 * Test component interactions like button clicks
 */
test('QPushButton should respond to click events', async ({ page }) => {
  await page.goto('/test.html');
  await page.waitForSelector('#test-status');
  
  // Create a button with a click handler
  await page.evaluate(() => {
    const { QWidget, QPushButton } = window.DFrame;
    
    // Create container
    const container = new QWidget();
    container.setObjectName('container');
    document.body.appendChild(container.getElement());
    
    // Create button with click handler
    const button = new QPushButton('Click Me');
    button.setObjectName('testButton');
    
    // Create status label to show click state
    const statusDiv = document.createElement('div');
    statusDiv.id = 'clickStatus';
    statusDiv.textContent = 'Not Clicked';
    document.body.appendChild(statusDiv);
    
    // Add click handler
    button.connect('clicked', () => {
      const resultElement = document.getElementById('clickStatus');
      if (resultElement) {
        resultElement.textContent = 'Button Clicked!';
      }
    });
    
    container.getElement().appendChild(button.getElement());
  });
  
  // Verify button exists
  await expect(page.locator('[data-dframe-object-name="testButton"]')).toBeVisible();
  
  // Check initial status
  expect(await page.locator('#clickStatus').textContent()).toBe('Not Clicked');
  
  // Click the button
  await page.locator('[data-dframe-object-name="testButton"]').click();
  
  // Check that status has changed
  expect(await page.locator('#clickStatus').textContent()).toBe('Button Clicked!');
  
  // Take a screenshot
  await page.screenshot({ path: 'test-results/button-click.png' });
});
