import { test, expect } from '@playwright/test';
import { DFrameTestUtils } from '../helpers/test-utils';
import { createFocusedTest } from '../helpers/test-filters';

test.describe('QPushButton', () => {
  test.beforeEach(async ({ page }) => {
    await DFrameTestUtils.setupTestPage(page);
  });

  test(createFocusedTest('should handle click events'), async ({ page }) => {
    // Create a counter variable in the page context
    await page.evaluate(() => {
      window.clickCount = 0;
      
      const button = new window.DFrame.QPushButton('Click me');
      button.setObjectName('testButton');
      
      button.connect('clicked', () => {
        // Use a non-null assertion since we just created this value
        window.clickCount! += 1;
      });
      
      document.body.appendChild(button.getElement());
    });
    
    const button = DFrameTestUtils.getComponent(page, 'testButton');
    
    // Perform click
    await button.click();
    
    // Check click was counted
    const clickCount = await page.evaluate(() => window.clickCount);
    expect(clickCount).toBe(1);
    
    // Click again
    await button.click();
    
    // Check click count increased
    const newClickCount = await page.evaluate(() => window.clickCount);
    expect(newClickCount).toBe(2);
  });
  
  test('should be styled as a button', async ({ page }) => {
    const button = await DFrameTestUtils.createComponent(page, 'QPushButton', 'styledButton', { 
      text: 'Styled Button',
      styles: {
        backgroundColor: 'blue',
        color: 'white',
        padding: '10px'
      }
    });
    
    // Check style was applied
    const bgColor = await button.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bgColor).toContain('0, 0, 255'); // Blue
  });
});
