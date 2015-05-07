require('../../lib');

var expect = require('chai').expect;
var Modules = require('./fixtures/modules');

describe('Module#appendFeatures', function() {
	describe('on Class', function() {
		it('is undefined', function() {
			expect(new Class().appendFeatures).to.not.be.ok;
		});
	});

	it('gets called when self is included in another module/class', function() {
		var appended = false;

		var m = new Module(function() {
			this.metaclass.$.appendFeatures = function() {
				appended = true;
			};
		});
		
		var c = new Class(function() {
			this.include(m);
		});

		expect(appended).to.be.true;
	});

	it('raises ArgumentError on a cyclic include', function() {
		expect(function() {
			Modules.CyclicAppendA.appendFeatures(Modules.CyclicAppendA);
		}).to.throw(ArgumentError);

		expect(function() {
			Modules.CyclicAppendB.appendFeatures(Modules.CyclicAppendA);
		}).to.throw(ArgumentError);
	});
});

