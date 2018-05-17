const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        main: './src/main.ts',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'paperview.min.js',
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: ['.webpack.js', '.web.js', '.ts', 'tsx', '.js', '.scss']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                // exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    watch: true,
    node: {
      fs: 'empty'
  },
  plugins: [
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: 'common' // Specify the common bundle's name.
    // }),
    //new webpack.IgnorePlugin(/^\.\/pdf.worker.js$/),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new ExtractTextPlugin('style.css'),
    // new CleanWebpackPlugin(['dist']),
    // new HtmlWebpackPlugin({
    //   title: 'Production'
    // })
  ]
}
