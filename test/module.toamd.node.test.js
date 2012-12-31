var Module = require('../lib/module')
  , fs = require('fs');


describe('Module.toAMD() [Node : programs/increment]', function() {

  describe('program.js', function() {
    var m = new Module('test/data/node/programs/increment/program');

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
  
});
