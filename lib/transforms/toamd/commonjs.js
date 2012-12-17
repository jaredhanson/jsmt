  // TODO: When burning IDs using the Node algorithm, may need to
  //       add some form of namespacing, to both the module and any
  //       requiring it.


module.exports = function(mod, ast, opts) {
  opts = opts || {};
  var define = opts.define || 'define';
  var dependencies = ['require', 'exports', 'module'].concat(mod.requires);
  
  //console.log(JSON.stringify(ast, null, 2));
  
  // The goal is to transform any CommonJS module into an AMD module.  This
  // is accomplished by wrapping it in a `define` statement, with all
  // dependencies declared so they can be loaded by the module loader prior
  // to executing the factory function.
  
  var elements = dependencies.map(function(id) {
    return { type: "Literal", value: id }
  });
  
  var wrap = {
    type: 'Program',
    body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: define
        },
        arguments: [ {
            type: 'ArrayExpression',
            elements: elements
          }, {
            type: 'FunctionExpression',
            id: null,
            params: [ {
                type: 'Identifier',
                name: 'require'
              }, {
                type: 'Identifier',
                name: 'exports'
              }, {
                type: 'Identifier',
                name: 'module'
              }
            ],
            body: {
              type: 'BlockStatement',
              body: ast.body
            }
          }
        ]
      }
    }]
  }
  
  return wrap;
}
