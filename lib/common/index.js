var Table = require('cli-table');

exports.usage = function (route) {
	var table = new Table({
		head : ['Command', 'Description'],
		chars: { 'top': '', 'top-mid': '', 'top-left': '', 'top-right': '',
			'bottom'  : '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
			'left'    : '', 'left-mid': '', 'mid': '', 'mid-mid': '',
			'right'   : '', 'right-mid': '',
			'middle'  : ' ' },
		style: {
			head           : ['yellow'],
			'padding-left' : 1,
			'padding-right': 1
		}
	});

	for (var i in route.object) {
		if (route.object.hasOwnProperty(i)) {
			if (i == 'data') {
				continue;
			}

			table.push([
				i,
				route.object[i].data.description
			]);
		}
	}

	console.log(); // Top padding.
	console.log(' Usage:'.red + ' show' + ((route.stack.length) ? ' ' : '') + route.stack.join(' ') + ((table.length) ? ' [command]' : ''));

	if (table.length) {
		console.log(); // Padding.
		console.log(table.toString());
	}

	console.log();  // Bottom padding.
};

exports.printFromJSONAPI = function (json_api, route) {
	var reserved_jsonapi_ids = [
		'linked',
		'links',
		'errors',
		'meta',
	];

	console.log(); // Top padding.

	var rows = [];

	for (var i in json_api) {
		if (json_api.hasOwnProperty(i)) {
			if (reserved_jsonapi_ids.indexOf(i) != -1) {
				continue;
			}

			if (route.data.formatter) {
				// Custom formatter.
				console.log(route.data.formatter(json_api[i]));
			}
			else {
				console.log(json_api[i]);
			}
		}
	}

	console.log();  // Bottom padding.
};

exports.cliTableVerticalOptions = {
	chars: {
		'top'   : '', 'top-mid': '', 'top-left': '', 'top-right': '',
		'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
		'left'  : '', 'left-mid': '', 'mid': '', 'mid-mid': '',
		'right' : '', 'right-mid': '',
		'middle': ' '
	},
	style: {
		head           : ['yellow'],
		'padding-left' : 1,
		'padding-right': 1
	}
};