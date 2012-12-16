/**
 * Module dependencies.
 */
var path = require('path')
  , fs = require('fs')
  , Module = require('../module');


/**
 * Build a JavaScript file from `main`, writing to `out`.
 *
 * @param {String} main
 * @param {String} out
 * @param {Object} options
 * @api protected
 */
module.exports = function build(main, out, options) {
  options = options || {};
  
  // TODO: Respect inline option.
  
  var filename = path.resolve(process.cwd(), main);
  options.baseDir = path.dirname(filename);
  
  // TODO: Implement option to specify this module's id.
  var mod = new Module('.', null);
  mod.load(filename, options, function(err) {
    if (err) throw err;
    
    var includes = []
      , excludes = [];
    traverse(mod, function(m) {
      if (m.filename) {
        includes.push(m);
      } else {
        excludes.push(m);
      }
    })
    
    var s = fs.createWriteStream(path.resolve(process.cwd(), out), {
      flags: 'w', encoding: 'utf8'
    });
    
    console.log('Included modules:')
    console.log('-----------------')
    concat(s, includes, options, function(err) {
      if (err) throw err;
      s.end();
      
      if (excludes.length) {
        console.log('')
        console.log('Excluded modules:')
        console.log('-----------------')
        excludes.forEach(function(m) {
          console.log(m.id)
        })
      }
    });
  });
}

function traverse(m, fn) {
  m.children.forEach(function(child) {
    traverse(child, fn);
  });
  fn(m);
}

function concat(s, mods, opts, cb) {
  (function iter(i, err) {
    if (err) { return cb(err); }

    var mod = mods[i];
    if (!mod) { return cb(); } // done
    
    if (i > 0) { s.write(new Buffer('\r\n', 'utf8')); };
    
    var buf = new Buffer(mod.toAMD() + '\r\n', 'utf8')
    if (opts.showPaths) {
      console.log(mod.id + ' -> ' + mod.filename + ' (' + buf.length + ' bytes)');
    } else {
      console.log(mod.id + ' (' + buf.length + ' bytes)');
    }
    
    s.write(buf);
    iter(i + 1);
  })(0);
}
