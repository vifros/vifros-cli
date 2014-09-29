// TODO: Add support for prompt override so users can specify options non-interactively.
// TODO: Separate all properties in two groups: basic & advanced. Only let to advanced if yes/no.
var http_status_codes = require('http').STATUS_CODES;

// Monkey-patch String object with colors.
require('colors');

var config = require('../../config/index');
var api_schema = require('../utils/api-schema');

module.exports = function (api_route, route_object, cb) {
  /*
   * Is a link only reference.
   * Print usage info and exit the app.
   */
  if (api_schema.isReferenceLinkOnly(route_object.reference)) {
    require('../common/usage')(['create'].concat(api_route), route_object.reference);

    // No error since it was a valid routes but a link only one.
    cb();
    return;
  }

  /*
   * If not supports resource creation
   * Print usage info and exit the app.
   */
  if (!api_schema.supportResourceCreation(route_object.reference)) {
    console.log('');
    console.log('The path doesn\'t support resource creation.'.yellow);
    console.log('');

    // No error since it was a valid route.
    cb();
    return;
  }

  // Since there are parameters that may contains invalid URI characters.
  for (var i = 0, j = api_route.length;
       i < j;
       i++) {

    api_route[i] = encodeURIComponent(api_route[i]);
  }

  var resource_ids = {
    singular: require('lingo').en.singularize(api_route.slice(-1)[0]),
    plural  : api_route.slice(-1)[0]
  };

  console.log(''); // Padding.
  console.log('Define the new %s properties:', resource_ids.singular.cyan);
  console.log(''); // Padding.

  var prompt = require('prompt');
  prompt.colors = false;

  prompt.start();

  var apischema_properties = api_schema.resolveSchema(
    route_object.reference.methods.POST.request,
    require('../../../vifros-api/public/api-docs.json')
  ).properties;

  var processed_props;

  try {
    processed_props = require('../routes/' + route_object.stack_apidoc.join('/')).compileSchema(apischema_properties);
  }
  catch (e) {
    processed_props = apischema_properties;
  }

  prompt.get({
    properties: processed_props
  }, function (error, result) {
    if (error) {
      cb(error);
      return;
    }

    // Remove empty values due `prompt`.
    for (var prop in result) {
      if (result.hasOwnProperty(prop)) {
        if (result[prop] == '') {
          result[prop] = null;
          delete result[prop];
        }
      }
    }

    var req_body = {};
    req_body[resource_ids.plural] = result;

    console.log(''); // Padding.
    console.log('Creating new ' + resource_ids.singular.cyan + ' with the following properties:');
    console.log(''); // Padding.
    console.log(require('prettyjson').render(req_body[resource_ids.plural]));
    console.log(''); // Padding.

    // Using original `request` adds ~200msec to the execution time.
    require('request-lite')({
      url    : config.api.url + '/' + api_route.join('/'),
      method : 'POST',
      headers: {
        'Accept'      : 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      },
      body   : JSON.stringify(req_body)
    }, function (error, response) {
      if (error) {
        console.log(' ' + error.message.red);
        console.log(''); // Bottom padding.
        return;
      }

      var message_status_color = '';
      switch (response.statusCode) {
        case 200:
          message_status_color = 'green';
          console.log('New ' + resource_ids.singular.cyan + ' created successfully.');
          break;

        default:
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
          console.log(response.statusCode.toString()[message_status_color] + ' ' + http_status_codes[response.statusCode][message_status_color]);
          console.log('');

          if (response.body.errors) {
            require('../utils/jsonapi').printErrorsFromResponse(JSON.parse(response.body.errors));
          }
          break;
      }
      console.log(''); // Bottom padding.
    });
  });
};