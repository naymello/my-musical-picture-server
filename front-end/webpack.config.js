const path = require('path')

module.exports = {
  mode: 'development',
  watch: true,
  entry: {
    imageMaking: './src/image-maker.js',
    landing: './src/landing.js'
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