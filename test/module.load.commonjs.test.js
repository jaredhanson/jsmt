var Module = require('../lib/module');


describe('Module.load() [CommonJS : programs/increment]', function() {

  describe('program.js', function() {
    var m = new Module('test/data/commonjs/programs/increment/program');

    before(function(done) {
      m.load('test/data/commonjs/programs/increment/program.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('result', function() {
      it('should be CommonJS format', function() {
        m.format.should.be.equal('commonjs');
      })
      it('should have correct dependencies', function() {
        m.requires.should.have.length(1);
        m.requires[0].should.equal('increment');
      })
    })
  }) // program.js
  
  describe('increment.js', function() {
    var m = new Module('test/data/commonjs/programs/increment/increment');

    before(function(done) {
      m.load('test/data/commonjs/programs/increment/increment.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('result', function() {
      it('should be CommonJS format', function() {
        m.format.should.be.equal('commonjs');
      })
      it('should have correct dependencies', function() {
        m.requires.should.have.length(1);
        m.requires[0].should.equal('math');
      })
    })
  }) // increment.js
  
  describe('math.js', function() {
    var m = new Module('test/data/commonjs/programs/increment/math');

    before(function(done) {
      m.load('test/data/commonjs/programs/increment/math.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('result', function() {
      it('should be CommonJS format', function() {
        m.format.should.be.equal('commonjs');
      })
      it('should have correct dependencies', function() {
        m.requires.should.have.length(0);
      })
    })
  }) // math.js

});
