var Saphire = require('./saphire');
var Builtin = require('./builtin');
var Helpers = require('./helpers');
var Type = require('./type');

// SuperObject
SuperObject.$.initialize = function() {
};

// Module
Builtin(Module).singletonClass.object.$.allocate = function() {
	return new Builtin.Module().object;
};

Module.$.initialize = function(name) {
	var module = Builtin(this);

	module.name = name;
};

Helpers.defineGetter(Module.$, 'name', function() {
	return Builtin(this).name;
});

Helpers.defineGetter(Module.$, 'moduleName', function() {
	return Builtin(this).moduleName;
});

Helpers.defineGetter(Module.$, 'metaclass', function() {
	return Builtin(this).singletonClass.object;
});

Helpers.defineSetter(Module.$, 'superclass', function(cls) {
	Builtin(this).superclass = Builtin(cls);
});

Helpers.defineGetter(Module.$, 'directSuperclass', function() {
	var superclass = Builtin(this).superclass;

	return superclass ? superclass.object : null;
});

Module.$.appendFeatures = function(mod) {
	new IncludedModule(this).attach(mod);
};

Module.$.included = function(base) {
};

Module.$.include = function(mod) {
	mod.appendFeatures(this);
	mod.included(this);
};

Module.$.extended = function(base) {
};

Module.$.extend = function(mod) {
	mod.appendFeatures(this.metaclass);
	mod.extended(this);
};

// Class
Builtin(Class).singletonClass.object.$.allocate = function() {
	return new Builtin.Class().object;
};

Class.$.allocate = function() {
	var cls = Builtin(this);

	if (this != BasicObject && !cls.superclass) {
		throw new Error("cannot instantiate uninitialized class");
	}

	return Object.create(Builtin(this).prototype);
};

Class.$.create = function() {
	var obj = this.allocate();

	obj.initialize.apply(obj, arguments);

	return obj;
};

Class.$.initialize = function(name, superclass) {
	var cls = Builtin(this);

	if (superclass === undefined) {
		superclass = SuperObject;
	}
	
	cls.setSuperclass(Builtin(superclass));

	Module.$.initialize.call(this, name);
};

// IncludedModule
Builtin(IncludedModule).singletonClass.object.$.allocate = function() {
	return new Builtin.IncludedModule().object;
};

IncludedModule.$.initialize = function(module) {
	Module.$.initialize.call(this, module.name);

	// Patch our prototype
	Builtin(this).prototype = Type.prepareProtoproxy(this.prototype, module.prototype);

	this.module = module;
};

IncludedModule.$.attach = function(cls) {
	this.superclass = cls.directSuperclass;
	cls.superclass = this;

	return this;
};

IncludedModule.$.toString = function() {
	return this.module.toString();
};

IncludedModule.$.inspect = function() {
	return "#<IncludedModule " + this.module.toString() + ">";
};

// Kernel
var Kernel = new Module('Kernel');

Helpers.defineGetter(Kernel.$, '__constructor__', function() {
	var klass = Builtin(Helpers.getClass(this));

	while (!klass && klass.constructor != Builtin.Class) {
		klass = klass.superclass;
	}

	return klass ? klass.object : null;
});

Helpers.defineGetter(Kernel.$, 'constructor', function() {
	return this.__constructor__;
});

Kernel.$.kindOf = function(other) {
	var klass = this.__constructor__;

	while (klass) {
		if (klass == other) {
			return true;
		}

		klass = klass.directSuperclass;
	}

	return false;
};

Kernel.$.isA = function(other) {
	return this.kindOf(other);
};

Kernel.$.instanceOf = function(other) {
	return this.constructor == other;
};

Kernel.$.toString = function() {
	return '#<#' + this.constructor.name + '>';
};

Kernel.$.inspect = function() {
	return this.toString();
};

SuperObject.include(Kernel);

// Exports
global.Kernel = Kernel;

