class DFrameWatchPlugin {
  constructor({ config }) {
    this.config = config;
  }

  // The prompt that will be displayed in watch mode
  getUsageInfo() {
    return {
      key: 'c',
      prompt: 'clear test cache and run all tests',
    };
  }

  // What happens when user presses the key
  run(globalConfig, updateConfigAndRun) {
    console.log('\nClearing test cache and running all tests...');
    
    // Update configuration to clear cache and run all tests
    updateConfigAndRun({
      mode: 'watch',
      testNamePattern: '',
      testPathPattern: '',
      skipNodeResolution: false,
      updateSnapshot: true,
      clearCache: true,
    });
    
    return Promise.resolve();
  }
}

module.exports = DFrameWatchPlugin;
