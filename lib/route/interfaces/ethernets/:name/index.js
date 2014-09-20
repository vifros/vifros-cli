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

  var operational_status_color;
  if (jsonapi_response.status.operational == 'DOWN') {
    operational_status_color = 'red';
  }
  else if (jsonapi_response.status.operational == 'NOTPRESENT') {
    operational_status_color = 'magenta';
  }
  else {
    operational_status_color = 'green';
  }

  var admin_status_color;
  if (jsonapi_response.status.admin == 'DOWN') {
    admin_status_color = 'red';
  }
  else if (jsonapi_response.status.admin == 'NOTPRESENT') {
    admin_status_color = 'magenta';
  }
  else {
    admin_status_color = 'green';
  }

  table.push({
    'Name': jsonapi_response.name
  }, {
    'MAC': jsonapi_response.mac
  }, {
    'MTU': jsonapi_response.mtu
  });

  if (jsonapi_response.description) {
    table.push({
      'Description': jsonapi_response.description
    });
  }

  table.push({
    'Status': ''
  }, {
    '  Operational': jsonapi_response.status.operational[operational_status_color]
  }, {
    '  Admin': jsonapi_response.status.admin[admin_status_color]
  });

  return table.toString();
};