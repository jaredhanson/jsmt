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
  
  // TODO: Implement support for AMD "map" configuration, allowing the
  //       "parent" module to be passed as an option.
  
  function r(id) {
    return resolve.sync(id, opts);
  }
  r.isSpecial = resolve.isSpecial;
  r.isCore = function() { return false; };
  r.__algo = 'amd';
  
  return r;
}
