require('../../lib');

var _ = require('lodash');
var expect = require('chai').expect;
var Modules = require('./fixtures/modules');

describe('Module#include', function() {
	it('calls #appendFeatures(this) in reversed order on each module', function() {
		var appendedModules = [];

		var m = new Module(function() {
			this.metaclass.$.appendFeatures = function(mod) {
				appendedModules.push([this, mod]);
			};
		});

		var m2 = new Module(function() {
			this.metaclass.$.appendFeatures = function(mod) {
				appendedModules.push([this, mod]);
			};
		});

		var m3 = new Module(function() {
			this.metaclass.$.appendFeatures = function(mod) {
				appendedModules.push([this, mod]);
			};
		});

		var c = new Class(function() {
			this.include(m, m2, m3);
		});

		expect(appendedModules).to.be.eql([ [m3, c], [m2, c], [m, c] ]);
	});

	it('adds all ancestors modules when a previously included module is included again', function() {
		expect(Modules.MultipleIncludes.ancestors).to.include.members([Modules.MA, Modules.MB]);
		
		Modules.MB.include(Modules.MC);
		Modules.MultipleIncludes.include(Modules.MB);

		expect(Modules.MultipleIncludes.ancestors).to.include.members([Modules.MA, Modules.MB, Modules.MC]);
	});

	it('throws a TypeError when the argument is not a Module', function() {
		expect(function() {
			Modules.Basic.include(new Class());
		}).to.throw(TypeError);
	});

	it('does not throws a TypeError when the argument is a instance of a subclass of Module', function() {
		expect(function() {
			Modules.Basic.include(new Modules.Subclass());
		}).to.not.throw(TypeError);
	});

	it('imports instance methods to modules and classes', function() {
		expect(Modules.A.prototype).to.have.property('ma');
		expect(Modules.B.prototype).to.have.property('ma');
		expect(Modules.B.prototype).to.have.property('mb');
		expect(Modules.C.prototype).to.have.property('ma');
		expect(Modules.C.prototype).to.have.property('mb');
	});

	it('does not import methods to modules and classes', function() {
		expect(Modules.A).to.have.property('cma');
		expect(Modules.B).to.not.have.property('cma');
		expect(Modules.B).to.have.property('cmb');
		expect(Modules.C).to.not.have.property('cma');
		expect(Modules.C).to.not.have.property('cmb');
	});

	it('attaches the module as the caller\'s immediate ancestor', function() {
		var top = new Module(function() {
			this.defineGetter('value', function() {
				return 5;
			});
		});

		var middle = new Module(function() {
			this.include(top);

			this.defineGetter('value', function() {
				return 6;
			});
		});

		var klass = new Class(function() {
			this.include(middle);
		});

		expect(new klass().value).to.be.equal(6);
	});

	it('doesn\'t include module if it is included in a super class', function() {
		new Module(function() {
			var M = new Module('M');

			var A = new Class('A', function() {
				this.include(M);
			});

			var B = new Class('B', A, function() {
				this.include(M);
			});

			var all = [A, B, M];
			var order = _.intersection(B.ancestors, all);

			expect(_.intersection(B.ancestors, all)).to.have.members([B, A, M]);
		});
	});

	it('recursively includes new mixins', function() {
		new Module('M1', function() {
			var U = new Module('U');
			var V = new Module('V');
			var X = new Module('X');
			var W = new Module('W');
			var Y = new Module('Y');

			var A = new Class('A', function() {
				this.include(X);
			});

			var B = new Class('B', A, function() {
				this.include(U, V, W);
			});

			V.include(X, U, Y);

			var anc = B.ancestors;

			[B, U, V, W, A, X].forEach(function(i) {
				expect(anc).to.include(i);
			});

			expect(anc).to.not.include(Y);

			B.include(V);

			var anc = B.ancestors;

			[B, U, Y, V, W, A, X].forEach(function(i) {
				expect(anc).to.include(i);
			});
		});
	});

	it('preserves ancestors order', function() {
		new Module('M2', function() {
			var M1 = new Module('M1');
			var M2 = new Module('M2');
			var M3 = new Module('M3');

			M3.include(M2);
			M2.include(M1);
			M3.include(M2);

			var anc = M3.ancestors;

			expect(anc[0]).to.be.equal(M3);
			expect(anc[1]).to.be.equal(M2);
			expect(anc[2]).to.be.equal(M1);
		});
	});

	it('detects cyclic includes', function() {
		var M = new Module('M');

		expect(function() {
			M.include(M);
		}).to.throw(ArgumentError);
	});

	it('accepts no-arguments', function() {
		expect(function() {
			new Module().include();
		}).to.not.throw();
	});

	it('ignores modules it has already included via module mutual inclusion', function() {
		new Module('AlreadyIncluded', function() {
			var M0 = new Module('M0');
			var M = new Module('M');

			M.include(M0);

			var K = new Class('K');

			K.include(M);
			K.include(M);

			var anc = K.ancestors;

			expect(anc[0]).to.be.equal(K);
			expect(anc[1]).to.be.equal(M);
			expect(anc[2]).to.be.equal(M0);
		});
	});
});

