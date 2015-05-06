
exports.Record = new Class('Record', function() {
	this.called = null;
});

exports.M = new Module('M', function() {
	this.$.inherited = function(base) {
		exports.Record.called = base;
		$super(base);
	};
});

exports.F = new Class('F', function() {
	this.metaclass.include(exports.M);
});

exports.A = new Class('A', function() {
	this.$.inherited = function(base) {
		exports.Record.called = base;
		$super(base);
	};
});

exports.H = new Class('H', exports.A, function() {
	this.$.inherited = function(base) {
		$super(base);
	};
});

exports.Inherited = new Module('Inherited', function() {
	this.A = new Class('A', function() {
		var A = this;

		this.subclasses = [];

		this.metaclass.$.inherited = function(base) {
			A.subclasses.push([this, base]);
			$super(base);
		};
	});

	this.B = new Class('B', this.A);
	this.C = new Class('C', this.B);
});

