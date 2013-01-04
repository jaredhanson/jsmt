/**
 * Module dependencies.
 */
var path = require('path')
  , fs = require('fs')
  , existsSync = fs.existsSync || path.existsSync
  , Module = require('../module')
  , Program = require('../program')
  , resolvers = require('../resolvers')
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
    , mime = options.mime || 'text/javascript';


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
      
      var prog = new Program(mod);
      var js = prog.toAMD(options);
      
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

