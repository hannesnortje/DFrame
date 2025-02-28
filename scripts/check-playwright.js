#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('Checking Playwright setup...');

try {
  // Check if Playwright is installed
  console.log('Checking Playwright installation:');
  execSync('npx playwright --version', { stdio: 'inherit' });

  // Check browser installation
  console.log('\nChecking browser installations:');
  execSync('npx playwright install chromium --dry-run', { stdio: 'inherit' });

  console.log('\nPlaywright setup appears to be working!');
  console.log('To run tests: npm run test:e2e');
} catch (error) {
  console.error('Error checking Playwright setup:', error.message);
  process.exit(1);
}
