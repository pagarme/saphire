require('../../lib');

var expect = require('chai').expect;
var Modules = require('./fixtures/modules');

describe('Module#included', function() {
	it('is invoked when self is included in another module or class', function() {
		var includedBy = null;

		var m = new Module(function() {
			this.metaclass.$.included = function(o) {
				includedBy = o;
			};
		});

		var c = new Class(function() {
			this.include(m);
		});

		expect(includedBy).to.be.equal(c);
	});

	it('allow extending self with the object into which it is being included', function() {
		var m = new Module(function() {
			this.metaclass.$.included = function(o) {
				o.extend(this);
			};

			this.defineGetter('test', function() {
				return 'passed';
			});
		});

		var c = new Class(function() {
			this.include(m);
		});

		expect(c.test).to.be.equal('passed');
	});
});

