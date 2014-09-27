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

  switch (jsonapi_response.name) {
    case 'transport_console':
      table.push({
        'Enabled': jsonapi_response.value.enabled.toString()[(jsonapi_response.value.enabled) ? 'green' : 'red']
      }, {
        'Colorize': jsonapi_response.value.colorize.toString()[(jsonapi_response.value.colorize) ? 'green' : 'red']
      }, {
        'Timestamp': jsonapi_response.value.timestamp.toString()[(jsonapi_response.value.timestamp) ? 'green' : 'red']
      });
      break;

    case 'transport_file':
      table.push({
        'Enabled': jsonapi_response.value.enabled.toString()[(jsonapi_response.value.enabled) ? 'green' : 'red']
      }, {
        'Colorize': jsonapi_response.value.colorize.toString()[(jsonapi_response.value.colorize) ? 'green' : 'red']
      }, {
        'Timestamp': jsonapi_response.value.timestamp.toString()[(jsonapi_response.value.timestamp) ? 'green' : 'red']
      }, {
        'Filename': jsonapi_response.value.filename
      });
      break;

    case 'transport_mongodb':
      table.push({
        'Enabled': jsonapi_response.value.enabled.toString()[(jsonapi_response.value.enabled) ? 'green' : 'red']
      }, {
        'DB': jsonapi_response.value.db
      });
      break;

    default:
      // Noop, already handled upstream.
      break;
  }

  return table.toString();
};