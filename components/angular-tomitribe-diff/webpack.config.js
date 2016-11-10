const webpack = require('webpack');
var precss = require('precss');
var autoprefixer = require('autoprefixer');

module.exports = {
  context: __dirname + '/src',
  entry:  {
    'tomitribe-diff': './tomitribe-diff.ts'
  },
  output: {
    path: __dirname +'/dist',
    filename: '[name].js',
    chunkFilename: '[id].js'
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader']
      },
      {
        test: /\.jade$/,
        loader: 'pug-html-loader'
      },
      {
        test: /\.sass$/,
        loader: "style-loader!css-loader!postcss-loader!sass-loader"
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ]
  },

  postcss: function () {
    return [precss, autoprefixer];
  },

  htmlLoader: {
    minimize: false
  },

  resolve: {
    extensions: ['', '.js', '.ts']
  }
}