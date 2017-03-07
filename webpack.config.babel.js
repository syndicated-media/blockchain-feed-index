const path = require ('path');
const webpack = require ('webpack');
const ExtractTextWebpackPlugin = require ('extract-text-webpack-plugin')
const Html = require ('html-webpack-plugin');

var plugins = [new Html({
  filename: './index.html',
  template: './main.html'
})];

var sassParameters = [{
  loader: 'css-loader'
},{
  loader: 'sass-loader'
}];

if (process.env.NODE_ENV === 'production') {
  sassParameters = ExtractTextWebpackPlugin.extract(sassParameters);
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    mangle: true
  }));
  plugins.push(new ExtractTextWebpackPlugin('[chunkHash].css'));
  plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }));
} else {
  sassParameters.unshift({
    loader: 'style-loader'
  });
}

module.exports = {
  context: path.resolve(__dirname, 'src/client'),
  devtool: '#source-map',
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[chunkHash].js',
    pathinfo: true,
    publicPath: '/assets/'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader'
    },{
      test: /\.scss$/,
      use: sassParameters
    }]
  },
  plugins: plugins
};
