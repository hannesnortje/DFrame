const path = require('path');

module.exports = (env = {}) => {
  // Determine which tsconfig file to use
  const tsConfigFile = env.config === 'dev' ? 'tsconfig.dev.json' : 'tsconfig.json';
  
  return {
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: tsConfigFile,
              transpileOnly: env.config === 'dev', // Skip type checking in dev mode
              compilerOptions: {
                // Overrides for development
                ...(env.config === 'dev' ? { noEmit: false } : {})
              }
            }
          },
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'DFrame',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 9000,
    },
  };
};
