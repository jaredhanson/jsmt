/**
 * Module dependencies.
 */
var path = require('path')
  , Module = require('../module')
  , resolvers = require('../resolvers')
  , utils = require('../utils')
  , debug = require('debug')('jsmt:middleware');

/**
 * Serve JavaScript to browsers in AMD format.
 *
 * @param {String} root
 * @param {Object} options
 * @return {Function}
 * @api public
 */
module.exports = function(root, options) {
  options = options || {};

  var resolve = resolvers[options.resolve || 'amd']({ baseDir: root })
    , transitive = options.transitive || false
    , mime = options.mime || 'text/javascript';

  return function modules(req, res, next) {
    var mid = req.path
      , ext = path.extname(mid);
    if (mid[0] == '/') {
      mid = mid.slice(1);
    }    
    mid = mid.slice(0, mid.length - ext.length);
    
    // Core modules are compiled into a JavaScript engine (ex: Node).  As such,
    // they cannot be resolved to a file and are expected to be included via
    // other mechanisms.
    if (resolve.isBuiltIn(mid)) {
      debug('core module, deferring: ' + mid);
      return next();
    }
    
    debug('resolving: ' + mid);
    var filename;
    try {
      filename = resolve(mid);
    } catch(e) {
    }
    debug('resolved to: ' + filename);
    
    // Failed to resolve module.  Proceed to next middleware, which may be able
    // to resolve the module and service the request.  If not, the request will
    // eventually 404.
    if (!filename) { return next(); }
    
    var mod = Module.get(mid, filename);
    var opts = {};
    utils.merge(opts, options);
    utils.merge(opts, { baseDir: root });
    // Multiple module middleware are typically in use to construct a "virtual"
    // module space.  Allow unresolved modules within any single instance, under
    // the assumption that a different instance will resolve the module.
    utils.merge(opts, { allowAllUnresolved: true });
    // Module IDs must be burned when transporting multiple modules in a single
    // response.
    if (transitive) { utils.merge(opts, { burnID: true }); }
    
    mod.load(filename, opts, function(err) {
      if (err) { return next(err); }
      
      var js = '';
      
      // Traverse the module tree, constructing AMD-compatible JavaScript.  If
      // the `transitive` option is disabled, the tree will consist of just the
      // requested module.
      traverse(mod, function(m) {
        if (!m.filename) { return; }
        
        var mopts = {};
        utils.merge(mopts, opts);
        if (transitive && !m.parent) {
          // If the module has no parent, burn the ID specified by the client in
          // order to keep state consistent between the client and server.
          //
          // In practice, the only time these would differ is when requesting a
          // top-level Node module in which the main JavaScript file resolves to
          // an internal file inside a lib directory (referenced through the
          // `main` property of package.json).
          utils.merge(mopts, { moduleID: m.id });
        }
        
        js += m.toAMD(mopts) + '\r\n';
      });
      
      res.setHeader('Content-Type', mime);
      res.end(js);
    });
  }
}


function traverse(m, fn) {
  m.children.forEach(function(child) {
    traverse(child, fn);
  });
  fn(m);
}

