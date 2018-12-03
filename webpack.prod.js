const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common.js')
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = merge(common, {
    watch: false,
    plugins: [
        // new webpack.LoaderOptionsPlugin({
        //     minimize: true,
        //     debug: false
        // }),
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map'
        })
    ],
})
