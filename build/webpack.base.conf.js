var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
// 获取根目录
function resolve(dir) {
	return path.join(__dirname, '..', dir)
}
var webpack = require('webpack')
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
});
module.exports = {
    // 定义入口文件
	externals: {
		jquery: 'window.jQuery',
		axios: 'axios',
		moment: 'moment',
		lodash: '_',
		qs: 'Qs',
		echarts: 'echarts',
		sortablejs: 'Sortable',
		'js-cookie': 'Cookies',
		screenfull: 'screenfull',
		vue: 'Vue',
		vuex: 'Vuex',
		'vue-router': 'VueRouter',
		'vue-i18n': 'VueI18n',
		'element-ui': 'ELEMENT',
		'ecloud-ui': 'ECLOUD'
	},
	entry: {
		app: ['babel-polyfill','./src/main.js']
    },
	output: {
        // 输出路径
        path: config.build.assetsRoot,
        // 输出文件名称，（name为entry中定义的key值）
        filename: '[name].js',
        // 静态资源路径（判断目前所处的环境）
        // 在开发环境下，路径为根目录
        // 在生产环境下，路径为根目录下的static文件夹
		publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
	},
	resolve: {
        // 自动解析拓展，可以在引用文件的时候不用写后缀
        extensions: ['.js', '.vue', '.json', '.css'],
        modules: [
            resolve('src'),
            resolve('node_modules')
        ],
        // 配置别名，避免在结构嵌套过深的情况下出现../../../xx的这种写法
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'@': resolve('src'),
			'src': resolve('src'),
			'static': resolve('static'),
			'api': resolve('src/api'),
			'root': resolve(''),
		}
	},
	module: {
        // 配置不同模块的处理规则
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
                options: vueLoaderConfig,
                include: [resolve('src')]
			},
			{
				test: /\.js$/,
				loader: 'happypack/loader?id=happyBabel',
				include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
			},
			{
                // 对于图片资源，当文件体积小于10kb的时候，将其生成base64,直接插入html，
                // 当大于10kb时将图片名称进行按照命名规则进行修改
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('images/[name].[hash:7].[ext]')
				},
				include: [resolve('src')]
			},
			{
                // 字体资源打包规则,与图片资源相同
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				},
				include: [resolve('src')]
			}
		]
    },
    plugins: [
        new HappyPack({
            //用id来标识 happypack处理那里类文件
            id: 'happyBabel',
            //如何处理  用法和loader 的配置一样
            loaders: [{
                loader: 'babel-loader?cacheDirectory=true',
            }],
            //共享进程池
            threadPool: happyThreadPool,
            //允许 HappyPack 输出日志
            verbose: true,
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
    ]
}