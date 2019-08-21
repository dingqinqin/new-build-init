require('./check-versions')()
// 获取webpack相关的配置
const log = console.log;
var config = require('../config')
// 如果没有通过DefinePlugin设置全局process.env字段，那么默认为开发环境
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
var fs = require('fs-extra')
// open可以跨平台打开网站，文件，可执行文件
var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
// 如果发生了跨域的情况,可以通过‘http-proxy-middleware’这个中间件进行反向代理，可以解决跨域问题
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing' ? require('./webpack.prod.conf') : require('./webpack.dev.conf')
var os = require('os')

// default port where dev server listens for incoming traffic
// 获取端口
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
// 配置是否自动打开浏览器
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
// 获取需要转发的接口
var proxyTable = config.dev.proxyTable

var app = express()
// 将webpack的开发环境设置放了webpack中，启动编译
var compiler = webpack(webpackConfig)
// 引入webpack-dev-middleware中间件
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    // 设置中间件的公共路径，值与webpack的公共路径相同
    // 这个路径就是内存中存储文件所在的路径
    publicPath: webpackConfig.output.publicPath,
    // 不在控制台显示任何信息
    quiet: true
})
// 引入webpack-hot-middleware中间件
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: false,
    heartbeat: 2000
});
// force page reload when html-webpack-plugin template changes
// 设置回调来访问编辑对象
compiler.plugin('compilation', function(compilation) {
    // 设置回调来访问html-webpack-plugin的after-emit（发射后），的钩子
    compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
        // 发布热重载事件并传入一个对象，在dev-client.js中可以subscribe到这个对象
        hotMiddleware.publish({ action: 'reload' })
        // 由于after-emit阶段是异步的，所以必须设置一个回调函数并调用它
        cb()
    })
})

// proxy api requests
// 遍历反向代理的配置，利用proxyMiddleware进行反向代理
Object.keys(proxyTable).forEach(function(context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
        options = { target: options }
    }
    app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
// 将暂存在内存中的webpack编辑后的文件挂载到示例上
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
// 将热重载挂载到示例上并输出相关状态和编译错误
app.use(hotMiddleware)

// serve pure static assets
// 获取配置中的静态资源绝对路径
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
// 当开发环境中如果遇到了staticPath的资源，那么到./static中引用该资源
app.use(staticPath, express.static('./static'))
app.use('/common', express.static('./common'))
// const commonProxy = proxyMiddleware('/common', {
//     target: 'http://4.shiyuesoft.com',
//     changeOrigin: true
// });
// app.use(commonProxy);
var _resolve
var readyPromise = new Promise(resolve => {
    _resolve = resolve
})

var network = os.networkInterfaces(),
    ip = 'localhost',
    uri = ('http://' + ip + ':' + port);

first: for (var i in network) {
    var wlans = network[i];
    for (var j = 0; j < wlans.length; j++) {
        var w = wlans[j];
        if (!w || !w.family || !w.address || w.family.toLocaleLowerCase() != 'ipv4' || w.address == '127.0.0.1') {
            continue;
        }
        ip = w.address;
        break first;
    }
}
// 
log('> Starting dev server...');
// 当编译生效时，执行回调函数
devMiddleware.waitUntilValid(() => {
    console.log("\n> --------------------------------------------------------------------\n> \t" +
        "EcloudApplication '" + process.env['npm_package_name'] + "' is running! Access URLs:\n> \t" +
        "Node.js: \t" + process.version + "\n> \t" +
        "Local: \t\t" + uri + "\n> \t" +
        "External: \t" + uri.replace('localhost', ip) + "\n> \t" +
        "Profile(s): \t" + process.env.NODE_ENV + "\n> \t" +
        "Module(s): \t[" + (function() {
            var _ = [];
            fs.readdirSync(path.join(__dirname, '../src/page/')).forEach((el, i) => {
            	if (el != '.svn' && fs.existsSync(path.join(__dirname, ('../src/page/' + el + '/router.js')))) {
                    _.push(el);
                }
            });
            return _;
        }()).join(', ') + "]\n> \t" +
        "WorkSpace: \t" + path.join(__dirname, '../src') + "\n" +
        "> --------------------------------------------------------------------");
    // when env is testing, don't need open it
    // 当环境为测试环境或者设置了autoOpenBrowser的时候，打开之前设定好地址
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        opn(uri)
    }
    _resolve()
})
// 监听端口
var server = app.listen(port)

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close()
    }
}