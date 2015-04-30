var SingletonClass = module.exports = function(obj) {
	Class.call(this);

	this.singleton = obj;
};

// To fix circular dependencies, we include this later
var Helpers = require('../helpers');
var Class = require('./class');

SingletonClass.prototype = Object.create(Class.prototype);
SingletonClass.prototype.constructor = SingletonClass;

Object.defineProperty(SingletonClass.prototype, 'realClass', {
	get: function() {
		return this.trueSuperclass;
	}
});

SingletonClass.attach = function(obj, sup) {
	var sc = new SingletonClass(obj);
	var alreadySc = Helpers.tryAs(obj, SingletonClass);

	if (alreadySc) {
		sc.klass = sc;
		sc.superclass = alreadySc.trueSuperclass.singletonClassInstance;
	} else {
		if (!sup) {
			sup = obj.klass;
		}

		sc.klass = sup.realClass.klass;
		sc.superclass = sup;
	}

	obj.klass = sc;

	return sc;
};

