/**
 * Module dependencies.
 */
var path = require('path')
  , fs = require('fs')
  , existsSync = fs.existsSync || path.existsSync
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
  options.baseDir = root;
  // Multiple `modules` middleware are often in use within in an application in
  // order to construct a "virtual" module space.  As such, unresolved modules
  // are allowed under the assumption that they will be resolved by another
  // middleware.  If the assumption does not hold, the client-side loader will
  // throw an error.
  options.allowAllUnresolved = true;

  var resolve = resolvers[options.resolve || 'amd']({ baseDir: root })
    , transitive = options.transitive || false
    , mime = options.mime || 'text/javascript';

  // Module IDs must be burned when transporting multiple modules in a single
  // response.
  if (transitive) { options.burnID = true; }


  return function modules(req, res, next) {
    var mid = req.path
      , ext = path.extname(mid);
    if (mid[0] == '/') {
      mid = mid.slice(1);
    }    
    mid = mid.slice(0, mid.length - ext.length);
    
    // Built-in modules are compiled into a JavaScript engine (ex: Node).  As
    // such, they cannot be resolved to a file and are expected to be included
    // via a compatibility layer.
    if (resolve.isBuiltIn(mid)) {
      debug('built-in module, deferring: ' + mid);
      return next();
    }
    
    debug('resolving: ' + mid);
    var filename;
    
    if (resolve.__algo == 'node') {
      // When serving Node modules to a browser, dependencies are pre-resolved
      // to their absolute path (by the `denode` transform).  This optimization
      // short-circuits Node resolution for the common case when it was already
      // been performed.
      var pabs = path.resolve(root, mid + '.js');
      if (existsSync(pabs)) {
        filename = pabs;
      }
    }
    
    if (!filename) {
      try {
        filename = resolve(mid);
      } catch(e) {
      }
    }
    debug('resolved to: ' + filename);
    
    // Failed to resolve module.  Proceed to next middleware, which may be able
    // to resolve the module and service the request.  If not, the request will
    // eventually 404.
    if (!filename) { return next(); }
    
    var mod = Module.get(mid, filename);
    mod.load(filename, options, function(err) {
      if (err) { return next(err); }
      
      var js = '';
      
      // Traverse the module tree, constructing AMD-compatible JavaScript.  If
      // the `transitive` option is disabled, the tree will consist of just the
      // requested module.
      traverse(mod, function(m) {
        if (!m.filename) { return; }
        
        var opts = {};
        utils.merge(opts, options);
        if (m.id == options.main) {
          // The main module of an application is wrapped in a `require` call,
          // so that its execution is triggered upon load.
          utils.merge(opts, { define: 'require' });
        }
        if (transitive && !m.parent) {
          // If the module has no parent, burn the ID specified by the client in
          // order to keep state consistent between the client and server.
          //
          // In practice, the only time these would differ is when requesting a
          // top-level Node module in which the main JavaScript file resolves to
          // an internal file inside a lib directory (referenced through the
          // `main` property of package.json).
          utils.merge(opts, { moduleID: m.id });
        }
        
        js += m.toAMD(opts) + '\r\n';
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

