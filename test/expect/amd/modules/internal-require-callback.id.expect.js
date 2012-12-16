define('test/data/amd/modules/internal-require-callback', [
  'require',
  'a',
  'b'
], function (require) {
  require([
    'a',
    'b'
  ], function (a, b) {
  });
});