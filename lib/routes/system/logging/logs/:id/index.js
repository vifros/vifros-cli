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

  var level_color;
  switch (jsonapi_response.level) {
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

  table.push({
    'Id': jsonapi_response.id
  }, {
    'Timestamp': jsonapi_response.timestamp
  }, {
    'Module': jsonapi_response.module
  }, {
    'Level': jsonapi_response.level[level_color]
  }, {
    'Tags': jsonapi_response.tags.join(',')
  });

  if (jsonapi_response.data) {
    table.push({
      'Data': require('prettyjson').render(jsonapi_response.data)
    });
  }

  if (jsonapi_response.message) {
    table.push({
      'Message': jsonapi_response.message
    });
  }

  return table.toString();
};