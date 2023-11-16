const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/client/index.js',
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    port: 8083,
    proxy: {
      '/': 'http://localhost:8082'
    },
    
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }, 
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      }
    ] 
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/views/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin({
      dry: true,
      verbose: true,
      cleanStaleWebpackAssets: true,
      protectWebpackAssets: false,
    }),
  ],
};
