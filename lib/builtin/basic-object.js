var Helpers = require('../helpers');

var BasicObject = module.exports = function(native) {
	if (!native) {
		native = Object.create(null);
	}

	this.object = native;
};

// To fix circular dependencies, we include this later
var Builtin = require('./index');
var SingletonClass = require('./singleton-class');

BasicObject.instanceType = null;
BasicObject.prototype.constructor = BasicObject;

// Basic allocator
BasicObject.prototype.allocate = function() {
	return Object.create(this.prototype);
};

// Object Class
Object.defineProperty(BasicObject.prototype, 'klass', {
	get: function() {
		return Builtin(Helpers.getClass(this.object));
	},
	set: function(cls) {
		Helpers.setClass(this.object, cls);
	}
});

// Singleton Class
// Also fixes up inheritance chain if needed
Object.defineProperty(BasicObject.prototype, 'singletonClass', {
	get: function() {
		var sc = this.singletonClassInstance;
		var scClass = Helpers.tryAs(sc.klass, SingletonClass);

		if (scClass && scClass.singleton != sc) {
			SingletonClass.attach(sc);
		}

		return sc;
	}
});

Object.defineProperty(BasicObject.prototype, 'singletonClassObject', {
	get: function() {
		var sc = Helpers.tryAs(this, SingletonClass);

		return sc ? sc.singleton : null;
	}
});

// Singleton Class
Object.defineProperty(BasicObject.prototype, 'singletonClassInstance', {
	get: function() {
		var sc = Helpers.tryAs(this.klass, SingletonClass);

		if (!sc || sc.singleton != this) {
			sc = SingletonClass.attach(this);
		}

		return sc;
	}
});

