
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
});

