// node自带的文件路径工具
var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
// 配置文件
var config = require('../config')
// webpack 配置合并插件
var merge = require('webpack-merge')
// webpack 基本配置
var baseWebpackConfig = require('./webpack.base.conf')
// webpack 复制文件和文件夹的插件
var CopyWebpackPlugin = require('copy-webpack-plugin')
// 自动生成 html 并且注入到 .html 文件中的插件
var HtmlWebpackPlugin = require('html-webpack-plugin')
// 提取css的插件
var ExtractTextPlugin = require('extract-text-webpack-plugin')
// webpack 优化压缩和优化 css 的插件
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
// js压缩插件
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// 增加 webpack-parallel-uglify-plugin来替换
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
// 如果当前环境为测试环境，则使用测试环境
// 否则，使用生产环境 获取当前环境
var env = process.env.NODE_ENV === 'testing' ? require('../config/test.env') : config.build.env

var webpackConfig = merge(baseWebpackConfig, {
    module: {
        // styleLoaders 将.vue外部的css或css预处理器文件进行处理
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
     // 是否开启调试
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        // 编译输出的静态资源根路径
        path: config.build.assetsRoot,
        // 编译输出的文件名
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        // 没有指定输出名的文件输出的文件名 或可以理解为 非入口文件的文件名，而又需要被打包出来的文件命名配置,如按需加载的模块
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    plugins: [
        
        new webpack.HashedModuleIdsPlugin(),
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        // 配置全局环境为生产环境 // 定义在非入口文件引用的文件的名称
        new webpack.DefinePlugin({
            'process.env': env
        }),
        // extract css into its own file
        // 将js中引入的css分离的插件
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'),
            allChunks: true
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        // 压缩提取出的css，并解决ExtractTextPlugin分离出的js重复问题(多个文件引入同一css文件)
        new OptimizeCSSPlugin({
            cssProcessorOptions: config.build.productionSourceMap ? {
                safe: true,
                map: {
                    inline: false
                }
            } : {
                safe: true
            }
        }),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        // 构建要编译输出的index.html,并在文件中嵌入资源文件
        new HtmlWebpackPlugin({
            // 输出的HTML文件名
            filename: process.env.NODE_ENV === 'testing' ? 'index.html' : config.build.index,
            // 模板文件路径
            template: 'index.html',
            // 设置为true或body可以将js代码放到<body>元素最后
            // 设置为head将js代码加到<head>里面
            // 设置为false所有静态资源css和JavaScript都不会注入到模板文件中
            inject: 'body',
            minify: {
                // 删除注释
                removeComments: true,
                 // 合并空白
                collapseWhitespace: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeEmptyAttributes: true,
                // 删除属性的引号
                removeAttributeQuotes: true,
                minifyCSS: true,
                minifyJS: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            favicon: './favicon.ico'
        }),
        // split vendor js into its own file
        //  分割公共 js 到独立的文件vendor中

        // 使用CommonsChunkPlugin可以保证如果我们的第三方插件没有变动，在打包的时候可以不被重新的打包
        // 待到上线后就不会重新的加载以达到缓存的目的
        // 我们会获得webpack执行时间和输出一份json文件保存chunk的id和最终引用它们的文件印射关系
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                // any required modules inside node_modules are extracted to vendor
                return (module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0)
            }
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        // 下面主要是将运行时代码提取到单独的manifest文件中，防止其影响vendor.js
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity
        }),
        // webpack将公共模块打包的vendor.js里面使用CommonsChunkPlugin将vendor.js分离到单独的文件
        new webpack.optimize.CommonsChunkPlugin({
            name: 'app',
            async: 'vendor-async',
            children: true,
            minChunks: 3
        }),
        // js文件压缩插件
        // new UglifyJsPlugin({
        //     cache: false,
        //     sourceMap: false,
        //     parallel: true,
        //     uglifyOptions: {
        //         ie8: false,
        //         sourceMap: false
        //     }
        // }),
        // remove console debugger warnings
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         drop_debugger: true,
        //         drop_console: true
        //     },
        //     sourceMap: false
        // }),
        new ParallelUglifyPlugin({
            cacheDir: '.cache/', // 设置缓存路径，不改动的调用缓存，第二次及后面build时提速
            uglifyJS: {
                output: {
                    comments: false
                },
                compress: {
                    warnings: false,
                    drop_debugger: true,
                    drop_console: true
                }
            }
        }),
        // copy custom static assets
        // new webpack.DllReferencePlugin({
        //     context: path.resolve(__dirname, '..'),
        //     manifest: require('./vendor-manifest.json')
        // })

        // copy custom static assets
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: config.build.assetsSubDirectory,
            ignore: ['.*']
        }])
    ]
})
// 如果开启了Gzip压缩，使用以下配置
if (config.build.productionGzip) {
    var CompressionWebpackPlugin = require('compression-webpack-plugin')
    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 0,
            minRatio: 0.8
        })
    )
}
// 如果开启了编译报告，使用以下配置
if (config.build.bundleAnalyzerReport) {
    var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig