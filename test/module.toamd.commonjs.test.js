var Module = require('../lib/module')
  , fs = require('fs');


describe('Module.toAMD() [CommonJS : programs/increment]', function() {

  describe('program.js', function() {
    var m = new Module('test/data/commonjs/programs/increment/program');

    before(function(done) {
      m.load('test/data/commonjs/programs/increment/program.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD({ define: 'require' });
        var expect = fs.readFileSync('test/expect/commonjs/programs/increment/program.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
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

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD();
        var expect = fs.readFileSync('test/expect/commonjs/programs/increment/increment.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
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

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD();
        var expect = fs.readFileSync('test/expect/commonjs/programs/increment/math.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
      })
    })
  }) // math.js

});

describe('Module.toAMD() with burnID option [CommonJS : programs/increment]', function() {

  describe('program.js', function() {
    var m = new Module('test/data/commonjs/programs/increment/program');

    before(function(done) {
      m.load('test/data/commonjs/programs/increment/program.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('output', function() {
      it('should be AMD module', function() {
        // NOTE: Main module with a top-level `require()` will not have an ID
        //       burned into it.
        var out = m.toAMD({ define: 'require', burnID: true });
        var expect = fs.readFileSync('test/expect/commonjs/programs/increment/program.id.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
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

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD({ burnID: true });
        var expect = fs.readFileSync('test/expect/commonjs/programs/increment/increment.id.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
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

    describe('output', function() {
      it('should be AMD module', function() {
        var out = m.toAMD({ burnID: true });
        var expect = fs.readFileSync('test/expect/commonjs/programs/increment/math.id.expect.js', 'utf8')
        //console.log('out: ' + out);
        //console.log('expect: ' + expect);
        out.should.equal(expect);
      })
    })
  }) // math.js

});

