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
 * @param {Module} mod
 * @param {Object} ast
 * @param {Object} opts
 * @return {Function}
 * @api public
 */
module.exports = function(mod, ast, opts) {
  opts = opts || {};
  
  //console.log(JSON.stringify(ast, null, 2));
  
  var baseDir = opts.baseDir || process.cwd()
    , requires = mod.requires
    , map = {};
  
  for (var i = 0, len = requires.length; i < len; i++) {
    var dep = requires[i];
    
    if (mod.resolve.isCore(dep)) {
      // Core modules are built in to Node.  When loading Node modules in an AMD
      // context, they will be provided by a compatibility layer and resolved
      // from the base URL.
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
      
      // TODO: Implement "flatten" option that allows all non-relative dependencies
      //       to be merged up to base URL.
      
      var fname = mod.resolve(dep);
      var ext = path.extname(fname);
      var aid = path.relative(baseDir, fname);
      aid = aid.slice(0, aid.length - ext.length);
      
      // map id to absolute id
      map[dep] = aid;
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
      } else if (isDefine(node)) {
        var dependencies = []
          , di = 0;
        
        // TODO: Find position of dependencies argument (0 or 1) (if listed, may not be)
        
        dependencies = node.arguments[di].elements;
        var elements = dependencies.map(function(d) {
          var mid = map[d.value] || d.value;
          return { type: "Literal", value: mid }
        });
        node.arguments[di].elements = elements;
      }
    }
  });
  
  return ast;
}
