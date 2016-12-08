var loaders = require("./loaders");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

module.exports = {
    entry: ['./src/index.ts'],
    output: {
        filename: 'build.js',
        path: 'dist'
    },
    resolve: {
        root: __dirname,
        extensions: ['', '.ts', '.js']
    },
    devtool: "source-map",
    plugins: [
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
        contentBase: 'dist',
        historyApiFallback: true,
        port: 8082,
        host: '0.0.0.0',
        hot: true
       // inline: true
    }
};
