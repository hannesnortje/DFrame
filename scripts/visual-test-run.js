#!/usr/bin/env node

const { spawn } = require('child_process');

// Configuration options
const runHeaded = true;        // true to see the browser, false for headless
const saveTraces = true;       // true to save traces for debugging
const saveScreenshots = true;  // true to save screenshots on failures
const testDir = 'src/tests-e2e';

// Build command
let command = 'npx playwright test';

if (runHeaded) {
  command += ' --headed';
}

if (saveTraces) {
  command += ' --trace on';
}

if (saveScreenshots) {
  command += ' --screenshot on-failure';
}

// Add test directory
command += ` ${testDir}`;

console.log(`Running tests with command: ${command}`);

// Run the command
const process = spawn(command, { shell: true, stdio: 'inherit' });

process.on('exit', (code) => {
  if (code === 0) {
    console.log('\n✅ Tests completed successfully');
  } else {
    console.log('\n❌ Tests failed');
  }
});
