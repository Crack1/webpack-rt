const path = require('path')
const fs = require('fs')
const webpack = require('webpack')


const nodeModules = fs.readdirSync('./node_modules').filter(d => d != '.bin')

function ignoreModules(context, request, callback) {
  //ignore if it is a relative path
  if (request[0] == '.')
    return callback()
  //Get the name of the module
  const module = request.split('/')[0]
  if (nodeModules.indexOf(module) !== -1) {

    return callback(null, 'commonjs ' + request)
  }
  return callback()
}

function createConfig(isDebug) {
  const plugins = []
  if (!isDebug) {
    plugins.push(new webpack.optimize.UglifyJsPlugin())
  }
  return {
    target: 'node',
    devtool: 'source-map',
    entry: './src/server/server.js',
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'server.js'
    },
    resolve: {
      alias: path.join(__dirname, 'src', 'shared')
    },

    module: {
      loaders: [{
        test: /\.js$/,
        loader: 'babel',
        exclude: '/node_modules/'
      }, {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: '/node_modules/'
      }]
    },
    externals: [ignoreModules],
    plugins: plugins
  }
}

module.exports = createConfig(true)
module.exports.create = createConfig
