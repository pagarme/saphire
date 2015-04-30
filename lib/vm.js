var callsites = require('v8-callsites');
var Type = require('./type');
var Helpers = require('./helpers');
var Builtin = require('./builtin');

function GetSuper() {
	return exports.findSuperMethodFromCallSite(exports.getCallSite(1));
};

exports.findSuperMethodFromCallSite = function(callsite) {
	var receiver = callsite.getThis();

	if (!receiver) {
		throw new TypeError("can't get super for unbound method");
	}

	var receiverClass = Builtin(Type.getClass(receiver));

	if (!receiverClass) {
		throw new TypeError("can't get super for untyped receiver");
	}

	// Find the method owning class on receiver class hierarchy
	var method = callsite.getFunction();
	var methodClass = receiverClass.findModule(method.__owner__);

	if (!methodClass) {
		throw new TypeError(" no superclass for method '" + method.__name__ + "'");
	}

	var superclass = methodClass.superclass;

	if (!superclass) {
		throw new TypeError("no superclass for method '" + method.__name__ + "'");
	}

	var fn = superclass.prototype[method.__name__];

	if (!fn) {
		throw new TypeError("no superclass for method '" + method.__name__ + "'");
	}

	return fn.bind(receiver);
};

exports.getCallerReceiver = function() {
    return exports.getCallSite(2).getThis();
};

exports.getCallSite = function(index) {
	return callsites(index + 1, exports.getCallSite)[index];
};

exports.defineGlobalProperty = function(name, desc) {
    Object.defineProperty(global, name, desc);
};

exports.defineGlobal = function(name, value) {
    exports.defineGlobalProperty(name, {
        writable: false,
        value: value
    });
};

exports.defineGlobalProperty('$super', {
	enumerable: false,
	configurable: false,
	get: GetSuper
});

