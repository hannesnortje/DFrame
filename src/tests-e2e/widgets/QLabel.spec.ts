import { test, expect } from '@playwright/test';
import { DFrameTestUtils } from '../helpers/test-utils';

test.describe('QLabel', () => {
  test.beforeEach(async ({ page }) => {
    await DFrameTestUtils.setupTestPage(page);
  });
  
  test('should display text correctly', async ({ page }) => {
    const testText = 'Hello, DFrame!';
    const label = await DFrameTestUtils.createComponent(page, 'QLabel', 'testLabel', { 
      text: testText
    });
    
    // Check text content
    expect(await label.textContent()).toBe(testText);
  });
  
  test('should update text content', async ({ page }) => {
    const initialText = 'Initial text';
    const updatedText = 'Updated text';
    
    await DFrameTestUtils.createComponent(page, 'QLabel', 'dynamicLabel', { 
      text: initialText
    });
    
    // Update text
    await page.evaluate(({ updatedText }) => {
      const label = window._testComponents['dynamicLabel'];
      label.setText(updatedText);
    }, { updatedText });
    
    // Check updated text
    const label = DFrameTestUtils.getComponent(page, 'dynamicLabel');
    expect(await label.textContent()).toBe(updatedText);
  });
  
  test('should apply styling', async ({ page }) => {
    await DFrameTestUtils.createComponent(page, 'QLabel', 'styledLabel', { 
      text: 'Styled Label',
      styles: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: '20px'
      }
    });
    
    const label = DFrameTestUtils.getComponent(page, 'styledLabel');
    
    // Check style was applied
    const color = await label.evaluate(el => getComputedStyle(el).color);
    expect(color).toContain('255'); // Red contains 255
  });
});
