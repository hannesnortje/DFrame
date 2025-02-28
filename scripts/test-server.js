#!/usr/bin/env node

const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
const path = require('path');
const fs = require('fs');

// Set a different port for testing
const PORT = 9500;

// Add debug options to our test server
const testConfig = {
    ...webpackConfig,
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        ...webpackConfig.output,
        library: 'DFrame',  // Expose as global
        libraryTarget: 'umd', // Universal Module Definition
    },
    devServer: {
        static: {
            directory: path.join(__dirname, '../public'),
            watch: true,
        },
        port: PORT,
        hot: false, // Disable HMR for tests for more stability
        liveReload: false,
        open: false,
        setupMiddlewares: (middlewares, devServer) => {
            // Log when URLs are accessed
            devServer.app.use((req, res, next) => {
                console.log(`Access: ${req.method} ${req.url}`);
                next();
            });
            
            return middlewares;
        }
    }
};

console.log(`Starting webpack dev server for testing on port ${PORT}...`);
console.log(`Serving static files from: ${path.join(__dirname, '../public')}`);

// Create a compiler instance
const compiler = webpack(testConfig);

// Create and start server
const server = new WebpackDevServer(testConfig.devServer, compiler);

compiler.hooks.afterCompile.tap('TestEntryPoint', (compilation) => {
    console.log('Webpack bundle compiled for tests');
    
    // Check if test-setup.js exists
    const testSetupPath = path.join(__dirname, '../public/test-setup.js');
    fs.access(testSetupPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`WARNING: ${testSetupPath} does not exist!`);
        } else {
            console.log(`test-setup.js found at ${testSetupPath}`);
        }
    });
});

server.start().catch(err => {
    console.error('Failed to start test server:', err);
    process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('Stopping test server...');
    server.stop();
    process.exit();
});
