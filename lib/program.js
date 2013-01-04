var utils = require('./utils');

function Program(main) {
  this.main = main;
}

Program.prototype.toAMD = function(opts) {
  opts = opts || {}
  
  var js = ''
    , transitive = opts.transitive || false
    , newline = opts.newline = '\n';
    
  // Module IDs must be burned when transporting multiple modules in a single
  // script.
  if (transitive) { opts.burnID = true; }
  
  // Traverse the module tree, constructing AMD-compatible JavaScript.  If
  // the `transitive` option is disabled, the tree will consist of just a
  // single module.
  traverse(this.main, function(mod) {
    if (!mod.filename) { return; }
    
    var mopts = {};
    utils.merge(mopts, opts);
    if (mod.id == opts.main) {
      // The main module of a program is wrapped in a `require` call, so that
      // its execution is triggered upon load.
      utils.merge(mopts, { define: 'require' });
    }
    if (opts.transitive && !mod.parent) {
      // TODO: Move this toAMD(), `node` case.
    
      // If the module has no parent, burn the ID specified by the client in
      // order to keep state consistent between the client and server.
      //
      // In practice, the only time these would differ is when requesting a
      // top-level Node module in which the main JavaScript file resolves to
      // an internal file inside a lib directory (referenced through the
      // `main` property of package.json).
      utils.merge(mopts, { moduleID: mod.id });
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
