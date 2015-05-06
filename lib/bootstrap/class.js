var Helpers = require('../helpers');
var Builtin = require('../builtin');

// Remove module methods
Class.$.appendFeatures = null;

Class.$.apply = Function.prototype.apply;
Class.$.call = Function.prototype.call;

Class.$.initialize = function(name, superclass, fn) {
	if (this.directSuperclass || this == BasicObject) {
		throw new TypeError('class already initialized');
	}

	var cls = Builtin(this);

	if (!fn && superclass instanceof Function) {
		fn = superclass;
		superclass = null;
	}

	if (name && name.constructor != String) {
		if (name instanceof Function) {
			fn = name;
		} else if (!superclass) {
			superclass = name;
		}

		name = null;
	}

	if (!superclass) {
		superclass = SuperObject;
	}

	if (superclass == Class) {
		throw new TypeError("can't make subclass of Class");
	}

	if (superclass && !superclass.kindOf(Class)) {
		throw new TypeError("superclass must be a Class");
	}
	
	cls.setSuperclass(Builtin(superclass));
	cls.name = name;

	if (superclass) {
		superclass.inherited(this);
	}

	$super();

	if (fn) {
		fn.apply(this);
	}
};

Class.$.inherited = function(base) {
};

Helpers.defineGetter(Class.$, 'superclass', function() {
	var klass = this.directSuperclass;

	if (!klass && this != BasicObject) {
		throw new Error('uninitialized class');
	}

	while (klass && klass.kindOf(IncludedModule)) {
		klass = klass.directSuperclass;
	}

	return klass;
});

Class.$.toString = function() {
	var name = '';
	var sc = Builtin(this).singletonClassObject;

	if (sc) {
		sc = sc.object;

		if (sc.kindOf(Class) || sc.kindOf(Module)) {
			name = "#<Class:" + sc.toString() + ">";
		}
	} else {
		name = this.moduleName;
	}

	return name;
};

