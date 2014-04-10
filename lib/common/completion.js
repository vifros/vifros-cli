// TODO: Remember to add top level commands(show,delete,and so on) to beginning.
var complete = require('complete');
var iterate = require('../utils').iterate;
var set_prop = require('../utils').set;

var routes = require('../routes');

var commands = {};

iterate(routes, [], function (object, stack) {
	if (stack) {
		if (stack.indexOf('data') != -1) {
			return;
		}

		set_prop(stack.join('.'), {}, commands);
	}
});

complete({
	program : 'vifros',
	commands: commands,
	options : {
		'--help'   : {},
		'-h'       : {},
		'--version': {},
		'-v'       : {}
	}
});

complete.init();