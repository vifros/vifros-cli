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

  table.push({
    'Scope': jsonapi_response.scope || '(not set)'
  }, {
    'Address': jsonapi_response.address
  });

  if (jsonapi_response.broadcast) {
    table.push({
      'Broadcast': jsonapi_response.broadcast
    });
  }

  if (jsonapi_response.peer) {
    table.push({
      'Peer': jsonapi_response.peer
    });
  }

  if (jsonapi_response.description) {
    table.push({
      'Description': jsonapi_response.description
    });
  }

  return table.toString();
};