var webpack = require('webpack');

/**
 * Identify the entrypoints for the JavaScript app
 */
var inputs = {
  App: './App.jsx'
};

/**
 * Output the built JavaScript to be served as a static asset
 */
var outputs = {
  filename: './static/[name].js'
};

/**
 * The tools to use for compiling JSX
 */
var reactLoaders = [ 'jsx-loader?harmony=true', 'envify-loader' ];

module.exports = {
  entry: inputs,
  output: outputs,
  module: {
    loaders: [
      { test: /\.js$|.jsx$/, loaders: reactLoaders }
    ]
  }
};
