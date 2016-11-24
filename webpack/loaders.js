module.exports = [
    {
		test: /\.ts$/,
		loader: 'ts-loader'
	}, {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
    }, {
        test: /\.(scss|sass)$/,
        loader: 'style!css!sass'
    }, {
        test: /\.(jade|pug)$/,
        loader: 'pug-loader'
    }, {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'raw'
    }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
    }, {
        test: /\.jpg$/,
        exclude: /node_modules/,
        loader: 'file'
    }, {
        test: /\.png$/,
        exclude: /node_modules/,
        loader: 'file-loader'
    }
];
