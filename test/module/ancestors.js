require('../../lib');

var expect = require('chai').expect;
var Modules = require('./fixtures/modules');

describe('Module#ancestors', function() {
	it('returns a list of modules included in self(including self)', function() {
		expect(Modules.ancestors).to.have.members([Modules]);
		expect(Modules.Basic.ancestors).to.have.members([Modules.Basic]);
		expect(Modules.Super.ancestors).to.have.members([Modules.Super, Modules.Basic]);
		expect(Modules.Parent.ancestors).to.have.members([Modules.Parent, SuperObject, Kernel, BasicObject]);
		expect(Modules.Child.ancestors).to.have.members([Modules.Child, Modules.Super, Modules.Basic, Modules.Parent, SuperObject, Kernel, BasicObject]);
	});

	it('returns only modules and classes', function() {
		expect(Modules.Child.metaclass.ancestors).to.include.members([
			Modules.Internal,
			Class,
			Module,
			SuperObject,
			Kernel,
			BasicObject
		]);
	});

	it('has 1 entry per module or class', function() {
		expect(Modules.Parent.ancestors).to.satisfy(function(arr) {
			for (var i = 0; i < arr.length; i++) {
				var count = 0;

				for (var j = 0; j < arr.length; j++) {
					if (arr[j] == arr[i]) {
						count++;
					}

					if (count > 1) {
						return false;
					}
				}
			}

			return true;
		});
	});

	describe('when called on a singleton class', function() {
		it('includes the singleton classes of ancestors', function() {
			var parent = new Class('Parent');
			var child = new Class('Child', parent);
			var schild = child.metaclass;

			expect(schild.ancestors).to.have.members([
				schild,
				parent.metaclass,
				SuperObject.metaclass,
				BasicObject.metaclass,
				Class,
				Module,
				SuperObject,
				Kernel,
				BasicObject
			]);
		});
	});
});

