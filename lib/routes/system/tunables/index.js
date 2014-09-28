var Table = require('cli-table');

// Monkey-patch String object with colors.
require('colors');

/**
 * Custom formatter for a JSON+API response.
 *
 * @param {Object}    jsonapi_response
 */
exports.formatter = function formatter(jsonapi_response) {
  var table = new Table({
    head : ['Path', 'Value/Original', 'Value/Current', 'Description'],
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
  });

  for (var i = 0, j = jsonapi_response.length;
       i < j;
       i++
  ) {

    table.push([
      jsonapi_response[i].path,
      jsonapi_response[i].value.original,
      jsonapi_response[i].value.current,
      jsonapi_response[i].description || ''
    ]);
  }

  return table.toString();
};

/**
 * Returns a compiled version of a schema, taking into account the apischema properties and
 * the required attributes needed for the prompt.
 *
 * @param   {Object}    apischema_properties
 * @return  {Object}
 */
exports.compileSchema = function compileSchema(apischema_properties) {
  apischema_properties.value.properties.original = null;
  delete apischema_properties.value.properties.original;

  return apischema_properties;
};