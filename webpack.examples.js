const path = require('path');
const mainConfig = require('./webpack.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  ...mainConfig,
  entry: './src/examples/index.ts',
  output: {
    filename: 'examples-bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/examples.html',
      filename: 'index.html',
      inject: false // Don't inject again, we already have the script tag
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 8000,
  }
};
