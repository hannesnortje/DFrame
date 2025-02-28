#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

function generateReport() {
  // Get test results
  const testResultsDir = path.join(__dirname, '../test-results');
  
  if (!fs.existsSync(testResultsDir)) {
    console.error('Test results directory not found. Run tests first.');
    process.exit(1);
  }
  
  // Get screenshots
  const screenshots = fs.readdirSync(testResultsDir)
    .filter(file => file.endsWith('.png'));
  
  // Create HTML report
  let html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>DFrame Test Report</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; }
      h1 { color: #333; }
      .screenshot { margin-bottom: 30px; }
      .screenshot img { max-width: 100%; border: 1px solid #ddd; }
      .screenshot h3 { margin-bottom: 5px; }
    </style>
  </head>
  <body>
    <h1>DFrame Test Report</h1>
    <p>Generated on ${new Date().toLocaleString()}</p>
    
    <h2>Visual Test Results</h2>
    <div class="screenshots">
  `;
  
  // Add screenshots to report
  screenshots.forEach(screenshot => {
    const name = screenshot.replace('.png', '').replace(/-/g, ' ');
    html += `
      <div class="screenshot">
        <h3>${name}</h3>
        <img src="${screenshot}" alt="${name}">
      </div>
    `;
  });
  
  html += `
    </div>
  </body>
  </html>
  `;
  
  // Write report
  fs.writeFileSync(path.join(testResultsDir, 'report.html'), html);
  console.log(`Report generated at ${path.join(testResultsDir, 'report.html')}`);
}

generateReport();
