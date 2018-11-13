exports.SetCode = function(a, b) {
	%SetCode(a, b);
};

exports.FunctionSetName = function(a, b) {
	Object.defineProperty(a, 'name', { value: b });
};

