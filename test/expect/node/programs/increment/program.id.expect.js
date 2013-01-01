require([
  'require',
  'exports',
  'module',
  'node_modules/increment/index'
], function (require, exports, module) {
  var inc = require('node_modules/increment/index').increment;
  var a = 1;
  console.log(inc(a));
});