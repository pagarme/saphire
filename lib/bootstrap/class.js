var Helpers = require('../helpers');
var Builtin = require('../builtin');

// Remove module methods
Class.$.appendFeatures = null;

Class.$.apply = Function.prototype.apply;
Class.$.call = Function.prototype.call;

Class.$.initialize = function(name, superclass, fn) {
	var cls = Builtin(this);

	if (!fn && (superclass instanceof Function)) {
		fn = superclass;
		superclass = undefined;
	}

	if (superclass === undefined) {
		superclass = SuperObject;
	}

	if (superclass && !superclass.kindOf(Class)) {
		throw new TypeError("superclass must be a Class");
	}
	
	if (superclass) {
		cls.setSuperclass(Builtin(superclass));
	}

	$super(name, fn);

	if (superclass) {
		superclass.inherited(this);
	}
};

Class.$.inherited = function(base) {
};

Helpers.defineGetter(Class.$, 'superclass', function() {
	var klass = this.directSuperclass;

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

