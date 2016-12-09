var loaders = require("./loaders");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

const isBundle = process.env['NODE_ENV'] === 'bundle';

module.exports = {
    entry: ['./src/index.ts'],
    output: {
        filename: 'build.js',
        path: isBundle ? 'dist/mykola' : 'dist/build',
        publicPath: isBundle ? '/mykola/' : ''
    },
    resolve: {
        root: __dirname,
        extensions: ['', '.ts', '.js']
    },
    devtool: "source-map",
    plugins: [
        {
          apply: (compiler) => {
              compiler.plugin('compilation', function(compilation) { // copy html file replacing base value
                  compilation.plugin('html-webpack-plugin-after-html-processing', (object, callback) => {
                      if (isBundle) {
                        object.html = object.html.replace('<base href="/">', '<base href="/mykola/">');
                      }
                      callback(null, object);
                  });
              });
          }
        },
        new HtmlWebpackPlugin({
            template: './src/index.jade',
            inject: 'body',
            hash: true
        }),
        new CopyWebpackPlugin([
            { from: './src/public' },
        ]),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.jquery': 'jquery'
        })
    ],
    module:{
        loaders: loaders
    },
    devServer: {
        contentBase: 'dist/build',
        historyApiFallback: true,
        port: 8082,
        host: '0.0.0.0',
        hot: true
       // inline: true
    }
};
