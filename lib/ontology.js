var Builtin = require('./builtin');
var Helpers = require('./helpers');
var Saphire = require('./saphire');

// We use this before initializing MOP
var newBasicClass = function(name, sup, native) {
	var cls = new Builtin.Class(native, null);

	cls.name = name;
	cls.superclass = sup;

	return cls;
};

// We use this after MOP was initialized
var newClass = function(name, sup) {
	var cls = new Builtin.Class(null, sup);

	cls.name = name;

	return cls;
};

var patchNativeClass = function(native, sup, replaceConstructor) {
	sup = Builtin(sup);

	var name = native.name;
	var cls = new Builtin.Class(native, sup);

	if (replaceConstructor) {
		%SetCode(native, Helpers.createStub());
	}

	cls.name = name;

	return cls;
};

// Here we need to initialize everythin in a particular order
// or everything will blow up

// This is hack to skip Class initialization as we can't do it now
// as all internals are not initialize yet
// so we must do it manually
var ClassClass = newBasicClass('Class');

Saphire.Class = ClassClass;
Builtin.Class.instanceType = ClassClass;

// Recursion ftw
ClassClass.klass = ClassClass;

// Now BasicObject(aka vanilla JS Object)
var BasicObjectClass = newBasicClass('Object', null, Object);

Saphire.BasicObject = BasicObjectClass;
Builtin.BasicObject.instanceType = BasicObjectClass;

// Now SuperObject
var SuperObjectClass = newBasicClass('SuperObject', BasicObjectClass);

Saphire.SuperObject = SuperObjectClass;
Builtin.SuperObject.instanceType = SuperObjectClass;

// Now Module
var ModuleClass = newBasicClass('Module', SuperObjectClass);

Saphire.Module = ModuleClass;
Builtin.Module.instanceType = ModuleClass;

// Fixup Class superclass to Module
ClassClass.superclass = ModuleClass;

// Now that we have:
// * BasicObject(aka Object)
// * SuperObject
// * Module
// * Class
// 
// With this four in place, we can correctly initialize classes.
//
// Now we can initialize the SingletonClass protocol(aka MOP),
// the SingletonClass of a class points to the SingletonClass
// of the superclass

// BasicObject's SingletonClass has Class as superclass
var sc = Builtin.SingletonClass.attach(BasicObjectClass, ClassClass);

// SuperObject's SingletonClass has BasicObject's SingletonClass as superclass
sc = Builtin.SingletonClass.attach(SuperObjectClass, sc);

// Module's SingletonClass has SuperObject's SingletonClass as superclass
sc = Builtin.SingletonClass.attach(ModuleClass, sc);

// Class's SingletonClass has Module's SingletonClass as superclass
Builtin.SingletonClass.attach(ClassClass, sc);

// The MOP protocol is fully active, go on
var IncludedModuleClass = newClass('IncludedModule', ModuleClass);

Saphire.IncludedModule = IncludedModuleClass;
Builtin.IncludedModule.instanceType = IncludedModuleClass;

// Finally, patches the Error class and it subclasses
patchNativeClass(Error, SuperObjectClass, true);
patchNativeClass(SyntaxError, Error, true);
patchNativeClass(TypeError, Error, true);
patchNativeClass(ReferenceError, Error, true);
patchNativeClass(RangeError, Error, true);
patchNativeClass(EvalError, Error, true);
patchNativeClass(URIError, Error, true);

// Export globals to the world
global.SuperObject = SuperObjectClass.object;
global.Module = ModuleClass.object;
global.IncludedModule = IncludedModuleClass.object;
global.Class = ClassClass.object;

