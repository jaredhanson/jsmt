/**
 * Converts a module from CommonJS format to AMD format.
 *
 * CommonJS modules can be converted easily to AMD format by wrapping them in a
 * `define` call.  The free variables `require`, `exports`, and `module` are the
 * first arguments in the dependency list, and correspond to those defined by the
 * CommonJS specification.  Any required modules are also added to the dependency
 * list.  Note that this makes the transformed module a traditional AMD module,
 * rather than a simplified CommonJS wrapper, which does not require any
 * client-side processing.
 *
 * Options:
 *  - `define`   name of top-level `define` function (default: 'define')
 *
 * @param {Object} opts
 * @return {Function}
 * @api public
 */
module.exports = function(opts) {
  opts = opts || {};
  var define = opts.define || 'define';
  
  return function(mod, ast) {
    //console.log(JSON.stringify(ast, null, 2));
  
    var dependencies = ['require', 'exports', 'module'].concat(mod.requires);
    
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
}
