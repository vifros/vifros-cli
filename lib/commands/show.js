// TODO: Remember to add `show` to beginning of the command.
var request = require('request');

var config = require('../../config/index');
var usage = require('../common').usage;
var printFromJSONAPI = require('../common').printFromJSONAPI;

module.exports = function (app, route) {
	var str_route = route.stack.join(' ');

	app.cmd(str_route + ' help', function () {
		usage(route);
	});

	if (route.object.data.link_only) {
		app.cmd(str_route, function () {
			usage(route);
		});
	}
	else {
		app.cmd(str_route, function () {
			request({
				url    : config.api.url + '/' + route.stack.join('/'),
				method : 'GET',
				headers: {
					'Content-Type': 'application/vnd.api+json'
				}
			}, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var json_api = JSON.parse(body);

					printFromJSONAPI(json_api, route.object);
				}
				else {
					console.log(error); // TODO: See how log errors.
				}
			});
		});
	}

	app.cmd(str_route + ' *', function () {
		usage(route);
	});
};