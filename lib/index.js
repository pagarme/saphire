// As we love good debugging, we need this to change function names
require('setflags').setFlags('--allow-natives-syntax');

// Require this just to make sure we resolve
// our circular dependencies correctly
require('./ontology');

// Initialize the VM
require('./vm');

// Load a bare environment so we can bootstrap
require('./alpha');

// Boostrap!
require('./bootstrap');

