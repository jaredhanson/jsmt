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
