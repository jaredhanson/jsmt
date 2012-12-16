var estraverse = require('estraverse')
  , isDefine = require('../utils').isDefine;

module.exports = function(mod, ast, opts) {
  opts = opts || {};
  
  //console.log(JSON.stringify(ast, null, 2));
  
  estraverse.traverse(ast, {
    leave: function(node) {
      if (isDefine(node)) {
        
        if (node.arguments.length && node.arguments[0].type !== 'Literal') {
          node.arguments[2] = node.arguments[1];
          node.arguments[1] = node.arguments[0];
          node.arguments[0] = { type: 'Literal', value: mod.aid }
        }
      }
    }
  });
  
  return ast;
}
