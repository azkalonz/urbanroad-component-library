const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function normalizeName(name) {
  return name
    .replace(/node_modules/g, 'nodemodules')
    .replace(/[\-_.|]+/g, ' ')
    .replace(/\b(nodemodules|js|modules|es)\b/g, '')
    .trim()
    .replace(/ +/g, '-');
}

module.exports = {
  entry: {
    'module/multi-step-form': './src/embeddables/multi-step-form.tsx',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Removes console.log statements
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: {
      name: 'runtime', // Creates a runtime file to separate the runtime logic
    },
  },
  plugins: [
    new CleanWebpackPlugin({
      protectWebpackAssets: false,
      cleanAfterEveryBuildPatterns: ['*.LICENSE.txt'],
    }),
    new HtmlWebpackPlugin({
      filename: 'wholesale-registration-form/index.html',
      title: 'MultiStepForm | Wholesale Registration',
      rootId: 'multi-step-form',
      component: 'wholesale-registration',
      template: './templates/multi-step-form.html',
      chunks: ['module/multi-step-form'],
      minify: false,
    }),
  ],
  output: {
    filename: 'js/[name].[contenthash].js',
    path: path.resolve(__dirname, 'examples'),
    library: 'UrbanRoadComponents',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, 'postcss.config.js'),
              },
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};
