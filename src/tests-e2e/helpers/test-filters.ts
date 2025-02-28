/**
 * Test filters for Playwright
 * 
 * Add tags to your tests like this:
 * test('my test @focus', async ({ page }) => { ... })
 */

import { test as baseTest } from '@playwright/test';

// Different test scopes you can use
export const componentTest = baseTest.extend({
  // Add component-specific fixtures here if needed
});

export const layoutTest = baseTest.extend({
  // Add layout-specific fixtures here if needed
});

export const integrationTest = baseTest.extend({
  // Add integration-specific fixtures here if needed
});

// To allow focused testing with npx playwright test --grep="@focus"
export function createFocusedTest(testName: string): string {
  // When TEST_FOCUS=1 is set, add the @focus tag to allow filtering
  return process.env.TEST_FOCUS ? `${testName} @focus` : testName;
}
