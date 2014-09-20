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
    head : ['Status/Operational', 'Status/Admin', 'Name', 'MAC', 'MTU', 'Description'],
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

    var operational_status_color;
    if (jsonapi_response[i].status.operational == 'DOWN') {
      operational_status_color = 'red';
    }
    else if (jsonapi_response[i].status.operational == 'NOTPRESENT') {
      operational_status_color = 'magenta';
    }
    else {
      operational_status_color = 'green';
    }

    var admin_status_color;
    if (jsonapi_response[i].status.admin == 'DOWN') {
      admin_status_color = 'red';
    }
    else if (jsonapi_response[i].status.admin == 'NOTPRESENT') {
      admin_status_color = 'magenta';
    }
    else {
      admin_status_color = 'green';
    }

    table.push([
      jsonapi_response[i].status.operational[operational_status_color],
      jsonapi_response[i].status.admin[admin_status_color],
      jsonapi_response[i].name,
      jsonapi_response[i].mac,
      jsonapi_response[i].mtu,
      jsonapi_response[i].description || ''
    ]);
  }

  return table.toString();
};