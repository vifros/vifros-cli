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
    case 'hostname':
      table.push([
        jsonapi_response.value
      ]);
      break;

    case 'domain':
      table.push([
        jsonapi_response.value
      ]);
      break;

    case 'nameservers':
      var title_map = [
        'Primary',
        'Secondary',
        'Tertiary'
      ];

      if (!jsonapi_response.value.length) {
        table.push([
          '(None)'
        ]);
        break;
      }

      for (var i = 0, len = jsonapi_response.value.length;
           i < len;
           i++) {

        table.push([
          title_map[i].yellow,
          jsonapi_response.value[i]
        ]);
      }
      break;

    default:
      // Noop, already handled upstream.
      break;
  }

  return table.toString();
};