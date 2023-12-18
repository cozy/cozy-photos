const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  plugins: [
    new CopyPlugin([
      {
        from: `src/photos/targets/vendor/assets/app-icon.svg`,
        to: 'public/app-icon.svg'
      },
      {
        from: `src/photos/targets/vendor/assets/favicon*`,
        to: 'public/',
        flatten: true
      },
      {
        from: `src/photos/targets/vendor/assets/apple-touch-icon.png`,
        to: 'public/apple-touch-icon.png'
      },
      {
        from: `src/photos/targets/vendor/assets/safari-pinned-tab.svg`,
        to: 'public/safari-pinned-tab.svg'
      },
      { from: `src/photos/targets/vendor/assets`, ignore: ['.gitkeep'] }
    ])
  ]
}
