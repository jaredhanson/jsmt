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

exports.amdUnresolve = function(path, opts) {
  opts = opts || {};

  console.log('AMD UNRESOLVE');
  console.log('path: ' + path);
  
  var id = path
    , packages = opts.packages || [];
  
  for (var i = 0, len = packages.length; i < len; i++) {
    var pkg = packages[i];
    if (typeof pkg === 'string') {
      pkg = { name: pkg }
    }
    pkg.main = pkg.main || 'main';
    pkg.location = pkg.location || pkg.name;
    
    if (pkg.location + '/' + pkg.main === path) {
      id = pkg.name;
    }
  }
  
  console.log('unresolved to: ' + id);
  return id;
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
