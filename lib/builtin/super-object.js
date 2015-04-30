var SuperObject = module.exports = function(native) {
	BasicObject.call(this, native);
};

// To fix circular dependencies, we include this later
var BasicObject = require('./basic-object');

SuperObject.instanceType = null;
SuperObject.prototype = Object.create(BasicObject.prototype);
SuperObject.prototype.constructor = SuperObject;

module.exports = SuperObject;

