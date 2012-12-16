var utils = require('../utils')
  , traverse = utils.traverse
  , isRequire = utils.isRequire
  , isDefine = utils.isDefine;

// TODO: Parse AMD "main" modules that have top-level require

module.exports = function() {

  return function(mod) {
    mod.format = 'commonjs';   // assume commonjs until parsing disconfirms
    mod.dependencies = [];
    mod.requires = mod.dependencies;
  
    var requires = [];
    traverse(mod.ast, function(node) {
      // TODO: Ensure that calls to `require` or `define` are bound to free
      //       variables, rather than a locally-defined function of the same
      //       name.
      // TODO: For modules in AMD format, warn if calls to `define` are nested.
      // TODO: For modules in AMD format, that are not using CommonJS wrapping,
      //       warn if they `require` a module that is not listed as a
      //       dependency.
      // TODO: Implement filters that can strip UMD boilerplate when
      //       transforming to AMD.
    
      if (isRequire(node)) {
        if (node.arguments.length == 1 && node.arguments[0].type === 'Literal') {
          // This is the standard form of `require`, as defined by CommonJS,
          // which accepts a module identifier as its single argument.  The
          // required module is a dependency of this module.
          //
          // For further details as to the format, consult the specifications:
          //   http://www.commonjs.org/specs/modules/1.0/
          //   http://wiki.commonjs.org/wiki/Modules/1.1
          //   http://wiki.commonjs.org/wiki/Modules/1.1.1
          //
          // Note also that Node.js modules, while not strictly adhering to the
          // CommonJS specification, are similar enough that they can be treated
          // as such (the biggest excpetion being the resolution algorithm).
          //
          // For further details as to the implementation, consult the API
          // documentation:
          //   http://nodejs.org/api/modules.html
          //   http://nodejs.org/api/globals.html#globals_require
          if (requires.indexOf(node.arguments[0].value) == -1) {
            requires.push(node.arguments[0].value);
          }
        } else if (node.arguments.length == 2 && node.arguments[0].type === 'ArrayExpression') {
          // This is the callback-based `require`, as defined by the AMD API.
          // This form allows dependencies to be loaded asynchronously, and is
          // typically used when dynamically calculating dependencies (in which
          // case the arguments will be non-literal).
          //
          // For further details as to the API, consult the documentation:
          //   https://github.com/amdjs/amdjs-api/wiki/require
          //   http://requirejs.org/docs/whyamd.html#commonjscompat
          mod.format = 'amd';
          
          var elements = node.arguments[0].elements
            , i
            , len;
        
          for (i = 0, len = elements.length; i < len; i++) {
            if (elements[i].type === 'Literal' && requires.indexOf(elements[i].value) == -1) {
              requires.push(elements[i].value);
            }
          }
        }
      
        // TODO: In cases that involve conditional, non-literal calculation of
        //       a module ID, there may be incompatibilities in translating
        //       CommonJS modules to AMD.  The callback-require form can be used
        //       to handle these cases, and automatic code transforms that can
        //       make use of this without changing logic should be investigated.
        //
        //       For details:
        //         http://requirejs.org/docs/whyamd.html#commonjscompat
        //         https://github.com/amdjs/amdjs-api/wiki/require
      
      } else if (isDefine(node)) {
        mod.format = 'amd';
      
        var elements = []
          , i
          , len;
        if (node.arguments.length == 1 && node.arguments[0].type === 'FunctionExpression') {
          // This is the simplified CommonJS wrapping defined by the AMD API, in
          // which dependencies are ommited but the factory function accepts
          // arguments.  The dependencies in this case default to ["require",
          // "exports", "module"], in that order.
          switch (node.arguments[0].params.length) {
            case 3:
              mod.dependencies.push('require');
              mod.dependencies.push('exports');
              mod.dependencies.push('module');
              break;
            case 2:
              // TODO: Implement test case for this
              mod.dependencies.push('require');
              mod.dependencies.push('exports');
              break;
            case 1:
              // TODO: Implement test case for this
              mod.dependencies.push('require');
              break;
          }
        } else if (node.arguments.length == 2 && node.arguments[0].type === 'ArrayExpression') {
          // This is the typical way to define a module with dependencies using
          // the AMD API.  The first argument is an array of module identifiers
          // which are dependencies of the module being defined.
          elements = node.arguments[0].elements;
        } else if (node.arguments.length == 3 && node.arguments[1].type === 'ArrayExpression') {
          // This is a named module with dependencies.  These typically occur as
          // a result of optimization, although in certain circumstances modules
          // may be explicitly named in code during development.
          elements = node.arguments[1].elements;
        }
      
        for (i = 0, len = elements.length; i < len; i++) {
          if (elements[i].type === 'Literal') {
            mod.dependencies.push(elements[i].value);
          }
        }
      }
    });
  
    for (var i = 0, len = requires.length; i < len; i++) {
      if (mod.dependencies.indexOf(requires[i]) == -1) {
        mod.dependencies.push(requires[i]);
      }
    }
  }
}
