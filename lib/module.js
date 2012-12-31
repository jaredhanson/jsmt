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
  
  if (parent.resolve.isSpecial(id)) {
    // Special modules (such as `require`, `exports`, and `module` in AMD) are
    // provided by the loader.
    return cb(null, null);
  }
  if (parent.resolve.isBuiltIn(id)) {
    // Core modules are those compiled into the JavaScript environment, such as
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
 * Initialization sets various properties of the module.  Among these are `aid`,
 * which is the absolute module ID (relative to the base directory) and
 * `filename`, which is the full path to the module.
 *
 * Additionally, a `resolve` function is configured which resolves modules
 * relative to this module, according to the specified resolution algorithm.
 *
 * Options:
 *   - `resolve`  require resolution algortithm, defaults to _'amd'_
 *
 * @param {String} filename
 * @param {Options} cb
 * @api private
 */
Module.prototype._init = function(filename, opts) {
  opts = opts || {};

  var baseDir = opts.baseDir || process.cwd();
  var rel = path.relative(baseDir, filename)
    , ext = path.extname(filename);

  this.aid = rel.slice(0, rel.length - ext.length); // absolute id
  this.filename = filename;
  this.resolve = resolvers[opts.resolve || 'amd']({
    relDir: path.dirname(this.filename)
  });
  
  Module._cache[filename] = this;
}

/**
 * Loads a module.
 *
 * Loads a module and optionally any dependencies the module requires.
 *
 * Options:
 *   - `transitive`  load required dependencies, defaults to _false_
 *   - `resolve`     require resolution algorithm, defaults to _'amd'_
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
 * the module will be analyzed to determine its format and dependencies.
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

/**
 * Analyzes a module.
 *
 * Analyzing a module involves applying a series of passes to its AST.  Analyzers
 * are similiar to middleware, and often add properties to the module based on
 * the results of analysis.
 *
 * @param {Function|Array} passes
 * @param {Function} cb
 * @api private
 */
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
 * code executing in a browser must be loaded via a network while ensuring that
 * dependencies are loaded prior executing a module's factory function.
 *
 * @param {Object} opts
 * @return {String} JavaScript code
 * @api public
 */
Module.prototype.toAMD = function(opts) {
  opts = opts || {};

  var tform = transforms.toamd[this.format](opts);
  if (!tform) throw new Error('unable to transform ' + this.format + ' to amd');
  
  var tforms = [ tform ]
    , ast = this.ast;
  
  if (opts.burnID) { tforms.push(transforms.burnid(opts)); }
  
  switch (this.resolve.__algo) {
    case 'node':
      tforms.push(require('./transforms/denode')(opts));
      break;
  }
  
  for (var i = 0, len = tforms.length; i < len; i++) {
    ast = tforms[i](this, ast);
  }
  
  // These options are, by default, passed to `escodegen.generate()` when
  // generating JavaScript code.  For reference, see:
  //   https://github.com/Constellation/escodegen/wiki/API
  var genopts = {
    format: {
      indent: {
        style: '  ',
        base: 0
      },
      json: false,
      renumber: false,
      hexadecimal: false,
      quotes: 'single',
      escapeless: false,
      compact: false,
      parentheses: true,
      semicolons: true
    },
    parse: null,
    comment: false,
    sourceMap: undefined
  }
  utils.merge(genopts, opts);
  
  return escodegen.generate(ast, genopts);
}


/**
 * Expose `Module`.
 */
module.exports = Module;
