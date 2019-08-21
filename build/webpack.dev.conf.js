var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// add hot-reload related code to entry chunks
// 将热重载的相关配置放了entry的每一项中,达到每一个文件都实现热重载的目的
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})
// 调用webpack-merge方法,将基层设置与开发设置进行合并
//  webpack-merge这个的作用类似于extend,少则添加,多则覆盖
module.exports = merge(baseWebpackConfig, {
    module: {
        // 开发环境下生成cssSourceMap便于调试
        // 官方说cssSourceMap的相对路径有一个bug
        // 暂时将其关闭

        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    },
    // cheap-module-eval-source-map is faster for development
    // 配置source Maps ，在开发过程中使用cheap-module-eval-source-map更快
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        // DefinePlugin可以为webpack提供一个在在编辑时可以配置的全局变量
        // 我们可以通过"process.env"的值来判断所处的环境
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        // 页面中的报错不会阻塞编译，但是会在编译结束后报错
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            favicon: './favicon.ico'
        }),
        new FriendlyErrorsPlugin({
            clearConsole: false
        })
    ]
})