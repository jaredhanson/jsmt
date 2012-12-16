define('test/data/amd/modules/commonjs-wrapping', [
  'require',
  'exports',
  'module',
  'a',
  'b'
], function (require, exports, module) {
  var a = require('a'), b = require('b');
  exports.action = function () {
  };
});