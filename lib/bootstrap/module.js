var Helpers = require('../helpers');
var Builtin = require('../builtin');
var Type = require('../type');

Module.$.initialize = function(name, fn) {
	if (!fn && (name instanceof Function)) {
		fn = name;
		name = undefined;
	}

	Builtin(this).name = name;

	if (fn) {
		fn.apply(this);
	}
};

Module.$.include = function() {
	var modules = Array.prototype.slice.call(arguments);

	for (var i = modules.length - 1; i >= 0; i--) {
		modules[i].appendFeatures(this);
		modules[i].included(this);
	}
};

Module.$.extend = function() {
	var modules = Array.prototype.slice.call(arguments);

	for (var i = modules.length - 1; i >= 0; i--) {
		modules[i].appendFeatures(this.metaclass);
		modules[i].extended(this);
	}
};

Module.$.appendFeatures = function(klass) {
	Type.includeModulesFrom(this, klass);

	return this;
};

Helpers.defineGetter(Module.$, 'ancestors', function() {
	var ancestors = [];
	var klass = this;

	do {
		if (klass.kindOf(IncludedModule)) {
			ancestors.push(klass.module);
		} else {
			ancestors.push(klass);
		}

		klass = klass.directSuperclass;
	} while(klass);

	return ancestors;
});

Module.$.defineMethod = function(name, fn) {
	Object.defineProperty(this.$, name, {
		enumerable: false,
		configurable: true,
		value: fn
	});
};

Module.$.defineGetter = function(name, fn) {
	Helpers.defineGetter(this.$, name, fn);
};

Module.$.defineSetter = function(name, fn) {
	Helpers.defineSetter(this.$, name, fn);
};

Module.$.defineProperty = function(name, get, set) {
	Helpers.defineGetter(this.$, name, get);
	Helpers.defineSetter(this.$, name, set);
};

Module.$.toString = function() {
	return this.name;
};

