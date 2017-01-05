const loaders = require("./loaders");
const webpack = require('webpack');

// just there to build the doc app dependencies bundle

const isBundle = process.env['NODE_ENV'] === 'bundle';

module.exports = {
    entry: ['./src/vendors.ts'],
    output: {
        filename: 'build.js',
        publicPath: isBundle ? '/mykola/doc/ngdocs/js/' : ''
    },
    resolve: {
        root: __dirname,
        extensions: ['', '.ts', '.js']
    },
    devtool: "source-map",
    plugins: [
      new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery', 'window.jquery': 'jquery' })
    ],
    module: { loaders: loaders }
};
