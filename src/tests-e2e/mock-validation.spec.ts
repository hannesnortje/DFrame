import { test, expect } from '@playwright/test';

test('Mock DFrame components are available', async ({ page }) => {
  // Go to the test page
  await page.goto('/test.html');
  
  // Wait for the page to be loaded
  await page.waitForSelector('#test-status');

  // Check that DFrame is defined in the global scope
  const dframeAvailable = await page.evaluate(() => {
    return typeof window.DFrame !== 'undefined';
  });
  
  expect(dframeAvailable).toBe(true);
  
  // Check that key components are available
  const components = await page.evaluate(() => {
    return {
      hasQWidget: typeof window.DFrame.QWidget === 'function',
      hasQLabel: typeof window.DFrame.QLabel === 'function',
      hasQPushButton: typeof window.DFrame.QPushButton === 'function',
      hasQVBoxLayout: typeof window.DFrame.QVBoxLayout === 'function',
      hasQHBoxLayout: typeof window.DFrame.QHBoxLayout === 'function',
    };
  });
  
  expect(components.hasQWidget).toBe(true);
  expect(components.hasQLabel).toBe(true);
  expect(components.hasQPushButton).toBe(true);
  expect(components.hasQVBoxLayout).toBe(true);
  expect(components.hasQHBoxLayout).toBe(true);
  
  // Test that we can create a widget
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
});
