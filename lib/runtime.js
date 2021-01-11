exports.SetCode = function(a, b) {
	Object.defineProperty(a, 'code', { value: b });
};

exports.FunctionSetName = function(a, b) {
	Object.defineProperty(a, 'name', { value: b });
};

