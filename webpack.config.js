const path = require('path');

module.exports = {
	mode: 'development',
	watch: true,
	entry: './src/app.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js'
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