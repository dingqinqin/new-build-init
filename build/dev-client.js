/* eslint-disable */
// eventsource-polyfill这个的引入
// polyfill这个可以填平旧浏览器的一些事件支持上的缺陷
require('eventsource-polyfill')
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')
// 监听dev-server.js中的webpack-hot-middleware发布的事件，当event.action为reload的时候刷新页面
hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
