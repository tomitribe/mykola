var loaders = require("./loaders");
var webpack = require('webpack');

module.exports = {
    entry: ['./src/vendors.ts'],
    output: {
        filename: 'build.js'
    },
    resolve: {
        root: __dirname,
        extensions: ['', '.ts', '.js']
    },
    devtool: "source-map",
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.jquery': 'jquery'
        })
    ],
    module:{
        loaders: loaders
    }
};
