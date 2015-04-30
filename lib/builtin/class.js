var Class = module.exports = function(native, superclass) {
	if (!native) {
		native = Helpers.createStub();
	}

	Module.call(this, native);

	this.superclass = superclass;

	if (superclass) {
		SingletonClass.attach(this, superclass.singletonClass);
	}
};

// To fix circular dependencies, we include this later
var Helpers = require('../helpers');
var Module = require('./module');
var IncludedModule = require('./included-module');
var SingletonClass = require('./singleton-class');

Class.instanceType = null;
Class.prototype = Object.create(Module.prototype);
Class.prototype.constructor = Class;

Object.defineProperty(Class.prototype, 'name', {
	get: function() {
		return this.moduleName;
	},
	set: function(name) {
		this.moduleName = name;

		Helpers.setFunctionName(this.object, name || '');
	}
});

Object.defineProperty(Class.prototype, 'trueSuperclass', {
	get: function() {
		var superclass = this.superclass;

		while (superclass instanceof IncludedModule) {
			superclass = superclass.superclass;
		}

		return superclass;
	}
});

Object.defineProperty(Class.prototype, 'realClass', {
	get: function() {
		return this;
	}
});

Class.prototype.setSuperclass = function(superclass) {
	if (!superclass) {
		this.superclass = null;
		return;
	}

	if (!(superclass instanceof Class)) {
		throw new TypeError("superclass must be a Class");
	}

	this.superclass = superclass;

	SingletonClass.attach(this, superclass.singletonClass)
};

