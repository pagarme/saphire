require('../../lib');

var expect = require('chai').expect;
var Modules = require('./fixtures/modules');

describe('Module#name', function() {
	it('is null for an anonymous module', function() {
		expect(new Module().name).to.be.null;
	});

	it('is set when created passing the name as argument in the constructor', function() {
		expect(Modules.name).to.be.equal('Modules');
	});
});

