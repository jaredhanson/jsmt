var Module = require('../lib/module')
  , should = require('should')


describe('Module.load() [UMD]', function() {

  describe('amdWeb', function() {
    var m = new Module('test/data/umd/modules/amdWeb');

    before(function(done) {
      m.load('test/data/umd/modules/amdWeb.js', function(err) {
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
        m.requires[0].should.equal('b');
      })
    })
  }) // amdWeb
  
  describe('amdWebGlobal', function() {
    var m = new Module('test/data/umd/modules/amdWebGlobal');

    before(function(done) {
      m.load('test/data/umd/modules/amdWebGlobal.js', function(err) {
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
        m.requires[0].should.equal('b');
      })
    })
  }) // amdWebGlobal
  
  describe('returnExports', function() {
    var m = new Module('test/data/umd/modules/returnExports');

    before(function(done) {
      m.load('test/data/umd/modules/returnExports.js', function(err) {
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
        m.requires[0].should.equal('b');
      })
    })
  }) // returnExports
  
  describe('returnExportsGlobal', function() {
    var m = new Module('test/data/umd/modules/returnExportsGlobal');

    before(function(done) {
      m.load('test/data/umd/modules/returnExportsGlobal.js', function(err) {
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
        m.requires[0].should.equal('b');
      })
    })
  }) // returnExportsGlobal
  
  describe('commonjsStrict', function() {
    var m = new Module('test/data/umd/modules/commonjsStrict');

    before(function(done) {
      m.load('test/data/umd/modules/commonjsStrict.js', function(err) {
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
        m.requires[0].should.equal('exports');
        m.requires[1].should.equal('b');
      })
    })
  }) // commonjsStrict
  
  describe('commonjsStrictGlobal', function() {
    var m = new Module('test/data/umd/modules/commonjsStrictGlobal');

    before(function(done) {
      m.load('test/data/umd/modules/commonjsStrictGlobal.js', function(err) {
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
        m.requires[0].should.equal('exports');
        m.requires[1].should.equal('b');
      })
    })
  }) // commonjsStrictGlobal
  
  describe('nodeAdapter', function() {
    var m = new Module('test/data/umd/modules/nodeAdapter');

    before(function(done) {
      m.load('test/data/umd/modules/nodeAdapter.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('result', function() {
      it('should be AMD format', function() {
        m.format.should.be.equal('amd');
      })
      it('should have correct dependencies', function() {
        m.requires.should.have.length(4);
        m.requires[0].should.equal('require');
        m.requires[1].should.equal('exports');
        m.requires[2].should.equal('module');
        m.requires[3].should.equal('b');
      })
    })
  }) // nodeAdapter
  
  describe('commonjsAdapter', function() {
    var m = new Module('test/data/umd/modules/commonjsAdapter');

    before(function(done) {
      m.load('test/data/umd/modules/commonjsAdapter.js', function(err) {
        if (err) return done(err);
        return done();
      });
    })

    describe('result', function() {
      it('should be AMD format', function() {
        m.format.should.be.equal('amd');
      })
      it('should have correct dependencies', function() {
        m.requires.should.have.length(4);
        m.requires[0].should.equal('require');
        m.requires[1].should.equal('exports');
        m.requires[2].should.equal('module');
        m.requires[3].should.equal('b');
      })
    })
  }) // commonjsAdapter
  
  describe('jqueryPlugin', function() {
    var m = new Module('test/data/umd/modules/jqueryPlugin');

    before(function(done) {
      m.load('test/data/umd/modules/jqueryPlugin.js', function(err) {
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
        m.requires[0].should.equal('jquery');
      })
    })
  }) // jqueryPlugin
  
  describe('jqueryPluginCommonjs', function() {
    var m = new Module('test/data/umd/modules/jqueryPluginCommonjs');

    before(function(done) {
      m.load('test/data/umd/modules/jqueryPluginCommonjs.js', function(err) {
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
        m.requires[0].should.equal('jquery');
      })
    })
  }) // jqueryPluginCommonjs
    
});
