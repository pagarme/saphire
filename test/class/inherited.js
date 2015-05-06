require('../../lib');

var expect = require('chai').expect;
var Classes = require('./fixtures/classes');

describe('Class.inherited', function() {
	beforeEach(function() {
		Classes.Record.called = null;
	});

	it('is invoked with the child Class when self is subclasses', function() {
		var childClass = null;

		var top = new Class('Top', function() {
			this.metaclass.$.inherited = function(cls) {
				childClass = cls;
			};
		});

		var child = new Class('Child', top);
		expect(childClass).to.be.equal(child);
		
		var otherChild = new Class('OtherChild', top);
		expect(childClass).to.be.equal(otherChild);
	});

	it('is invoked only once per subclass', function() {
		expect(Classes.Inherited.A.subclasses).eql([
			[Classes.Inherited.A, Classes.Inherited.B],
			[Classes.Inherited.B, Classes.Inherited.C]
		]);
	});

	it('is called by super from a method provided by an included module', function() {
		expect(Classes.Record.called).to.be.null;

		var E = new Class('E', Classes.F);

		expect(Classes.Record.called).to.be.equal(E);
	});
});

