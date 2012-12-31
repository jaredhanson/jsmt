var Module = require('../lib/module');

describe('Module', function() {
  
  describe('constructor with id', function() {
    var m = new Module('foo');
    
    it('should have correct id', function() {
      m.id.should.equal('foo');
    })
    it('should not have a parent', function() {
      m.should.not.have.property('parent')
    })
    it('should not have children', function() {
      m.children.should.have.length(0)
    })
    it('should not be loaded', function() {
      m.loaded.should.be.false;
    })
    it('should not have format', function() {
      m.should.not.have.property('format')
    })
  })
  
})
