// Prepare native errors
delete Error.prototype.name;
delete TypeError.prototype.name;
delete SyntaxError.prototype.name;
delete ReferenceError.prototype.name;
delete RangeError.prototype.name;
delete EvalError.prototype.name;
delete URIError.prototype.name;


Error.$.initialize = function(message) {
	this.reasonMessage = message;

	Error.captureStackTrace(this, this.constructor);
};

Error.defineGetter('name', function() {
	return this.constructor.name;
});

Error.defineGetter('message', function() {
	return this.reasonMessage;
});

Error.$.toString = function() {
	if (this.message) {
		return this.message;
	} else {
		return this.name;
	}
};

Error.$.inspect = function() {
	var s = this.toString();

	if (s == '') {
		return this.constructor.name;
	} else {
		return '#<#' + this.constructor.name + ': ' + s +'>';
	}
};

global.ScriptError = new Class('ScriptError', Error);

global.StandardError = new Class('StandardError', Error);
global.IndexError = new Class('IndexError', StandardError);

global.NameError = new Class('NameError', StandardError);
global.NoMethodError = new Class('NoMethodError', NameError);

global.ArgumentError = new Class('ArgumentError', StandardError);

ArgumentError.$.toString = function() {
	if (this.given && this.expected) {
		if (this.methodName) {
			return this.methodName + ': given ' + this.given + ', expected ' + this.expected;
		} else {
			return 'given ' + this.given + ', expected ' + this.expected;
		}
	} else {
		return $super();
	}
};

global.SecurityError = new Class('SecurityError', StandardError);

// Patch native errors hierarchy
SyntaxError.superclass = ScriptError;
ReferenceError.superclass = ScriptError;
EvalError.superclass = ScriptError;
RangeError.superclass = StandardError;
TypeError.superclass = StandardError;
URIError.superclass = StandardError;

