/**
 * Module dependencies.
 */
var resolve = require('amd-resolve');

/**
 * Resolves modules using the AMD resolution algorithm.
 *
 * @param {Object} options
 * @api public
 */
module.exports = function(opts) {
  opts = opts || {};
  
  function r(id) {
    return resolve.sync(id, opts);
  }
  r.isBuiltIn = resolve.isSpecial;
  r.__algo = 'amd';
  
  return r;
}
