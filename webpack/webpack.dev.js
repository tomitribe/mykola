/*jshint esversion: 6 */
const loaders = require("./loaders");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const isBundle = process.env['NODE_ENV'] === 'bundle';


module.exports = {
    entry: ['./src/index.ts'],
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, (isBundle ? '../target/noderesources' : '../target/build')),
        publicPath: isBundle ? '/mykola/' : ''
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devtool: "source-map",
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.jade',
            inject: 'body',
            hash: true
        }),
        {
            apply: function (compiler) {
                compiler.plugin('compilation', function (compilation) { // copy html file replacing base value
                    compilation.plugin('html-webpack-plugin-after-html-processing', function (object) {
                        if (isBundle) object.html = object.html.replace('<base href="/">', '<base href="/mykola/">');
                        return object;
                    });
                });
            }
        },
        new CopyWebpackPlugin([
            { from: path.resolve(__dirname, '../src/public') }
        ]),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.jquery': 'jquery',
            Popper: ['popper.js', 'default']
        })
    ],
    module:{
        rules: loaders
    },
    devServer: {
        contentBase: path.resolve(__dirname, '../target/build'),
        historyApiFallback: true,
        port: 8082,
        host: '0.0.0.0',
        hot: true,
        disableHostCheck: true
       // inline: true
    }
};
