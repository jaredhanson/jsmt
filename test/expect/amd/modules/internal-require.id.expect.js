define('test/data/amd/modules/internal-require', [
  'require',
  './relative/name'
], function (require) {
  var mod = require('./relative/name');
});