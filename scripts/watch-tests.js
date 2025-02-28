#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');

// Configuration
const testDir = path.join(__dirname, '../src/tests-e2e');
const srcDir = path.join(__dirname, '../src');
const testCommand = 'npx playwright test';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Store last run info
let isRunning = false;
let queuedRun = false;
let lastChangedFile = null;

console.log(`${colors.bright}${colors.blue}Playwright Test Watcher${colors.reset}`);
console.log(`${colors.cyan}Watching for changes in:${colors.reset}`);
console.log(`  - ${testDir}`);
console.log(`  - ${srcDir}`);
console.log(`${colors.cyan}Press Ctrl+C to exit${colors.reset}\n`);

// Function to run tests
function runTests(changedFile = null) {
  if (isRunning) {
    // Queue a run for when the current run finishes
    queuedRun = true;
    lastChangedFile = changedFile;
    return;
  }
  
  isRunning = true;
  lastChangedFile = null;
  
  const testFile = changedFile && changedFile.endsWith('.spec.ts') ? changedFile : '';
  const displayCommand = `${testCommand}${testFile ? ' ' + path.relative(process.cwd(), testFile) : ''}`;
  
  console.log(`\n${colors.bright}${colors.yellow}Running tests: ${displayCommand}${colors.reset}\n`);
  
  const cmd = testCommand + (testFile ? ' ' + testFile : '');
  const child = spawn(cmd, { shell: true, stdio: 'inherit' });
  
  child.on('exit', (code) => {
    const timestamp = new Date().toLocaleTimeString();
    
    if (code === 0) {
      console.log(`\n${colors.green}✓ Tests passed${colors.reset} (${timestamp})`);
    } else {
      console.log(`\n${colors.red}✗ Tests failed${colors.reset} (${timestamp})`);
    }
    
    isRunning = false;
    
    // If another run was requested while this one was running, run again
    if (queuedRun) {
      queuedRun = false;
      runTests(lastChangedFile);
    }
  });
}

// Watch for changes
const watcher = chokidar.watch([
  path.join(testDir, '**/*.ts'),
  path.join(srcDir, '**/*.ts'),
  path.join(__dirname, '../public/*.html'),
], {
  ignored: /(node_modules|\.git|dist)/,
  persistent: true,
  ignoreInitial: true,
});

console.log(`${colors.magenta}Initial test run...${colors.reset}`);
runTests();

watcher.on('change', (filePath) => {
  console.log(`${colors.cyan}File changed: ${path.relative(process.cwd(), filePath)}${colors.reset}`);
  runTests(filePath);
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}Test watcher stopped.${colors.reset}`);
  watcher.close();
  process.exit(0);
});
