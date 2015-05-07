var Reflect = require('harmony-reflect');
var Builtin = require('./builtin');

exports.setClass = function(obj, cls) {
	if (cls) {
		Object.setPrototypeOf(obj, cls.prototype);
	} else {
		Object.setPrototypeOf(obj, null);
	}
};

exports.getClass = function(obj) {
	return obj.__class__;
};

exports.prepareProtoproxy = function(ourProto, prototype) {
	var hasOwnProperty = {}.hasOwnProperty;

	return new Proxy(ourProto, {
		get: function(target, name, receiver) {
			if (name === '__class__') {
				return Reflect.get(target, name, receiver);
			}

			if (hasOwnProperty.call(prototype, name)) {
				return Reflect.get(prototype, name, receiver);
			}

			return Reflect.get(target, name, receiver);
		},
		has: function(target, name) {
			if (hasOwnProperty.call(prototype, name)) {
				return true;
			}

			return Reflect.has(target, name);
		},
		hasOwn: function(target, name) {
			return hasOwnProperty.call(prototype, name);
		},
		getOwnPropertyDescriptor: function(target, name) {
			return Reflect.getOwnPropertyDescriptor(prototype, name);
		},
		ownKeys: function(target) {
			return Reflect.ownKeys(prototype);
		}
	});
};

exports.includeModulesFrom = function(includedModule, klass) {
	var insertAt = klass;
	var mod = includedModule;

	while (mod) {
		if (mod == klass || (mod.instanceOf(IncludedModule) && mod.module == klass)) {
			throw new ArgumentError("cyclic included detected");
		}

		if (Builtin(mod) == Builtin(mod).origin) {
			var superclassSeen = false;
			var add = true;

			var k = klass.directSuperclass;

			while (k) {
				if (k.kindOf(IncludedModule)) {
					if (k == mod) {
						if (!superclassSeen) {
							insertAt = k
						}

						add = false;
						break;
					}
				} else {
					superclassSeen = true;
				}

				k = k.directSuperclass;
			}

			if (add) {
				var originalMod;

				if (mod.kindOf(IncludedModule)) {
					originalMod = mod.module;
				} else {
					originalMod = mod;
				}

				var im = new IncludedModule(originalMod);

				im.attach(insertAt);
				insertAt = im;
			}
		}

		mod = mod.directSuperclass;
	}
};

