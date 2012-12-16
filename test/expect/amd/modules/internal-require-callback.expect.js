define([
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