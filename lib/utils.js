exports.isDefine = function(node, word) {
  word = word || 'define'
  
  var c = node.callee;
  return c
    && node.type === 'CallExpression'
    && c.type === 'Identifier'
    && c.name === word
  ;
}

exports.isRequire = function(node, word) {
  word = word || 'require'
  
  var c = node.callee;
  return c
    && node.type === 'CallExpression'
    && c.type === 'Identifier'
    && c.name === word
  ;
}


/**
 * Merge object b with object a.
 *
 *     var a = { foo: 'bar' }
 *       , b = { bar: 'baz' };
 *     
 *     utils.merge(a, b);
 *     // => { foo: 'bar', bar: 'baz' }
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api private
 */

exports.merge = function(a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};
