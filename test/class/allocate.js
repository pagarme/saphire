require('../../lib');

var expect = require('chai').expect;

describe('Class#allocate', function() {
	it('return an instance of self', function() {
		var klass = new Class();

		expect(klass.allocate().instanceOf(klass)).to.be.true;
	});

	it('return a fully-formated instance of Module', function() {
		var klass = Class.allocate();

		expect(klass).to.have.property('prototype');
		expect(klass).to.have.property('$');
	});

	it('throws an exception when calling a method on a new instance', function() {
		var klass = Class.allocate();

		expect(function() {
			klass.create();
		}).to.throw();
	});

	it('does not call initialize on the new instance', function() {
		var klass = new Class(function() {
			this.$.initialize = function() {
				this.initialized = true;
			};
		});

		expect(klass.allocate().initialized).to.not.be.false;
	});

	it('throws TypeError for #superclass', function() {
		var klass = Class.allocate();

		expect(function() {
			klass.superclass;
		}).to.throw();
	});
});


