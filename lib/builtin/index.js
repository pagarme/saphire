module.exports = function(obj, coerce) {
	if (!obj) {
		return null;
	}

	if (obj instanceof module.exports.BasicObject) {
		return obj;
	}
	
	return obj.__builtin__ || null;
};

module.exports.BasicObject = require('./basic-object');
module.exports.SuperObject = require('./super-object');
module.exports.Module = require('./module');
module.exports.IncludedModule = require('./included-module');
module.exports.Class = require('./class');
module.exports.SingletonClass = require('./singleton-class');

