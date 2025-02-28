#!/usr/bin/env node

const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Start the test server before running this script
async function measurePerformance() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Starting performance measurements...');
  
  // Navigate to page and wait for load
  const startTime = Date.now();
  await page.goto('http://localhost:9500/test.html');
  await page.waitForSelector('#test-status');
  const loadTime = Date.now() - startTime;
  
  // Measure component creation time
  const createWidgetTime = await page.evaluate(() => {
    const startTime = performance.now();
    for (let i = 0; i < 100; i++) {
      new window.DFrame.QWidget();
    }
    return performance.now() - startTime;
  });
  
  // Measure layout performance
  const layoutTime = await page.evaluate(() => {
    const startTime = performance.now();
    
    // Create a complex layout
    const container = new window.DFrame.QWidget();
    const layout = new window.DFrame.QVBoxLayout(container);
    
    for (let i = 0; i < 50; i++) {
      const widget = new window.DFrame.QWidget();
      layout.addWidget(widget);
    }
    
    return performance.now() - startTime;
  });
  
  // Report results
  const results = {
    loadTime: `${loadTime}ms`,
    createWidgetTime: `${createWidgetTime.toFixed(2)}ms for 100 widgets (${(createWidgetTime / 100).toFixed(2)}ms per widget)`,
    layoutTime: `${layoutTime.toFixed(2)}ms for 50-widget layout`
  };
  
  console.log('Performance Results:');
  console.table(results);
  
  // Save results
  const resultsDir = path.join(__dirname, '../perf-results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
  }
  
  fs.writeFileSync(
    path.join(resultsDir, `perf-${new Date().toISOString().replace(/:/g, '-')}.json`), 
    JSON.stringify(results, null, 2)
  );
  
  await browser.close();
  console.log('Performance measurements complete!');
}

measurePerformance().catch(console.error);
