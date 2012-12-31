/**
 * Module dependencies.
 */
var estraverse = require('estraverse')
  , isDefine = require('../utils').isDefine;


/**
 * Burns the module ID into the module definition.
 *
 * When transporting multiple modules in a single file (typically the result of
 * optimization), the module identifier must be explicitly declared in the module
 * definition (rather than being derived from the path).
 *
 * The module ID that is burned during this transform is the absolute module
 * identifier, as needed by the AMD resolution algorithm.
 *
 * @param {Module} mod
 * @param {Object} ast
 * @param {Object} opts
 * @return {Function}
 * @api public
 */
module.exports = function(opts) {
  opts = opts || {};
  
  return function(mod, ast) {
    //console.log(JSON.stringify(ast, null, 2));
    
    var id = typeof opts.burnID == 'string' ? opts.burnID : mod.aid;
    
    estraverse.traverse(ast, {
      leave: function(node) {
        if (isDefine(node)) {
          
          if (node.arguments.length && node.arguments[0].type !== 'Literal') {
            if (node.arguments.length == 1) {
              node.arguments[2] = node.arguments[0];
              node.arguments[1] = { type: 'ArrayExpression', elements: [] }
            } else {
              node.arguments[2] = node.arguments[1];
              node.arguments[1] = node.arguments[0];
            }
            node.arguments[0] = { type: 'Literal', value: id }
          }
        }
      }
    });
    
    return ast;
  }
}
