var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'

module.exports = {
    // 配置在.vue文件中的相关处理规则
  loaders: utils.cssLoaders({
    //   根据所处理的环境是否生成sourceMap用于代码调试
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    // 是否将单独的css文件（一般为引入的外部文件），进行提取单独处理
    extract: isProduction
  })
}
