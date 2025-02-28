import { createShowcase } from './showcase';
import { debugConfig } from '../config/debug';

// Disable debug panel for the showcase
debugConfig.showDebugPanel = false;
debugConfig.highlightComponents = false;
debugConfig.showObjectNames = false;

// Entry point for examples
window.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }
  
  console.log('Creating showcase...');
  const showcase = createShowcase();
  rootElement.appendChild(showcase.getElement());
  console.log('Showcase created and added to DOM');
  
  // Find and remove debug panel if it exists
  const debugPanel = document.querySelector('.dframe-debug-panel');
  if (debugPanel && debugPanel.parentNode) {
    debugPanel.parentNode.removeChild(debugPanel);
  }
});
