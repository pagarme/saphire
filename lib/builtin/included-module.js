var IncludedModule = module.exports = function(native) {
	Module.call(this, native);
};

// To fix circular dependencies, we include this later
var Module = require('./module');

IncludedModule.instanceType = null;
IncludedModule.prototype = Object.create(Module.prototype);
IncludedModule.prototype.constructor = IncludedModule;

