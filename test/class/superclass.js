require('../../lib');

var expect = require('chai').expect;
var Classes = require('./fixtures/classes');

describe('Class#superclass', function() {
	it('returns the superclass of self', function() {
		expect(BasicObject.superclass).to.be.null;
		expect(SuperObject.superclass).to.be.equal(BasicObject);
		expect(new Class().superclass).to.be.equal(SuperObject);
	});

	describe('for a singleton class', function() {
		it('of a class returns the singleton class of its superclass', function() {
			expect(Classes.H.metaclass.superclass).to.be.equal(Classes.A.metaclass);
		});
	});
});

