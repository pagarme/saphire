var NativeSaphire = require('bindings')('saphire');
var Builtin = require('./builtin');
var runtime = require('./runtime');

exports.cloneFunction = function(original) {
	return original;
};

exports.setFunctionName = function(fn, name) {
	runtime.FunctionSetName(fn, name);
};

exports.copyProperties = function(from, to) {
	var props = Object.getOwnPropertyNames(from);

	for (var i = 0; i < props.length; i++) {
		var name = props[i];
		var desc = Object.getOwnPropertyDescriptor(from, name);

		Object.defineProperty(to, name, desc);
	}
};

exports.getPropertyDescriptor = function(obj, name) {
	while (obj) {
		var desc = Object.getOwnPropertyDescriptor(obj, name);

		if (desc) {
			return desc;
		}

		obj = Object.getPrototypeOf(obj);
	}

	return null;
};

exports.getClass = function(obj, create) {
	if (!obj) {
		return null;
	}

	var proto = Object.getPrototypeOf(obj);

	return proto ? proto.__class__ : null;
};

exports.setClass = function(obj, cls) {
	if (cls) {
		Object.setPrototypeOf(obj, cls.prototype);
	} else {
		Object.setPrototypeOf(obj, null);
	}
};

exports.tryAs = function(value, type) {
	if (value instanceof type) {
		return value;
	}

	return null;
};

exports.createStub = function() {
	return eval('(function(){return arguments.callee.create.apply(arguments.callee, arguments)})')
};

exports.defineGetter = function(obj, name, get) {
	Object.defineProperty(obj, name, {
		enumerable: false,
		configurable: true,
		get: get
	});
};

exports.defineSetter = function(obj, name, set) {
	Object.defineProperty(obj, name, {
		enumerable: false,
		configurable: true,
		set: set
	});
};

