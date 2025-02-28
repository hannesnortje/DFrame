/**
 * Debug configuration options for DFrame
 */
export const debugConfig = {
  /**
   * Whether to show the debug panel
   * Set to false to hide the debug panel in production
   */
  showDebugPanel: false,
  
  /**
   * Log level for the console
   * - 0: None
   * - 1: Error only
   * - 2: Error and warnings
   * - 3: Error, warnings and info
   * - 4: Everything (verbose)
   */
  logLevel: 1,
  
  /**
   * Whether to highlight components with debug colors
   * Useful for visualizing layout and component boundaries
   */
  highlightComponents: false,
  
  /**
   * Whether to show object names in the DOM
   */
  showObjectNames: false,
  
  /**
   * Whether to track component render time
   */
  trackPerformance: false
};
