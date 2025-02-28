import { FullConfig } from '@playwright/test';

/**
 * Global setup for Playwright tests
 */
async function globalSetup(config: FullConfig) {
  console.log('Setting up Playwright tests for DFrame');
  
  // Add any global setup here - browser installations happen automatically
}

export default globalSetup;
