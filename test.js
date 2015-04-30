require('./lib');

var A = new Class('A');

A.prototype.lol = function() {
	console.log('A');
};

var B = new Class('B', A);

B.prototype.lol = function() {
	console.log('B');
	$super();
};

var a = new A();

a.lol();

var b = new B();

b.lol();

