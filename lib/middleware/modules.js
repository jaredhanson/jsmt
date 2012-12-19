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

  var resolve = resolvers[options.resolve || 'amd']({ baseDir: root });

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
    if (resolve.isCore(mid)) {
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
    
    // TODO: Implement inline option
    
    var mod = new Module(mid, null);
    var opts = {};
    utils.merge(opts, options);
    utils.merge(opts, { xburnID: true, baseDir: root });
    
    mod.load(filename, opts, function(err) {
      if (err) { return next(err); }
      var js = mod.toAMD(opts);
      res.setHeader('Content-Type', 'application/javascript');
      res.end(js);
    });
  }
}
