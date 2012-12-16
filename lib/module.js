/**
 * Module dependencies.
 */
var path = require('path')
  , fs = require('fs')
  , esprima = require('esprima')
  , escodegen = require('escodegen')
  , resolvers = require('./resolvers')
  , analyzers = require('./analyzers')
  , transforms = require('./transforms')
  , utils = require('./utils')
  , options = require('./options')
  , debug = require('debug')('jsmt');


/**
 * `Module` constructor.
 *
 * Constructs a new module with the given `id` and `parent`.  If `parent` is
 * not null, the created module will be added as a child of `parent`.
 *
 * @param {String} id
 * @param {Module} parent
 * @api public
 */
function Module(id, parent) {
  this.id = id
  this.parent = parent;
  if (parent && parent.children) {
    parent.children.push(this);
  }
  this.children = [];
  
  this.filename = null;
  this.format = undefined;
  this.loaded = false;
}

// module cache
Module._cache = {};

/**
 * Class method to load a module.
 *
 * @param {String} id
 * @param {Module} parent
 * @param {Object} opts
 * @param {Function} cb
 * @api private
 */
Module._load = function(id, parent, opts, cb) {
  if (typeof opts == 'function') {
    cb = opts;
    opts = {};
  }
  opts = opts || {};
  cb = cb || function() {};
  
  var filename;
  
  debug('loading id: ' + id + ' parent: ' + parent.id);
  try {
    filename = parent.resolve(id);
    debug('resolve id: ' + id + ' to: ' + filename);
  } catch (e) {
    // Catch module not found errors.  When compiling (aka concatenating)
    // modules, it is common to compile application-specific modules into a
    // single file, while compiling shared frameworks into a separate file.  The
    // separate modules are resolved and loaded at runtime by the loader.
    // Allowing unresolved modules at compile time accomodates this case.
    
    // TODO: only allow if not relative. add separate `allowRelativeUnresolved`
    //       option
    if (opts.allowUnresolved) {
      // insert a stub missing module, as indicated by the lack of a `filename`
      return cb(null, new Module(id, parent));
    }
    return cb(e)
  }
  
  if (parent.resolve.isSpecial(filename)) {
    // Special modules (such as `require`, `exports`, and `module` in AMD) are
    // provided by the loader.
    return cb(null, null);
  }
  if (parent.resolve.isCore(id)) {
    // Core modules are those compiled into the JavaScript runtime, such as
    // `events`, `path, `net`, etc provided by Node.js.
    
    // TODO: Provide a mechanism to concatenate core modules along with
    //       non-core modules.
    return cb(null, null);
  }
  
  
  var cachedModule = Module._cache[filename];
  if (cachedModule) { return cb(null, cachedModule); }
  
  var module = new Module(id, parent);
  module.load(filename, opts, function(err) {
    if (err) { return cb(err); }
    return cb(null, module);
  });
}

/**
 * Initialize a module.
 *
 * Initialize a module, including a resolve function configured with the
 * specified resolution algorithm and relative search paths.
 *
 * @param {String} filename
 * @param {Options} cb
 * @api private
 */
Module.prototype._init = function(filename, opts) {
  opts = opts || {};

  this.aid = path.relative(opts.baseDir, filename); // absolute id
  this.filename = filename;
  this.resolve = resolvers[opts.resolve || 'amd']({
    relDir: path.dirname(this.filename)
  });
  
  // TODO: Assign `this` to cache.  `module` appears to be undefined.
  Module._cache[filename] = module;
}

/**
 * Loads a module.
 *
 * Loads a module and optionally any dependencies the module requires.
 *
 * Options:
 *   - `transitive`  Load required dpendencies, defaults to _false_
 *   - `resolve`     Require resolution algorithm, defaults to _'amd'_
 *
 * @param {Object} opts
 * @param {Function} cb
 * @api public
 */
Module.prototype.load = function(filename, opts, cb) {
  if (typeof opts == 'function') {
    cb = opts;
    opts = {};
  }
  opts = opts || {};
  cb = cb || function() {};
  
  if (this.loaded) { return cb(); }
  this.loaded = true;
  this._init(filename, opts);
  
  var self = this;
  
  function require(id, cb) {
    return Module._load(id, self, opts, cb);
  }
  
  this.parse(opts, function(err) {
    if (err) { return cb(err); }
    
    if (opts.transitive) {
      var deps = self.requires;
      (function iter(i, err) {
        if (err) { return cb(err); }
      
        var dep = deps[i];
        if (!dep) { return cb(); } // done
      
        require(dep, function(e) {
          iter(i + 1, e);
        });
      })(0);
    } else {
      return cb();
    }
  })
}

/**
 * Parses a module.
 *
 * Parses a JavaScript module into an abstract syntax tree (AST).  Once parsed,
 * any passes will be applied in order to analyze the code.
 *
 * @param {Object} opts
 * @param {Function} cb
 * @api private
 */
Module.prototype.parse = function(opts, cb) {
  if (typeof opts == 'function') {
    cb = opts;
    opts = {};
  }
  opts = opts || {};
  cb = cb || function() {};
  
  if (this.ast) { return cb(); }
  
  var self = this;
  fs.readFile(this.filename, 'utf8', function(err, src) {
    if (err) { return cb(err); }
    
    self.ast = esprima.parse(src);
    self.analyze(analyzers.requires(), function(err) {
      if (err) { return cb(err); }
      return cb();
    });
  });
}

Module.prototype.analyze = function(passes, cb) {
  if (typeof passes == 'function') {
    passes = [ passes ];
  }
  
  var self = this;
  (function iter(i, err) {
    if (err) { return cb(err); }
      
    var pass = passes[i];
    if (!pass) { return cb(); } // done
      
    try {
      var arity = pass.length;
      if (arity == 1) {
        // sync
        pass(self);
        iter(i + 1);
      } else {
        // async
        pass(self, function(e) { iter(i + 1, e); } )
      }
    } catch(e) {
      return cb(e);
    }
  })(0);
}


/**
 * Transforms a module to AMD format.
 *
 * AMD defines a module format that is optimized for browser-based environments.
 * It allows modules to be defined, including declaration of any dependencies.
 * The loader handles asynchronous loading of code, accomodating the fact that
 * code executing in a browser must be loaded via a network.  The loader further
 * ensures that dependencies are loaded prior executing a module's code.
 *
 * @param {Object} opts
 * @return {String} JavaScript code
 * @api public
 */
Module.prototype.toAMD = function(opts) {
  var tform = transforms[this.format];
  if (!tform) throw new Error('unable to transform ' + this.format + ' to amd');
  
  var tforms = [ tform ]
    , ast = this.ast;
  
  for (var i = 0, len = tforms.length; i < len; i++) {
    ast = tforms[i](this, ast, opts);
  }
  return escodegen.generate(ast, options.generate);
}


/**
 * Expose `Module`.
 */
module.exports = Module;
