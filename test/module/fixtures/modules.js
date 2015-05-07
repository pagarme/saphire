
module.exports = new Module('Modules', function() {
	var Modules = this;

	this.Subclass = new Class('Subclass', Module);

	this.Parent = new Class('Parent');

	this.Basic = new Module('Basic');

	this.Super = new Module('Super', function() {
		this.include(Modules.Basic);
	});

	this.Internal = new Module('Internal');

	this.Child = new Class('Child', this.Parent, function() {
		this.include(Modules.Super);
		this.metaclass.include(Modules.Internal);
	});

	this.CyclicAppendA = new Module('CyclicAppendA');

	this.CyclicAppendB = new Module('CyclicAppendB', function() {
		this.include(Modules.CyclicAppendA);
	});

	this.MA = new Module('MA');

	this.MB = new Module('MB', function() {
		this.include(Modules.MA);
	});

	this.MC = new Module('MC');
	
	this.MultipleIncludes = new Module('MultipleIncludes', function() {
		this.include(Modules.MB);
	});

	this.M1 = new Module('M1');

	this.M2 = new Module('M2');

	this.Subclass = new Class('Subclass', Module);

	this.A = new Module('A', function() {
		this.$.ma = function(){};
		this.metaclass.$.cma = function(){};
	});

	this.B = new Module('B', function() {
		this.include(Modules.A);

		this.$.mb = function(){};
		this.metaclass.$.cmb = function(){};
	});

	this.C = new Module('C', function() {
		this.include(Modules.B);
	});
});

