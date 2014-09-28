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
    head : ['Id', 'Name', 'Description'],
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
      jsonapi_response[i].id,
      jsonapi_response[i].name,
      jsonapi_response[i].description
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
  var custom_schema = {
    id: {
      message: 'It has to be greater than 0 and less than 2147483648'
    }
  };

  return require('lodash').merge(apischema_properties, custom_schema);
};