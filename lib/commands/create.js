var http_status_codes = require('http').STATUS_CODES;

var request = require('request');
var cliff = require('cliff');

var config = require('../../config/index');
var usage = require('../common').usage;

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

      if (!(route.object.data && route.object.data.schema)) {
        // There is no model associated to the path to return;
        console.log('');
        console.log('The path doesn\'t support resource creation.'.red);
        console.log('');
        return;
      }

      var resource_id = stack_buffer[stack_buffer.length - 1];
      app.log.info('Define new ' + resource_id.magenta + ' properties:');

      app.prompt.start();
      app.prompt.get(route.object.data.schema, function (error, result) {
        if (error) {
          console.log(error);
          return;
        }

        app.log.info('Creating new ' + resource_id.magenta + ' with the following properties:');

        cliff.putObject(result);

        var req_body = {};
        req_body[resource_id] = result;

        request({
          url    : config.api.url + '/' + stack_buffer.slice(1).join('/'),
          method : 'POST',
          headers: {
            'Accept'      : 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
          },
          body   : JSON.stringify(req_body)
        }, function (error, response, body) {
          console.log(''); // Top padding.

          if (error) {
            console.log(' ' + error.message.red);
            console.log(''); // Bottom padding.
            return;
          }

          var message_status_color = '';
          switch (response.statusCode) {
            case 200:
              message_status_color = 'green';
              console.log(' New' + resource_id.magenta + ' created successfully.');
              break;

            default:
              // TODO: Later on, log returned errors array.
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
              break;
          }
          console.log(''); // Bottom padding.
        });
      });
    });
  }

  app.cmd(str_route + ' *', function () {
    usage(route);
  });
};