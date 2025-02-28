import { test, expect } from '@playwright/test';

test('DFrame is globally available', async ({ page }) => {
  // Navigate to the test page with mock DFrame
  await page.goto('/test.html');
  
  // Wait for the page to load
  await page.waitForSelector('#test-status');
  
  // Check if DFrame is available globally
  const dframeAvailable = await page.evaluate(() => {
    return typeof window.DFrame !== 'undefined';
  });
  
  expect(dframeAvailable).toBe(true);
  console.log('DFrame is available globally in the test environment');
  
  // Test creating a basic widget
  const canCreateWidget = await page.evaluate(() => {
    try {
      const widget = new window.DFrame.QWidget();
      return widget && typeof widget.getElement === 'function';
    } catch (e) {
      console.error('Error creating widget:', e);
      return false;
    }
  });
  
  expect(canCreateWidget).toBe(true);
  console.log('Successfully created a QWidget');
  
  // Take a screenshot for verification
  await page.screenshot({ path: 'test-results/dframe-available.png' });
});
