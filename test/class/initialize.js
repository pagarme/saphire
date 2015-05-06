require('../../lib');

var expect = require('chai').expect;

describe('Class#initialize', function() {
	it('throw a TypeError when called on already initialized class', function() {
		expect(function() {
			StandardError.initialize();
		}).to.throw(TypeError);
	});

	describe('when given the Class', function() {
		var uninitialized;

		beforeEach(function() {
			uninitialized = Class.allocate();
		});

		it('throw a TypeError', function() {
			expect(function() {
				uninitialized.initialize(Class);
			}).to.throw(TypeError);
		});
	});
});

