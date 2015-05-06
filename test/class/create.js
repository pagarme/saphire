require('../../lib');

var expect = require('chai').expect;
var Classes = require('./fixtures/classes');

describe('Class.new', function() {
	it('uses passed function as body', function() {
		var klass = new Class(function() {
			this.metaclass.defineGetter('text', function() {
				return 'text';
			});

			this.defineGetter('message', function() {
				return 'message';
			});
		});

		expect(klass.text).to.be.equal('text');
		expect(new klass().message).to.be.equal('message');
	});

	it('creates a subclass of the given superclass', function() {
		var sc = new Class(function() {
			this._body = this;

			this.metaclass.defineGetter('body', function() {
				return this._body;
			});

			this.defineGetter('message', function() {
				return 'message';
			});
		});

		var klass = new Class(sc, function() {
			this._body = this;

			this.metaclass.defineGetter('body', function() {
				return this._body;
			});

			this.defineGetter('message2', function() {
				return 'hello';
			});
		});

		expect(sc.body).to.be.equal(sc);
		expect(klass.body).to.be.equal(klass);
		expect(klass.superclass).to.be.equal(sc);
		expect(new klass().message).to.be.equal('message');
		expect(new klass().message2).to.be.equal('hello');
	});
});

