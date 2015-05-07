require('../../lib');

var expect = require('chai').expect;

describe('Module.allocate', function() {
	it('returns an instance of Module', function() {
		expect(Module.allocate().instanceOf(Module)).to.be.true;
	});

	it('returns a fully-formed instance of module', function() {
		var klass = Module.allocate();

		expect(klass).to.have.property('prototype');
		expect(klass).to.have.property('$');
	});
});

