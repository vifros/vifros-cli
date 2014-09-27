var http_status_codes = require('http').STATUS_CODES;

// Monkey-patch String object with colors.
require('colors');

var config = require('../../config/index');
var api_schema = require('../utils/api-schema');
var printFromJSONAPI = require('../utils/jsonapi').printFromJSONAPI;

module.exports = function (api_route, route_object, cb) {
  /*
   * Is a link only reference.
   * Print usage info and exit the app.
   */
  if (api_schema.isReferenceLinkOnly(route_object.reference)) {
    require('../common/usage')(['show'].concat(api_route), route_object.reference);

    // No error since it was a valid routes but a link only one.
    cb();
    return;
  }

  /*
   * Has inner instances, so treat it as if it would be a link only reference.
   * Print usage info and exit the app.
   */
  if (api_schema.hasDynamicChildrenWithInstances(route_object.reference)) {
    require('../common/usage')(['show'].concat(api_route), api_schema.getDynamicChildReference(route_object.reference));

    // No error since it was a valid routes but a link only one.
    cb();
    return;
  }

  // Since there are parameters that may contains invalid URI characters.
  for (var i = 0, j = api_route.length;
       i < j;
       i++) {

    api_route[i] = encodeURIComponent(api_route[i]);
  }

  // Using original `request` adds ~200msec to the execution time.
  require('request-lite')({
    url    : config.api.url + '/' + api_route.join('/') + '?limit=0',
    method : 'GET',
    headers: {
      'Content-Type': 'application/vnd.api+json'
    }
  }, function (error, response, body) {
    if (error) {
      console.log(''); // Top padding.
      console.log(' ' + error.red);
      console.log(''); // Bottom padding.

      cb(error);
      return;
    }

    switch (response.statusCode) {
      case 200:
        printFromJSONAPI(route_object.stack_apidoc, JSON.parse(body));
        break;

      default:
        // TODO: Log returned errors array.
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

    cb();
  });
};