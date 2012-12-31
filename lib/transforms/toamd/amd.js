/**
 * Module dependencies.
 */
var estraverse = require('estraverse')
  , isDefine = require('../../utils').isDefine;

/**
 * Converts a module from AMD format to AMD format.
 *
 * AMD modules are, naturally, already in AMD format.  However, any modules using
 * simplified CommonJS wrapping require client-side analysis of the code to
 * determine dependencies (typically using `Function.toString()`).  This
 * transform will convert CommonJS wrapping to a traditional AMD module, avoiding
 * the need for client-side processing.
 *
 * @param {Module} mod
 * @param {Object} ast
 * @param {Object} opts
 * @return {Function}
 * @api public
 */
module.exports = function(opts) {
  opts = opts || {};
  
  // TODO: Make it an option to strip UMD wrapping
  
  return function(mod, ast) {
    //console.log(JSON.stringify(ast, null, 2));
  
    estraverse.traverse(ast, {
      leave: function(node) {
        if (isDefine(node)) {
          // The goal is to take any simplified CommonJS wrapping and turn it into
          // a traditional AMD module.  This avoids the need to perform
          // Function.prototype.toString() conversions and RegExp scanning for
          // `require` calls on the client.
          
          if (node.arguments.length == 1 && node.arguments[0].type === 'FunctionExpression') {
            var params = node.arguments[0].params;
            if (params.length !== mod.requires.length) {
              // This is the simplified CommonJS wrapping defined by the AMD API,
              // which has implicit dependencies.  The `define` statement will be
              // re-written to explicitly list all dependencies, ensuring that the
              // loader has loaded the modules by the time they are `require`'d.
              
              var elements = mod.requires.map(function(id) {
                return { type: "Literal", value: id }
              });
              node.arguments[1] = node.arguments[0];
              node.arguments[0] = { type: 'ArrayExpression', elements: elements }
            }
          }
        }
      }
    });
    
    return ast;
  }
}
