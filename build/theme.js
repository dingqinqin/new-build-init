const fs = require('fs-extra');
var path = require('path');
const themePre = "export default "
const chartset = '@charset "UTF-8";'
const chalk = require("chalk");
const error = chalk.bold.red;
const success = chalk.bold.green;
const info = chalk.bold.blue;
const danger = chalk.bold.red;
const warning = chalk.keyword("orange");
const log = console.log;
// theme ----
var myPath = path.join(__dirname, '../src/css/theme.css'),
    outPath = path.join(__dirname, '../src/theme/theme.js'),
    style = fs.readFileSync(myPath, 'utf8').replace(/("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g, '');
fs.writeFileSync(outPath, themePre + "`" + style + "`");
log(success('> theme-success           ', outPath));

var elementPath = path.join(__dirname, '../src/css/element-ui.css'),
    outElenentPath = path.join(__dirname, '../src/theme/element.js'),
    style = fs.readFileSync(elementPath, 'utf8').replace(/("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g, '');
fs.writeFileSync(outElenentPath, themePre + "`" + chartset + style + "`");
log(success('> element-ui-success      ', elementPath));
// router ----
// function getFileStr(imports, routers) {
//     if (!routers || routers.length == 0) {
//         return 'export default []';
//     }
//     return imports.join('\n') + '\n\nexport default [\n\t...' + routers.join(',\n\t...') + '\n]';
// }

// let _p = path.join(__dirname, '../src/page/'),
//     _import = [],
//     _router = [];

// if (fs.existsSync(_p)) {
//     fs.readdirSync(_p).forEach((el, i) => {
//         let _path = ('../src/page/' + el + '/router.js');
//         if (el != '.svn' && fs.existsSync(path.join(__dirname, _path))) {
//             _router.push(el);
//             _import.push('import ' + el + ' from "' + _path.replace('/src/', '/') + '";');
//         }
//     });
// }

// fs.writeFileSync(path.join(__dirname, '../src/router/routers.js'), getFileStr(_import, _router));

// log(success('> router-success          ', path.join(__dirname, '../src/router/routers.js')));