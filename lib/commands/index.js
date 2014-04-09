var utils = require('../utils');
var usage = require('../common').usage;

var routes = require('../routes');

var cmd_show = require('./show');

exports.init = function (app) {
	/*
	 * Version.
	 */
	app.cmd('version', function () {
		console.log(app.version);
	});

	app.router.notfound = function () {
		usage({
			object: routes,
			stack : []
		});
	};

	var cmd_flattened = [];

	utils.iterate(routes, [], function (object, stack) {
		if (stack) {
			if (stack.indexOf('data') != -1) {
				return;
			}

			cmd_flattened.push({
				object: object,
				stack : stack
			});
		}
	});

	for (var i = cmd_flattened.length - 1;
	     i >= 0;
	     i--) {

		cmd_show(app, cmd_flattened[i]);
	}
};