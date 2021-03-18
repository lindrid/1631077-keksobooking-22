const path = require('path');

module.exports = {
  entry: './source/js/main.js',
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, './build/js')
  }
};