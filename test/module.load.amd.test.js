var Module = require('../lib/module')
  , should = require('should')


describe('Module.load() [AMD]', function() {

  describe('object literal', function() {
    var m = new Module('test/data/amd/modules/object-literal');

    before(function(done) {
      m.load('test/data/amd/modules/object-literal.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('result', function() {
      it('should be AMD format', function() {
        m.format.should.be.equal('amd');
      })
      it('should have correct dependencies', function() {
        m.requires.should.have.length(0);
      })
    })
  }) // object literal
  
  describe('factory without dependences', function() {
    var m = new Module('test/data/amd/modules/factory-without-dependencies');

    before(function(done) {
      m.load('test/data/amd/modules/factory-without-dependencies.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('result', function() {
      it('should be AMD format', function() {
        m.format.should.be.equal('amd');
      })
      it('should have correct dependencies', function() {
        m.requires.should.have.length(0);
      })
    })
  }) // factory without dependences
  
  describe('factory with dependences', function() {
    var m = new Module('test/data/amd/modules/factory-with-dependencies');

    before(function(done) {
      m.load('test/data/amd/modules/factory-with-dependencies.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('result', function() {
      it('should be AMD format', function() {
        m.format.should.be.equal('amd');
      })
      it('should have correct dependencies', function() {
        m.requires.should.have.length(2);
        m.requires[0].should.equal('./cart');
        m.requires[1].should.equal('./inventory');
      })
    })
  }) // factory with dependences
  
  describe('CommonJS wrapping', function() {
    var m = new Module('test/data/amd/modules/commonjs-wrapping');

    before(function(done) {
      m.load('test/data/amd/modules/commonjs-wrapping.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('result', function() {
      it('should be AMD format', function() {
        m.format.should.be.equal('amd');
      })
      it('should have correct dependencies', function() {
        m.requires.should.have.length(5);
        m.requires[0].should.equal('require');
        m.requires[1].should.equal('exports');
        m.requires[2].should.equal('module');
        m.requires[3].should.equal('a');
        m.requires[4].should.equal('b');
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

    describe('result', function() {
      it('should be AMD format', function() {
        m.format.should.be.equal('amd');
      })
      it('should have correct dependencies', function() {
        m.requires.should.have.length(2);
        m.requires[0].should.equal('require');
        m.requires[1].should.equal('./relative/name');
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

    describe('result', function() {
      it('should be AMD format', function() {
        m.format.should.be.equal('amd');
      })
      it('should have correct dependencies', function() {
        m.requires.should.have.length(3);
        m.requires[0].should.equal('require');
        m.requires[1].should.equal('a');
        m.requires[2].should.equal('b');
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

    describe('result', function() {
      it('should be AMD format', function() {
        m.format.should.be.equal('amd');
      })
      it('should have correct dependencies', function() {
        m.requires.should.have.length(0);
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

    describe('result', function() {
      it('should be AMD format', function() {
        m.format.should.be.equal('amd');
      })
      it('should have correct dependencies', function() {
        m.requires.should.have.length(0);
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

    describe('result', function() {
      it('should be AMD format', function() {
        m.format.should.be.equal('amd');
      })
      it('should have correct dependencies', function() {
        m.requires.should.have.length(2);
        m.requires[0].should.equal('my/cart');
        m.requires[1].should.equal('my/inventory');
      })
    })
  }) // named factory with dependences

});

describe('Module.load() [AMD : programs/increment]', function() {

  describe('program.js', function() {
    var m = new Module('test/data/amd/programs/increment/program');

    before(function(done) {
      m.load('test/data/amd/programs/increment/program.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('result', function() {
      it('should be AMD format', function() {
        m.format.should.be.equal('amd');
      })
      it('should have correct dependencies', function() {
        m.requires.should.have.length(1);
        m.requires[0].should.equal('increment');
      })
    })
  }) // program.js
  
  describe('increment.js', function() {
    var m = new Module('test/data/amd/programs/increment/increment');

    before(function(done) {
      m.load('test/data/amd/programs/increment/increment.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('result', function() {
      it('should be AMD format', function() {
        m.format.should.be.equal('amd');
      })
      it('should have correct dependencies', function() {
        m.requires.should.have.length(1);
        m.requires[0].should.equal('math');
      })
    })
  }) // increment.js
  
  describe('math.js', function() {
    var m = new Module('test/data/amd/programs/increment/math');

    before(function(done) {
      m.load('test/data/amd/programs/increment/math.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('result', function() {
      it('should be AMD format', function() {
        m.format.should.be.equal('amd');
      })
      it('should have correct dependencies', function() {
        m.requires.should.have.length(0);
      })
    })
  }) // math.js

});
