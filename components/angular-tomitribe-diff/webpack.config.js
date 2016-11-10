const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  context: __dirname + "/src",
  entry:  {
    component: './tomitribe-diff.ts',
  },
  output: {
    path: __dirname +"/dist",
    filename: '[name].js',
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

  tslint: {
    emitErrors: false,
    failOnHint: true
  },

  plugins:[
    new HtmlWebpackPlugin({
      template: './tomitribe-diff.jade'
    })
  ],

  htmlLoader: {
    minimize: false
  },

  resolve: {
    extensions: ['', '.js', '.ts']
  }
}