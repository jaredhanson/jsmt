var utils = require('./utils');

function Program(main) {
  this.main = main;
}

Program.prototype.toAMD = function(opts) {
  opts = opts || {}
  
  var self = this
    , js = ''
    , transitive = opts.transitive || false
    , newline = opts.newline = '\n';
    
  // Module IDs must be burned when transporting multiple modules in a single
  // script.
  if (transitive) { opts.burnID = true; }
  
  // Traverse the module tree, constructing AMD-compatible JavaScript.  If the
  // `transitive` option is disabled, the tree will consist of just a single
  // module.
  traverse(this.main, function(mod) {
    if (!mod.filename) { return; }
    
    var mopts = {};
    utils.merge(mopts, opts);
    if (mod.id == opts.main) {
      // The main module of a program is wrapped in a `require` call, so that
      // its execution is triggered upon load.
      utils.merge(mopts, { define: 'require' });
    }
    if (transitive && self.main == mod) {
      // For top-level modules, the client will request the module with a notion
      // of what its identifier is.  In order to keep state consistent between
      // the client and server, that same identifier needs to be burned when
      // transporting the module.  By default, the module's absolute ID is
      // burned as that conforms to the majority of AMD resolution cases.
      // However, the following cases adjust for situations in which that
      // assumption does not hold.
      
      switch (mod.resolve.__algo) {
        case 'amd':
          // In practice, AMD identifiers differ when using common configuration
          // options, such as `packages`, which modify the path requested when
          // a module is required.
          //
          // For example:
          //   packages: [
          //     { name: 'util', main: 'util' }
          //   ]
          //   util -> util/util.js
          utils.merge(mopts, { moduleID: mod.id });
          break;
        case 'node':
          // In practice, Node identifiers differ when the main JavaScript file
          // resolves to an internal file inside a lib directory (referenced
          // through the `main` property of package.json).
          //
          // For example:
          //   junction -> junction/lib/index.js
          utils.merge(mopts, { moduleID: mod.id });
          break;
      }
    }
    
    js += mod.toAMD(mopts) + newline;
  });
  
  return js;
}

module.exports = Program;


function traverse(m, fn) {
  m.children.forEach(function(child) {
    traverse(child, fn);
  });
  fn(m);
}
