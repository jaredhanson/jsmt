define([
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