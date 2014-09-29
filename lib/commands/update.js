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
    require('../common/usage')(['update'].concat(api_route), route_object.reference);

    // No error since it was a valid routes but a link only one.
    cb();
    return;
  }

  /*
   * If not supports resource update
   * Print usage info and exit the app.
   */
  if (!api_schema.supportResourceUpdate(route_object.reference)) {
    console.log('');
    console.log('The path doesn\'t support resource modification.'.yellow);
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
    singular: require('lingo').en.singularize(api_route[api_route.length - 2]) + ' ' + api_route.slice(-1)[0],
    plural  : api_route[api_route.length - 2]
  };

  console.log(''); // Padding.
  console.log('Update the %s properties:', resource_ids.singular.cyan);
  console.log(''); // Padding.

  var prompt = require('prompt');
  prompt.colors = false;

  prompt.start();

  var apischema_properties = api_schema.resolveSchema(
    route_object.reference.methods.PUT.request,
    require('../../../vifros-api/public/api-docs.json')
  ).properties;

  var processed_props;

  try {
    processed_props = require('../routes/' + route_object.stack_apidoc.join('/') + '/../').compileSchema(apischema_properties);
  }
  catch (e) {
    processed_props = apischema_properties;
  }

  // Remove read-only properties.
  removeReadOnlyProperties(processed_props);

  // Get current properties for displaying.
  require('request-lite')({
    url    : config.api.url + '/' + api_route.join('/'),
    method : 'GET',
    headers: {
      'Content-Type': 'application/vnd.api+json'
    }
  }, function (error, response, body) {
    if (error) {
      console.log(''); // Top padding.
      console.log('Current values couldn\'t be retrieved.'.red);
      console.log(' ' + error.red);
      console.log(''); // Bottom padding.

      cb(error);
      return;
    }

    var current_properties = JSON.parse(body)[resource_ids.plural];

    // Set default values from current ones.
    setDefaultValues(processed_props, current_properties);

    prompt.get({
      properties: processed_props
    }, function (error, result) {
      if (error) {
        cb(error);
        return;
      }

      /*
       * It is not needed to remove empty values due `prompt` since it is valid
       * in this case. F.e.: Already set a `description` to some value and
       * resetting it to empty.
       */

      // Remove unmodified values.
      removeUnmodifiedValues(result, current_properties);

      if (!Object.keys(result).length) {
        // There are no modified values so show a message and don't query the server.
        console.log(''); // Padding.
        console.log('The ' + resource_ids.singular.cyan + ' was not modified.');
        console.log(''); // Padding.
        cb();
        return;
      }

      var req_body = {};
      req_body[resource_ids.plural] = result;

      console.log(''); // Padding.
      console.log('Updating the ' + resource_ids.singular.cyan + ' with the following values:');
      console.log(''); // Padding.
      console.log(require('prettyjson').render(req_body[resource_ids.plural]));
      console.log(''); // Padding.

      // Using original `request` adds ~200msec to the execution time.
      require('request-lite')({
        url    : config.api.url + '/' + api_route.join('/'),
        method : 'PUT',
        headers: {
          'Accept'      : 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        },
        body   : JSON.stringify(req_body)
      }, function (error, response) {
        if (error) {
          console.log(' ' + error.message.red);
          console.log(''); // Bottom padding.

          cb(error);
          return;
        }

        var message_status_color = '';
        switch (response.statusCode) {
          case 204:
            message_status_color = 'green';
            console.log(require('lingo').capitalize(resource_ids.singular)['cyan'] + ' updated successfully.');
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
        cb();
      });
    });
  });
};

/**
 * Deletes readonly properties from a schema.
 *
 * @param {Object}  properties
 */
function removeReadOnlyProperties(properties) {
  for (var prop in properties) {
    if (properties.hasOwnProperty(prop)) {
      if (properties[prop].readonly) {
        properties[prop] = null;
        delete properties[prop];
        continue;
      }

      // If has nested properties, reapply the operation to the children.
      if (properties[prop].type
        && properties[prop].type == 'object') {

        removeReadOnlyProperties(properties[prop].properties);
      }
    }
  }
}

/**
 * Deletes readonly properties from a schema.
 *
 * @param {Object}  prompt_values
 * @param {Object}  default_values
 */
function setDefaultValues(prompt_values, default_values) {
  for (var prop in prompt_values) {
    if (prompt_values.hasOwnProperty(prop)
      && default_values.hasOwnProperty(prop)) {

      // If has nested properties, reapply the operation to the children.
      if (prompt_values[prop].type
        && prompt_values[prop].type == 'object') {

        setDefaultValues(prompt_values[prop].properties, default_values[prop]);
        continue;
      }

      prompt_values[prop].default = default_values[prop];
    }
  }
}

/**
 * Removes unmodified properties from a schema.
 *
 * @param {Object}  result_values
 * @param {Object}  default_values
 */
function removeUnmodifiedValues(result_values, default_values) {
  for (var prop in result_values) {
    if (result_values.hasOwnProperty(prop)
      && default_values.hasOwnProperty(prop)) {

      // If has nested properties, reapply the operation to the children.
      if (typeof result_values[prop] == 'object') {
        removeUnmodifiedValues(result_values[prop], default_values[prop]);

        // Removes object if empty.
        if (!Object.keys(result_values[prop]).length) {
          result_values[prop] = null;
          delete result_values[prop];
        }
        continue;
      }

      if (result_values[prop] == default_values[prop]) {
        // It is an unmodified value, so remove it.
        result_values[prop] = null;
        delete result_values[prop];
      }
    }
  }
}