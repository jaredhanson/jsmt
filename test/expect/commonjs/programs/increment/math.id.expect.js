define('test/data/commonjs/programs/increment/math', [
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