var Reflect = require('harmony-reflect');

var createPrototypeTrampoline = function(module) {
	var trampoline = new Proxy(module.prototypeBackend, {
		set: function(target, name, value, receiver) {
			return module.defineMethod(name, value, true);
		},
		defineProperty: function(target, name, desc) {
			return module.defineProperty(name, desc, true);
		},
		deleteProperty: function(target, name) {
			return module.deleteProperty(target, name);
		}
	});

	return trampoline;
};

var createPropertyFunctionWrapper = function(fn, name, propName, klass) {
	fn = Helpers.cloneFunction(fn);

	Object.defineProperty(fn, '__name__', {
		configurable: true,
		enumerable: false,
		writable: false,
		value: name
	});

	Object.defineProperty(fn, '__property__', {
		configurable: true,
		enumerable: false,
		writable: false,
		value: propName
	});

	Object.defineProperty(fn, '__owner__', {
		configurable: true,
		enumerable: false,
		writable: false,
		value: klass
	});

	return fn;
};

var createFunctionWrapper = function(fn, name, klass) {
	fn = Helpers.cloneFunction(fn);

	Object.defineProperty(fn, '__name__', {
		configurable: true,
		enumerable: false,
		writable: false,
		value: name
	});

	Object.defineProperty(fn, '__owner__', {
		configurable: true,
		enumerable: false,
		writable: false,
		value: klass
	});

	return fn;
};

var Module = module.exports = function(native) {
	if (!native) {
		native = { prototype: {} };
	}

	SuperObject.call(this, native);

	this.prototype = this.object.prototype;
	this.prototypeBackend = this.prototype;

	Object.defineProperty(this.object, '$', {
		writable: false,
		enumerable: false,
		configurable: true,
		value: createPrototypeTrampoline(this)
	});

	Object.defineProperty(this.object, '__builtin__', {
		writable: false,
		enumerable: false,
		configurable: true,
		value: this
	});

	Object.defineProperty(this.prototypeBackend, '__class__', {
		writable: false,
		enumerable: false,
		configurable: true,
		value: this.object
	});

	this.name = null;
	this.origin = this;
	this.superclass = null;
	this.klass = this.constructor.instanceType;
};

// To fix circular dependencies, we include this later
var Helpers = require('../helpers');
var Builtin = require('./index');
var SuperObject = require('./super-object');
var SingletonClass = require('./singleton-class');

Module.instanceType = null;
Module.prototype = Object.create(SuperObject.prototype);
Module.prototype.constructor = Module;

// Module Allocator
Module.prototype.allocate = function() {
	return new this.constructor().object;
};

// Name
Object.defineProperty(Module.prototype, 'name', {
	configurable: true,
	get: function() {
		return this.moduleName;
	},
	set: function(name) {
		this.moduleName = name;
	}
});

// Module Superclass
Object.defineProperty(Module.prototype, 'superclass', {
	get: function() {
		return Builtin(Helpers.getClass(this.prototypeBackend));
	},
	set: function(cls) {
		Helpers.setClass(this.prototypeBackend, cls);
	}
});

// Module Origin(for prepended modules)
Object.defineProperty(Module.prototype, 'origin', {
	writable: true,
	value: null
});

// Define a method
Module.prototype.defineMethod = function(name, fn, clone) {
	return this.defineProperty(name, {
		configurable: true,
		enumerable: false,
		writable: true,
		value: fn
	}, clone);
};

// Define a named property
Module.prototype.defineProperty = function(name, desc, clone) {
	var current = Helpers.getPropertyDescriptor(this.prototype, name);

	if (desc.get) {
		desc.get = createPropertyFunctionWrapper(desc.get, name, '__get_' + name, this);
		this.defineMethod('__get_' + name, desc.get, false);
		desc.get = new Function('return this[' + JSON.stringify('__get_' + name) + ']();');
	} else if (current) {
		desc.get = current.get;
	} else {
		delete desc.get;
	}

	if (desc.set) {
		desc.set = createPropertyFunctionWrapper(desc.set, name, '__set_' + name, this);
		this.defineMethod('__set_' + name, desc.set, false);
		desc.set = new Function('value', 'return this[' + JSON.stringify('__set_' + name) + '](value);');
	} else if (current) {
		desc.set = current.set;
	} else {
		delete desc.set
	}

	if ('get' in desc && desc.get === undefined) {
		delete desc.get;
	}

	if ('set' in desc && desc.set === undefined) {
		delete desc.set;
	}

	if (desc.value && (desc.value instanceof Function) && clone) {
		desc.value = createFunctionWrapper(desc.value, name, this);
	}

	return Object.defineProperty(this.prototype, name, desc);
};

// Remove a property
Module.prototype.deleteProperty = function(name) {
	return delete this.prototype[name];
};

// Find a module in the hierarchy
Module.prototype.findModule = function(target) {
	var klass = this;

	do {
		if (klass == target) {
			break;
		}

		if (klass instanceof Builtin.IncludedModule) {
			if (klass.object.module == target.object) {
				break;
			}
		}

		klass = klass.superclass;
	} while (klass);

	return klass;
};

Module.prototype.inspect = function() {
	return this.toString();
};

Module.prototype.toString = function() {
	return this.moduleName || '<anonymous module>';
};

