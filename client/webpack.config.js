const path = require('path')

module.exports = {
  mode: 'production',
  watch: true,
  entry: {
    appSettings: './src/app-settings.js',
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