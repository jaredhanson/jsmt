/**
 * Module dependencies.
 */
var path = require('path')
  , Module = require('../module');


/**
 * List dependencies of a module.
 *
 * @param {String} main
 * @param {Object} options
 * @api protected
 */
module.exports = function list(main, options) {
  options = options || {};
  options.transitive = true;
  
  // TODO: Implement option to specify this module's id.
  var mod = new Module('.', null);
  mod.load(path.resolve(process.cwd(), main), options, function(err) {
    if (err) throw err;
    
    var resolved = []
      , missing = [];
      
    traverse(mod, function(m) {
      if (m.filename) {
        resolved.push(m);
      } else {
        missing.push(m);
      }
    })
    
    if (resolved.length) {
      console.log('================')
      console.log('Resolved Modules')
      console.log('================')
      resolved.forEach(function(m) {
        if (options.showPaths) {
          console.log(m.id + ' -> ' + m.filename)
        } else {
          console.log(m.id)
        }
      })
    }
    
    if (missing.length) {
      console.log('')
      console.log('================')
      console.log('Missing Modules')
      console.log('================')
      missing.forEach(function(m) {
        console.log(m.id)
      })
    }
  });
}

function traverse(m, fn) {
  fn(m);
  m.children.forEach(function(child) {
    traverse(child, fn);
  });
}
