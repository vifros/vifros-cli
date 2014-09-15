var http_status_codes = require('http').STATUS_CODES;

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
      var stack_buffer = route.stack;

      if (arguments.length) {
        var arguments_stack = 0;
        for (var i = 0, j = stack_buffer.length;
             i < j;
             i++) {

          if (stack_buffer[i].charAt(0) == ':') {
            // Is a dynamic path.
            stack_buffer[i] = arguments[arguments_stack++];
          }
        }
      }

      request({
        url    : config.api.url + '/' + stack_buffer.slice(1).join('/') + '?limit=0',
        method : 'GET',
        headers: {
          'Content-Type': 'application/vnd.api+json'
        }
      }, function (error, response, body) {
        if (error) {
          console.log(''); // Top padding.
          console.log(' ' + error.message.red);
          console.log(''); // Bottom padding.
          return;
        }

        switch (response.statusCode) {
          case 200:
            printFromJSONAPI(JSON.parse(body), route.object);
            break;

          default:
            // TODO: Later on, log returned errors array.
            console.log(''); // Top padding.

            var message_status_color = '';

            if (response.statusCode > 0 && response.statusCode < 299) {
              message_status_color = 'green';
            }
            else if (response.statusCode > 300 && response.statusCode < 399) {
              message_status_color = 'blue';
            }
            else if (response.statusCode > 400 && response.statusCode < 499) {
              message_status_color = 'yellow';
            }
            else {
              message_status_color = 'red';
            }

            console.log(' ' + http_status_codes[response.statusCode][message_status_color]);
            console.log(''); // Bottom padding.
            break;
        }
      });
    });
  }

  app.cmd(str_route + ' *', function () {
    usage(route);
  });
};