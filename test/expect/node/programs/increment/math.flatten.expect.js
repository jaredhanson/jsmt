define([
  'require',
  'exports',
  'module',
  'node_modules/increment/node_modules/math/lib/add',
  'node_modules/increment/node_modules/math/lib/sub'
], function (require, exports, module) {
  exports.add = require('node_modules/increment/node_modules/math/lib/add').add;
  exports.sub = require('node_modules/increment/node_modules/math/lib/sub').sub;
});