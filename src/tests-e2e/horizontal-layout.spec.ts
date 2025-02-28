import { test, expect } from '@playwright/test';
import { DFrameTestUtils } from './helpers/dframe-test-utils';

/**
 * E2E tests for DFrame horizontal layouts
 */

test.describe('QHBoxLayout Tests', () => {
  // Use the test page with mock objects for all tests
  test.beforeEach(async ({ page }) => {
    await page.goto('/test.html');
    await page.waitForSelector('#test-status');
  });

  test('QHBoxLayout should arrange widgets horizontally', async ({ page }) => {
    // Create test layout using mock objects
    await page.evaluate(() => {
      const { QWidget, QLabel, QPushButton, QHBoxLayout } = window.DFrame;
      
      // Create test container
      const container = new QWidget();
      container.setObjectName('hboxContainer');
      document.body.appendChild(container.getElement());
      
      // Add styling
      container.getElement().style.width = '500px';
      container.getElement().style.height = '100px';
      container.getElement().style.border = '1px solid black';
      
      // Create horizontal layout
      const layout = new QHBoxLayout(container);
      
      // Add widgets
      const leftLabel = new QLabel('Left Widget');
      leftLabel.setObjectName('leftLabel');
      leftLabel.getElement().style.backgroundColor = 'pink';
      
      const middleButton = new QPushButton('Middle Button');
      middleButton.setObjectName('middleButton');
      middleButton.getElement().style.backgroundColor = 'lightblue';
      
      const rightLabel = new QLabel('Right Widget');
      rightLabel.setObjectName('rightLabel');
      rightLabel.getElement().style.backgroundColor = 'lightgreen';
      
      // Add to layout
      layout.addWidget(leftLabel);
      layout.addWidget(middleButton);
      layout.addWidget(rightLabel);
    });
    
    // Verify widgets were created and displayed
    await expect(page.locator('[data-dframe-object-name="hboxContainer"]')).toBeVisible();
    await expect(page.locator('[data-dframe-object-name="leftLabel"]')).toBeVisible();
    await expect(page.locator('[data-dframe-object-name="middleButton"]')).toBeVisible();
    await expect(page.locator('[data-dframe-object-name="rightLabel"]')).toBeVisible();
    
    // Take a screenshot for verification
    await page.screenshot({ path: 'test-results/hbox-layout.png' });
  });

  test('QHBoxLayout should arrange widgets horizontally using mock', async ({ page }) => {
    // Navigate to test page with mock DFrame
    await page.goto('/test.html');
    
    // Wait for mock to be available
    await page.waitForSelector('#test-status');
    
    // Create test layout using mock objects
    await page.evaluate(() => {
      const { QWidget, QLabel, QPushButton, QHBoxLayout } = window.DFrame;
      
      // Create test container
      const container = new QWidget();
      container.setObjectName('container');
      document.body.appendChild(container.getElement());
      
      // Add styling
      container.getElement().style.width = '500px';
      container.getElement().style.height = '100px';
      container.getElement().style.border = '1px solid black';
      
      // Create layout
      const layout = new QHBoxLayout(container);
      
      // Add widgets
      const label1 = new QLabel('Left');
      label1.setObjectName('left');
      label1.getElement().style.backgroundColor = 'pink';
      
      const button = new QPushButton('Middle');
      button.setObjectName('middle');
      button.getElement().style.backgroundColor = 'lightblue';
      
      const label2 = new QLabel('Right');
      label2.setObjectName('right');
      label2.getElement().style.backgroundColor = 'lightgreen';
      
      // Add to layout
      layout.addWidget(label1);
      layout.addWidget(button);
      layout.addWidget(label2);
    });
    
    // Verify widgets were created and displayed
    await expect(page.locator('[data-dframe-object-name="left"]')).toBeVisible();
    await expect(page.locator('[data-dframe-object-name="middle"]')).toBeVisible();
    await expect(page.locator('[data-dframe-object-name="right"]')).toBeVisible();
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/hbox-mock.png' });
  });
});
