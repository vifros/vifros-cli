// TODO: Remember to add top level commands(show,delete,and so on) to beginning.
var complete = require('complete');
var request = require('request');

var config = require('../../config/index');
var iterate = require('../utils').iterate;
var set_prop = require('../utils').set;
var getJSONAPIPayload = require('../common').getJSONAPIPayload;

var routes = require('../routes');

var commands = {};

iterate(routes, [], function (object, stack) {
	if (stack) {
		if (stack.indexOf('data') != -1) {
			return;
		}

		set_prop(stack.join('.'), {}, commands);

		/*
		 * Completion for dynamic paths.
		 */
		var current_path = stack.slice(-1)[0];
		var dynamic_segment_id = current_path.split(':')[1];

		if (current_path.charAt(0) == ':') {
			// Is a dynamic segment.
			set_prop(stack.slice(0, -1).join('.'), function (words, prev, cur) {
				request({
					url    : config.api.url + '/' + stack.slice(1, -1).join('/'),
					method : 'GET',
					headers: {
						'Content-Type': 'application/vnd.api+json'
					}
				}, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						var jsonapi_payload = getJSONAPIPayload(JSON.parse(body));
						var new_words = [];

						for (var i = 0, j = jsonapi_payload.length; i < j; i++) {
							new_words.push(jsonapi_payload[i][dynamic_segment_id])
						}

						if (cur && new_words.indexOf(cur) != -1) {
							complete.output(cur, new_words);
						}
						else {
							complete.add(new_words);
						}
					}
				});
			}, commands);
		}
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