var modules = require('../lib/middleware/modules')
  , fs = require('fs');


function MockRequest() {
}

function MockResponse(done) {
  this.headers = {};
  this._done = done;
}

MockResponse.prototype.setHeader = function(name, value) {
  this.headers[name] = value;
}

MockResponse.prototype.end = function(data) {
  this.data = data;
  this._done();
}


describe('modules middleware [Node]', function() {

  describe('serving increment program', function() {
    var middleware = modules(__dirname + '/data/node/programs/increment', { resolve: 'node' });
  
    it('should serve increment module', function(done) {
      var req = new MockRequest();
      var res = new MockResponse(check);
      
      req.path = '/node_modules/increment/index.js';
      middleware(req, res, function(err) {
        check(err);
      });
      
      function check(err) {
        if (err) { return done(err); }
        res.headers.should.have.property('Content-Type');
        res.headers['Content-Type'].should.equal('text/javascript');
        
        var expect = fs.readFileSync('test/expect/node/programs/increment/increment.expect.js', 'utf8')
        //console.log('data: ' + res.data);
        //console.log('expect: ' + expect);
        res.data.should.equal(expect + '\r\n');
        
        done();
      }
    });
  
  });
  
});
