var Module = require('../lib/module')
  , fs = require('fs');


describe('Module.toAMD() [Node : programs/increment]', function() {

  describe('program.js', function() {
    var m = new Module('program');

    before(function(done) {
      m.load(process.cwd() + '/test/data/node/programs/increment/program.js', { resolve: 'node' }, function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD({ define: 'require', baseDir: process.cwd() + '/test/data/node/programs/increment' });
        var expect = fs.readFileSync('test/expect/node/programs/increment/program.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
      })
    })
  }) // program.js
  
  describe('increment.js', function() {
    var m = new Module('node_modules/increment/index');

    before(function(done) {
      m.load(process.cwd() + '/test/data/node/programs/increment/node_modules/increment/index.js', { resolve: 'node' }, function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD({ baseDir: process.cwd() + '/test/data/node/programs/increment' });
        var expect = fs.readFileSync('test/expect/node/programs/increment/increment.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
      })
    })
  }) // increment.js
  
  describe('math.js', function() {
    var m = new Module('node_modules/increment/node_modules/math/lib/index');

    before(function(done) {
      m.load(process.cwd() + '/test/data/node/programs/increment/node_modules/increment/node_modules/math/lib/index.js', { resolve: 'node' }, function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD({ baseDir: process.cwd() + '/test/data/node/programs/increment' });
        var expect = fs.readFileSync('test/expect/node/programs/increment/math.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
      })
    })
  }) // math.js
  
});


describe('Module.toAMD() with burnID option [Node : programs/increment]', function() {

  describe('program.js', function() {
    var m = new Module('program');

    before(function(done) {
      m.load(process.cwd() + '/test/data/node/programs/increment/program.js', { resolve: 'node' }, function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('output', function() {
      it('should be AMD module', function() {
        // NOTE: Main module with a top-level `require()` will not have an ID
        //       burned into it.
        var out = m.toAMD({ define: 'require', burnID: true, baseDir: process.cwd() + '/test/data/node/programs/increment' });
        var expect = fs.readFileSync('test/expect/node/programs/increment/program.id.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
      })
    })
  }) // program.js
  
  describe('increment.js', function() {
    var m = new Module('node_modules/increment/index');

    before(function(done) {
      m.load(process.cwd() + '/test/data/node/programs/increment/node_modules/increment/index.js', {
          resolve: 'node',
          baseDir: process.cwd() + '/test/data/node/programs/increment'
        }, function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD({ burnID: true, baseDir: process.cwd() + '/test/data/node/programs/increment' });
        var expect = fs.readFileSync('test/expect/node/programs/increment/increment.id.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
      })
    })
  }) // increment.js
  
  describe('math.js', function() {
    var m = new Module('node_modules/increment/node_modules/math/lib/index');

    before(function(done) {
      m.load(process.cwd() + '/test/data/node/programs/increment/node_modules/increment/node_modules/math/lib/index.js', {
          resolve: 'node',
          baseDir: process.cwd() + '/test/data/node/programs/increment'
        }, function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD({ burnID: true, moduleID: 'math2', baseDir: process.cwd() + '/test/data/node/programs/increment' });
        var expect = fs.readFileSync('test/expect/node/programs/increment/math.id.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
      })
    })
  }) // math.js
  
});


describe('Module.toAMD() with flatten option [Node : programs/increment]', function() {
  
  describe('increment.js', function() {
    var m = new Module('node_modules/increment/index');

    before(function(done) {
      m.load(process.cwd() + '/test/data/node/programs/increment/node_modules/increment/index.js', {
          resolve: 'node',
          baseDir: process.cwd() + '/test/data/node/programs/increment'
        }, function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD({ flatten: true, baseDir: process.cwd() + '/test/data/node/programs/increment' });
        var expect = fs.readFileSync('test/expect/node/programs/increment/increment.flatten.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
      })
    })
  }) // increment.js
  
  describe('math.js', function() {
    var m = new Module('node_modules/increment/node_modules/math/lib/index');

    before(function(done) {
      m.load(process.cwd() + '/test/data/node/programs/increment/node_modules/increment/node_modules/math/lib/index.js', {
          resolve: 'node',
          xbaseDir: process.cwd() + '/test/data/node/programs/increment'
        }, function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD({ flatten: true, baseDir: process.cwd() + '/test/data/node/programs/increment' });
        var expect = fs.readFileSync('test/expect/node/programs/increment/math.flatten.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
      })
    })
  }) // math.js
  
});
