var Module = require('../lib/module')
  , fs = require('fs')
  , should = require('should')


describe('Module.toAMD() [AMD]', function() {

  describe('object literal', function() {
    var m = new Module('test/data/amd/modules/object-literal');

    before(function(done) {
      m.load('test/data/amd/modules/object-literal.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD();
        var expect = fs.readFileSync('test/expect/amd/modules/object-literal.expect.js', 'utf8')
        //console.log(out);
        //console.log(expect);
        out.should.equal(expect);
      })
    })
  }) // object literal
  
  describe('factory without dependencies', function() {
    var m = new Module('test/data/amd/modules/factory-without-dependencies');

    before(function(done) {
      m.load('test/data/amd/modules/factory-without-dependencies.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD();
        var expect = fs.readFileSync('test/expect/amd/modules/factory-without-dependencies.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
      })
    })
  }) // factory without dependencies
  
  describe('factory with dependencies', function() {
    var m = new Module('test/data/amd/modules/factory-with-dependencies');

    before(function(done) {
      m.load('test/data/amd/modules/factory-with-dependencies.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD();
        var expect = fs.readFileSync('test/expect/amd/modules/factory-with-dependencies.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
      })
    })
  }) // factory with dependencies
  
  describe('CommonJS wrapping', function() {
    var m = new Module('test/data/amd/modules/commonjs-wrapping');

    before(function(done) {
      m.load('test/data/amd/modules/commonjs-wrapping.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD();
        var expect = fs.readFileSync('test/expect/amd/modules/commonjs-wrapping.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
      })
    })
  }) // CommonJS wrapping
  
  describe('internal require', function() {
    var m = new Module('test/data/amd/modules/internal-require');

    before(function(done) {
      m.load('test/data/amd/modules/internal-require.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD();
        var expect = fs.readFileSync('test/expect/amd/modules/internal-require.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
      })
    })
  }) // internal require
  
  describe('internal require callback', function() {
    var m = new Module('test/data/amd/modules/internal-require-callback');

    before(function(done) {
      m.load('test/data/amd/modules/internal-require-callback.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD();
        var expect = fs.readFileSync('test/expect/amd/modules/internal-require-callback.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
      })
    })
  }) // internal require callback
  
  describe('named object literal', function() {
    var m = new Module('test/data/amd/modules/named-object-literal');

    before(function(done) {
      m.load('test/data/amd/modules/named-object-literal.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD();
        var expect = fs.readFileSync('test/expect/amd/modules/named-object-literal.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
      })
    })
  }) // named object literal
  
  describe('named factory without dependences', function() {
    var m = new Module('test/data/amd/modules/named-factory-without-dependencies');

    before(function(done) {
      m.load('test/data/amd/modules/named-factory-without-dependencies.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD();
        var expect = fs.readFileSync('test/expect/amd/modules/named-factory-without-dependencies.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
      })
    })
  }) // named factory without dependences
  
  describe('named factory with dependences', function() {
    var m = new Module('test/data/amd/modules/named-factory-with-dependencies');

    before(function(done) {
      m.load('test/data/amd/modules/named-factory-with-dependencies.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD();
        var expect = fs.readFileSync('test/expect/amd/modules/named-factory-with-dependencies.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
      })
    })
  }) // named factory with dependences

});


describe('Module.toAMD() with burnID option [AMD]', function() {

  describe('factory with dependencies', function() {
    var m = new Module('test/data/amd/modules/factory-with-dependencies');

    before(function(done) {
      m.load('test/data/amd/modules/factory-with-dependencies.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD({ burnID: true });
        var expect = fs.readFileSync('test/expect/amd/modules/factory-with-dependencies.id.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
      })
    })
  }) // factory with dependencies
  
});
