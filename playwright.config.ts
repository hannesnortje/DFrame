import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests-e2e',
  use: {
    browserName: 'chromium',
    baseURL: 'http://localhost:9500',
  },
  webServer: {
    command: 'node scripts/test-server.js',
    port: 9500,
    reuseExistingServer: false,
    timeout: 60000, // Give it more time to compile
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        browserName: 'chromium',
        headless: false // Set to false to debug visually
      },
    }
  ]
});
