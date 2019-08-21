//这里是用来检测node，npm版本的
require('./check-versions')()
process.env.NODE_ENV = 'production'
// 这里的ora是用来显示编译信息
var ora = require('ora')
// 以下这些是用来配置编译信息在控制台的样式
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')
var startTime = new Date().getTime();

var spinner = ora('building for production...')
// 开始显示编译信息
spinner.start()

webpack(webpackConfig, function (err, stats) {
    // 停止编译信息的显示
    spinner.stop()
    // 如果有报错，显示报错此信息
    if (err) throw err
    // 以下为编译信息样式配置
	process.stdout.write(stats.toString({
		colors: true,
		modules: false,
		children: false,
		chunks: false,
		chunkModules: false
	}) + '\n\n')
    var endTime = new Date().getTime();
	console.log('  Build complete.\n')
	console.log('   Time : ' + parseInt((endTime - startTime) / 1000) + ' s')
	console.log(
		'  Tip: built files are meant to be served over an HTTP server.\n' +
		'  Opening index.html over file:// won\'t work.\n'
	)
})
