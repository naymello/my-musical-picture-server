const path = require('path');

module.exports = {
	mode: 'development',
	watch: true,
	entry: {
		app: './src/app.js',
		functions: './src/functions.js',
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: '[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			},
		]
	}
};