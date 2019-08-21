//定制控制台日志的输入样式
// var chalk = require('chalk')
// 加载语义化版本的测试库--(语义化指的是让计算机更加容易理解)
var semver = require('semver')
// 引入package.json
var packageConfig = require('../package.json')
// 引入shell
var shell = require('shelljs')
// require ('child_process'),调用nodejs子进程
// execSync同步的exec方法执行command
function exec(cmd) {
	return require('child_process').execSync(cmd).toString().trim()
}

var versionRequirements = [
	{
        name: 'node',
        // process的版本信息
        // semver.clean 返回版本信息
        currentVersion: semver.clean(process.version),
        // 从package.json中读取node版本信息
		versionRequirement: packageConfig.engines.node
	},
]

// 检查控制台是否以运行npm开头的命令---shell使用
if (shell.which('npm')) {
	versionRequirements.push({
        name: 'npm',
        // exec执行command，并返回npm版本
        currentVersion: exec('npm --version'),
        // 从package.json中读取node版本信息
		versionRequirement: packageConfig.engines.npm
	})
}

module.exports = function () {
	var warnings = []
	for (var i = 0; i < versionRequirements.length; i++) {
        var mod = versionRequirements[i]
        // 判断现有的版本是否满足要求
		if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
			warnings.push(mod.name + ': ' + mod.currentVersion + ' should be ' + mod.versionRequirement)
		}
	}
    // 打印错误的信息
	if (warnings.length) {
		console.log('')
		console.log('To use this template, you must update following to modules:')
		console.log()
		for (var i = 0; i < warnings.length; i++) {
			var warning = warnings[i]
			console.log('  ' + warning)
		}
        console.log()
        // 按照linux的规范，一般成功用0表示，非0 则表示失败，
        // 存在不满足版本要求的模块，执行失败
		process.exit(1)
	}
}
