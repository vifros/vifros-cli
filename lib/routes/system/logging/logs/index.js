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
    head : ['Id', 'Timestamp', 'Module', 'Level', 'Tags', 'Message'],
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

  var level_color = '';
  for (var i = 0, j = jsonapi_response.length;
       i < j;
       i++
  ) {

    switch (jsonapi_response[i].level) {
      case 'info' :
        level_color = 'blue';
        break;
      case 'error' :
        level_color = 'red';
        break;
      default :
        level_color = 'yellow';
        break;
    }

    table.push([
      jsonapi_response[i].id,
      jsonapi_response[i].timestamp,
      jsonapi_response[i].module,
      jsonapi_response[i].level[level_color],
      jsonapi_response[i].tags.join(','),
      jsonapi_response[i].message
    ]);
  }

  return table.toString();
};