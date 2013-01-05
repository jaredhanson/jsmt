/**
 * Module dependencies.
 */
var resolve = require('resolve');

/**
 * Resolves modules using the Node.js resolution algorithm.
 *
 * For details regarding the algorithm, consult the documentation:
 *   http://nodejs.org/api/modules.html
 *   http://nodejs.org/api/modules.html#modules_all_together
 *
 * @param {Object} options
 * @api public
 */
module.exports = function(opts) {
  opts = opts || {};
  opts.basedir = opts.relDir || opts.baseDir || opts.basedir;
  
  function r(id) {
    return resolve.sync(id, opts);
  }
  r.isBuiltIn = resolve.isCore;
  r.__algo = 'node';
  
  return r;
}
