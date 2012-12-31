/**
 * Module dependencies.
 */
var path = require('path')
  , estraverse = require('estraverse')
  , utils = require('../utils')
  , isRequire = utils.isRequire
  , isDefine = utils.isDefine;
  

/**
 * Transforms require statements to use absolute module IDs.
 *
 * Node's module resolution algorithm finds modules by searching in node_modules
 * directories, as well as loading from directories containing a package.json
 * file (with a `main` property).  This algorithm is incompatible with AMD's
 * algorithm, which locates all modules under a base URL.
 *
 * When transforming a Node module to AMD, `require` statements will be
 * re-written to use absolute module IDs.  This ensures that dependencies are
 * correctly resolved when loaded by an AMD-compatible loader in a browser.
 *
 * Options:
 *  - `baseDir`   base directory in which modules are located
 *  - `flatten`   make all dependencies top-level dependencies
 *  - `define`    name of top-level `define` function (default: 'define')
 *
 * @param {Object} opts
 * @return {Function}
 * @api public
 */
module.exports = function(opts) {
  opts = opts || {};
  var baseDir = opts.baseDir || process.cwd()
    , flatten = opts.flatten || false
    , define = opts.define || 'define';
  
  return function(mod, ast) {
    //console.log(JSON.stringify(ast, null, 2));
    
    var requires = mod.requires
      , map = {};
    
    for (var i = 0, len = requires.length; i < len; i++) {
      var dep = requires[i];
      
      if (mod.resolve.isBuiltIn(dep)) {
        // Core modules are built in to Node.  When loading Node modules in an AMD
        // context, they will be provided by a compatibility layer and resolved
        // from the base URL.
      } else if (flatten && dep[0] != '.') {
        // When flatten mode is enabled, any non-relative modules will not be
        // mapped to their Node resolution path.  This forces all dependencies up
        // to the top level, where they are resolved from the base URL in an AMD
        // context.
      } else {
        // Any required non-core modules will be required by their absolute ID.
        // In effect, this "pre-resolves" modules since Node's algorithm cannot be
        // performed within a browser.
        //
        // Note that, at first glance, it is tempting to leave relative modules
        // (in the form `require('./foo')`) alone thinking that they will correctly
        // be resolved by AMD from the parent module's path.  However, this does
        // not hold when the parent module is loaded from a directory containing a
        // package.json file.  Therefore, even relative require statements are
        // mapped to absolute module IDs.
        
        try {
          var fname = mod.resolve(dep);
          var ext = path.extname(fname);
          var aid = path.relative(baseDir, fname);
          aid = aid.slice(0, aid.length - ext.length);
          
          // map id to absolute id
          map[dep] = aid;
        } catch(e) {
          // Catch and ignore MODULE_NOT_FOUND errors, leaving the module
          // unmapped.
        }
      }
    }
    
    
    estraverse.traverse(ast, {
      leave: function(node) {
        if (isRequire(node)) {
          // TODO: Implement test case for non-literal require.  Should not be modified.
          
          if (node.arguments.length && node.arguments[0].type === 'Literal') {
            var mid = map[node.arguments[0].value] || node.arguments[0].value;
            node.arguments[0].value = mid;
          }
        }
        if (isDefine(node, define)) {
          var dependencies
            , di;
          
          if (node.arguments.length >= 1 && node.arguments[0].type == 'ArrayExpression') {
            dependencies = node.arguments[0].elements;
            di = 0;
          } else if (node.arguments.length >= 2 && node.arguments[1].type == 'ArrayExpression') {
            dependencies = node.arguments[1].elements;
            di = 1;
          }
          
          if (dependencies) {
            var elements = dependencies.map(function(d) {
              var mid = map[d.value] || d.value;
              return { type: "Literal", value: mid }
            });
            node.arguments[di].elements = elements;
          }
        }
      }
    });
    
    return ast;
  }
}
