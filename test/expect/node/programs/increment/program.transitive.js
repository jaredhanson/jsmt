define('node_modules/increment/node_modules/math/lib/add', [
  'require',
  'exports',
  'module'
], function (require, exports, module) {
  exports.add = function () {
    var sum = 0, i = 0, args = arguments, l = args.length;
    while (i < l) {
      sum += args[i++];
    }
    return sum;
  };
});
define('node_modules/increment/node_modules/math/lib/sub', [
  'require',
  'exports',
  'module'
], function (require, exports, module) {
  exports.sub = function () {
    var sum = 0, i = 0, args = arguments, l = args.length;
    while (i < l) {
      sum -= args[i++];
    }
    return sum;
  };
});
define('node_modules/increment/node_modules/math/lib/index', [
  'require',
  'exports',
  'module',
  'node_modules/increment/node_modules/math/lib/add',
  'node_modules/increment/node_modules/math/lib/sub'
], function (require, exports, module) {
  exports.add = require('node_modules/increment/node_modules/math/lib/add').add;
  exports.sub = require('node_modules/increment/node_modules/math/lib/sub').sub;
});
define('node_modules/increment/index', [
  'require',
  'exports',
  'module',
  'node_modules/increment/node_modules/math/lib/index'
], function (require, exports, module) {
  var add = require('node_modules/increment/node_modules/math/lib/index').add;
  exports.increment = function (val) {
    return add(val, 1);
  };
});
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